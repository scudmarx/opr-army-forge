import { ISelectedUnit, IUpgrade, IUpgradeGains, IUpgradeGainsItem, IUpgradeOption } from "../data/interfaces";
import EquipmentService from "./EquipmentService";
import "../extensions";
import DataParsingService from "./DataParsingService";
import RulesService from "./RulesService";
import { current } from "immer";
import { nanoid } from "nanoid";
import _ from 'lodash';
import UnitService from "./UnitService";

export default class UpgradeService {
  static calculateListTotal(list: ISelectedUnit[]) {
    return list
      .filter(u => u.selectionId !== "dummy")
      .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);
  }

  static calculateUnitTotal(unit: ISelectedUnit) {
    if (!unit) return 0;
    let cost = unit.cost;

    for (const upgrade of unit.selectedUpgrades) {
      if (upgrade.cost) {
        cost += upgrade.cost;
      }
    }

    return cost;
  }

  public static isApplied(unit: ISelectedUnit, option: IUpgradeOption): boolean {
    return option && unit.selectedUpgrades.contains(u => u.id === option.id);
  }

  public static getApplied(unit: ISelectedUnit, upgrade: IUpgrade): IUpgradeOption {
    return upgrade.options.find((opt) => {return UpgradeService.isApplied(unit, opt)}) ?? null
  }

  public static countApplied(unit: ISelectedUnit, option: IUpgradeOption): number {
    return unit.selectedUpgrades.filter(u => u.id === option.id).length;
  }

  public static findUpgrade(unit: ISelectedUnit, what: string, forRestore: boolean) {
    const equipment = unit.equipment //UnitService.getAllEquipment(unit)
    return forRestore ? 
      equipment.find(item => EquipmentService.compareEquipment(item, what)) 
      : equipment.findLast((item) => {return item.count > 0 && EquipmentService.compareEquipment(item, what)})
  }

  public static getControlType(upgrade: IUpgrade): "check" | "radio" | "updown" {
    if (upgrade.affects == "any") return "updown"
    if (typeof (upgrade.select) === "number") { 
      if (upgrade.select > 1) return "updown"
      return "radio"
    }
    if (upgrade.type == "replace") {
      if (upgrade.affects == "unit") return "updown"
      return "radio"
    }
    return "check"
  }

  public static isValid(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): boolean {
    /*
    const testunit = UnitService.createDummyCopy(unit)
    return (UpgradeService.applyUpgradeOption(testunit, upgrade, option))
    */
    const controlType = UpgradeService.getControlType(upgrade);
    const appliedInGroup = upgrade.options.reduce((total, next) => total + UpgradeService.countApplied(unit, next), 0);

    // if it's a radio in a group with a selected option, it's valid if the currently selected upgrade can be removed
    if (controlType === "radio")
      if (appliedInGroup > 0) {
        return UpgradeService.isValidToRemove(unit, upgrade, UpgradeService.getApplied(unit, upgrade))
      } else {
        if (!option) return true
      }
    
    if (controlType === "check")
      if (unit.selectedUpgrades.includes(option))
          return UpgradeService.isValidToRemove(unit, upgrade, option)

    //Upgrade 'all' doesn't require there to be any; means none if that's all there is.
    //if (upgrade.affects === "all") return true
    
    // for 'replace [thing]' upgrades, test if the option can actually be taken (i.e. replaced items are available)
    if (upgrade.type == "replace" && upgrade.replaceWhat) {
      const testunit = UnitService.createDummyCopy(unit)
      if (!UpgradeService.applyUpgradeOption(testunit, upgrade, option)){
        return false
      }
    }

    // "UPGRADE"... Otherwise, count upgrades taken so far and check that not already taken max times...
    // "upgrade all" or "upgrade [unit]" means one of those available.
    let available = upgrade.select

    if (upgrade.affects == "any") {
      available = unit.size * (available ?? 1)
    } else {
      if (!upgrade.select) return true
    }

    if (upgrade.replaceWhat) {
      if (upgrade.affects == "all") {
        return true
      } else {
        let availablereplaces = UpgradeService.getUpgradableCount(unit, upgrade) + (upgrade.type == "replace" ? appliedInGroup : 0)
        available = Math.min(availablereplaces, available ?? availablereplaces)
      }
    }

    return appliedInGroup < available
  };

  public static isValidToRemove(unit: ISelectedUnit,  upgrade: IUpgrade, option: IUpgradeOption): boolean {
    let logging = false
    const testunit = UnitService.createDummyCopy(unit)
    if (logging) testunit.name = "Logs McGee"
    return !!(UpgradeService.removeUpgradeOption(testunit, upgrade, option))
  }

  /**
   * Calculates the total number of times an upgrade could be taken given the current equipment a unit has.
   */
  public static getUpgradableCount(unit: ISelectedUnit, upgrade: IUpgrade): number {
    if (!upgrade.replaceWhat || upgrade.replaceWhat.length == 0) return -1
    return upgrade.replaceWhat.reduce((count, what) => {
      return count + what.reduce((max, what, index) => {
        let itemcount = upgrade.type == "replace" ? UnitService.getEquipmentCount(unit, what) : UnitService.getModSlots(unit, what, upgrade.select ?? 1)
        return index == 0 ? itemcount : Math.min(max, itemcount)
      }, -1)
    }, 0)
  }

  /**
   * Removes or modifies a unit's equipment as required by an upgrade's type and replaceWhat.
   * @param mod If modifying the equipment, what ID should we apply? (option.id)
   * @returns true if the replacement was made, false if it was not (e.g. the replaceWhat items were missing),
   * or if removed items had any mods then returns an array of those mods
   */
  public static replaceOrUpgradeItems(unit: ISelectedUnit, upgrade: IUpgrade): boolean | string[] {
    let logging = false && unit.name !== "Dummy"

    for (let alt of upgrade.replaceWhat) {
      let altreplaced = false
      const testunit = UnitService.createDummyCopy(unit)
      var movedMods = []
      for (let replace of alt) {
        altreplaced = true
        let replaceResult = false
        if (upgrade.type != "upgrade") {
          replaceResult = UnitService.removeItem(testunit, replace)
        } else {
          if (UnitService.getModSlotsAvailable(unit, upgrade.id, replace, upgrade.select ?? 1) > 0)
            replaceResult = UpgradeService.addModToItem(testunit, upgrade.id, replace)
        }
          
        if (logging) console.log(`Attempt to ${upgrade.type}`, replace, `${replaceResult ? "" : "un"}successful.`, JSON.parse(JSON.stringify(unit)))

        if (!replaceResult || (typeof replaceResult == "object" && (replaceResult as string[]).length > 0)) {
          altreplaced = false
          break
        } else {
          if (typeof replaceResult == "object") {
            movedMods = movedMods.concat(replaceResult)
          }
        }
      }

      if (altreplaced) {
        if (logging) console.log("Success!")
        unit.equipment = testunit.equipment
        if (logging) console.log("Unit is now: ", JSON.parse(JSON.stringify(unit)))
        return movedMods.length > 0 ? movedMods : true
      }
    }
    return false
  }

  /**
   * applies an upgrade to a unit's equipment
   * @returns true if successful, or false if the upgrade could not be applied
   */
  public static applyUpgradeOption(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    let logging = false && unit.name != "Dummy"
    if (logging) console.log("Applying upgrade option:", upgrade, option)
    // TODO: How to replace unit's built-in special rules. e.g. "Replace Psychic(1) with: Psychic(2)"

    // If the upgrade doesn't replace or upgrade anything in particular, we only need to add the gained items.
    if (!upgrade.replaceWhat) {
      let count = 1
      if (upgrade.affects == "all" && !upgrade.replaceWhat) count = unit.size
      for (let i = 0; i < count; i++) {
        UnitService.addGrantedItems(unit, option)
      }
      if (logging) console.log("Unit upgraded!", JSON.parse(JSON.stringify(unit)))
      return true;
    }
    
    // if we need to upgrade or replace items...
    const doGains = () => {
      if (upgrade.type as any != "remove") {
        UnitService.addGrantedItems(unit, option)  
      } else {
        option.gains.forEach(item => UpgradeService.removeModFromItem(unit, upgrade.id, item))
      }
      return true
    }

    if (upgrade.affects == "all") {
      let replacedCount = 0
      let mods = []
      for (let i = 0; i <= 255; i++) {
        if (i == 255) {
          console.log("Got stuck:", unit, upgrade, option)
          //throw(new Error("Replacing item got stuck in a loop!"))
          break
        }
        let replaceResult = UpgradeService.replaceOrUpgradeItems(unit, upgrade)
        if (replaceResult) {
          if (typeof replaceResult == "object" && replaceResult.length > 0) {
            // is it acceptable to replace modded items?
            break // computer says no.
            mods = mods.concat(replaceResult)
          }
          replacedCount++
        } else break
      }
      if (replacedCount > 0) {
        for (let i = 0; i < replacedCount; i++) {
          doGains()
        }
        if (typeof mods == "object" && mods.length > 0) {
          if (logging) console.log("Removed items had mods:", mods)
          mods.forEach(mod => {
            option.gains.forEach(item => {
              // TODO: Check if that mod can be applied to that item?
              UpgradeService.addModToItem(unit, mod, item)
            })
          })
        }
        return true
      }
    } else {
      let replaceResult = UpgradeService.replaceOrUpgradeItems(unit, upgrade)
      if (replaceResult) {
        if (logging) console.log(`Item[s] ${upgrade.type}d, adding in gains.`)
        doGains()
        if (typeof replaceResult == "object" && replaceResult.length > 0) {
          if (logging) console.log("Removed item had mods:", replaceResult)
          replaceResult.forEach(mod => {
            option.gains.forEach(item => {
              // TODO: Check if that mod can be applied to that item?
              UpgradeService.addModToItem(unit, mod, item)
            })
          })
          if (logging) console.log("Unit updated:", JSON.parse(JSON.stringify(unit)))
        }
        return true
      } else return false
      
    }

  }
  /**
   * removes an upgrade from a unit's equipment.
   * @returns true if successful, or false if the upgrade could not be removed (e.g. because the gained items
   * have since been removed by another upgrade)
   */
  public static removeUpgradeOption(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    let logging = false
    let [replaceUpgrade, replaceOption] = UpgradeService.toRemoveMode(upgrade, option)
    return UpgradeService.applyUpgradeOption(unit, replaceUpgrade, replaceOption)

    // attempt to remove all granted items.
    // are they there?
    // have they been modified?
    // if succesful, add back items that were replaced.
    // replace modifications on the returned items?


  }

  /**
   * Searches a unit for an item and marks it as having been modified with a given id.
   * @returns true if mod was applied, false if not (e.g. if item wasn't found)
   */
  public static addModToItem(unit: ISelectedUnit, mod: string, item: IUpgradeGains|string ) : boolean {
    let logging = false && unit.name != "Dummy"
    if (logging) console.log("upgrading", item, "on unit", JSON.parse(JSON.stringify(unit)))
    let upgradedItem = UnitService.getAllEquipment(unit).find(e => {
      return EquipmentService.compareEquipment(e, (item as any).name || item)
    })
    if (upgradedItem) {
      upgradedItem.mods.push(mod)
      return true
    } else {
      return false
    }        
  }

  /** Removes a mod entry from an item on an unit's equipment list */
  public static removeModFromItem (unit: ISelectedUnit, mod: string, item: IUpgradeGains | string): boolean {
    let logging = false
    if (logging) console.log("removeModFromItem:", unit, mod, item)
    let upgradedItem = UnitService.getAllEquipment(unit).find(e => EquipmentService.compareEquipment(e, item) && e.mods.includes(mod))
    if (upgradedItem) {
      return upgradedItem.mods.splice(upgradedItem.mods.indexOf(mod), 1).length > 0
    } else return false
  }

  /**
   * Wraps the applyUpgradeOption function and modifies the unit's selectedUpgrades.
   */
  public static apply(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    let logging = false
    if (logging) console.log("Applying option", option, "from upgrade", upgrade, "to unit", JSON.parse(JSON.stringify(unit)))
    if (UpgradeService.applyUpgradeOption(unit, upgrade, option)) {
      unit.selectedUpgrades.push(option)
      if (logging) console.log("apply succeeded:", JSON.parse(JSON.stringify(unit)))
      if (logging) console.log(`This upgrade can${this.isValidToRemove(unit, upgrade, option)?"":"not"} be removed!`)
      return true;
    } else {
      if (logging) console.log("apply failed:", JSON.parse(JSON.stringify(unit)))
      return false
    }
  }

  /**
   * Wraps the removeUpgradeOption function and modifies the unit's selectedUpgrades.
   */
  public static remove(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    let logging = false
    if (logging) console.log("Removing option", option, "of upgrade", upgrade, "from unit", JSON.parse(JSON.stringify(unit)))
    
    // can't remove upgrades that aren't selected
    if (!UpgradeService.isApplied(unit, option)) {
      if (logging) console.log("Failed! Option not found!")
      return false
    }

    if (UpgradeService.removeUpgradeOption(unit, upgrade, option)) {
      unit.selectedUpgrades.splice(_.findIndex(unit.selectedUpgrades, upg => upg.id == option.id), 1)
      if (logging) console.log("remove succeeded:", JSON.parse(JSON.stringify(unit)))
      return true;
    } else {
      if (logging) console.log("remove failed:", JSON.parse(JSON.stringify(unit)))
      return false
    }
  }

  public static toRemoveMode(upgrade: IUpgrade, option: IUpgradeOption): [IUpgrade, IUpgradeOption] {
    let logging = false
    if (logging) console.log("Transforming upgrade into a remove version of itself:", upgrade, option)
    option = upgrade?.options.find(opt => opt?.id == option?.id)
    option = option ?? {id: "1", gains: [], cost: 0, label: "option", type: "ArmyBookUpgradeOption"}
    upgrade = upgrade ?? {id: "2", affects: "unit", type: "remove" as any, replaceWhat: [[]], options: [option]}
    
    let replaced = upgrade.replaceWhat ? upgrade.replaceWhat[0] as any : []
    let gains = option?.gains.flatMap(g => {
      return Array(g.count ?? 1).fill({...g, count: 1})
    }) || []

    const newUpgrade = {...upgrade,
      label: `REMOVE: ${upgrade.label}`,
      type: upgrade.type == "replace" ? "replace" : "remove" as any,
      replaceWhat: [gains]
    }
    const newOption = {...option,
      gains: replaced
    }
    if (logging) console.log("Turned them into:", newUpgrade, newOption)
    return [newUpgrade, newOption]
  }
}

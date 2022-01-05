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
    if (typeof (upgrade.select) === "number") { 
      if (upgrade.select > 1) return "updown"
      if (upgrade.type == "replace" && upgrade.affects == "any") return "updown"
      return "radio"
    }
    if (upgrade.affects == "any") return "updown"
    if (upgrade.type == "replace") {
      if (upgrade.affects == "unit") return "updown"
      return "radio"
    }
    return "check"
  }

  public static isValid(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): boolean {

    const controlType = UpgradeService.getControlType(upgrade);
    const appliedInGroup = upgrade.options.reduce((total, next) => total + UpgradeService.countApplied(unit, next), 0);

    // if it's a radio in a group with a selected option, it's valid if the currently selected upgrade can be removed
    if (controlType === "radio")
      if (appliedInGroup > 0) {
        return UpgradeService.isValidToRemove(unit, UpgradeService.getApplied(unit, upgrade))
      }
    
    if (controlType === "check")
      if (unit.selectedUpgrades.includes(option))
          return UpgradeService.isValidToRemove(unit, option)

    //Upgrade 'all' doesn't require there to be any; means none if that's all there is.
    //if (upgrade.affects === "all") return true
    
    // for 'replace [thing]' upgrades, test if the option can actually be taken (i.e. replaced items are available)
    if (upgrade.type == "replace" && upgrade.replaceWhat) {
      const testunit = {...unit,
        name: "TestUnit",
        equipment: unit.equipment.map(g => ({...g})),
        selectedUpgrades: [...unit.selectedUpgrades]
      }
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

  public static isValidToRemove(unit: ISelectedUnit, option: IUpgradeOption): boolean {
    const [removeUpgrade, removeOption] = UpgradeService.toRemoveMode(null, option)
    return UpgradeService.isValid(unit, removeUpgrade, removeOption)
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

  public static applyUpgradeOption(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {

    // TODO: How to replace unit's built-in special rules. e.g. "Replace Psychic(1) with: Psychic(2)"

    const addItems = (addItemsUnit) => {
      if (addItemsUnit.name != "TestUnit") console.log("Adding gains items...")
      for (let gain of option.gains) {
        if (upgrade.type as any != "remove") UnitService.addItem(addItemsUnit, gain)
        else {
          let upgradedItem = UnitService.getAllEquipment(addItemsUnit).find(e => EquipmentService.compareEquipment(e, gain) && e.mods)
          if (upgradedItem) {
            upgradedItem.mods--
          }
        }
      }
      if (addItemsUnit.name != "TestUnit") console.log("Added", option.gains, "to unit:", JSON.parse(JSON.stringify(addItemsUnit)))
    }

    // Remove the equipment which the upgrade is replacing, if possible. If not, return false and do nothing.
    let count = 1
    if (upgrade.affects == "all" && !upgrade.replaceWhat) count = unit.size
    if (upgrade.affects == "all" && upgrade.replaceWhat && !["replace", "remove"].includes(upgrade.type)) {
      count = UpgradeService.getUpgradableCount(unit, upgrade)
    }
    if (upgrade.replaceWhat) {

      const effect = ["replace", "remove"].includes(upgrade.type) ? UnitService.removeItem : (unit: ISelectedUnit, item: IUpgradeGains|string) : boolean => {
        let upgradedItem = UnitService.getAllEquipment(unit).find(e => EquipmentService.compareEquipment(e, item) && (!e?.mods || e.mods < (e.count * upgrade.select)))
        if (upgradedItem) {
          if (!upgradedItem.mods) upgradedItem.mods = 0
          upgradedItem.mods++
          return true
        } else {
          return false
        }        
      }

      const testunit = {
        ...unit,
        selectionId: "dummy",
        equipment: unit.equipment.map(g => ({...g})),
        selectedUpgrades: [...unit.selectedUpgrades]
      }

      count = 0
      for (let i = 0; i <= 255; i++) {
        if (i == 255) throw(new Error("Replacing item got stuck in a loop!"))
        let replaced = false
        for (let alt of upgrade.replaceWhat) {
          let altreplaced = true
          let ogequipment = testunit.equipment.map(g => ({...g}))
          let ogupgrades = [...testunit.selectedUpgrades]
          addItems(testunit)
          if (testunit.name !== "TestUnit") console.log(i, " - Attempting to replace items:", upgrade.replaceWhat, JSON.parse(JSON.stringify(testunit)))
          for (let replace of alt) {
            if (!effect(testunit, replace as string)) {
              if (testunit.name !== "TestUnit") console.log("Failure! Got to:", JSON.parse(JSON.stringify(testunit)), "but could not find: ", replace)
              altreplaced = false
              break
            }
          }
          if (altreplaced) {
            if (testunit.name !== "TestUnit") console.log("Success!")
            replaced = true
            break
          } else {
            testunit.equipment = ogequipment.map(g => ({...g}))
            testunit.selectedUpgrades = [...ogupgrades]
            if (testunit.name !== "TestUnit") console.log("Unit rolled back to:", JSON.parse(JSON.stringify(testunit)))
          }
        }

        if (replaced) {
          count++
          unit.equipment = testunit.equipment.map(g => ({...g}))
          unit.selectedUpgrades = [...testunit.selectedUpgrades]
          if (upgrade.affects != "all") {
            break
          }
          replaced = false
        } else {
          break
        }
      }
      if (count == 0) {
        if (unit.name !== "TestUnit") console.log("Failed!", upgrade, JSON.parse(JSON.stringify(unit)))
        return false
      }
    } else {
      for (let i = 0; i < count; i++) {
        addItems(unit)
      }
    }
    if (unit.name !== "TestUnit") console.log("Unit upgraded!", JSON.parse(JSON.stringify(unit)))
    return true;
  }

  public static apply(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    console.log("Applying option", option, "from upgrade", upgrade, "to unit", JSON.parse(JSON.stringify(unit)))
    if (UpgradeService.applyUpgradeOption(unit, upgrade, option)) {
      unit.selectedUpgrades.push(option)
      console.log("apply succeeded:", JSON.parse(JSON.stringify(unit)))
      return true;
    } else {
      return false
    }
  }

  public static remove(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    console.log("Removing option", option, "of upgrade", upgrade, "from unit", JSON.parse(JSON.stringify(unit)))
    // can't remove upgrades that aren't selected
    if (!UpgradeService.isApplied(unit, option)) {
      //console.log("Failed! Option not found!")
      return false
    }
    
    let [replaceUpgrade, replaceOption] = UpgradeService.toRemoveMode(upgrade, option)
    //console.log("Turned them into:", replaceOption, replaceUpgrade)
    if (UpgradeService.applyUpgradeOption(unit, replaceUpgrade, replaceOption)) {
      unit.selectedUpgrades.splice(_.findIndex(unit.selectedUpgrades, upg => upg.id == option.id), 1)
      console.log("Success!")
      return true
    } else {
      console.log("Somehow failed!")
      return false
    }
  }

  public static toRemoveMode(upgrade: IUpgrade, option: IUpgradeOption): [IUpgrade, IUpgradeOption] {
    option = upgrade?.options.find(opt => opt.id == option.id)
    option = option ?? {id: "1", gains: [], cost: 0, label: "option", type: "ArmyBookUpgradeOption"}
    upgrade = upgrade ?? {id: "2", affects: "unit", type: "remove" as any, replaceWhat: [[]], options: [option]}
    const newUpgrade = {...upgrade,
      type: upgrade.type == "replace" ? "replace" : "remove" as any,
      replaceWhat: [option?.gains.flatMap(g => {
        return Array(g.count ?? 1).fill({...g, count: 1})
      }) || []]
    }
    const newOption = {...option,
      gains: upgrade.replaceWhat ? upgrade.replaceWhat[0] as any : []
    }
    return [newUpgrade, newOption]
  }
}

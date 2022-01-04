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
    return upgrade.options.find((opt) => {return this.isApplied(unit, opt)}) ?? null
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
    // "Upgrade Psychic(1):"
    if (upgrade.type === "upgradeRule") {
      return "check";
    }

    // (upgrade|replace) (_n_|one|any|all) [things] with (n)
    if (typeof upgrade.affects == "number") {
      if (upgrade.affects > 1) {
        return "updown"
      }
    }
    
    // (upgrade|replace) (one|any|all) with (_n_)
    if (typeof (upgrade.select) === "number") {
      if (upgrade.select > 1) {
        return "updown";
      }
      else {
        return "radio";
      }
    }
    
    if (upgrade.affects == "any") {
      if (upgrade.type == "replace") return "updown"
    }

    if (upgrade.type == "replace") return "radio"
    return "check"

  }

  public static isValid(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): boolean {

    const controlType = this.getControlType(upgrade);
    const appliedInGroup = upgrade.options.reduce((total, next) => total + this.countApplied(unit, next), 0);

    // if it's a radio in a group with a selected option, it's valid if the currently selected upgrade can be removed
    if (controlType === "radio")
      if (appliedInGroup > 0) {
        return UpgradeService.isValidToRemove(unit, UpgradeService.getApplied(unit, upgrade))
      }
    
    if (controlType === "check")
      if (unit.selectedUpgrades.includes(option))
          return true;

      //Upgrade 'all' doesn't require there to be any; means none if that's all there is.
      if (upgrade.affects === "all") return true

      // "UPGRADE"... Otherwise, count upgrades taken so far and check that not already taken max times...
      // "upgrade with" means one.
      var available = 1

      // "upgrade any with" means once per model in the unit
      if (upgrade.affects == "any") available = unit.size

      // "upgrade (any|x) [things] with" means count those things, that's our limit
      if (upgrade.replaceWhat) {
        (upgrade.replaceWhat as string[]).forEach((what, i) => {
          let thisavailable = UnitService.getEquipmentCount(unit, what)
          available = i==0 ? thisavailable : Math.min(available, thisavailable)
        })
      }

      // Upgrade [(any)?] with n:
      if (typeof (upgrade.select) === "number") {
        available *= upgrade.select
      }
      if (upgrade.select === "any") {
        available *= upgrade.options.length
      }

      if (appliedInGroup >= available) {
        return false;
      }

      // for replacing, check if the option can actually be taken (i.e. replaced items are available)
      if (upgrade.type == "replace") {
        const testunit = {...unit,
          equipment: unit.equipment.map(g => ({...g})),
          selectedUpgrades: [...unit.selectedUpgrades]
        }
        if (!this.applyUpgradeOption(testunit, upgrade, option)) return false
      }

    return true;
  };

  public static isValidToRemove(unit: ISelectedUnit, option: IUpgradeOption): boolean {
    const [removeUpgrade, removeOption] = this.toRemoveMode(null, option)
    return this.isValid(unit, removeUpgrade, removeOption)
  }

  public static applyUpgradeOption(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    // Remove the equipment which the upgrade is replacing, if possible. If not, return false and do nothing.
    if (upgrade.type == "replace") {
      const testunit = {
        ...unit,
        selectionId: "dummy",
        equipment: unit.equipment.map(g => ({...g})),
        selectedUpgrade: [...unit.selectedUpgrades]
      }
      let replaced = true
      for (let replace of upgrade.replaceWhat) {
        if (!UnitService.removeItem(testunit, replace as string)) {
          replaced = false
        }
      }
      if (replaced) {
        unit.equipment = testunit.equipment
        unit.selectedUpgrades = testunit.selectedUpgrades
      } else {
        return false
      }
    }

    // Add the option's granted items to the unit.
    for (let gain of option.gains) {
      UnitService.addItem(unit, gain)
    }

    return true;
  }

  public static apply(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    console.log("Applying option", option, "from upgrade", upgrade, "to unit", unit)
    if (this.applyUpgradeOption(unit, upgrade, option)) {
      unit.selectedUpgrades.push(option)
      return true;
    } else {
      return false
    }
  }

  public static remove(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    //console.log("Removing option", option, "of upgrade", upgrade, "from unit", unit)
    // can't remove upgrades that aren't selected
    if (!this.isApplied(unit, option)) {
      //console.log("Failed! Option not found!")
      return false
    }
    
    let [replaceUpgrade, replaceOption] = this.toRemoveMode(upgrade, option)
    if (this.applyUpgradeOption(unit, replaceUpgrade, replaceOption)) {
      unit.selectedUpgrades.splice(_.findIndex(unit.selectedUpgrades, upg => upg.id == option.id), 1)
      //console.log("Success!")
      return true
    } else {
      //console.log("Somehow failed!")
      return false
    }
  }

  public static toRemoveMode(upgrade, option) {
    option = option ?? {id: 1, gains: []}
    upgrade = upgrade ?? {replaceWhat: [], options: [option.id]}
    const newUpgrade = {...upgrade,
      type: "replace",
      replaceWhat: option.gains || []
    }
    const newOption = {...option,
      gains: upgrade.replaceWhat || []
    }
    return [newUpgrade, newOption]
  }
}

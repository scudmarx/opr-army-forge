import { IEquipment, ISelectedUnit, IUpgrade, IUpgradeGainsItem, IUpgradeOption } from "../data/interfaces";
import EquipmentService from "./EquipmentService";
import "../extensions";
import DataParsingService from "./DataParsingService";
import RulesService from "./RulesService";
import { current } from "immer";

export default class UpgradeService {
  static calculateListTotal(list: ISelectedUnit[]) {
    return list
      .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);
  }

  static calculateUnitTotal(unit: ISelectedUnit) {
    let cost = unit.cost * (unit.combined ? 2 : 1);

    for (const upgrade of unit.selectedUpgrades) {

      var upgradeGroup = { affects: "all" };

      if (upgrade.cost) {
        cost += upgrade.cost * (unit.combined && upgradeGroup.affects === "all" ? 2 : 1);
      }
    }

    return cost;
  }

  public static isApplied(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): boolean {

    return unit.selectedUpgrades.contains(u => u.id === option.id);
  }

  public static countApplied(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): number {
    return unit.selectedUpgrades.filter(u => u.id === option.id).length;
  }

  public static findToReplace(unit: ISelectedUnit, what: string) {
    // Try and find item to replace...
    var toReplace = EquipmentService.findLast(unit.equipment, what) as { count?: number };

    // Couldn't find the item to replace or there are none left
    if (!toReplace || toReplace.count <= 0) {

      // Try and find an upgrade instead
      for (let i = unit.selectedUpgrades.length - 1; i >= 0; i--) {
        const upgrade = unit.selectedUpgrades[i];
        toReplace = upgrade
          .gains
          .filter(e => EquipmentService.compareEquipmentNames(e.name, what))[0] as { count?: number };

        if (toReplace)
          break;
      }
    }

    return toReplace;
  }

  public static isValid(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): boolean {

    const controlType = this.getControlType(unit, upgrade);
    //const alreadySelected = this.countApplied(unit, upgrade, option);
    const appliedInGroup = upgrade.options.reduce((total, next) => total + this.countApplied(unit, upgrade, next), 0);

    // if it's a radio, it's valid if any other upgrade in the group is already applied
    if (controlType === "radio")
      if (appliedInGroup > 0)
        return true;

    if (upgrade.type === "replace") {

      const canReplaceSet = (options: string[]) => {
        if (!Array.isArray(options)) {
          options = [options];
        }
        for (let what of options) {

          var toRestore = null;

          // Try and find an upgrade instead
          for (let i = unit.selectedUpgrades.length - 1; i >= 0; i--) {
            const upgrade = unit.selectedUpgrades[i];
            toRestore = upgrade
              .gains
              .filter(e => EquipmentService.compareEquipmentNames(e.name, what))[0] as { count?: number };

            if (toRestore && toRestore.count)
              break;
          }

          // Couldn't find the upgrade to replace
          if (!toRestore || toRestore.count <= 0)
            toRestore = EquipmentService.findLast(unit.equipment, what);

          if (!toRestore)
            return false;

          // Nothing left to replace
          if (toRestore.count <= 0)
            return false;

          // May only select up to the limit
          if (typeof (upgrade.select) === "number") {
            // Any model may replace 1...
            if (upgrade.affects === "any") {
              if (appliedInGroup >= upgrade.select * unit.size)
                return false;
            } else if (appliedInGroup >= upgrade.select)
              return false;
          } else if (unit.combined) {
            if (appliedInGroup >= 2)
              return false;
          }
        }
        return true;
      }

      let canReplace = false;

      // Dealing with a combination of alternate replace options...
      if (typeof (upgrade.replaceWhat[0]) !== "string") {
        // For each combination
        for (let set of upgrade.replaceWhat as string[][]) {
          canReplace ||= canReplaceSet(set);
        }
      } else {
        canReplace = canReplaceSet(upgrade.replaceWhat as string[])
      }
      if (!canReplace)
        return false;
    }

    // TODO: ...what is this doing?
    if (upgrade.type === "upgrade") {

      if (typeof (upgrade.select) === "number") {

        if (appliedInGroup >= upgrade.select) {
          return false;
        }
      }
      else if (appliedInGroup >= unit.size) {
        return false;
      }
    }

    return true;
  };

  public static getControlType(unit: ISelectedUnit, upgrade: IUpgrade): "check" | "radio" | "updown" {
    const combinedAffects = (unit.combined && typeof (upgrade.affects) === "number") ? upgrade.affects * 2 : upgrade.affects;
    if (upgrade.type === "upgrade") {

      // "Upgrade any model with:"
      if (upgrade.affects === "any" && unit?.size > 1)
        return "updown";

      // "Upgrade with one:"
      if (upgrade.select === 1)
        return "radio";

      // Select > 1
      if (typeof (upgrade.select) === "number")
        return "updown";

      return "check";
    }

    // "Upgrade Psychic(1):"
    if (upgrade.type === "upgradeRule") {
      return "check";
    }

    if (upgrade.type === "replace") {

      // "Replace [weapon]:"
      if (!upgrade.affects) {
        if (typeof (upgrade.select) === "number")
          return "updown";
        return "radio";
      }
      // "Replace one [weapon]:"
      // "Replace all [weapons]:"
      if (combinedAffects === 1 || upgrade.affects === "all") {
        return "radio";
      }
      // "Replace any [weapon]:"
      // "Replace 2 [weapons]:"
      if (upgrade.affects === "any" || typeof (upgrade.affects) === "number") {
        return "updown";
      }

    }

    console.error("No control type for: ", upgrade);

    return "updown";
  }

  public static apply(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {

    // How many of this upgrade do we need to apply
    const count = (typeof (upgrade.affects) === "number"
      ? upgrade.affects
      : upgrade.affects === "all"
        ? unit.size || 1 // All in unit
        : 1); // TODO: Add back multiple count weapons? * (option.count || 1);

    // Function to apply the upgrade option to the unit
    const apply = (available: number) => {
      const toApply = {
        ...option,
        gains: option.gains.map(g => ({
          ...g,
          count: Math.min(count, available) // e.g. If a unit of 5 has 4 CCWs left...
        }))
      };

      // Apply counts to item content
      for (let gain of toApply.gains) {
        if (gain.type !== "ArmyBookItem")
          continue;
        const item = gain as IUpgradeGainsItem;
        item.content = item.content.map(c => ({
          ...c,
          count: gain.count
        }));
      }

      unit.selectedUpgrades.push(toApply);
    };

    if (upgrade.type === "upgradeRule") {

      // TODO: Refactor this - shouldn't be using display name func to compare probably!
      const existingRuleIndex = unit
        .specialRules
        .findIndex(r => RulesService.displayName(r) === (upgrade.replaceWhat[0] as string));

      // Remove existing rule
      if (existingRuleIndex > -1)
        unit.specialRules.splice(existingRuleIndex, 1);

      apply(count);

      // Add new rule(s)!
      //unit.specialRules = unit.specialRules.concat(option.gains as ISpecialRule[]);

      return;
    }
    else if (upgrade.type === "upgrade") {

      apply(count);
    }
    else if (upgrade.type === "replace") {

      console.log("Replace " + count);

      let available = 999;

      const replace = (options: string[]) => {

        const replace = [];
        if (!Array.isArray(options)) {
          options = [options];
        }
        // Check each option to make sure it's present before acting
        for (let what of options) {

          // Try and find item to replace...
          const toReplace = this.findToReplace(unit, what);

          // Couldn't find the item to replace
          if (!toReplace) {
            console.error(`Cannot find ${upgrade.replaceWhat} to replace!`);
            return false;
          }

          replace.push(toReplace);
        }

        // Actual modify the options now we know they're all here
        for (let toReplace of replace) {

          console.log("Replacing... ", current(toReplace));

          available = Math.min(available, toReplace.count);

          // Decrement the count of the item being replaced
          toReplace.count -= count;

          // TODO: Use Math.max... ?
          if (toReplace.count <= 0)
            toReplace.count = 0;


          // If we're replacing an upgrade...
          if (toReplace.type) {
            // ...then track which upgrade replaced it
            (toReplace.dependencies || (toReplace.dependencies = [])).push(option.id);
          }

          console.log("Replaced... ", current(toReplace));
        }

        return true;
      }

      // Dealing with a combination of alternate replace options...
      if (typeof (upgrade.replaceWhat[0]) !== "string") {

        let applied = false;
        for (let set of upgrade.replaceWhat as string[][]) {
          applied ||= replace(set);
          if (applied)
            break;
        }
        if (!applied)
          return false;

      } else {
        if (!replace(upgrade.replaceWhat as string[]))
          return false;
      }

      apply(available);
    }
  }

  public static remove(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) {
    const removeAt = unit.selectedUpgrades.findLastIndex(u => u.id === option.id);
    const toRemove = unit.selectedUpgrades[removeAt];
    const count = toRemove.gains[0]?.count;
    unit.selectedUpgrades.splice(removeAt, 1);

    if (upgrade.type === "upgradeRule") {

      // Re-add original rule
      unit.specialRules.push(DataParsingService.parseRule(upgrade.replaceWhat[0] as string));

      return;
    }

    if (upgrade.type === "replace") {

      const restore = (options: string[]) => {

        const items = [];
        if (!Array.isArray(options)) {
          options = [options];
        }
        // For each bit of equipment that was originally replaced
        for (let what of options) {

          var toRestore = null;// EquipmentService.findLast(unit.equipment, what) as { count?: number };

          // Try and find an upgrade instead
          for (let i = unit.selectedUpgrades.length - 1; i >= 0; i--) {
            const upgrade = unit.selectedUpgrades[i];
            toRestore = upgrade
              .gains
              .filter(e => EquipmentService.compareEquipmentNames(e.name, what))[0] as { count?: number };

            if (toRestore)
              break;
          }

          // Couldn't find the upgrade to replace
          if (!toRestore)
            toRestore = EquipmentService.findLast(unit.equipment, what);

          if (!toRestore) {
            // Uh oh
            console.log("Could not restore " + what, current(unit));
            return false;
          }

          items.push(toRestore);
        }

        for (let toRestore of items) {

          // Increase the count by however much was replaced
          toRestore.count += count;
        }

        return true;
      }

      if (typeof (upgrade.replaceWhat[0]) !== "string") {
        for (let set of upgrade.replaceWhat as string[][]) {
          restore(set);
        }
      } else {
        restore(upgrade.replaceWhat as string[]);
      }
    }
  }
}
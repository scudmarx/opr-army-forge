import { IEquipment, ISelectedUnit, ISpecialRule, IUpgrade, IUpgradeOption } from "../data/interfaces";
import EquipmentService from "./EquipmentService";
import "../extensions";
import DataParsingService from "./DataParsingService";
import RulesService from "./RulesService";
import { loadOptions } from "@babel/core";
import { current } from "immer";

export default class UpgradeService {
    static calculateListTotal(list: ISelectedUnit[]) {
        return list
            .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);
    }

    static calculateUnitTotal(unit: ISelectedUnit) {
        let cost = unit.cost;
        for (const upgrade of unit.selectedUpgrades) {
            if (upgrade.cost)
                cost += parseInt(upgrade.cost);
        }
        return cost;
    }

    public static isApplied(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): boolean {

        return unit.selectedUpgrades.contains(u => u.id === option.id);
    }

    public static countApplied(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): number {
        return unit.selectedUpgrades.filter(u => u.id === option.id).length;
    }

    public static isValid(unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption): boolean {

        const alreadySelected = this.countApplied(unit, upgrade, option);

        if (upgrade.type === "replace") {

            // TODO: Will we need this here? Replacing more than 1 at a time perhaps...
            const replaceCount = typeof (upgrade.affects) === "number"
                ? upgrade.affects
                : upgrade.affects === "all"
                    ? unit.size || 1 // All in unit
                    : 1;

            //debugger;

            const replaceWhat: string[] = typeof (upgrade.replaceWhat) === "string"
                ? [upgrade.replaceWhat]
                : upgrade.replaceWhat;

            for (let what of replaceWhat) {

                const toReplace = EquipmentService.findLast(unit.equipment, what);

                if (!toReplace)
                    return false;

                // Nothing left to replace
                if (toReplace.count <= 0)
                    return false;

                // May only select up to the limit
                if (typeof (upgrade.select) === "number") {
                    if (alreadySelected >= upgrade.select)
                        return false;
                }
            }
        }

        // TODO: ...what is this doing?
        if (upgrade.type === "upgrade") {

            if (typeof (upgrade.select) === "number") {

                if (alreadySelected >= upgrade.select) {
                    return false;
                }
            }
            else if (alreadySelected >= unit.size) {
                return false;
            }
        }

        return true;
    };

    public static getControlType(unit: ISelectedUnit, upgrade: IUpgrade): "check" | "radio" | "updown" {
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
            if (upgrade.affects === 1 || upgrade.affects === "all") {
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

        const count = (typeof (upgrade.affects) === "number"
            ? upgrade.affects
            : upgrade.affects === "all"
                ? unit.size || 1 // All in unit
                : 1); // TODO: Add back multiple count weapons? * (option.count || 1);

        const apply = (available: number) => {
            unit.selectedUpgrades.push({
                ...option,
                gains: option.gains.map(g => ({
                    ...g,
                    count: Math.min(count, available) // e.g. If a unit of 5 has 4 CCWs left...
                }))
            });
        };

        if (upgrade.type === "upgradeRule") {

            // TODO: Refactor this - shouldn't be using display name func to compare probably!
            const existingRuleIndex = unit
                .specialRules
                .findIndex(r => RulesService.displayName(r) === (upgrade.replaceWhat as string));

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

            const replaceWhat: string[] = typeof (upgrade.replaceWhat) === "string"
                ? [upgrade.replaceWhat]
                : upgrade.replaceWhat;

            let available = 999;

            for (let what of replaceWhat) {

                // Try and find item to replace...
                const replaceIndex = EquipmentService.findLastIndex(unit.equipment, what);
                const toReplace = unit.equipment[replaceIndex];

                // Couldn't find the item to replace
                if (!toReplace) {
                    console.error(`Cannot find ${upgrade.replaceWhat} to replace!`);
                    return;
                }

                console.log("Replacing... ", current(toReplace));

                available = Math.min(available, toReplace.count);

                // Decrement the count of the item being replaced
                toReplace.count -= count;

                // TODO: Use Math.max... ?
                if (toReplace.count <= 0)
                    toReplace.count = 0;
                //     unit.equipment.splice(replaceIndex, 1);
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
            unit.specialRules.push(DataParsingService.parseRule(upgrade.replaceWhat as string));

            return;
        }



        // for (let e of option.gains) {
        //     const selection = EquipmentService.findLast(unit.equipment, e.name);

        //     // If multiple selections
        //     if (selection.count) {
        //         selection.count -= count;
        //     }

        //     if (selection.count <= 0) {
        //         // Remove the upgrade from the list
        //         const removeIndex = EquipmentService.findLastIndex(unit.equipment, e.name)
        //         unit.equipment.splice(removeIndex, 1);
        //     }
        // }

        if (upgrade.type === "replace") {

            const replaceWhat: string[] = typeof (upgrade.replaceWhat) === "string"
                ? [upgrade.replaceWhat]
                : upgrade.replaceWhat;

            // For each bit of equipment that was originally replaced
            for (let what of replaceWhat) {

                const current = EquipmentService.findLast(unit.equipment, what);

                // Increase the count by however much was replaced
                current.count += count;
            }
        }
    }
}
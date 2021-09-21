import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";
import pluralise from "pluralize";
import { current } from "immer";

export default class UpgradeService {
    static calculateListTotal(list: ISelectedUnit[]) {
        return list
            .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);
    }

    static calculateUnitTotal(unit: ISelectedUnit) {
        let cost = unit.cost;
        for (const equipment of unit.selectedEquipment) {
            if (equipment.cost)
                cost += equipment.cost;
        }
        return cost;
    }

    static isApplied(unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment): boolean {

        if (upgrade.type === "upgradeRule") {
            console.log(unit.specialRules);
            console.log(option.specialRules);

            // Check that the special rules from this upgrade are contained within the unit's rules
            return option.specialRules.reduce((prev, curr) => prev && unit.specialRules.indexOf(curr) >= 0, true);
        }

        const isApplied = name => unit
            .selectedEquipment
            .filter(e => pluralise.singular(e.name) === pluralise.singular(name))
            .length > 0;

        if (option.type === "combined") {

            return option
                .equipment
                .reduce((prev, current) => prev && isApplied(current.name), true)

        } else {

            return isApplied(option.name);
        }
    }

    static countApplied(unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment): number {
        const selection = unit
            .selectedEquipment
            .filter(e => e.name === option.name)[0];

        return selection ? selection.count : 0;
    }

    static foo() {

    }

    static isValid(unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment): boolean {

        if (upgrade.type === "replace") {

            const replaceCount = typeof (upgrade.affects) === "number"
                ? upgrade.affects
                : upgrade.affects === "all"
                    ? unit.size || 1 // All in unit
                    : 1;

            const toReplace = unit
                .selectedEquipment
                .filter(eqp => pluralise.singular(eqp.name) === pluralise.singular(upgrade.replaceWhat))[0];

            const alreadySelected = upgrade
                .options
                .reduce((prev, curr) => prev + (unit.selectedEquipment.filter(eqp => pluralise.singular(eqp.name) === pluralise.singular(curr.name))[0]?.count || 0), 0);

            if (!toReplace)
                return false;

            // "Replace any [weapon]"
            if (upgrade.affects === "any") {

                if (toReplace.count <= 0)
                    return false;
            }
            if (typeof (upgrade.select) === "number") {
                if (alreadySelected >= upgrade.select)
                    return false;
            }
        }

        if (upgrade.type === "upgrade") {

            if (typeof (upgrade.select) === "number") {

                const selections = unit
                    .selectedEquipment
                    .filter(selected => upgrade.options.findIndex(opt => opt.name === selected.name) > -1);

                const countSelected = selections.reduce((prev, next) => prev + next.count || 1, 0);

                if (countSelected >= upgrade.select) {
                    return false;
                }
            }
        }

        return true;
    };

    public static getControlType(unit: ISelectedUnit, upgrade: IUpgrade): "check" | "radio" | "updown" {
        if (upgrade.type === "upgrade") {

            // "Upgrade with:"
            // "Upgrade with any:"
            if (!upgrade.select || upgrade.select == "any") {
                return "check";
            }
            // "Upgrade with one:"
            if (upgrade.select === 1) {
                return "radio";
            }
            // TODO "Upgrade with up to n:"

            // "Upgrade with any:"
            if (upgrade.select === "any") {
                return "check";
            }
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
}
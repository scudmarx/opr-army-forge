import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";

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
        return unit
            .selectedEquipment
            .map(eqp => eqp.name)
            .filter(name => name === option.name)
            .length > 0;
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

            // "Replace any [weapon]"
            if (upgrade.affects === "any") {

                const toReplace = unit
                    .selectedEquipment
                    .filter(eqp => eqp.name.indexOf(upgrade.replaceWhat as any) === 0)[0];

                if (!toReplace || toReplace.count <= 0)
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
            if (!upgrade.affects && !upgrade.limit) {
                return "radio";
            }
            // "Replace one [weapon]:"
            if (upgrade.affects === 1) {
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
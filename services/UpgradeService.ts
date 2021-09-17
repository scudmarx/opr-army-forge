import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";

export default class UpgradeService {
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

    static foo() {

    }

    static isValid(unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment): boolean {
        console.log(unit);
        console.log(upgrade);
        console.log(option);


        if (upgrade.type === "replace") {

            // "Replace any [weapon]"
            if (upgrade.affects === "any") {

                const toReplace = unit
                    .selectedEquipment
                    .filter(eqp => eqp.name === upgrade.replacesWhat)[0];

                if (!toReplace || toReplace.count <= 0)
                    return false;
            }
        }

        if (upgrade.type === "upgrade") {

            if (upgrade.select !== "any") {
                const optionNames = upgrade.options.map(opt => opt.name);
                const selectedEquipmentNames = unit.selectedEquipment.map(eqp => eqp.name);
                const alreadySelected = selectedEquipmentNames
                    .filter(name => optionNames.indexOf(name) > -1)
                    .length > 0;
                if (alreadySelected) {
                    return false;
                }
            }
        }

        return true;
    };
}
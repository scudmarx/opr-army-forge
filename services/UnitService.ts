import { IEquipment, ISelectedUnit, IUpgradeGains, IUpgradeGainsItem, IUpgradeGainsRule, IUpgradeOption } from "../data/interfaces";

export default class UnitService {
    public static getAllUpgrades(unit: ISelectedUnit): IUpgradeGains[] {
        return unit
            .selectedUpgrades
            .reduce((value, option) => value.concat(option.gains), []);
    }

    public static getAllUpgradedRules(unit: ISelectedUnit): IUpgradeGainsRule[] {
        const upgrades = this.getAllUpgrades(unit);

        const rules = upgrades.filter(u => u.type === "ArmyBookRule") || [];
        const rulesFromitems = upgrades
            .filter(u => u.type === "ArmyBookItem")
            .reduce((value, u: IUpgradeGainsItem) => value.concat(u.content.filter(c => c.type === "ArmyBookRule" || c.type === "ArmyBookDefense")), []) || [];

        const allRules: IUpgradeGainsRule[] = rules.concat(rulesFromitems) as IUpgradeGainsRule[];

        return allRules;
    }
}
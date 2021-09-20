import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";
import UpgradeService from "./UpgradeService";

const defaultUnit: ISelectedUnit = {
    customName: "1",
    name: "1",
    selectionId: 1,
    cost: 1,
    quality: "2+",
    defense: "2+",
    size: 1,
    specialRules: [],
    equipment: [],
    selectedEquipment: [],
    upgradeSets: []
}

test("Upgrade with up to two is valid", () => {

    const unit: ISelectedUnit = {
        ...defaultUnit,
        selectedEquipment: [
            {
                name: "Attack Beast", count: 1
            }
        ]
    };

    const option: IEquipment = { name: "Attack Beast" };

    const upgrade: IUpgrade = {
        type: "upgrade",
        select: 2,
        options: [
            option
        ]
    };

    const isValid = UpgradeService.isValid(unit, upgrade, option);

    expect(isValid).toBe(true);
});

test("Upgrade with up to two is not valid", () => {

    const unit: ISelectedUnit = {
        ...defaultUnit,
        selectedEquipment: [
            {
                name: "Attack Beast",
                count: 2
            }
        ]
    };

    const option: IEquipment = { name: "Attack Beast" };

    const upgrade: IUpgrade = {
        type: "upgrade",
        select: 2,
        options: [
            option
        ]
    };

    const isValid = UpgradeService.isValid(unit, upgrade, option);

    expect(isValid).toBe(false);
});
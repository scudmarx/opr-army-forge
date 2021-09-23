import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";
import UpgradeService from "./UpgradeService";
import DataParsingService from "./DataParsingService";

//#region IsValid

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

//#endregion

//#region Control Types

test('Control Type "Upgrade with:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade with:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("check");
});

test('Control Type "Upgrade with one:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade with one:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("radio");
});

test('Control Type "Upgrade with up to 2:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade with up to 2:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("updown");
});

test('Control Type "Upgrade with any:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade with any:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("check");
});

test('Control Type "Upgrade Psychic(1):"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade Psychic(1):");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("check");
});

test('Control Type "Upgrade all modes with:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("check");
});

test('Control Type "Upgrade all modes with one:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with one:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("radio");
});

test('Control Type "Upgrade all modes with any:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with any:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("check");
});

test('Control Type "Upgrade any model with one:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade any model with one:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("radio");
});

test('Control Type "Upgrade one model with:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade one model with:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("check");
});

test('Control Type "Upgrade one model with one:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade one model with one:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("radio");
});

test('Control Type "Upgrade any model with:" with a unit size > 1', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade any model with:");
    const type = UpgradeService.getControlType({ ...defaultUnit, size: 5 }, upgrade);

    expect(type).toBe("updown");
});

test('Control Type "Upgrade with one:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade with one:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("radio");
});

test('Control Type "Upgrade all [weapons] with one:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade all Crossbows with one:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("radio");
});

test('Control Type "Upgrade with up to two:"', () => {

    const upgrade = DataParsingService.parseUpgradeText("Upgrade with up to two:");
    const type = UpgradeService.getControlType(null, upgrade);

    expect(type).toBe("updown");
});

//#endregion

//#region Apply Upgrade

test("Apply upgradeRule", () => {
    const unit = { ...defaultUnit, specialRules: ["Tough(3)"] };
    const option: IEquipment = {
        name: "Psychic(2)",
        specialRules: ["Psychic(2)"]
    };
    const upgrade: IUpgrade = {
        type: "upgradeRule",
        options: [option]
    };
    UpgradeService.apply(unit, upgrade, option);

    expect(unit.specialRules).toStrictEqual([
        "Tough(3)", "Psychic(2)"
    ])
});

test("Apply 'Replace one Assault Rifle and CCW'", () => {
    const unit: ISelectedUnit = {
        ...defaultUnit,
        selectedEquipment: [
            {
                name: 'Pistol',
                count: 1,
                cost: 0
            },
            {
                name: 'CCW',
                count: 1,
                cost: 0
            }
        ]
    };

    const option: IEquipment = {
        name: 'Shotgun',
        cost: 5
    };

    const upgrade: IUpgrade = {
        text: 'Replace one Pistol',
        type: 'replace',
        affects: 1,
        replaceWhat: 'Pistol',
        options: [option]
    };

    UpgradeService.apply(unit, upgrade, option);

    expect(unit.selectedEquipment).toStrictEqual([
        {
            name: "Pistol",
            count: 0,
            cost: 0
        },
        {
            name: 'CCW',
            count: 1,
            cost: 0
        },
        {
            name: 'Shotgun',
            count: 1,
            cost: 5,
            originalCount: 1
        }
    ])

});

test("Remove Upgrade", () => {

})

test("Apply option with count", () => {
    const unit: ISelectedUnit = {
        ...defaultUnit,
        selectedEquipment: [
            {
                name: 'Hand Weapons',
                count: 1,
                cost: 0
            }
        ]
    };

    const option: IEquipment = {
        name: 'Hand Weapons',
        count: 2
    };

    const upgrade: IUpgrade = {
        type: 'replace',
        affects: 1,
        replaceWhat: 'Hand Weapons',
        options: [option]
    };

    UpgradeService.apply(unit, upgrade, option);

    expect(unit.selectedEquipment).toStrictEqual([
        {
            name: 'Hand Weapons',
            count: 2,
            cost: 0
        }
    ])

});

//#endregion

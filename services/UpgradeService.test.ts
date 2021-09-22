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

//#endregion

import { IEquipment, ISelectedUnit, IUpgrade, IUpgradeOption } from "../data/interfaces";
import UpgradeService from "./UpgradeService";
import DataParsingService from "./DataParsingService";
import { nanoid } from "nanoid";



const defaultUnit: ISelectedUnit = {
  customName: "1",
  name: "1",
  selectionId: "asdqwe",
  cost: 1,
  quality: "2+",
  defense: "2+",
  size: 1,
  specialRules: [],
  equipment: [],
  upgrades: [],
  combined: false,
  selectedUpgrades: [],
  joinToUnit: null
};

const defaultOption: () => IUpgradeOption = () => ({
  id: nanoid(5),
  label: nanoid(5),
  cost: 5,
  gains: [],
  type: "ArmyBookUpgradeOption"
});



//#region IsValid

test('"Upgrade with up to two" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    selectedUpgrades: [
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade with up to 2"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Upgrade with up to two" is not valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    selectedUpgrades: [
      option,
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade with up to 2"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(false);
});

test('"Replace Any Rifle" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    equipment: [
      {
        label: "Rifle",
        count: 4
      }
    ],
    selectedUpgrades: [
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace any Rifle"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Replace Any Rifle" is not valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    equipment: [
      {
        label: "Rifle",
        count: 0
      }
    ],
    selectedUpgrades: [
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace any Rifle"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(false);
});

test('"Replace all Rifles" is valid', () => {

  const option1: IUpgradeOption = { ...defaultOption() };
  const option2: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    equipment: [
      {
        label: "Rifle",
        count: 5
      }
    ],
    selectedUpgrades: [
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace all Rifles"),
    options: [
      option1,
      option2
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option2);

  expect(isValid).toBe(true);
});

test('Radio is valid when another option in group is applied', () => {

  const option1: IUpgradeOption = { ...defaultOption() };
  const option2: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    equipment: [
      {
        label: "Heavy Rifle",
        count: 0
      }
    ],
    selectedUpgrades: [
      option1
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace all Heavy Rifles"),
    options: [
      option1,
      option2
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option2);

  expect(isValid).toBe(true);
});

test('"Replace one Rifle" is valid, where Rifle is an upgrade', () => {

  const rifleOption: IUpgradeOption = {
    ...defaultOption(),
    gains: [
      {
        label: "Rifle",
        name: "Rifle",
        type: "ArmyBookWeapon",
        count: 1
      }
    ]
  };
  const option: IUpgradeOption = { ...defaultOption() };

  // Rifle replaced a gun?
  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        label: "Gun",
        count: 4
      }
    ],
    selectedUpgrades: [
      rifleOption
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace all Rifles"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Replace one Rifle" is not valid, where Rifle is an upgrade', () => {

  const rifleOption: IUpgradeOption = {
    ...defaultOption(),
    gains: [
      {
        label: "Rifle",
        name: "Rifle",
        type: "ArmyBookWeapon",
        count: 0
      }
    ]
  };
  const option: IUpgradeOption = { ...defaultOption() };

  // Rifle replaced a gun?
  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        label: "Gun",
        count: 4
      }
    ],
    selectedUpgrades: [
      rifleOption
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace all Rifles"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(false);
});

test('"Replace up to 2 Rifles" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    equipment: [
      {
        label: "Rifle",
        count: 4
      }
    ],
    selectedUpgrades: [
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace up to 2 Rifles"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Replace up to 2 Rifles" is not valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    equipment: [
      {
        label: "Rifle",
        count: 3
      }
    ],
    selectedUpgrades: [
      option,
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace up to 2 Rifles"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(false);
});

test('"Any model may replace 1 Claw" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        label: "Claw",
        count: 9
      }
    ],
    selectedUpgrades: [
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Any model may replace 1 Claw:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Any model may replace 1 Claw" is not valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        label: "Claw",
        count: 5
      }
    ],
    selectedUpgrades: [
      option, option, option, option, option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Any model may replace 1 Claw:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(false);
});

test('"Replace one A / B" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        label: "ARifle",
        count: 5
      }
    ],
    selectedUpgrades: [
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace one ARifle / BRifle:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Replace any A / B" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        label: "BRifle",
        count: 4
      }
    ],
    selectedUpgrades: [
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace any ARifle / BRifle:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Replace any A / B" is not valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        label: "BRifle",
        count: 0
      }
    ],
    selectedUpgrades: [
      option, option, option, option, option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Replace any ARifle / BRifle:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(false);
});

test('"Upgrade with one" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    selectedUpgrades: [
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade with one:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Upgrade with any" is valid', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    selectedUpgrades: [
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade with any:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Upgrade with any" is valid', () => {

  const option1: IUpgradeOption = { ...defaultOption() };
  const option2: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    selectedUpgrades: [
      option1
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade with any:"),
    options: [
      option1,
      option2
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option2);

  expect(isValid).toBe(true);
});


//#endregion

//#region Control Types

test('Control Type "Upgrade with:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade with:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade with one:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade with one:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("radio");
});

test('Control Type "Upgrade with up to 2:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade with up to 2:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("updown");
});

test('Control Type "Upgrade with any:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade with any:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade Psychic(1):"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade Psychic(1):");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade all modes with:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade all modes with one:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with one:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("radio");
});

test('Control Type "Upgrade all modes with any:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with any:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade any model with one:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any model with one:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("radio");
});

test('Control Type "Upgrade one model with:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade one model with:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade one model with one:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade one model with one:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("radio");
});

test('Control Type "Upgrade any model with:" with a unit size > 1', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any model with:");
  const type = UpgradeService.getControlType({ ...defaultUnit, size: 5 }, upgrade);

  expect(type).toBe("updown");
});

test('Control Type "Upgrade with one:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade with one:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("radio");
});

test('Control Type "Upgrade all [weapons] with one:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade all Crossbows with one:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("radio");
});

test('Control Type "Upgrade with up to two:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade with up to two:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

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
    equipment: [
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

  expect(unit.equipment).toStrictEqual([
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
    equipment: [
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

  expect(unit.equipment).toStrictEqual([
    {
      name: 'Hand Weapons',
      count: 2,
      cost: 0
    }
  ])

});

//#endregion

import { ISelectedUnit, ISpecialRule, IUpgrade, IUpgradeGainsWeapon, IUpgradeOption } from "../data/interfaces";
import UpgradeService from "./UpgradeService";
import DataParsingService from "./DataParsingService";
import { nanoid } from "nanoid";


const defaultWeapon: IUpgradeGainsWeapon = {
  type: "ArmyBookWeapon",
  attacks: 1,
  range: 0,
  specialRules: [],
  //id: "",
  name: "",
  label: "",
  count: 1,
  originalCount: 0
}

const SpecialRules = {
  Hero: {
    key: "hero",
    name: "Hero",
    rating: ""
  },
  Tough: (rating) => {
    return {
      key: "tough",
      name: "Tough",
      rating: rating}
  }
}

const defaultWeapons = {
  rifle: {
    ...defaultWeapon,
    name: "Rifle",
    label: "Rifle",
    range: 24
  },
  ccw: {
    ...defaultWeapon,
    name: "CCW",
    label: "CCW",
  },
  pistol: {
    ...defaultWeapon,
    name: "Pistol",
    label: "Pistol",
    range: 12
  }
}

const defaultUnit: ISelectedUnit = {
  customName: "Defaulty McDefaultFace",
  name: "Unit",
  selectionId: "default",
  cost: 1,
  quality: "4+",
  defense: "4+",
  size: 1,
  specialRules: [],
  equipment: [],
  upgrades: [],
  combined: false,
  selectedUpgrades: [],
  joinToUnit: null,
  disabledUpgradeSections: []
};

const defaultUnits = {
  hero: {
    ...defaultUnit,
    specialRules: [SpecialRules.Hero, SpecialRules.Tough(3)],
    equipment: [ defaultWeapons.ccw ],
  },
  infantry: {
    ...defaultUnit,
    size: 5,
    equipment: [ defaultWeapons.rifle, defaultWeapons.ccw ]
  }
}

const defaultOption: () => IUpgradeOption = () => ({
  id: nanoid(5),
  label: nanoid(5),
  cost: 5,
  gains: []
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
        ...defaultWeapon,
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
        ...defaultWeapon,
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
        ...defaultWeapon,
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
        ...defaultWeapon,
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
        count: 1,
        originalCount: 1,
        //id: ""
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
        ...defaultWeapon,
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

test('"Replace one Rifle" is not valid, where Rifle is an upgrade (which gives 0 rifles)', () => {

  const rifleOption: IUpgradeOption = {
    ...defaultOption(),
    gains: [
      {
        label: "Rifle",
        name: "Rifle",
        type: "ArmyBookWeapon",
        count: 0,
        originalCount: 1,
        //id: ""
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
        ...defaultWeapon,
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
        ...defaultWeapon,
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

test('"Replace up to 2 Rifles" is not valid (already selected twice)', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    equipment: [
      {
        ...defaultWeapon,
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
        ...defaultWeapon,
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

test('"Any model may replace 1 Claw" is not valid (already replaced all Claws)', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 5,
    equipment: [
      {
        ...defaultWeapon,
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
        ...defaultWeapon,
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
        ...defaultWeapon,
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
        ...defaultWeapon,
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

test('"Upgrade any model with up to two" is valid (3 models in unit, 3 options selected)', () => {

  const option: IUpgradeOption = { ...defaultOption() };

  const unit: ISelectedUnit = {
    ...defaultUnit,
    size: 3,
    selectedUpgrades: [
      option,
      option,
      option
    ]
  };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade any model with up to two:"),
    options: [
      option
    ]
  };

  const isValid = UpgradeService.isValid(unit, upgrade, option);

  expect(isValid).toBe(true);
});

test('"Upgrade any Rifle with one:" is valid (infantry unit with Rifles)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade any Rifle with one:"),
    options: [
      option
    ]
  }

  const unit = defaultUnits.infantry
  const isValid = UpgradeService.isValid(unit, upgrade, option);
  expect(isValid).toBe(true)
})

test('"Upgrade any Rifle with one:" is NOT valid (size [5] infantry unit with Rifles, already selected 5 times)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade any Rifle with one:"),
    options: [
      option
    ]
  }

  const unit = {...defaultUnits.infantry, selectedUpgrades: [option, option, option, option, option]}
  const isValid = UpgradeService.isValid(unit, upgrade, option);
  if (isValid) console.log(unit, upgrade)
  expect(isValid).toBe(false)
})

test('"Upgrade any Pistol with one:" is valid (Hero unit with 2x Pistol, already selected 1 times)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade any Pistol with one:"),
    options: [
      option
    ]
  }

  const unit = {...defaultUnits.hero, equipment: [ {...defaultWeapons.pistol, count: 2} ],
    selectedUpgrades: [option]}
  const isValid = UpgradeService.isValid(unit, upgrade, option);
  expect(isValid).toBe(true)
})

test('"Upgrade any Pistol with one:" is NOT valid (Hero unit with 2x Pistol, already selected 2 times)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade any Pistol with one:"),
    options: [
      option
    ]
  }

  const unit = {...defaultUnits.hero, equipment: [ {...defaultWeapons.pistol, count: 2} ],
  selectedUpgrades: [option, option]}
  const isValid = UpgradeService.isValid(unit, upgrade, option);
  expect(isValid).toBe(false)
})

test('"Upgrade any Pistol with up to two:" is valid (Hero unit with 2x Pistol, already selected 3 times)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade any Pistol with up to two:"),
    options: [
      option
    ]
  }

  const unit = {...defaultUnits.hero, equipment: [ {...defaultWeapons.pistol, count: 2} ],
  selectedUpgrades: [option, option, option]}
  const isValid = UpgradeService.isValid(unit, upgrade, option);
  expect(isValid).toBe(true)
})

test('"Upgrade any Pistol with up to two:" is NOT valid (Hero unit with 2x Pistol, already selected 4 times)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade any Pistol with up to two:"),
    options: [
      option
    ]
  }

  const unit = {...defaultUnits.hero, equipment: [ {...defaultWeapons.pistol, count: 2} ],
  selectedUpgrades: [option, option, option, option]}
  const isValid = UpgradeService.isValid(unit, upgrade, option);
  expect(isValid).toBe(false)
})

test('"Upgrade three Rifles with up to two:" is valid (infantry unit with Rifles, already selected 5 times)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade three Rifles with up to two:"),
    options: [
      option
    ]
  }

  const unit = {...defaultUnits.infantry, selectedUpgrades: [option, option, option, option, option]}

  const isValid = UpgradeService.isValid(unit, upgrade, option);
  expect(isValid).toBe(false)
})

test('"Upgrade three Rifles with up to two:" is NOT valid (infantry unit with Rifles, already selected 6 times)', () => {
  
  const option: IUpgradeOption = { ...defaultOption() };

  const upgrade: IUpgrade = {
    ...DataParsingService.parseUpgradeText("Upgrade three Rifles with up to two:"),
    options: [
      option
    ]
  }

  const unit = {...defaultUnits.infantry, selectedUpgrades: [option, option, option, option, option, option]}

  const isValid = UpgradeService.isValid(unit, upgrade, option);
  expect(isValid).toBe(false)
})

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

test('Control Type "Upgrade all models with:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade all models with one:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with one:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("radio");
});

test('Control Type "Upgrade all models with any:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with any:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("check");
});

test('Control Type "Upgrade any model with one:" (one model in unit)', () => {

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

test('Control Type "Upgrade any Pistol with:" for Hero with one Pistol', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any Pistol with:");
  const type = UpgradeService.getControlType(defaultUnits.hero, upgrade);

  expect(type).toBe("updown");
});

test('Control Type "Upgrade any Pistol with one:" for Hero with one Pistol', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any Pistol with one:");
  const type = UpgradeService.getControlType(defaultUnits.hero, upgrade);

  expect(type).toBe("updown");
});

test('Control Type "Upgrade any Pistol with:" for Hero with two Pistols', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any Pistol with:");
  const type = UpgradeService.getControlType({...defaultUnits.hero, equipment: [defaultWeapons.pistol, defaultWeapons.pistol]}, upgrade);

  expect(type).toBe("updown");
});

test('Control Type "Upgrade any Pistol with one:" for Hero with two Pistols', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any Pistol with one:");
  const type = UpgradeService.getControlType({...defaultUnits.hero, equipment: [defaultWeapons.pistol, defaultWeapons.pistol]}, upgrade);

  expect(type).toBe("updown");
});

test('Control Type "Upgrade any Rifle with:" for infantry squad with one Rifle each', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any Rifle with:");
  const type = UpgradeService.getControlType(defaultUnits.infantry, upgrade);

  expect(type).toBe("updown");
});

test('Control Type "Upgrade any Rifle with one:" for infantry squad with one Rifle each', () => {

  const upgrade = DataParsingService.parseUpgradeText("Upgrade any Rifle with one:");
  const type = UpgradeService.getControlType(defaultUnits.infantry, upgrade);

  expect(type).toBe("updown");
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

test('Control Type "Replace up to two [weapon]:"', () => {

  const upgrade = DataParsingService.parseUpgradeText("Replace up to two Rocket Launchers:");
  const type = UpgradeService.getControlType(defaultUnit, upgrade);

  expect(type).toBe("updown");
});

//#endregion

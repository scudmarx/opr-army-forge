import { ListState } from "./listSlice";

/**
 * The object which is saved in JSON format as a list save file.
 */
export interface ISaveData {
  armyId?: string;
  armyFile?: string;
  gameSystem: string;
  armyName: string;
  modified: string;
  listPoints: number;
  list: ListState;
}

export interface ISpecialRule {
  key: string;
  name: string;
  rating: string;
  condition?: string;
  modify?: boolean;
}

/**
 * Interface for units as they appear in rulebooks, as templates for selection.
 */
export interface IUnit {
  category?: string;
  name: string;
  /** The number of models in the unit */
  size: number;
  cost: number;
  quality: string;
  defense: string;
  specialRules?: ISpecialRule[];
  upgrades: string[];
  /** the equipment that each model has */
  equipment: IUpgradeGainsWeapon[]; //IEquipment[];
  disabledUpgradeSections: string[];
}

/**
 * Interface for units as they appear in a roster, with selected upgrade options.
 */
export interface ISelectedUnit extends IUnit {
  selectionId: string;
  customName?: string;
  selectedUpgrades: IUpgradeOption[];
  combined: boolean;
  joinToUnit: string;
}

/**
 * Interface for Upgrade groups, containing one or more upgrade options.
 */
export interface IUpgrade {
  id: string;
  label?: string;
  type: "replace" | "upgrade" | "upgradeRule" | "attachment";
  affects?: "any" | "all" | number;
  select?: string | number;
  replaceWhat?: string[] | string[][];
  model?: boolean;
  attachment?: boolean;
  attachModel?: boolean;
  options?: IUpgradeOption[];
}

export interface IUpgradeOption {
  id: string;
  /** The point cost to select this upgrade option. */
  cost: number;
  label: string;
  isModel?: boolean;
  /** Array of upgrades provided by choosing this option. */
  gains: IUpgradeGains[];// IEquipment[] | ISpecialRule[];
  replacedWhat?: string[] | string[][];
  type: "ArmyBookUpgradeOption";
}

export interface IUpgradeGains {
  id: string;
  name: string;
  label: string;
  count: number;
  originalCount: number;
  type: "ArmyBookRule" | "ArmyBookWeapon" | "ArmyBookItem" | "ArmyBookDefense" | "ArmyBookMultiWeapon"; // TODO: Add these
  dependencies?: string[];
}

export interface IUpgradeGainsItem extends IUpgradeGains {
  content: IUpgradeGains[];
}

export interface IUpgradeGainsWeapon extends IUpgradeGains {
  type: "ArmyBookWeapon";
  attacks: number;
  range: number;
  specialRules: IUpgradeGainsRule[];
}

/** Upgrade which grants multiple weapons. */
export interface IUpgradeGainsMultiWeapon extends IUpgradeGains {
  type: "ArmyBookMultiWeapon";
  /** The array of Weapons provided. */
  profiles: IUpgradeGainsWeapon[];
}

export interface IUpgradeGainsRule extends IUpgradeGains {
  type: "ArmyBookRule" | "ArmyBookDefense";
  /** The key of the Special Rule granted. (The name of the rule in lowercase and with dashes instead of spaces.)*/
  key: string;
  condition: string;
  /** Is the rating for this rule a modifier to an existing value, e.g. AP(+1), rather than a set value itself, e.g. AP(3)? */
  modify: boolean; // ?
  rating: string;
}

/** Interface for a list of upgrade groups. (e.g. A unit in a rulebook may be listed as having access to upgrades 'A, B', which are UpgradePackages. ) */
export interface IUpgradePackage {
  hint: string,
  uid: string;
  /** The Upgrade groups provided by this package. */
  sections: IUpgrade[];
}

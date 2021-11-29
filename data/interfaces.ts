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
  joinToUnit?: string;
}

/**
 * Interface for Upgrade groups, containing one or more upgrade options.
 */
export interface IUpgrade {
  id: string;
  label?: string;
  /** how the upgrade affects what it affects */
  type: "replace" | "upgrade" | "upgradeRule" | "attachment";
  /** how many things the upgrade affects */
  affects?: "any" | "all" | number;
  /** how many times the upgrade can be selected per thing it affects */
  select?: string | number;
  /** list of [lists of] possible things to be affected by the upgrade */
  replaceWhat?: string[] | string[][];
  /** does this upgrade add models to the unit? redundant with .attachModel and options[].isModel? */
  model?: boolean;
  /** does this upgrade apply a weapon attachment to a weapon? */
  attachment?: boolean;
  /** does this upgrade add models to the unit? redundant with .model and options[].isModel? */
  attachModel?: boolean;
  options?: IUpgradeOption[];
}

/**
 * interface for the options available in an upgrade group
 */
export interface IUpgradeOption {
  id: string;
  /** The point cost to select this upgrade option. */
  cost: number;
  label: string;
  /** does this option add a model to the unit? */
  isModel?: boolean;
  /** Array of upgrades provided by choosing this option. */
  gains: IUpgradeGains[];// IEquipment[] | ISpecialRule[];
  /** used to track replaced items for restoration after removing this upgrade */
  replacedWhat?: string[] | string[][];
}

/** A thing gained by taking an upgrade option */
export interface IUpgradeGains {
  //id: string; // never used
  name: string;
  label: string;
  /** how many times this is applied */
  count: number;
  /** used to track how many times this was applied previously, for restoring previous state when removing the upgrade */
  originalCount?: number;
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

/** Upgrade which grants a Special Rule */
export interface IUpgradeGainsRule extends IUpgradeGains {
  type: "ArmyBookRule" | "ArmyBookDefense";
  /** The key of the Special Rule granted. (The name of the rule in lowercase and with dashes instead of spaces.)*/
  key: string;
  /** conditions required for rule to apply, e.g. "in melee" */
  condition: string;
  /** Is the rating for this rule a modifier to an existing value, e.g. AP(+1), rather than a set value itself, e.g. AP(3)? */
  modify: boolean; // ?
  /** The rating of the granted rule, e.g. the 6 in Tough(6) */
  rating: string;
}

/** Interface for a list of upgrade groups. (e.g. A unit in a rulebook may be listed as having access to upgrades 'A, B', which are UpgradePackages. ) */
export interface IUpgradePackage {
  hint: string,
  uid: string;
  /** The Upgrade groups provided by this package. */
  sections: IUpgrade[];
}

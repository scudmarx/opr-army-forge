import { ListState } from "./listSlice";

export interface ISaveData {
  armyId?: string;
  armyFile?: string;
  gameSystem: string;
  armyName: string;
  modified: string;
  listPoints: number;
  list: ListState;
}
export interface IEquipment {
  label?: string;
  name?: string;
  range?: number;
  attacks?: number;
  count?: number;
  specialRules?: string[]
}

export interface ISpecialRule {
  key: string;
  name: string;
  rating: string;
  condition?: string;
  modify?: boolean;
}

export interface IUnit {
  category?: string;
  name: string;
  size: number;
  cost: number;
  quality: string;
  defense: string;
  specialRules?: ISpecialRule[];
  upgrades: string[];
  equipment: IEquipment[]
}

export interface ISelectedUnit extends IUnit {
  selectionId: string;
  customName?: string;
  selectedUpgrades: IUpgradeOption[];
  combined: boolean;
  joinToUnit: string;
}

export interface IUpgrade {
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
  cost: number;
  label: string;
  isModel?: boolean;
  gains: IUpgradeGains[];// IEquipment[] | ISpecialRule[];
  replacedWhat?: string[] | string[][];
  type: "ArmyBookUpgradeOption";
}

export interface IUpgradeGains {
  name: string;
  label: string;
  count?: number;
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

export interface IUpgradeGainsMultiWeapon extends IUpgradeGains {
  type: "ArmyBookMultiWeapon";
  profiles: IUpgradeGainsWeapon[];
}

export interface IUpgradeGainsRule extends IUpgradeGains {
  type: "ArmyBookRule" | "ArmyBookDefense";
  key: string;
  condition: string;
  modify: boolean; // ?
  rating: string;
}

export interface IUpgradePackage {
  hint: string,
  uid: string;
  sections: IUpgrade[];
}

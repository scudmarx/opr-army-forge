import { IntegrationInstructions } from "@mui/icons-material";

export interface IEquipment {
    id?: string;
    type?: "combined" | "mount" | "weaponPart" | "weaponHeader" | "ArmyBookWeapon" | "ArmyBookItem";
    label?: string;
    name?: string;
    range?: number;
    attacks?: number;
    cost?: number;
    count?: number;
    originalCount?: number;
    specialRules?: ISpecialRule[];
    //equipment?: IEquipment[]; // For { "type": "combined" }
}

export interface ISpecialRule {
    key: string;
    name: string;
    rating: string;
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

export interface IUpgrade {
    label?: string;
    type: "replace" | "upgrade" | "upgradeRule";
    affects?: "any" | "all" | number;
    select?: string | number;
    limit?: number;
    replaceWhat?: string | string[];
    options?: IUpgradeOption[];
}

export interface IUpgradeOption {
    id: string;
    cost: string;
    label: string;
    gains: IEquipment[] | ISpecialRule[];
}

export interface IUpgradePackage {
    hint: string,
    uid: string;
    sections: IUpgrade[];
}

export interface ISelectedUnit extends IUnit {
    selectionId: number;
    selectedEquipment: IEquipment[];
    customName?: string;
    selectedUpgrades: IUpgradeOption[];
}

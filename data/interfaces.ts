export interface IEquipment {
    type?: "combined";
    name: string;
    range?: number;
    attacks?: number;
    cost?: number;
    count?: number;
    specialRules?: string[];
    equipment?: IEquipment[]; // For { "type": "combined" }
}

export interface IUnit {
    category?: string;
    name: string;
    size: number;
    cost: number;
    quality: string;
    defense: string;
    specialRules: string[];
    upgradeSets: string[];
    equipment: IEquipment[]
}

export interface IUpgrade {
    type: "replace" | "upgrade" | "upgradeRule";
    affects?: "any" | "all" | number;
    select?: string | number;
    limit?: number;
    replaceWhat?: string|string[];
    options?: IEquipment[];
}

export interface ISelectedUnit extends IUnit {
    selectionId: number;
    customName: string;
    selectedEquipment: IEquipment[];
}
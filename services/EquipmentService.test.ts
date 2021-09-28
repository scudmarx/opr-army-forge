import { IEquipment } from '../data/interfaces';
import EquipmentService from './EquipmentService';

test("Format basic string", () => {
    const e: IEquipment = {
        name: "Sword",
        attacks: 3
    };

    const result = EquipmentService.formatString(e);

    expect(result).toBe("Sword (A3)");
})

test("Item string parts", () => {
    const parts = EquipmentService.getStringParts({
        label: "Light Shields (Defense +1 in melee)",
        name: "Light Shields",
        content: [
            {
                key: "defense",
                name: "Defense",
                rating: "1",
                condition: "in melee"
            }
        ],
        type: "ArmyBookItem"
    } as any, 1);

    expect(parts).toStrictEqual({
        name: "Light Shields",
        rules: ""
    });

    const parts2 = EquipmentService.getStringParts({
        label: "Shield Bash (A2)",
        name: "Shield Bash",
        attacks: 2,
        specialRules: [],
        type: "ArmyBookWeapon"
    } as any, 1);

    expect(parts2).toStrictEqual({
        name: "Light Shields",
        rules: ""
    });
})
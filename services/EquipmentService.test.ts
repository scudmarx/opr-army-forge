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
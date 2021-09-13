import { IEquipment } from "../data/interfaces";

export default class EquipmentService {
    static formatString(eqp: IEquipment) {
        var range = eqp.range ? `${eqp.range}"` : null;
        var attacks = eqp.attacks ? "A" + eqp.attacks : null;
        return `${eqp.name} (${[range, attacks] // Range, then attacks
            .concat(eqp.specialRules || []) // then special rules
            .filter((m) => !!m) // Remove empty/null entries
            .join(", ")})`; // comma separated list
    }
}
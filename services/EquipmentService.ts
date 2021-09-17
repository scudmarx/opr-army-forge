import { IEquipment } from "../data/interfaces";

export default class EquipmentService {
    static getAP(e: IEquipment): number {
        if (!e || !e.specialRules) return null;
        for (let rule of e.specialRules) {
            var match = /AP\((\d+)\)/.exec(rule);
            if (match)
                return parseInt(match[1]);
        }
        return null;
    }

    static formatString(eqp: IEquipment): string {
        var range = eqp.range ? `${eqp.range}"` : null;
        var attacks = eqp.attacks ? "A" + eqp.attacks : null;
        return `${eqp.name} (${[range, attacks] // Range, then attacks
            .concat(eqp.specialRules || []) // then special rules
            .filter((m) => !!m) // Remove empty/null entries
            .join(", ")})`; // comma separated list
    }

    static getStringParts(eqp: IEquipment): { name: string, rules: string } {
        var range = eqp.range ? `${eqp.range}"` : null;
        var attacks = eqp.attacks ? "A" + eqp.attacks : null;
        return {
            name: eqp.name,
            rules: [range, attacks] // Range, then attacks
                .concat(eqp.specialRules || []) // then special rules
                .filter((m) => !!m) // Remove empty/null entries
                .join(", ") // csv
        }
    }
}
import { IEquipment } from "../data/interfaces";
import pluralise from "pluralize";
import { EscalatorWarning } from "@mui/icons-material";

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
        const name = eqp.count > 1 ? pluralise.plural(eqp.name) : eqp.name;
        var range = eqp.range ? `${eqp.range}"` : null;
        var attacks = eqp.attacks ? "A" + eqp.attacks : null;
        return `${name} (${[range, attacks] // Range, then attacks
            .concat(eqp.specialRules || []) // then special rules
            .filter((m) => !!m) // Remove empty/null entries
            .join(", ")})`; // comma separated list
    }

    static getStringParts(eqp: IEquipment): { name: string, rules: string } {
        const name = eqp.count > 1 ? pluralise.plural(eqp.name) : eqp.name;
        var range = eqp.range ? `${eqp.range}"` : null;
        var attacks = eqp.attacks ? "A" + eqp.attacks : null;
        return {
            name: name,
            rules: [range, attacks] // Range, then attacks
                .concat(eqp.specialRules || []) // then special rules
                .filter((m) => !!m) // Remove empty/null entries
                .join(", ") // csv
        }
    }
}
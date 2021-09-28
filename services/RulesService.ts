import { ISpecialRule } from "../data/interfaces";

export default class RulesService {
    public static displayName(rule: ISpecialRule) {
        return rule.name
            + (rule.rating ? `(${(rule.name === "Defense" ? "+" : "") + rule.rating})` : "")
            + (rule.condition ? ` ${rule.condition}` : "");
    }
}
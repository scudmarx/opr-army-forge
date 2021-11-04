import { ISpecialRule } from "../data/interfaces";

export default class RulesService {
    public static displayName(rule: ISpecialRule) {
        return rule.name
            + ((rule.rating != null) ? `(${(rule.name === "Defense" || rule.modify ? "+" : "") + rule.rating})` : "")
            + (rule.condition ? ` ${rule.condition}` : "");
    }
}
import RuleItem from "./RuleItem";
import { RootState } from '../../data/store';
import { useSelector } from 'react-redux';
import { IGameRule } from "../../data/armySlice";
import { Fragment } from "react";
import { ISpecialRule } from "../../data/interfaces";
import RulesService from "../../services/RulesService";
import { groupBy } from "../../services/Helpers";

export default function RuleList({ specialRules }: { specialRules: ISpecialRule[] }) {
    const army = useSelector((state: RootState) => state.army);
    const gameRules = army.rules;
    const armyRules = army.data.specialRules;
    const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);

    const rules = specialRules.filter(r => !!r && r.name != "-");

    if (!rules || rules.length === 0)
        return null;

    const ruleGroups = groupBy(rules, "name");
    const keys = Object.keys(ruleGroups);
    // Sort rules alphabetically
    keys.sort((a, b) => a.localeCompare(b));

    return (
        <div>
            {keys.map((key, index) => {
                const group = ruleGroups[key];
                const rule = group[0];
                const rating = group.reduce((total, next) => next.rating ? total + parseInt(next.rating) : total, 0);

                const ruleDefinition = ruleDefinitions
                    .filter(r => /(.+?)(?:\(|$)/.exec(r.name)[0] === rule.name)[0];

                return (
                    <Fragment key={index}>
                        {index > 0 ? <span className="mr-1">, </span> : null}
                        <RuleItem label={RulesService.displayName({...rule, rating })} description={ruleDefinition?.description || ""} />
                    </Fragment>
                );
            })}
        </div>
    );
}
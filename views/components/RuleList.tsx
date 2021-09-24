import RuleItem from "./RuleItem";
import { RootState } from '../../data/store';
import { useSelector } from 'react-redux';
import { IGameRule } from "../../data/armySlice";
import { Fragment } from "react";
import { ISpecialRule } from "../../data/interfaces";
import RulesService from "../../services/RulesService";

export default function RuleList({ specialRules }: { specialRules: ISpecialRule[] }) {
    const army = useSelector((state: RootState) => state.army);
    const gameRules = army.rules;
    const armyRules = army.data.specialRules;
    const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);

    if (!specialRules || specialRules.length === 0)
        return null;

    return (
        <div>
            {specialRules.filter(r => !!r && r.name != "-").map((rule, index) => {

                const ruleDefinition = ruleDefinitions
                    .filter(r => r.name.indexOf(rule.name) === 0)[0];

                if (!ruleDefinition)
                    return null;

                return (
                    <Fragment key={index}>
                        {index > 0 ? <span className="mr-1">, </span> : null}
                        <RuleItem label={RulesService.displayName(rule)} description={ruleDefinition.description} />
                    </Fragment>
                );
            })}
        </div>
    );
}
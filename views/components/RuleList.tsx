import RuleItem from "./RuleItem";
import { RootState } from '../../data/store';
import { useSelector } from 'react-redux';
import { IGameRule } from "../../data/armySlice";

export default function RuleList({ specialRules }: { specialRules: string[] }) {
    const army = useSelector((state: RootState) => state.army);
    const gameRules = army.rules;
    const armyRules = army.data.specialRules;
    const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);

    if (!specialRules || specialRules.length === 0)
        return null;

    return (
        <div>
            {specialRules.filter(r => !!r && r != "-").map((rule, index) => {
                const ruleName = /^(.+?)(?:\(|$)/.exec(rule)[1].trim();

                const description = ruleDefinitions
                    .filter(r => r.name.indexOf(ruleName) === 0)[0]
                    ?.description;

                return (
                    <>
                        {index > 0 ? <span className="mr-1">, </span> : null}
                        <RuleItem key={index} label={rule} description={description} />
                    </>
                );
            })}
        </div>
    );
}
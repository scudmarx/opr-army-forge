import Head from "next/head";
import React, { Fragment, useEffect } from "react";
import { useSelector } from 'react-redux'
import { RootState } from '../data/store'
import { useRouter } from "next/router";
import { useMediaQuery } from 'react-responsive';
import style from "../styles/Cards.module.css";
import UnitEquipmentTable from "../views/UnitEquipmentTable";
import { Paper, Card } from "@mui/material";
import RulesService from "../services/RulesService";
import RuleList from "../views/components/RuleList";
import DataParsingService from "../services/DataParsingService";
import { IGameRule } from "../data/armySlice";
import { groupBy } from "../services/Helpers";

export default function Cards() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army);
    const router = useRouter();

    const gameRules = army.rules;
    const armyRules = army.data?.specialRules;
    const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);


    // Load army list file 
    useEffect(() => {
        // Redirect to game selection screen if no army selected
        if (!army.armyFile) {
            router.push("/", null, { shallow: true });
            return;
        }
    }, []);

    return (
        <>
            <Head>
                <title>OPR Army Forge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="columns is-multiline m-4">
                {list.units.map((u, i) => {

                    const equipmentSpecialRules = u
                        .equipment
                        .filter(e => !e.attacks && e.specialRules?.length) // No weapons, and only equipment with special rules
                        .reduce((value, e) => value.concat(e.specialRules), []); // Flatten array of special rules arrays

                    const specialRules = (u.specialRules || [])
                        .concat(equipmentSpecialRules.map(DataParsingService.parseRule))
                        .filter(r => r.name != "-");

                    const rules = specialRules.filter(r => !!r && r.name != "-");
                    const ruleGroups = groupBy(rules, "name");
                    const keys = Object.keys(ruleGroups);
                    // Sort rules alphabetically
                    keys.sort((a, b) => a.localeCompare(b));

                    return (
                        <div key={i} className="column is-one-third">
                            <Card elevation={1}>
                                <div className="mb-4">
                                    <div className="card-body">
                                        <h3 className="is-size-4 my-2" style={{ fontWeight: 500, textAlign: "center" }}>{u.name}</h3>
                                        <hr className="my-0" />

                                        <div className="is-flex mb-2" style={{ justifyContent: "center" }}>

                                            <div className={style.profileStat}>
                                                <p>Quality</p>
                                                <p>
                                                    {u.quality}+
                                                </p>
                                            </div>
                                            <div className={style.profileStat}>
                                                <p>Defense</p>
                                                <p>
                                                    {u.defense}+
                                                </p>
                                            </div>

                                        </div>
                                        <UnitEquipmentTable unit={u} />
                                        {/* {specialRules?.length && <Paper square elevation={0}>
                                            <div className="px-4 mb-4">
                                                <h4 style={{ fontWeight: 600 }}>Special Rules</h4>
                                                <RuleList specialRules={specialRules} />
                                            </div>
                                        </Paper>} */}
                                        {specialRules?.length > 0 && <Paper square elevation={0}>
                                            <div className="px-4 my-2">
                                                {keys.map((key, index) => {
                                                    const group = ruleGroups[key];
                                                    const rule = group[0];
                                                    const rating = group.reduce((total, next) => next.rating ? total + parseInt(next.rating) : total, 0);

                                                    const ruleDefinition = ruleDefinitions
                                                        .filter(r => /(.+?)(?:\(|$)/.exec(r.name)[0] === rule.name)[0];

                                                    return (
                                                        <p key={index}>
                                                            <span style={{ fontWeight: 600 }}>{RulesService.displayName({ ...rule, rating })} - </span>
                                                            <span>{ruleDefinition?.description || ""}</span>
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        </Paper>}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

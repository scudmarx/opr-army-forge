import React from "react";
import { useSelector } from 'react-redux'
import { RootState } from '../data/store'
import style from "../styles/Cards.module.css";
import UnitEquipmentTable from "../views/UnitEquipmentTable";
import { Paper, Card } from "@mui/material";
import RulesService from "../services/RulesService";
import DataParsingService from "../services/DataParsingService";
import { IGameRule } from "../data/armySlice";
import { groupBy } from "../services/Helpers";
import UnitService from "../services/UnitService";
import UpgradeService from "../services/UpgradeService";
import _ from "lodash";
import { ISelectedUnit } from "../data/interfaces";

export default function ViewCards({ showPsychic, showFullRules, showPointCosts }) {

  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army);

  const gameRules = army.rules;
  const armyRules = army.data?.specialRules;
  const spells = army.data?.spells || [];
  const ruleDefinitions: IGameRule[] = gameRules.concat(armyRules);

  const units = (list?.units ?? []).map(u => ({ ...u }));
  for (let unit of units) {
    delete unit.selectionId;
  }

  const unitGroups = _.groupBy(units, u => JSON.stringify(u));
  console.log(unitGroups);
  return (
    <>
      <div className="columns is-multiline">
        {Object.values(unitGroups).map((grp: ISelectedUnit[], i) => {

          const u = grp[0];
          const count = grp.length;
          const equipmentSpecialRules = u
            .equipment
            .filter(e => !e.attacks && e.specialRules?.length) // No weapons, and only equipment with special rules
            .reduce((value, e) => value.concat(e.specialRules), []); // Flatten array of special rules arrays

          const specialRules = (u.specialRules || [])
            .concat(equipmentSpecialRules.map(DataParsingService.parseRule))
            .filter(r => r.name != "-");

          const equipmentRules = UnitService.getAllUpgradedRules(u);
          console.log(equipmentRules);

          const rules = specialRules.concat(equipmentRules).filter(r => !!r && r.name != "-");
          const ruleGroups = groupBy(rules, "name");
          const ruleKeys = Object.keys(ruleGroups);
          const toughness = toughFromUnit(u);

          // Sort rules alphabetically
          ruleKeys.sort((a, b) => a.localeCompare(b));

          return (
            <div key={i} className="column is-one-third">
              <Card elevation={1}>
                <div className="mb-4">
                  <div className="card-body">
                    <h3 className="is-size-4 my-2" style={{ fontWeight: 500, textAlign: "center" }}>
                      {count > 1 ? `${count}x ` : ""}{u.customName || u.name}
                      {(u.size > 1) && <span className="mr-2" style={{ color: "#666666" }}>[{u.size}]</span>}
                      {showPointCosts && <span className="is-size-6" style={{ color: "#666666" }}>- {UpgradeService.calculateUnitTotal(u)}pts</span>}</h3>
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
                      {toughness > 1 && <div className={style.profileStat}>
                        <p>Tough</p>
                        <p>
                          {toughness}
                        </p>
                      </div>}

                    </div>
                    <div className="px-2">
                      <UnitEquipmentTable unit={u} />
                    </div>
                    {/* {specialRules?.length && <Paper square elevation={0}>
                                            <div className="px-4 mb-4">
                                                <h4 style={{ fontWeight: 600 }}>Special Rules</h4>
                                                <RuleList specialRules={specialRules} />
                                            </div>
                                        </Paper>} */}
                    {rules?.length > 0 && <Paper square elevation={0}>
                      <div className="px-2 my-2">
                        {ruleKeys.map((key, index) => {

                          const group = ruleGroups[key];
                          const rule = group[0];
                          const rating = group.reduce((total, next) => next.rating ? total + parseInt(next.rating) : total, 0);

                          if (!showFullRules)
                            return (
                              <span key={index} style={{ fontWeight: 600 }}>
                                {index === 0 ? "" : ", "}
                                {RulesService.displayName({ ...rule, rating })}
                              </span>
                            );

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
        {showPsychic && <div className="column is-one-third">
          <Card elevation={1}>
            <div className="mb-4">
              <div className="card-body">
                <h3 className="is-size-4 my-2" style={{ fontWeight: 500, textAlign: "center" }}>Psychic/Spells</h3>
                <hr className="my-0" />

                <Paper square elevation={0}>
                  <div className="px-2 my-2">
                    {spells.map(spell => (
                      <p key={spell.id}>
                        <span style={{ fontWeight: 600 }}>{spell.name} ({spell.threshold}+): </span>
                        <span>{spell.effect}</span>
                      </p>
                    ))}
                  </div>
                </Paper>
              </div>
            </div>
          </Card>
        </div >}
      </div >
    </>
  );
}

function toughFromUnit(unit) {
  let baseTough: number = 0;

  baseTough += unit.specialRules.reduce((tough, rule) => {
    if (rule.name === "Tough") {
      tough += parseInt(rule.rating);
    }
    return tough;
  }, 0);

  baseTough += UnitService.getAllUpgradedRules(unit).reduce((tough, { name, rating }) => {
    if (name === "Tough") {
      tough += parseInt(rating);
    }
    return tough;
  }, 0)

  return baseTough || 1;
}

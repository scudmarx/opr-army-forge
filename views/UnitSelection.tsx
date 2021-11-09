import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { addUnit } from '../data/listSlice';
import { Fragment, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, IconButton, Modal, Paper, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from "@mui/icons-material/Warning";
import EquipmentService from "../services/EquipmentService";
import { dataToolVersion } from "../pages/data";
import RuleList from "./components/RuleList";
import { IUnit } from "../data/interfaces";
import { useMediaQuery } from "react-responsive";
import FullCompactToggle from "./components/FullCompactToggle";

export function UnitSelection({ onSelected }) {

  // Access the main army definition state
  const armyData = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);
  const army = armyData.data;
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState(null);
  const [expandAll, setExpandAll] = useState(true);

  // If army has not been selected yet, show nothing
  if (!armyData.loaded)
    return null;

  // Group army units by category
  const isTough = (u: IUnit, threshold) => u.specialRules.some(r => {
    if (r.name !== "Tough")
      return false;
    const toughness = parseInt(r.rating);
    return toughness >= threshold;
  });
  const hasRule = (u: IUnit, rule: string) => u.specialRules.some(r => r.name === rule);
  const isLarge = (u) => isTough(u, 6);
  const isElite = (u) => isTough(u, 3);

  const unitGroups = {
    "Heroes": [],
    "Core": [],
    "Elite": [],
    "Large": [],
    "Artillery": [],
    "Aircraft": [],
  };

  for (let unit of army.units) {
    if (hasRule(unit, "Hero"))
      unitGroups["Heroes"].push(unit);
    else if (hasRule(unit, "Aircraft"))
      unitGroups["Aircraft"].push(unit);
    else if (hasRule(unit, "Artillery"))
      unitGroups["Artillery"].push(unit);
    else if (isLarge(unit))
      unitGroups["Large"].push(unit);
    else if (isElite(unit))
      unitGroups["Elite"].push(unit);
    else
      unitGroups["Core"].push(unit);
  }

  const handleSelection = (unit) => {
    dispatch(addUnit(unit));
    onSelected(unit);
  };

  const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <aside
      className={styles.menu + " menu"}
      style={{ minHeight: "100%" }}
    >
      <div className={isBigScreen ? "sticky" : ""}>
        {isBigScreen && <div className="is-flex is-align-items-center">
          <h3 className="is-size-4 px-4 pt-4 is-flex-grow-1">
            {army.name} - {army.versionString}
          </h3>
          {army.uid == null && army.dataToolVersion !== dataToolVersion && <div className="mr-4" title="Data file may be out of date"><WarningIcon /></div>}
        </div>}

        <FullCompactToggle expanded={expandAll} onToggle={() => setExpandAll(!expandAll)} />
      </div>

      {
        // For each category
        Object.keys(unitGroups).map((key, i) => (
          <Fragment key={key}>
            {key !== "undefined" && unitGroups[key].length > 0 && <p className={"menu-label px-4 " + (i > 0 ? "pt-3" : "")}>
              {/* {key} */}
            </p>}
            <ul className="menu-list">
              {
                // For each unit in category
                unitGroups[key].map((u, index) => {

                  const countInList = list.units.filter(listUnit => listUnit.name === u.name).length;

                  return (
                    <Accordion
                      key={u.name}
                      style={{
                        backgroundColor: countInList > 0 ? "#F9FDFF" : null,
                        borderLeft: countInList > 0 ? "2px solid #0F71B4" : null,
                      }}
                      disableGutters
                      square
                      elevation={1}
                      expanded={expandedId === u.name || expandAll}
                      onChange={() => setExpandedId(expandedId === u.name ? null : u.name)}>
                      <AccordionSummary>
                        <div className="is-flex is-flex-grow-1 is-align-items-center">
                          <div className="is-flex-grow-1" onClick={() => setExpandedId(u.name)}>
                            <p className="mb-1" style={{ fontWeight: 600 }}>
                              {countInList > 0 && <span style={{ color: "#0F71B4" }}>{countInList}x </span>}
                              <span>{u.name} </span>
                              <span style={{ color: "#656565" }}>{u.size > 1 ? `[${u.size}]` : ''}</span>
                            </p>
                            <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                              <p>Qua {u.quality}+</p>
                              <p className="ml-2">Def {u.defense}+</p>
                            </div>
                          </div>
                          <p>{u.cost}pts</p>
                          <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleSelection(u); }}>
                            <AddIcon />
                          </IconButton>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails className="pt-0" style={{ flexDirection: "column", fontSize: "14px", color: "#666", lineHeight: 1.4 }}>
                        <div>
                          {u.equipment.map((eqp, i) => (
                            <p key={i}>
                              {(eqp.count && eqp.count !== 1 ? `${eqp.count}x ` : "") + EquipmentService.formatString(eqp)}{' '}
                            </p>
                          ))}
                        </div>
                        <div>
                          <RuleList specialRules={u.specialRules} />
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              }
            </ul>
          </Fragment>
        ))
      }
    </aside >
  );
}

import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { addUnit } from '../data/listSlice';
import { Fragment, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, IconButton, Modal, Paper, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from "@mui/icons-material/Warning";
import EquipmentService from "../services/EquipmentService";
import { dataToolVersion } from "../pages/data";
import RuleList from "./components/RuleList";
import { IUnit } from "../data/interfaces";
import { useMediaQuery } from "react-responsive";
import MenuIcon from "@mui/icons-material/Menu";

export function UnitSelection({ onSelected }) {

  // Access the main army definition state
  const armyData = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);
  const army = armyData.data;
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState(null);
  const [expandAll, setExpandAll] = useState(null);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);

  // If army has not been selected yet, show nothing
  if (!armyData.loaded)
    return null;

  // Group army units by category
  const isTough = (u: IUnit, threshold) => u.specialRules.filter(r => {
    if (r.name !== "Tough")
      return false;
    const toughness = parseInt(r.rating);
    return toughness >= threshold;
  }).length > 0
  const hasRule = (u: IUnit, rule: string) => u.specialRules.filter(r => r.name === rule).length > 0;
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
      {isBigScreen && <div className="is-flex is-align-items-center">
        <h3 className="is-size-4 p-4 is-flex-grow-1">
          {army.name} - v{army.version}
        </h3>
        {army.dataToolVersion !== dataToolVersion && <div className="mr-4" title="Data file may be out of date"><WarningIcon /></div>}
      </div>}

      <div className="is-flex px-4" style={{alignItems:"center"}}>
        <p className="is-flex-grow-1" style={{fontWeight:600}}>Units</p>
        <Button onClick={() => setExpandAll(!expandAll)}>
          <MenuIcon />
          <span className="pl-2 full-compact-text">{expandAll ? "Full" : "Compact"}</span>
        </Button>
      </div>

      {
        // For each category
        Object.keys(unitGroups).map(key => (
          <Fragment key={key}>
            {key !== "undefined" && unitGroups[key].length > 0 && <p className="menu-label px-4 pt-3">{key}</p>}
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
                        borderLeft: countInList > 0 ? "2px solid #3f51b5" : null,
                      }}
                      disableGutters
                      square
                      elevation={0}
                      variant="outlined"
                      expanded={expandedId === u.name || expandAll}
                      onChange={() => setExpandedId(expandedId === u.name ? null : u.name)}>
                      <AccordionSummary>
                        <div className="is-flex is-flex-grow-1 is-align-items-center">
                          <div className="is-flex-grow-1" onClick={() => setExpandedId(u.name)}>
                            <p className="mb-1" style={{ fontWeight: 600 }}>
                              {countInList > 0 && <span style={{ color: "#3f51b5" }}>{countInList}x </span>}
                              <span>{u.name} </span>
                              <span style={{ color: "#656565" }}>{u.size > 1 ? `[${u.size}]` : ''}</span>
                            </p>
                            <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                              <p>Qua {u.quality}+</p>
                              <p className="ml-2">Def {u.defense}+</p>
                            </div>
                          </div>
                          <p className="mr-2">{u.cost}pts</p>
                          <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleSelection(u); }}>
                            <AddIcon />
                          </IconButton>
                        </div>
                      </AccordionSummary>
                      <AccordionDetails style={{ flexDirection: "column" }}>
                        <div className="mb-2">
                          {u.equipment.map((eqp, i) => (
                            <span key={i}>
                              {(eqp.count && eqp.count !== 1 ? `${eqp.count}x ` : "") + EquipmentService.formatString(eqp)}{' '}
                            </span>
                          ))}
                        </div>
                        <RuleList specialRules={u.specialRules} />
                      </AccordionDetails>
                    </Accordion>
                  );
                })
              }
            </ul>
          </Fragment>
        ))
      }
      <Modal
        open={ruleModalOpen}
        onClose={() => setRuleModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper className="p-4 m-4">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Tough(3)
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Paper>
      </Modal>
    </aside >
  );
}

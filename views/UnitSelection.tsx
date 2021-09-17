import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { addUnit } from '../data/listSlice';
import { groupBy } from "../services/Helpers";
import { Fragment, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Button, Fab, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EquipmentService from "../services/EquipmentService";

export function UnitSelection({ onSelected }) {

  // Access the main army definition state
  const armyData = useSelector((state: RootState) => state.army);
  const army = armyData.data;
  const dispatch = useDispatch();
  const [expandedId, setExpandedId] = useState(null);

  // If army has not been selected yet, show nothing
  if (!armyData.loaded)
    return null;

  // Group army units by category
  var unitGroups = groupBy(army.units, "category");

  var handleSelection = (unit) => {
    console.log("foo");
    dispatch(addUnit(unit));
    onSelected(unit);
  };

  return (
    <aside
      className={styles.menu + " menu"}
      style={{ minHeight: "100%" }}
    >
      <h3 className="is-size-4 pt-4 px-4">
        {army.name} - v{army.version}
      </h3>

      {
        // For each category
        Object.keys(unitGroups).map(key => (
          <Fragment key={key}>
            <p className="menu-label px-4">{key}</p>
            <ul className="menu-list">
              {
                // For each unit in category
                unitGroups[key].map((u, index) => (
                  <Accordion key={u.name} disableGutters square elevation={0} variant="outlined" expanded={expandedId === u.name} onChange={() => setExpandedId(expandedId === u.name ? null : u.name)}>
                    <AccordionSummary>
                      <div className="is-flex is-flex-grow-1 is-align-items-center">
                        <div className="is-flex-grow-1" onClick={() => setExpandedId(u.name)}>
                          <p className="mb-1" style={{ fontWeight: 600 }}>{u.name} {u.size > 1 ? `[${u.size}]` : ''}</p>
                          <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                            <p>Qua {u.quality}</p>
                            <p className="ml-2">Def {u.defense}</p>
                          </div>
                        </div>
                        <p className="mr-2">{u.cost}pts</p>
                        <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleSelection(u); }}>
                          <AddIcon />
                        </IconButton>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails style={{ flexDirection: "column" }}>
                      <div className="mb-2">{(u.specialRules || []).join(", ")}</div>
                      <div>
                        {u.equipment.map((eqp, i) => (
                          <span key={i}>
                            {(eqp.count && eqp.count !== 1 ? `${eqp.count}x ` : "") + EquipmentService.formatString(eqp)}
                          </span>
                        ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                ))
              }
            </ul>
          </Fragment>
        ))
      }
    </aside >
  );
}

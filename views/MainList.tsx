import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { ISelectedUnit } from "../data/interfaces";
import RemoveIcon from '@mui/icons-material/Clear';
import { selectUnit, removeUnit } from "../data/listSlice";
import UpgradeService from "../services/UpgradeService";
import { Accordion, AccordionDetails, AccordionSummary, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import RuleList from "./components/RuleList";
import UnitService from "../services/UnitService";
import { distinct } from "../services/Helpers";
import FullCompactToggle from "./components/FullCompactToggle";

export function MainList({ onSelected }) {

  const list = useSelector((state: RootState) => state.list);

  const dispatch = useDispatch();
  const router = useRouter();
  const [expandAll, setExpandAll] = useState(true);

  const handleSelectUnit = (unit: ISelectedUnit) => {
    if (list.selectedUnitId !== unit.selectionId) {
      dispatch(selectUnit(unit.selectionId));
    }
    onSelected(unit);
  };

  const handleRemove = (unit: ISelectedUnit) => {
    dispatch(removeUnit(unit.selectionId));
  };

  return (
    <>
      {/* <Button onClick={() => router.push("/cards")}>View Cards</Button> */}
      <FullCompactToggle expanded={expandAll} onToggle={() => setExpandAll(!expandAll)} />
      <ul className="mt-2">
        {
          // For each selected unit
          list.units.map((s: ISelectedUnit, index: number) => {

            const equipmentWeaponNames = s.equipment.filter(e => e.count > 0).map((eqp, i) => eqp.label);
            const upgradeWeaponNames = UnitService.getAllUpgradeWeapons(s).map(u => u.name);

            return (
              <li key={index}
                onClick={() => handleSelectUnit(s)} >
                <Accordion
                  square
                  disableGutters
                  elevation={1}
                  expanded={expandAll}
                  style={{ backgroundColor: (list.selectedUnitId === s.selectionId ? "rgba(249, 253, 255, 1)" : null) }}>
                  <AccordionSummary>
                    <div className="is-flex is-flex-grow-1 is-align-items-center">
                      <div className="is-flex-grow-1">
                        <p className="mb-1" style={{ fontWeight: 600 }}>{s.customName || s.name} {s.size > 1 ? `[${s.size}]` : ''}</p>
                        <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                          <p>Qua {s.quality}+</p>
                          <p className="ml-2">Def {s.defense}+</p>
                        </div>
                      </div>
                      <p className="mr-2">{UpgradeService.calculateUnitTotal(s)}pts</p>
                      <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleRemove(s); }}>
                        <RemoveIcon />
                      </IconButton>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails className="pt-0">
                    <div style={{ fontSize: "14px", color: "#666666" }}>
                      <div>
                        {distinct(equipmentWeaponNames.concat(upgradeWeaponNames)).map((label, i) => (
                          <span key={i}>
                            {i > 0 ? ", " : ""}{label}
                          </span>
                        ))}
                      </div>
                      <RuleList specialRules={s.specialRules.concat(UnitService.getAllUpgradedRules(s))} />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </li>
            );
          })
        }
      </ul>
    </>
  );
}

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
import LinkIcon from '@mui/icons-material/Link';

export function MainList({ onSelected, onUnitRemoved }) {

  const list = useSelector((state: RootState) => state.list);

  const dispatch = useDispatch();
  const router = useRouter();
  const [expandAll, setExpandAll] = useState(true);

  const joinedUnitIds = list.units.filter(u => u.joinToUnit).map(u => u.joinToUnit);
  const units = list.units.filter(u => joinedUnitIds.indexOf(u.selectionId) === -1);

  return (
    <>
      <FullCompactToggle expanded={expandAll} onToggle={() => setExpandAll(!expandAll)} />
      <ul className="mt-2">
        {
          // For each selected unit
          units.map((s: ISelectedUnit, index: number) => {

            const child = s.joinToUnit
              ? list.units.find(u => u.selectionId === s.joinToUnit)
              : null;

            const grandchild = child?.joinToUnit
              ? list.units.find(u => u.selectionId === child?.joinToUnit)
              : null;

            return (
              <li key={index} className={child ? "my-2" : ""} style={{ backgroundColor: child ? "rgba(0,0,0,.12)" : "" }}>
                {child && <div className="is-flex px-4 py-2 is-align-items-center">
                  <LinkIcon style={{ fontSize: "24px", color: "rgba(0,0,0,.38)" }} />
                  <h3 className="ml-2" style={{ fontWeight: 400, flexGrow: 1 }}>
                    {s.customName || s.name}
                    {s.joinToUnit && !s.combined && ` and ${(child.customName || child.name)}`}
                    </h3>
                  <p className="mr-2">{UpgradeService.calculateUnitTotal(s) + UpgradeService.calculateUnitTotal(child) + UpgradeService.calculateUnitTotal(grandchild)}pts</p>
                </div>}
                <div className={child ? "ml-1" : ""}>
                  <MainListItem
                    list={list}
                    unit={s}
                    expanded={expandAll}
                    onSelected={onSelected}
                    onUnitRemoved={onUnitRemoved} />
                  {child && <MainListItem
                    list={list}
                    unit={child}
                    expanded={expandAll}
                    onSelected={onSelected}
                    onUnitRemoved={onUnitRemoved} />}
                  {grandchild && <MainListItem
                    list={list}
                    unit={grandchild}
                    expanded={expandAll}
                    onSelected={onSelected}
                    onUnitRemoved={onUnitRemoved} />}
                </div>
              </li>
            );
          })
        }
      </ul>
    </>
  );
}

function MainListItem({ list, unit, expanded, onSelected, onUnitRemoved }) {

  const dispatch = useDispatch();

  const equipmentWeaponNames = unit.equipment.filter(e => e.count > 0).map((eqp, i) => eqp.label);
  const upgradeWeaponNames = UnitService.getAllUpgradeWeapons(unit).filter(e => e.count > 0).map(u => u.name);

  const handleSelectUnit = (unit: ISelectedUnit) => {
    if (list.selectedUnitId !== unit.selectionId) {
      dispatch(selectUnit(unit.selectionId));
    }
    onSelected(unit);
  };

  const handleRemove = (unit: ISelectedUnit) => {
    onUnitRemoved(unit);
    dispatch(removeUnit(unit.selectionId));
  };

  return (
    <Accordion
      square
      disableGutters
      elevation={1}
      expanded={expanded}
      onClick={() => handleSelectUnit(unit)}
      style={{
        backgroundColor: (list.selectedUnitId === unit.selectionId ? "rgba(249, 253, 255, 1)" : null)
      }}>
      <AccordionSummary>
        <div className="is-flex is-flex-grow-1 is-align-items-center">
          <div className="is-flex-grow-1">
            <p className="mb-1" style={{ fontWeight: 600 }}>{unit.customName || unit.name} {unit.size > 1 ? `[${unit.size}]` : ''}</p>
            <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
              <p>Qua {unit.quality}+</p>
              <p className="ml-2">Def {unit.defense}+</p>
            </div>
          </div>
          <p className="mr-2">{UpgradeService.calculateUnitTotal(unit)}pts</p>
          <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleRemove(unit); }}>
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
          <RuleList specialRules={unit.specialRules.concat(UnitService.getAllUpgradedRules(unit))} />
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
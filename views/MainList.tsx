import React, { Fragment } from "react";
import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";
import RemoveIcon from '@mui/icons-material/Clear';
import { selectUnit, removeUnit } from "../data/listSlice";
import UpgradeService from "../services/UpgradeService";
import { Button, IconButton, Paper } from "@mui/material";
import { useRouter } from "next/router";

export function MainList({ onSelected }) {

  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army.data);

  const dispatch = useDispatch();
  const router = useRouter();

  const totalPointCost = list
    .units
    .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);

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
    <Button onClick={() => router.push("/cards")}>View Cards</Button>
    <ul>
      {
        // For each selected unit
        list.units.map((s: ISelectedUnit, index: number) => (
          <li key={index}
            onClick={() => handleSelectUnit(s)} >
            <Paper square elevation={1} style={{ backgroundColor: (list.selectedUnitId === s.selectionId ? "#D7E3EB" : null) }}>
              <div className="p-2 is-flex is-flex-grow-1 is-align-items-center">
                <div className="is-flex-grow-1">
                  <p className="mb-1" style={{ fontWeight: 600 }}>{s.customName || s.name} {s.size > 1 ? `[${s.size}]` : ''}</p>
                  <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                    <p>Qua {s.quality}</p>
                    <p className="ml-2">Def {s.defense}</p>
                  </div>
                </div>
                <p className="mr-2">{UpgradeService.calculateUnitTotal(s)}pts</p>
                <IconButton color="primary" onClick={(e) => { e.stopPropagation(); handleRemove(s); }}>
                  <RemoveIcon />
                </IconButton>
              </div>
            </Paper>
          </li>
        ))
      }
    </ul>
    </>
  );
}

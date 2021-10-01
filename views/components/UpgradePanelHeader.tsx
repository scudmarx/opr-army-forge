import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../data/store'
import { UnitSelection } from "../UnitSelection";
import { MainList } from "../MainList";
import Slider from "react-slick";
import { Upgrades } from "../upgrades/Upgrades";
import { BottomSheet } from "react-spring-bottom-sheet";
import { AppBar, Paper, Tab, Tabs, Toolbar, Typography, IconButton, TextField, Menu, MenuItem } from "@mui/material";
import EditIcon from '@mui/icons-material/Create';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpgradeService from "../../services/UpgradeService";
import { renameUnit, selectUnit } from "../../data/listSlice";
import { useRouter } from "next/router";
import { ISelectedUnit } from "../../data/interfaces";

export default function UpgradePanelHeader({ selectedUnit }: { selectedUnit: ISelectedUnit }) {

    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);

    if (!selectedUnit)
        return null;

    return (
        <div className="is-flex is-align-items-center">
            {editMode ? (
                <TextField
                    variant="standard"
                    className="is-flex-grow-1"
                    value={selectedUnit.customName || selectedUnit.name}
                    onChange={e => dispatch(renameUnit({ unitId: selectedUnit.selectionId, name: e.target.value }))}
                />
            ) : (
                <div className="is-flex-grow-1 is-flex">
                    <h3 className="is-size-4 has-text-left">{selectedUnit.customName || selectedUnit.name} {`[${selectedUnit.size}]`}</h3>
                </div>
            )}
            <IconButton color="primary" onClick={() => setEditMode(!editMode)}>
                <EditIcon />
            </IconButton>
            <p className="ml-4">{UpgradeService.calculateUnitTotal(selectedUnit)}pts</p>
        </div>
    );
}
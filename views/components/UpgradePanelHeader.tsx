import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import { IconButton, TextField } from "@mui/material";
import EditIcon from '@mui/icons-material/Create';
import UpgradeService from "../../services/UpgradeService";
import { renameUnit } from "../../data/listSlice";
import { ISelectedUnit } from "../../data/interfaces";

export default function UpgradePanelHeader({ selectedUnit }: { selectedUnit: ISelectedUnit }) {

    const dispatch = useDispatch();
    const [editMode, setEditMode] = useState(false);

    if (!selectedUnit)
        return null;

    const toggleEditMode = () => {
        const toggleTo = !editMode;
        setEditMode(toggleTo);
        if (toggleTo) {
            // Focus
        }
    }

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
            <IconButton color="primary" onClick={() => toggleEditMode()}>
                <EditIcon />
            </IconButton>
            <p className="ml-4">{UpgradeService.calculateUnitTotal(selectedUnit)}pts</p>
        </div>
    );
}
import { ConstructionOutlined } from '@mui/icons-material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEquipment, ISelectedUnit, IUpgrade, IUpgradeOption } from './interfaces';
import pluralise from "pluralize";
import UpgradeService from '../services/UpgradeService';

export interface ListState {
    name: string,
    units: ISelectedUnit[],
    selectedUnitId: number
}

const initialState: ListState = {
    name: "New Army",
    units: [],
    selectedUnitId: null
}

export const listSlice = createSlice({
    name: 'army',
    initialState,
    reducers: {
        addUnit: (state, action: PayloadAction<any>) => {
            state.units.push({
                ...action.payload,
                selectionId: state.units.length,
                selectedUpgrades: []
            });
        },
        selectUnit: (state, action: PayloadAction<number>) => {
            state.selectedUnitId = action.payload;
        },
        removeUnit: (state, action: PayloadAction<number>) => {
            const removeIndex = state
                .units
                .findIndex(u => u.selectionId === action.payload);

            state.units.splice(removeIndex, 1);

            // Update remaining IDs
            for (let i = 0; i < state.units.length; i++) {
                state.units[i].selectionId = i;
            }
        },
        renameUnit: (state, action: PayloadAction<{ unitId: number, name: string }>) => {
            const { unitId, name } = action.payload;
            const unit = state.units.filter(u => u.selectionId === unitId)[0];
            unit.customName = name;
        },
        applyUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IUpgradeOption }>) => {

            // TODO: Refactor, break down, unit test...

            const { unitId, upgrade, option } = action.payload;
            const unit = state.units.filter(u => u.selectionId === unitId)[0];

            UpgradeService.apply(unit, upgrade, option);
        },
        removeUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IUpgradeOption }>) => {

            // TODO: Refactor, break down, unit test...

            const { unitId, upgrade, option } = action.payload;
            const unit = state.units.filter(u => u.selectionId === unitId)[0];

            UpgradeService.remove(unit, upgrade, option);
        }

    },
})

// Action creators are generated for each case reducer function
export const { addUnit, applyUpgrade, removeUpgrade, selectUnit, removeUnit, renameUnit } = listSlice.actions

export default listSlice.reducer
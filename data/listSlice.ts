import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEquipment, ISelectedUnit, IUpgrade } from './interfaces';

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
                selectedEquipment: action.payload.equipment.map(eqp => ({
                    ...eqp,
                    count: eqp.count || action.payload.size
                }))
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
        applyUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IEquipment }>) => {
            const { unitId, upgrade, option } = action.payload;
            const unit = state.units.filter(u => u.selectionId === unitId)[0];
            const existingSelection = unit.selectedEquipment.filter(eqp => eqp.name === option.name)[0];

            if (upgrade.type === "upgrade") {


                if (existingSelection) {
                    if (!existingSelection.count)
                        existingSelection.count = 1;

                    existingSelection.count += 1;
                } else {
                    unit.selectedEquipment.push({ ...option, count: 1 });
                }
            }
            else if (upgrade.type === "replace") {

                // "Replace Pistol:"
                if (upgrade.replacesWhat && !upgrade.affects && !upgrade.select) {
                    const replaceIndex = unit
                        .selectedEquipment
                        .findIndex(e => e.name === upgrade.replacesWhat);

                    unit.selectedEquipment.splice(replaceIndex, 1);
                    unit.selectedEquipment.push(option);
                } else {

                    if (upgrade.affects === "any") {

                    }

                    const toReplace = unit.selectedEquipment.filter(eqp => eqp.name === upgrade.replacesWhat)[0];

                    // Decrement the count of whatever we're replacing
                    toReplace.count--;

                    if (existingSelection) {
                        if (!existingSelection.count)
                            existingSelection.count = 1;

                        existingSelection.count += 1;
                    } else {
                        unit.selectedEquipment.push({ ...option, count: 1 });
                    }
                }
            }
        },
        removeUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IEquipment }>) => {
            
        }
    },
})

// Action creators are generated for each case reducer function
export const { addUnit, applyUpgrade, removeUpgrade, selectUnit, removeUnit } = listSlice.actions

export default listSlice.reducer
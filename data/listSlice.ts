import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEquipment, ISelectedUnit, IUpgrade } from './interfaces';

export interface ListState {
    name: string,
    units: ISelectedUnit[]
}

const initialState: ListState = {
    name: "New Army",
    units: []
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
})

// Action creators are generated for each case reducer function
export const { addUnit, applyUpgrade } = listSlice.actions

export default listSlice.reducer
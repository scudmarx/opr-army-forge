import { ConstructionOutlined } from '@mui/icons-material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IEquipment, ISelectedUnit, IUpgrade } from './interfaces';
import pluralise from "pluralize";

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
        renameUnit: (state, action: PayloadAction<{ unitId: number, name: string }>) => {
            const { unitId, name } = action.payload;
            const unit = state.units.filter(u => u.selectionId === unitId)[0];
            unit.customName = name;
        },
        applyUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IEquipment }>) => {
            const { unitId, upgrade, option } = action.payload;
            const unit = state.units.filter(u => u.selectionId === unitId)[0];
            const existingSelection = unit.selectedEquipment.filter(eqp => eqp.name === option.name)[0];


            if (upgrade.type === "upgradeRule") {

                // Remove existing rule
                unit.specialRules.splice(unit.specialRules.findIndex(r => r === upgrade.replaceWhat), 1);

                // Add new rule(s)!
                unit.specialRules = unit.specialRules.concat(option.specialRules);

                return;
            }

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

                const replaceCount = typeof (upgrade.affects) === "number"
                    ? upgrade.affects
                    : upgrade.affects === "all"
                        ? unit.size || 1 // All in unit
                        : 1;

                console.log("Replace " + replaceCount);

                const replaceWhat: string[] = typeof (upgrade.replaceWhat) === "string"
                    ? [upgrade.replaceWhat]
                    : upgrade.replaceWhat;

                for (let what of replaceWhat) {

                    // Try and find item to replace...
                    const replaceIndex = unit
                        .selectedEquipment
                        .findIndex(e => pluralise.singular(e.name) === pluralise.singular(what));

                    const toReplace = unit.selectedEquipment[replaceIndex];

                    // Couldn't find the item to replace
                    if (!toReplace) {
                        console.error(`Cannot find ${upgrade.replaceWhat} to replace!`);
                        return;
                    }

                    console.log("Replacing... ", toReplace);

                    // Decrement the count of the item being replaced
                    toReplace.count -= replaceCount;

                    if (toReplace.count <= 0)
                        unit.selectedEquipment.splice(replaceIndex, 1);
                }

                if (option.type === "combined") {
                    // Add each piece from the combination
                    for (let e of option.equipment) {
                        unit.selectedEquipment.push({ ...e, count: 1 });
                    }

                } else {

                    if (existingSelection) {
                        existingSelection.count++;
                    } else {
                        unit.selectedEquipment.push({ ...option, count: 1 });
                    }
                }
            }
        },
        removeUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IEquipment }>) => {
            const { unitId, upgrade, option } = action.payload;
            const unit = state.units.filter(u => u.selectionId === unitId)[0];

            if (upgrade.type === "upgradeRule") {

                // Remove upgrades rule(s)
                for (let i = unit.specialRules.length - 1; i >= 0; i--)
                    if (option.specialRules.indexOf(unit.specialRules[i]) >= 0)
                        unit.specialRules.splice(i, 1);

                // Re-add original rule
                unit.specialRules.push(upgrade.replaceWhat as string);

                return;
            }

            const equipment = option.type === "combined" ? option.equipment : [option];

            for (let e of equipment) {
                const selection = unit.selectedEquipment.filter(eqp => eqp.name === e.name)[0];

                if (selection.count > 1) {
                    // Remove only 1
                    selection.count--;
                }
                else {
                    // Remove the upgrade from the list
                    const removeIndex = unit.selectedEquipment.findIndex(eqp => eqp.name === e.name);
                    unit.selectedEquipment.splice(removeIndex, 1);
                }
            }

            if (upgrade.type === "replace") {

                // TODO: Count
                const replaceCount = typeof (upgrade.affects) === "number"
                    ? upgrade.affects
                    : upgrade.affects === "all"
                        ? unit.size || 1 // All in unit
                        : 1;

                const replaceWhat: string[] = typeof (upgrade.replaceWhat) === "string"
                    ? [upgrade.replaceWhat]
                    : upgrade.replaceWhat;

                for (let what of replaceWhat) {

                    const current = unit
                        .selectedEquipment
                        .filter(e => pluralise.singular(e.name) === pluralise.singular(what))[0];

                    if (current) {

                        current.count += replaceCount;

                    } else {

                        const original = unit
                            .equipment
                            .filter(e => pluralise.singular(e.name) === pluralise.singular(what))[0];

                        // put the original item back
                        unit.selectedEquipment.push({ ...original, count: replaceCount });
                    }
                }
            }
        }

    },
})

// Action creators are generated for each case reducer function
export const { addUnit, applyUpgrade, removeUpgrade, selectUnit, removeUnit, renameUnit } = listSlice.actions

export default listSlice.reducer
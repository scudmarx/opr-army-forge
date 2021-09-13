import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ArmyState {
    loaded: boolean;
    name: string;
    version: string;
    units: any[];
    upgradeSets: any[];
}

const initialState: ArmyState = {
    loaded: false,
    name: null,
    version: null,
    units: null,
    upgradeSets: null
}

export const armySlice = createSlice({
    name: 'army',
    initialState: initialState,
    reducers: {
        load: (state, action: PayloadAction<any>) => {
            return {...action.payload, loaded: true};
        },
    },
})

// Action creators are generated for each case reducer function
export const { load } = armySlice.actions

export default armySlice.reducer
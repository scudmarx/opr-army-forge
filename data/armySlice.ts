import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ArmyState {
    loaded: boolean;
    gameSystem: string;
    armyFile: string;
    data: IArmyData;
}

export interface IArmyData {
    name: string;
    version: string;
    units: any[];
    upgradeSets: any[];
}

const initialState: ArmyState = {
    loaded: false,
    armyFile: null,
    gameSystem: null,
    data: null
}

export const armySlice = createSlice({
    name: 'army',
    initialState: initialState,
    reducers: {
        load: (state, action: PayloadAction<IArmyData>) => {
            return {
                ...state,
                data: action.payload,
                loaded: true
            };
        },
        setGameSystem: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                gameSystem: action.payload
            };
        },
        setArmyFile: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                armyFile: action.payload
            };
        }
    },
})

// Action creators are generated for each case reducer function
export const { load, setGameSystem, setArmyFile } = armySlice.actions;

export default armySlice.reducer;

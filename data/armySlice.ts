import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUnit, IUpgradePackage } from './interfaces';

export interface IGameRule {
  name: string;
  description: string;
  options: string[];
}

export interface ArmyState {
  loaded: boolean;
  gameSystem: string;
  armyFile: string;
  data: IArmyData;
  rules: IGameRule[];
}

export interface IArmyData {
  uid: string;
  name: string;
  versionString: string;
  dataToolVersion: string;
  units: IUnit[];
  upgradePackages: IUpgradePackage[];
  specialRules: IGameRule[];
  spells: { id: string; name: string; effect: string; threshold: number; }[];
}

const initialState: ArmyState = {
  loaded: false,
  armyFile: null,
  gameSystem: null,
  data: null,
  rules: []
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
    },
    setGameRules: (state, action: PayloadAction<IGameRule[]>) => {
      return {
        ...state,
        rules: action.payload
      };
    }
  },
})

// Action creators are generated for each case reducer function
export const { load, setGameSystem, setArmyFile, setGameRules } = armySlice.actions;

export default armySlice.reducer;

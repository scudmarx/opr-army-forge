import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISelectedUnit, IUpgrade, IUpgradeOption } from './interfaces';
import UpgradeService from '../services/UpgradeService';
import { debounce } from 'throttle-debounce';
import { current } from 'immer';
import PersistenceService from '../services/PersistenceService';
import { nanoid } from "nanoid";

export interface ListState {
  creationTime: string;
  name: string;
  pointsLimit?: number;
  units: ISelectedUnit[];
  selectedUnitId?: string;
  points: number;
}

const initialState: ListState = {
  creationTime: null,
  name: "New Army",
  pointsLimit: 0,
  units: [],
  selectedUnitId: null,
  points: 0
}

const debounceSave = debounce(1500, (state: ListState) => {
  PersistenceService.updateSave(state);
});

export const listSlice = createSlice({
  name: 'army',
  initialState,
  reducers: {
    resetList: (state) => {
      return {
        creationTime: null,
        name: "New Army",
        pointsLimit: 0,
        initialised: false,
        units: [],
        selectedUnitId: null,
        points: 0
      };
    },
    createList: (state, action: PayloadAction<{ name: string; pointsLimit?: number; creationTime: string; }>) => {
      const { name, pointsLimit, creationTime } = action.payload;
      state.creationTime = creationTime;
      state.name = name;
      state.pointsLimit = pointsLimit;
    },
    updateListSettings: (state, action: PayloadAction<{ name: string, pointsLimit?: number }>) => {
      const { name, pointsLimit } = action.payload;
      state.name = name;
      state.pointsLimit = pointsLimit;
      debounceSave(current(state));
    },
    loadSavedList(state, action: PayloadAction<ListState>) {
      return { ...action.payload };
    },
    addUnit: (state, action: PayloadAction<any>) => {
      state.units.push({
        ...action.payload,
        selectionId: nanoid(5),
        selectedUpgrades: [],
        combined: false,
        joined: false,
        equipment: action.payload.equipment.map(eqp => ({
          ...eqp,
          count: eqp.count || action.payload.size // Add count to unit size if not already present
        }))
      });

      state.points = UpgradeService.calculateListTotal(state.units);

      debounceSave(current(state));
    },
    selectUnit: (state, action: PayloadAction<string>) => {
      state.selectedUnitId = action.payload;
    },
    removeUnit: (state, action: PayloadAction<string>) => {
      const removeIndex = state
        .units
        .findIndex(u => u.selectionId === action.payload);

      state.units.splice(removeIndex, 1);

      state.points = UpgradeService.calculateListTotal(state.units);

      debounceSave(current(state));
    },
    renameUnit: (state, action: PayloadAction<{ unitId: string, name: string }>) => {
      const { unitId, name } = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];
      unit.customName = name;

      debounceSave(current(state));
    },
    toggleUnitCombined: (state, action: PayloadAction<string>) => {
      const unitId = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];
      unit.combined = !unit.combined;
      if (unit.combined)
        unit.size *= 2;
      else
        unit.size /= 2;

      state.points = UpgradeService.calculateListTotal(state.units);

      debounceSave(current(state));
    },
    joinUnit: (state, action: PayloadAction<{ unitId: string, joinToUnitId: string }>) => {
      const { unitId, joinToUnitId } = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];
      const joinToUnit = state.units.filter(u => u.selectionId === joinToUnitId)[0];
      
      unit.joinToUnit = joinToUnit.selectionId;

      debounceSave(current(state));
    },
    applyUpgrade: (state, action: PayloadAction<{ unitId: string, upgrade: IUpgrade, option: IUpgradeOption }>) => {

      // TODO: Refactor, break down, unit test...

      const { unitId, upgrade, option } = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];

      UpgradeService.apply(unit, upgrade, option);

      state.points = UpgradeService.calculateListTotal(state.units);

      debounceSave(current(state));
    },
    removeUpgrade: (state, action: PayloadAction<{ unitId: string, upgrade: IUpgrade, option: IUpgradeOption }>) => {

      // TODO: Refactor, break down, unit test...

      const { unitId, upgrade, option } = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];

      UpgradeService.remove(unit, upgrade, option);

      state.points = UpgradeService.calculateListTotal(state.units);

      debounceSave(current(state));
    }

  },
})

// Action creators are generated for each case reducer function
export const {
  resetList,
  createList,
  addUnit,
  applyUpgrade,
  removeUpgrade,
  selectUnit,
  removeUnit,
  renameUnit,
  toggleUnitCombined,
  joinUnit,
  loadSavedList,
  updateListSettings
} = listSlice.actions

export default listSlice.reducer
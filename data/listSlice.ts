import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ISelectedUnit, IUpgrade, IUpgradeOption } from './interfaces';
import UpgradeService from '../services/UpgradeService';
import { debounce } from 'throttle-debounce';
import { current } from 'immer';
import PersistenceService from '../services/PersistenceService';

export interface ListState {
  name: string,
  pointsLimit?: number;
  units: ISelectedUnit[],
  selectedUnitId?: number
}

const initialState: ListState = {
  name: "New Army",
  pointsLimit: null,
  units: [],
  selectedUnitId: null
}

const debounceSave = debounce(1500, (state: ListState) => {
  PersistenceService.updateSave(state);
});

export const listSlice = createSlice({
  name: 'army',
  initialState,
  reducers: {
    resetList: (state) => {
      state.units = [];
    },
    createList: (state, action: PayloadAction<{ name: string, pointsLimit?: number }>) => {
      const { name, pointsLimit } = action.payload;
      state.name = name;
      state.pointsLimit = pointsLimit;
    },
    loadSavedList(state, action: PayloadAction<ListState>) {
      return { ...action.payload };
    },
    addUnit: (state, action: PayloadAction<any>) => {
      state.units.push({
        ...action.payload,
        selectionId: state.units.length,
        selectedUpgrades: [],
        combined: false,
        joined: false,
        equipment: action.payload.equipment.map(eqp => ({
          ...eqp,
          count: eqp.count || action.payload.size // Add count to unit size if not already present
        }))
      });

      debounceSave(current(state));
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

      debounceSave(current(state));
    },
    renameUnit: (state, action: PayloadAction<{ unitId: number, name: string }>) => {
      const { unitId, name } = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];
      unit.customName = name;

      debounceSave(current(state));
    },
    toggleUnitCombined: (state, action: PayloadAction<number>) => {
      const unitId = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];
      unit.combined = !unit.combined;
      if (unit.combined)
        unit.size *= 2;
      else
        unit.size /= 2;

      debounceSave(current(state));
    },
    toggleUnitJoined: (state, action: PayloadAction<number>) => {
      const unitId = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];
      unit.joined = !unit.joined;

      debounceSave(current(state));
    },
    applyUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IUpgradeOption }>) => {

      // TODO: Refactor, break down, unit test...

      const { unitId, upgrade, option } = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];

      UpgradeService.apply(unit, upgrade, option);

      debounceSave(current(state));
    },
    removeUpgrade: (state, action: PayloadAction<{ unitId: number, upgrade: IUpgrade, option: IUpgradeOption }>) => {

      // TODO: Refactor, break down, unit test...

      const { unitId, upgrade, option } = action.payload;
      const unit = state.units.filter(u => u.selectionId === unitId)[0];

      UpgradeService.remove(unit, upgrade, option);

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
  toggleUnitJoined,
  loadSavedList
} = listSlice.actions

export default listSlice.reducer
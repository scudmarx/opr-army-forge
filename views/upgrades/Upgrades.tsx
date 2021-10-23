import { Checkbox, FormControlLabel, FormGroup, Paper, FormControl, MenuItem, InputLabel, Select } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../data/store';
import styles from "../../styles/Upgrades.module.css";
import UpgradeGroup from './UpgradeGroup';
import UnitEquipmentTable from '../UnitEquipmentTable';
import RuleList from '../components/RuleList';
import { ISpecialRule, IUpgradePackage } from '../../data/interfaces';
import UnitService from '../../services/UnitService';
import { toggleUnitCombined, joinUnit } from '../../data/listSlice';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SpellsTable from '../SpellsTable';
import { CustomTooltip } from '../components/CustomTooltip';

export function Upgrades() {

  const list = useSelector((state: RootState) => state.list);
  const gameSystem = useSelector((state: RootState) => state.army.gameSystem);
  const army = useSelector((state: RootState) => state.army.data);
  const spells = army?.spells;
  const dispatch = useDispatch();

  const isLive = window.location.host === "opr-army-forge.vercel.app";

  const selectedUnit = UnitService.getSelected(list);

  const getUpgradeSet = (id) => army.upgradePackages.filter((s) => s.uid === id)[0];

  const equipmentSpecialRules: ISpecialRule[] = selectedUnit && selectedUnit
    .equipment
    .filter(e => !e.attacks && e.specialRules?.length) // No weapons, and only equipment with special rules
    .reduce((value, e) => value.concat(e.specialRules), []); // Flatten array of special rules arrays

  const unitUpgradeRules: ISpecialRule[] = selectedUnit && UnitService
    .getAllUpgradedRules(selectedUnit);

  const specialRules = selectedUnit && (selectedUnit.specialRules || [])
    .concat(equipmentSpecialRules)
    .concat(unitUpgradeRules)
    .filter(r => r.name !== "-");

  const isSkirmish = gameSystem !== "gf" && gameSystem !== "aof";
  const isHero = selectedUnit ? selectedUnit.specialRules.findIndex(sr => sr.name === "Hero") > -1 : false;
  const isPsychic = specialRules?.findIndex(r => r.name === "Psychic" || r.name === "Wizard") > -1;

  const joinToUnit = (e) => {
    const joinToUnitId = e.target.value;

    dispatch(joinUnit({
      unitId: selectedUnit.selectionId,
      joinToUnitId: joinToUnitId
    }));
  };

  const originalUpgradeSets = (selectedUnit?.upgrades || [])
    .map((setId) => getUpgradeSet(setId))
    .filter((s) => !!s); // remove empty sets?

  const upgradeSets = isHero
    ? originalUpgradeSets
    : [
      ...originalUpgradeSets.splice(1),
      originalUpgradeSets[0]
    ].filter((s) => !!s);

  return (
    <div className={styles["upgrade-panel"]}>

      {selectedUnit && <Paper square elevation={0}>
        {selectedUnit.size > 1 && !isLive && !isSkirmish && <FormGroup className="px-4 pt-2 is-flex-direction-row is-align-items-center">
          <FormControlLabel control={
            <Checkbox checked={selectedUnit.combined} onClick={() => dispatch(toggleUnitCombined(selectedUnit.selectionId))
            } />} label="Double Unit Size" className="mr-2" />
          <CustomTooltip title={"When preparing your army you may merge units by deploying two copies of the same unit as a single big unit, as long as any upgrades that are applied to all models are bought for both."} arrow enterTouchDelay={0} leaveTouchDelay={5000}>
            <InfoOutlinedIcon color="primary" />
          </CustomTooltip>
        </FormGroup>}
        {!isSkirmish && isHero && <FormGroup className="px-4 pt-2 pb-3">
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Join To Unit</InputLabel>
            <Select
              value={selectedUnit?.joinToUnit || ""}
              label="Join To Unit"
              onChange={joinToUnit}
            >
              <MenuItem value={null}>None</MenuItem>
              {list.units.filter(u => u.size > 1).map((u, index) => (
                <MenuItem key={index} value={u.selectionId}>{u.customName || u.name} [{u.size}]</MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroup>}
        <div className="px-4 pt-2">
          <UnitEquipmentTable unit={selectedUnit} />
        </div>
        <div className="px-4 pt-2">
          {isPsychic && <SpellsTable />}
        </div>
        {specialRules?.length > 0 &&
          <div className="p-4 mb-4">
            <h4 style={{ fontWeight: 600, fontSize: "14px" }}>Special Rules</h4>
            <RuleList specialRules={specialRules} />
          </div>}

      </Paper>}

      {upgradeSets.map((pkg: IUpgradePackage) => (
        <div key={pkg.uid}>
          {/* <p className="px-2">{set.id}</p> */}
          {pkg.sections.map((u, i) => (
            <div className={"mt-4"} key={i}>
              <p className="px-4 pt-0" style={{ fontWeight: "bold", fontSize: "14px", lineHeight: 1.7 }}>{u.label}:</p>
              <UpgradeGroup upgrade={u} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
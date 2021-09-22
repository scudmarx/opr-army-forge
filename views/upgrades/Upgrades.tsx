import { Chip, Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store';
import styles from "../../styles/Upgrades.module.css";
import UpgradeGroup from './UpgradeGroup';
import UnitEquipmentTable from '../UnitEquipmentTable';

export function Upgrades() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army.data);

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    const getUpgradeSet = (id) => army.upgradeSets.filter((s) => s.id === id)[0];
    if (!selectedUnit)
        return null;

    const equipmentSpecialRules = selectedUnit
        .selectedEquipment
        .filter(e => !e.attacks && e.specialRules?.length) // No weapons, and only equipment with special rules
        .reduce((value, e) => value.concat(e.specialRules), []); // Flatten array of special rules arrays

    const specialRules = (selectedUnit.specialRules || []).concat(equipmentSpecialRules);

    return (
        <div className={styles["upgrade-panel"] + " py-4"}>
            <h3 className="px-4 is-size-4 is-hidden-mobile mb-4">{selectedUnit.name} Upgrades</h3>
            <UnitEquipmentTable unit={selectedUnit} />
            {specialRules?.length && <Paper square elevation={0}>
                <div className="p-4 mb-4">
                    <h4 style={{ fontWeight: 600 }}>Special Rules</h4>
                    {specialRules.map((rule, i) => (
                        <Chip key={i} label={rule} className="mr-1 mt-1" />
                    ))}
                </div>
            </Paper>}
            {(selectedUnit.upgradeSets || [])
                .map((setId) => getUpgradeSet(setId))
                .filter((s) => !!s) // remove empty sets?
                .map((set) => (
                    <div key={set.id}>
                        {/* <p className="px-2">{set.id}</p> */}
                        {set.upgrades.map((u, i) => (
                            <div className={"mt-4"} key={i}>
                                <p className="px-4 pt-0" style={{ fontWeight: "bold", fontStyle: "italic", }}>{u.text}:</p>
                                <UpgradeGroup upgrade={u} />
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    );
}
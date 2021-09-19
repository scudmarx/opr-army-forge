import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IEquipment, ISelectedUnit, IUpgrade } from '../data/interfaces';
import { applyUpgrade } from '../data/listSlice';
import { RootState } from '../data/store';
import UpgradeService from '../services/UpgradeService';
import styles from "../styles/Upgrades.module.css";
import UpgradeGroup from './UpgradeGroup';
import UnitEquipmentTable from './UnitEquipmentTable';

export function Upgrades() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army.data);

    const dispatch = useDispatch();

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    var getUpgradeSet = (id) => army.upgradeSets.filter((s) => s.id === id)[0];

    var handleUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment) => {

        if (UpgradeService.isValid(unit, upgrade, option)) {
            dispatch(applyUpgrade({ unitId: unit.selectionId, upgrade, option }));
        }
    };

    if (!selectedUnit)
        return null;

    return (
        <div className={styles["upgrade-panel"] + " py-4"}>
            <h3 className="is-size-4 is-hidden-mobile mb-4">{selectedUnit.name} Upgrades</h3>
            <UnitEquipmentTable unit={selectedUnit} />
            {selectedUnit.specialRules?.length > 0 && <Paper square elevation={0}>
                <div className="p-4 mb-4">
                    <h4 style={{ fontWeight: 600 }}>Special Rules</h4>
                    {selectedUnit.specialRules.join(", ")}
                </div>
            </Paper>}
            {(selectedUnit.upgradeSets || [])
                .map((setId) => getUpgradeSet(setId))
                .filter((s) => !!s) // remove empty sets?
                .map((set) => (
                    <div key={set.id}>
                        {/* <p className="px-2">{set.id}</p> */}
                        {set.upgrades.map((u, i) => (
                            <div className={i > 0 ? "mt-4" : null} key={i}>
                                <p className="px-4" style={{ fontWeight: "bold", fontStyle: "italic", }}>{u.text}:</p>
                                <UpgradeGroup upgrade={u} />
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    );
}
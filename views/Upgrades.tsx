import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IEquipment, ISelectedUnit, IUpgrade } from '../data/interfaces';
import { applyUpgrade } from '../data/listSlice';
import { RootState } from '../data/store';
import EquipmentService from '../services/EquipmentService';
import UpgradeService from '../services/UpgradeService';
import styles from "../styles/Upgrades.module.css";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

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
        <div className={styles["upgrade-panel"] + " p-4"}>
            <h3 className="is-size-4 is-hidden-mobile mb-4">{selectedUnit.name} Upgrades</h3>
            <TableContainer component={Paper} className="mb-4">
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Equipment</TableCell>
                            <TableCell>RNG</TableCell>
                            <TableCell>ATK</TableCell>
                            <TableCell>AP</TableCell>
                            <TableCell>SPE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            selectedUnit.selectedEquipment.map(e => (
                                <TableRow>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell>{e.range ? e.range + '"' : ''}</TableCell>
                                    <TableCell>{e.attacks ? "A" + e.attacks : ''}</TableCell>
                                    <TableCell>{EquipmentService.getAP(e)}</TableCell>
                                    <TableCell>{e.specialRules?.filter(r => !/^AP/.test(r)).join(", ")}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="columns is-multiline">
                {(selectedUnit.upgradeSets || [])
                    .map((setId) => getUpgradeSet(setId))
                    .filter((s) => !!s) // remove empty sets?
                    .map((set) => {
                        console.log(set);
                        return (
                            <div className="column is-half" key={set.id}>
                                <p>{set.id}</p>
                                {set.upgrades.map((u, i) => (
                                    <div key={i}>
                                        <p
                                            style={{
                                                fontWeight: "bold",
                                                fontStyle: "italic",
                                            }}
                                        >
                                            {u.type === "replace" ? (
                                                <span>
                                                    Replace {u.affects} {u.replacesWhat}
                                                </span>
                                            ) : (
                                                <span>
                                                    Upgrade{" "}
                                                    {u.affects
                                                        ? `${u.affects} model(s) `
                                                        : null}
                                                    with {u.select}
                                                </span>
                                            )}
                                        </p>
                                        {
                                            // For each upgrade option
                                            u.options.map((opt, i) => (
                                                <div key={i} className="is-flex is-align-items-center">
                                                    <div className="is-flex-grow-1">{EquipmentService.formatString(opt)}</div>
                                                    <div>{opt.cost}pt&nbsp;</div>
                                                    <IconButton color={UpgradeService.isApplied(selectedUnit, u, opt) ? "primary" : "default"}>
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        color={UpgradeService.isApplied(selectedUnit, u, opt) ? "primary" : "default"}
                                                        onClick={() => handleUpgrade(selectedUnit, u, opt)}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </div>
                                            ))
                                        }
                                    </div>
                                ))}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
import { Checkbox, IconButton, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IEquipment, ISelectedUnit, IUpgrade } from '../data/interfaces';
import { applyUpgrade, removeUpgrade } from '../data/listSlice';
import { RootState } from '../data/store';
import EquipmentService from '../services/EquipmentService';
import UpgradeService from '../services/UpgradeService';
import styles from "../styles/Upgrades.module.css";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import hash from "object-hash";

export default function UpgradeGroup({ upgrade }: { upgrade: IUpgrade }) {

    const list = useSelector((state: RootState) => state.list);
    const dispatch = useDispatch();

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    var handleUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment) => {

        if (UpgradeService.isValid(unit, upgrade, option)) {
            dispatch(applyUpgrade({ unitId: unit.selectionId, upgrade, option }));
        }
    };

    const controlType = (() => {
        if (upgrade.type === "upgrade") {

            // "Upgrade with:"
            // "Upgrade with any:"
            if (!upgrade.select || upgrade.select == "any") {
                return "check";
            }
            // "Upgrade with one:"
            if (upgrade.select === "one") {
                return "radio";
            }
            // TODO "Upgrade with up to n:"

            // "Upgrade with any:"
            if (upgrade.select === "any") {
                return "check";
            }
        }

        // "Upgrade Psychic(1):"
        if (upgrade.type === "upgradeRule") {
            return "check";
        }

        if (upgrade.type === "replace") {

            // "Replace [weapon]:"
            if (!upgrade.affects && !upgrade.limit) {
                return "radio";
            }
            // "Replace one [weapon]:"
            if (upgrade.affects === "one") {
                return "radio";
            }
            // "Replace any [weapon]:"
            // "Replace 2 [weapons]:"
            if (upgrade.affects === "any" || typeof (upgrade.affects) === "number") {
                return "updown";
            }
        }

        console.error("No control type for: ", upgrade);
        return null;
    })();

    const isApplied = (option) => UpgradeService.isApplied(selectedUnit, upgrade, option);

    const handleRadio = (option) => {

        const applied = isApplied(option);

        if (!applied) {
            // Remove any other selections from group
            for (let opt of upgrade.options)
                if (isApplied(opt))
                    dispatch(removeUpgrade({ unitId: selectedUnit.selectionId, upgrade, option: opt }));

            // Apply the selected upgrade
            dispatch(applyUpgrade({ unitId: selectedUnit.selectionId, upgrade, option }));

        } else {
            // Deselecting the already selected option in the group
            dispatch(removeUpgrade({ unitId: selectedUnit.selectionId, upgrade, option }));
        }
    };

    const checkControl = (option: IEquipment) => <Checkbox />
    const radioControl = (option: IEquipment) => (
        <Radio
            checked={isApplied(option)}
            onClick={() => handleRadio(option)}
            name={hash(upgrade)}
            color="primary"
            value={option.name} />
    );
    const updownControl = (option: IEquipment) => (
        <>
            <IconButton color={UpgradeService.isApplied(selectedUnit, upgrade, option) ? "primary" : "default"}>
                <DownIcon />
            </IconButton>
            <div>{UpgradeService.countApplied(selectedUnit, upgrade, option)}</div>
            <IconButton
                disabled={!UpgradeService.isValid(selectedUnit, upgrade, option)}
                color={UpgradeService.isApplied(selectedUnit, upgrade, option) ? "primary" : "default"}
                onClick={() => handleUpgrade(selectedUnit, upgrade, option)}
            >
                <UpIcon />
            </IconButton>
        </>
    )

    return (
        <Paper className="px-4 py-2" square elevation={0}>
            {
                upgrade.options.map((opt, i) => (
                    <div key={i} className="is-flex is-align-items-center">
                        <div className="is-flex-grow-1 pr-2">{(() => {
                            const parts = EquipmentService.getStringParts(opt);
                            return (
                                <>
                                    <span style={{ color: "#000000" }}>{parts.name} </span>
                                    <span style={{ color: "#656565" }}>({parts.rules})</span>
                                </>
                            );
                        })()}</div>
                        <div>{opt.cost}pt&nbsp;</div>
                        {(() => {
                            switch (controlType) {
                                case "check": return checkControl(opt);
                                case "radio": return radioControl(opt);
                                case "updown": return updownControl(opt);
                            }
                        })()}
                    </div>
                ))
            }
        </Paper>
    );

    //return ({ upgrade.options.map((opt, i) => (<p></p>)});
}
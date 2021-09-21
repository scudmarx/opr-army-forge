import { Checkbox, IconButton, Paper, Radio } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IEquipment, ISelectedUnit, IUpgrade } from '../../data/interfaces';
import { applyUpgrade, removeUpgrade, selectUnit } from '../../data/listSlice';
import { RootState } from '../../data/store';
import EquipmentService from '../../services/EquipmentService';
import UpgradeService from '../../services/UpgradeService';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import hash from "object-hash";
import UpgradeItem from './UpgradeItem';

export default function UpgradeGroup({ upgrade }: { upgrade: IUpgrade }) {

    const list = useSelector((state: RootState) => state.list);
    const dispatch = useDispatch();

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    const incrementUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment) => {
        dispatch(applyUpgrade({ unitId: unit.selectionId, upgrade, option }));
    };
    const decrementUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment) => {
        dispatch(removeUpgrade({ unitId: unit.selectionId, upgrade, option }));
    };

    const controlType = UpgradeService.getControlType(selectedUnit, upgrade);

    const isApplied = (option) => UpgradeService.isApplied(selectedUnit, upgrade, option);

    // #region Check

    const checkControl = (option: IEquipment) => (
        <Checkbox
            checked={isApplied(option)}
            onClick={() => handleCheck(option)}
            value={option.name} />
    );

    const handleCheck = (option) => {

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

    // #endregion

    //#region Radio

    const radioControl = (option: IEquipment) => (
        <Radio
            checked={isApplied(option)}
            onClick={() => handleRadio(option)}
            name={hash(upgrade)}
            color="primary"
            value={option.name || "None"} />
    );

    const handleRadio = (option: IEquipment | null) => {

        const applied = option ? isApplied(option) : false;

        if (!applied) {
            // Remove any other selections from group
            for (let opt of upgrade.options)
                if (isApplied(opt))
                    dispatch(removeUpgrade({ unitId: selectedUnit.selectionId, upgrade, option: opt }));

            if (option)
                // Apply the selected upgrade
                dispatch(applyUpgrade({ unitId: selectedUnit.selectionId, upgrade, option }));

        } else {
            // BAD apparently we are not allowed to deselect radio buttons...
            // Deselecting the already selected option in the group
            //dispatch(removeUpgrade({ unitId: selectedUnit.selectionId, upgrade, option }));
        }
    };

    // #endregion

    const updownControl = (option: IEquipment) => {
        const isApplied = UpgradeService.isApplied(selectedUnit, upgrade, option);
        const countApplied = UpgradeService.countApplied(selectedUnit, upgrade, option);
        const isValid = UpgradeService.isValid(selectedUnit, upgrade, option);

        return (
            <>
                <IconButton
                    disabled={countApplied === 0}
                    color={countApplied > 0 ? "primary" : "default"}
                    onClick={() => decrementUpgrade(selectedUnit, upgrade, option)}>

                    <DownIcon />
                </IconButton>
                <div>{countApplied}</div>
                <IconButton
                    disabled={!isValid}
                    color={"primary"}
                    onClick={() => incrementUpgrade(selectedUnit, upgrade, option)}
                >
                    <UpIcon />
                </IconButton>
            </>
        );
    };

    return (
        <Paper className="px-4 py-2" square elevation={0}>
            {
                // "None" / Default option for radio group
                controlType === "radio" && <div className="is-flex is-align-items-center">
                    <div className="is-flex-grow-1 pr-2">{(() => {
                        const defaultOpt = upgrade.type === "replace"
                            ? selectedUnit.equipment.filter(e => e.name === upgrade.replaceWhat)[0]
                            : null;

                        if (!defaultOpt)
                            return <span style={{ color: "#000000" }}>None</span>;

                        const parts = EquipmentService.getStringParts(defaultOpt);

                        return (
                            <>
                                <span style={{ color: "#000000" }}>{parts.name} </span>
                                <span style={{ color: "#656565" }}>({parts.rules})</span>
                            </>
                        );
                    })()}</div>
                    <div>Free&nbsp;</div>
                    <Radio
                        checked={!upgrade.options.reduce((prev, current) => prev || isApplied(current), false)}
                        onClick={() => handleRadio(null)}
                        name={hash(upgrade)}
                        color="primary"
                        value={"None"} />
                </div>
            }
            {upgrade.options.map((opt, i) => <UpgradeItem key={i} selectedUnit={selectedUnit} upgrade={upgrade} option={opt} />)}
        </Paper>
    );

    //return ({ upgrade.options.map((opt, i) => (<p></p>)});
}
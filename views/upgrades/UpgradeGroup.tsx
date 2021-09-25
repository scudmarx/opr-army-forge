import { Paper, Radio } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { IUpgrade, IUpgradeOption } from '../../data/interfaces';
import { applyUpgrade, removeUpgrade } from '../../data/listSlice';
import { RootState } from '../../data/store';
import EquipmentService from '../../services/EquipmentService';
import UpgradeService from '../../services/UpgradeService';
import hash from "object-hash";
import UpgradeItem from './UpgradeItem';

export default function UpgradeGroup({ upgrade }: { upgrade: IUpgrade }) {

    const list = useSelector((state: RootState) => state.list);
    const dispatch = useDispatch();

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    const controlType = UpgradeService.getControlType(selectedUnit, upgrade);

    const isApplied = (option) => UpgradeService.isApplied(selectedUnit, upgrade, option);

    //#region Radio

    const handleRadio = (option: IUpgradeOption | null) => {

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

    return (
        <Paper className="px-4 py-2" square elevation={0}>
            {
                // "None" / Default option for radio group
                controlType === "radio" && <div className="is-flex is-align-items-center">
                    <div className="is-flex-grow-1 pr-2">{(() => {
                        const defaultOpt = upgrade.type === "replace" && typeof(upgrade.replaceWhat) === "string"
                            ? EquipmentService.findLast(selectedUnit.equipment, upgrade.replaceWhat as string)
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
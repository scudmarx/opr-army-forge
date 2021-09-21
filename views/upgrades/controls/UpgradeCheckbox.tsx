import { Checkbox } from '@mui/material';
import { useDispatch } from 'react-redux';
import { IEquipment, ISelectedUnit, IUpgrade } from '../../../data/interfaces';
import { applyUpgrade, removeUpgrade } from '../../../data/listSlice';
import UpgradeService from '../../../services/UpgradeService';

export default function UpgradeCheckbox({ selectedUnit, upgrade, option }: { selectedUnit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment }) {

    const dispatch = useDispatch();

    const isApplied = (option) => UpgradeService.isApplied(selectedUnit, upgrade, option);

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

    return (
        <Checkbox
            checked={isApplied(option)}
            onClick={() => handleCheck(option)}
            value={option.name} />
    );

    //return ({ upgrade.options.map((opt, i) => (<p></p>)});
}
import { Radio } from '@mui/material';
import { useDispatch } from 'react-redux';
import { IEquipment, ISelectedUnit, IUpgrade } from '../../../data/interfaces';
import { applyUpgrade, removeUpgrade } from '../../../data/listSlice';
import UpgradeService from '../../../services/UpgradeService';
import hash from "object-hash";

export default function UpgradeRadio({ selectedUnit, upgrade, option }: { selectedUnit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment }) {

    const dispatch = useDispatch();

    const isApplied = (option) => UpgradeService.isApplied(selectedUnit, upgrade, option);

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

    return (
        <Radio
            checked={isApplied(option)}
            onClick={() => handleRadio(option)}
            name={hash(upgrade)}
            color="primary"
            value={option.name || "None"} />
    );

    //return ({ upgrade.options.map((opt, i) => (<p></p>)});
}
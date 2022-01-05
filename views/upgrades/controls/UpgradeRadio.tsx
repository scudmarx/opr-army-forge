import { Radio } from '@mui/material';
import { useDispatch } from 'react-redux';
import { ISelectedUnit, IUpgrade, IUpgradeOption } from '../../../data/interfaces';
import { applyUpgrade, removeUpgrade, switchUpgrade } from '../../../data/listSlice';
import UpgradeService from '../../../services/UpgradeService';
import hash from "object-hash";

export default function UpgradeRadio(
  { selectedUnit, upgrade, option, isValid }: { selectedUnit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption, isValid: boolean }
) {

  const dispatch = useDispatch();

  const isApplied = UpgradeService.getApplied(selectedUnit, upgrade) == option

  const handleRadio = (option: IUpgradeOption | null) => {

    if (!isApplied) {
      if (option)
      // Apply the selected upgrade
      dispatch(switchUpgrade({ unitId: selectedUnit.selectionId, upgrade, option }));

      // Remove any other selections from group
      for (let opt of upgrade.options)
        if (opt && opt?.id != option?.id && UpgradeService.isApplied(selectedUnit, opt))
          dispatch(removeUpgrade({ unitId: selectedUnit.selectionId, upgrade, option: opt }));
    }
  };

  // #endregion
  return (
    <Radio
      checked={isApplied}
      onClick={() => handleRadio(option)}
      disabled={!isValid}
      name={hash(upgrade)}
      color="primary"
      value={option?.label || "None"} />
  );

  //return ({ upgrade.options.map((opt, i) => (<p></p>)});
}
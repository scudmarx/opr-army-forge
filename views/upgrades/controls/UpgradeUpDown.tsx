import { IconButton } from '@mui/material';
import DownIcon from '@mui/icons-material/KeyboardArrowDown';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch } from 'react-redux';
import { ISelectedUnit, IUpgrade, IUpgradeOption } from '../../../data/interfaces';
import { applyUpgrade, removeUpgrade } from '../../../data/listSlice';
import UpgradeService from '../../../services/UpgradeService';

export default function UpgradeUpDown({ selectedUnit, upgrade, option }: { selectedUnit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption }) {

  const dispatch = useDispatch();

  const incrementUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) => {
    dispatch(applyUpgrade({ unitId: unit.selectionId, upgrade, option }));
  };
  const decrementUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption) => {
    dispatch(removeUpgrade({ unitId: unit.selectionId, upgrade, option }));
  };
  try {
    const countApplied = UpgradeService.countApplied(selectedUnit, option);
    const isValid = UpgradeService.isValid(selectedUnit, upgrade, option);
    const isValidToRemove = countApplied > 0 && UpgradeService.isValidToRemove(selectedUnit, upgrade, option);

    return (
      <>
        <IconButton
          disabled={!isValidToRemove}
          color={countApplied > 0 ? "primary" : "default"}
          onClick={() => decrementUpgrade(selectedUnit, upgrade, option)}>

          <DownIcon />
        </IconButton>
        <div style={{ color: isValid ? "#000000" : "rgba(0,0,0,.5)" }}>{countApplied}</div>
        <IconButton
          disabled={!isValid}
          color={"primary"}
          onClick={() => incrementUpgrade(selectedUnit, upgrade, option)}
        >
          <UpIcon />
        </IconButton>
      </>
    );
  }
  catch (e) {
    console.log(e)
    console.log(selectedUnit);
    console.log(upgrade);
    console.log(option);
  }
}
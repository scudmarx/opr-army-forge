import { useSelector } from 'react-redux'
import { RootState } from '../data/store'
import GameSystemSelection from "../views/GameSystemSelection";
import ArmyFileSelection from "../views/ArmyFileSelection";

export default function Home() {

  const army = useSelector((state: RootState) => state.army);

  return (
    <div className="container">
      {army.gameSystem == null ? <GameSystemSelection /> : <ArmyFileSelection />}
    </div>
  );
}

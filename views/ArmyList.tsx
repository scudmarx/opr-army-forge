import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { addUnit } from '../data/listSlice';
import { groupBy } from "../services/Helpers";
import { Fragment } from "react";

export function ArmyList({ onSelected }) {

  // Access the main army definition state
  const armyData = useSelector((state: RootState) => state.army);
  const army = armyData.data;
  const dispatch = useDispatch();

  // If army has not been selected yet, show nothing
  if (!armyData.loaded)
    return null;

  // Group army units by category
  var unitGroups = groupBy(army.units, "category");

  var handleSelection = (unit) => {
    dispatch(addUnit(unit));
    onSelected(unit);
  };

  return (
    <aside
      className={styles.menu + " menu p-4"}
      style={{ minHeight: "100%" }}
    >
      <p className="menu-label">
        {army.name} - v{army.version}
      </p>
      {
        // For each category
        Object.keys(unitGroups).map(key => (
          <Fragment key={key}>
            <p className="menu-label">{key}</p>
            <ul className="menu-list">
              {
                // For each unit in category
                unitGroups[key].map((u) => (
                  <li key={u.name} className="mb-2"onClick={() => handleSelection(u)}>
                    <div className="is-flex">
                      <p className="is-flex-grow-1" style={{fontWeight:"600"}}>
                        {u.name}
                      </p>
                      <p>{u.cost}pts</p>
                      <p>+</p>
                    </div>
                    <div className="is-flex" style={{fontSize:"14px", color:"#666"}}>
                      <p>Qua {u.quality}</p>
                      <p className="ml-2">Def {u.defense}</p>
                    </div>
                    {/* <a >{u.name} [{u.size}] {u.quality} {u.defense} {u.cost}pt</a> */}
                  </li>
                ))
              }
            </ul>
          </Fragment>
        ))
      }
    </aside>
  );
}

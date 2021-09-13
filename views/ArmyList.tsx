import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { addUnit } from '../data/listSlice';
import { groupBy } from "../services/Helpers";
import { Fragment } from "react";

export function ArmyList() {

  // Access the main army definition state
  const army = useSelector((state: RootState) => state.army);
  const dispatch = useDispatch();

  // If army has not been selected yet, show nothing
  if (!army.loaded)
    return null;

  // Group army units by category
  var unitGroups = groupBy(army.units, "category");

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
                  <li key={u.name}>
                    <a onClick={() => dispatch(addUnit(u))}>{u.name} [{u.size}] {u.quality} {u.defense} {u.cost}pt</a>
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

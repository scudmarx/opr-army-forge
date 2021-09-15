import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import { addUnit } from '../data/listSlice';
import { groupBy } from "../services/Helpers";
import { Fragment } from "react";
import { Button, Fab, IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';

export function UnitSelection({ onSelected }) {

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
    console.log("foo");
    dispatch(addUnit(unit));
    onSelected(unit);
  };

  return (
    <aside
      className={styles.menu + " menu p-4"}
      style={{ minHeight: "100%" }}
    >
      <h3 className="is-size-4">
        {army.name} - v{army.version}
      </h3>
      {
        // For each category
        Object.keys(unitGroups).map(key => (
          <Fragment key={key}>
            <p className="menu-label">{key}</p>
            <ul className="menu-list">
              {
                // For each unit in category
                unitGroups[key].map((u) => (
                  <li key={u.name} className="mb-2" style={{ cursor: "pointer" }}>
                    <div className="is-flex is-align-items-center">
                      <div className="is-flex-grow-1">
                        <p className="mb-1" style={{ fontWeight: 600 }}>{u.name} {u.size > 1 ? `[${u.size}]` : ''}</p>
                        <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                          <p>Qua {u.quality}</p>
                          <p className="ml-2">Def {u.defense}</p>
                        </div>
                      </div>
                      <p className="mr-2">{u.cost}pts</p>
                      <IconButton color="primary" onClick={() => handleSelection(u)}>
                        <AddIcon />
                      </IconButton>
                      {/* <Fab color="default" size="small" onClick={() => handleSelection(u)} >
                        
                      </Fab> */}
                    </div>
                    <hr className="my-1" />
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

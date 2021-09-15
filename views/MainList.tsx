import { Fragment } from "react";
import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import EquipmentService from "../services/EquipmentService";
import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";
import { applyUpgrade, selectUnit } from "../data/listSlice";
import UpgradeService from "../services/UpgradeService";

export function MainList({ onSelected }) {

  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army.data);

  const dispatch = useDispatch();

  const totalPointCost = list
    .units
    .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);

  const handleSelectUnit = (unit: ISelectedUnit) => {
    if (list.selectedUnitId !== unit.selectionId) {
      dispatch(selectUnit(unit.selectionId));
    }
    onSelected(unit);
  };

  return (
    <main className={styles.main + " pt-4"}>
      <h1 className="is-size-4">{list.name} - {totalPointCost}pts</h1>
      <hr />
      <ul>
        {
          // For each selected unit
          list.units.map((s: ISelectedUnit, index: number) => (
            <li key={index} onClick={() => handleSelectUnit(s)} style={{ backgroundColor: (list.selectedUnitId === s.selectionId ? "#D7E3EB" : null) }} >
              <div className="is-flex">
                <p className="is-flex-grow-1" style={{ fontWeight: 600 }}>
                  {s.name} {s.size > 1 ? `[${s.size}]` : null}
                </p>
                <p>{UpgradeService.calculateUnitTotal(s)}pts</p>
              </div>
              <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                <p>Qua {s.quality}</p>
                <p className="ml-2">Def {s.defense}</p>
              </div>
              <div></div>
              <div>
                {s.selectedEquipment.filter(eqp => eqp.count > 0).map((eqp, i) => (
                  <span key={i}>
                    {(eqp.count && eqp.count !== 1 ? `${eqp.count}x ` : "") + EquipmentService.formatString(eqp)}
                  </span>
                ))}
              </div>
              <div>{(s.specialRules || []).join(", ")}</div>
            </li>
          ))
        }
      </ul>
    </main >
  );
}

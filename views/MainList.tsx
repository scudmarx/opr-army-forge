import { Fragment } from "react";
import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import EquipmentService from "../services/EquipmentService";
import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";
import { applyUpgrade, selectUnit } from "../data/listSlice";
import UpgradeService from "../services/UpgradeService";

export function MainList() {

  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army.data);

  const dispatch = useDispatch();

  const totalPointCost = list
    .units
    .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);

  const handleSelectUnit = (unit: ISelectedUnit) => {
    dispatch(selectUnit(unit.selectionId));
  };

  return (
    <main className={styles.main + " p-4"}>
      <h1 className="is-size-3">{list.name} - {totalPointCost}pts</h1>
      <hr />
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th>Unit</th>
            <th>Quality</th>
            <th>Defense</th>
            <th>Equipment</th>
            <th>Special Rules</th>
            <th>Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            // For each selected unit
            list.units.map((s: ISelectedUnit, index: number) => (
              <Fragment key={index}>
                <tr onClick={() => handleSelectUnit(s)} style={{backgroundColor:(list.selectedUnitId === s.selectionId ? "#D7E3EB" : null)}}>
                  <td>
                    {s.name} {s.size > 1 ? `[${s.size}]` : null}
                  </td>
                  <td>{s.quality}</td>
                  <td>{s.defense}</td>
                  <td>
                    {s.selectedEquipment.filter(eqp => eqp.count > 0).map((eqp, i) => (
                      <p key={i}>
                        {(eqp.count && eqp.count !== 1 ? `${eqp.count}x ` : "") + EquipmentService.formatString(eqp)}
                      </p>
                    ))}
                  </td>
                  <td>{(s.specialRules || []).join(", ")}</td>
                  <td>{UpgradeService.calculateUnitTotal(s)}pts</td>
                  <td></td>
                </tr>
              </Fragment>
            ))
          }
        </tbody>
      </table>
    </main>
  );
}

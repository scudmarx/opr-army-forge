import { Fragment } from "react";
import styles from "../styles/Home.module.css";
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../data/store';
import EquipmentService from "../services/EquipmentService";
import { IEquipment, ISelectedUnit, IUpgrade } from "../data/interfaces";
import { applyUpgrade } from "../data/listSlice";
import UpgradeService from "../services/UpgradeService";

export function MainList() {

  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army);

  const dispatch = useDispatch();

  var getUpgradeSet = (id) => army.upgradeSets.filter((s) => s.id === id)[0];

  var handleUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment) => {

    if (UpgradeService.isValid(unit, upgrade, option)) {
      dispatch(applyUpgrade({ unitId: unit.selectionId, upgrade, option }));
    }
  };

  const totalPointCost = list
    .units
    .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);

  return (
    <main className={styles.main}>
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
                <tr>
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
                <tr>
                  <td colSpan={42}>
                    <div className="columns is-multiline">
                      {(s.upgradeSets || [])
                        .map((setId) => getUpgradeSet(setId))
                        .filter((s) => !!s) // remove empty sets?
                        .map((set) => {
                          console.log(set);
                          return (
                            <div className="column is-half" key={set.id}>
                              <p>{set.id}</p>
                              {set.upgrades.map((u, i) => (
                                <div key={i}>
                                  <p
                                    style={{
                                      fontWeight: "bold",
                                      fontStyle: "italic",
                                    }}
                                  >
                                    {u.type === "replace" ? (
                                      <span>
                                        Replace {u.affects} {u.replacesWhat}
                                      </span>
                                    ) : (
                                      <span>
                                        Upgrade{" "}
                                        {u.affects
                                          ? `${u.affects} model(s) `
                                          : null}
                                        with {u.select}
                                      </span>
                                    )}
                                  </p>
                                  {
                                    // For each upgrade option
                                    u.options.map((opt, i) => (
                                      <div key={i} className="is-flex">
                                        <div className="is-flex-grow-1">{EquipmentService.formatString(opt)}</div>
                                        <div>{opt.cost}pt&nbsp;</div>
                                        <button
                                          className={"button mb-1 is-small " + (UpgradeService.isApplied(s, u, opt) ? "is-primary" : "")}
                                          onClick={() => handleUpgrade(s, u, opt)}
                                        >
                                          +
                                        </button>
                                      </div>
                                    ))
                                  }
                                </div>
                              ))}
                            </div>
                          );
                        })}
                    </div>
                  </td>
                </tr>
              </Fragment>
            ))
          }
        </tbody>
      </table>
    </main>
  );
}

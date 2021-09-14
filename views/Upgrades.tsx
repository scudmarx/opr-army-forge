import { useSelector, useDispatch } from 'react-redux';
import { IEquipment, ISelectedUnit, IUpgrade } from '../data/interfaces';
import { applyUpgrade } from '../data/listSlice';
import { RootState } from '../data/store';
import EquipmentService from '../services/EquipmentService';
import UpgradeService from '../services/UpgradeService';

export function Upgrades() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army.data);

    const dispatch = useDispatch();

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    var getUpgradeSet = (id) => army.upgradeSets.filter((s) => s.id === id)[0];

    var handleUpgrade = (unit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment) => {

        if (UpgradeService.isValid(unit, upgrade, option)) {
            dispatch(applyUpgrade({ unitId: unit.selectionId, upgrade, option }));
        }
    };

    if (!selectedUnit)
        return null;

    return (
        <div className="p-4">
            <h3 className="is-size-4">{selectedUnit.name} Upgrades</h3>
            <div className="columns is-multiline">
                {(selectedUnit.upgradeSets || [])
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
                                                        className={"button mb-1 is-small " + (UpgradeService.isApplied(selectedUnit, u, opt) ? "is-primary" : "")}
                                                        onClick={() => handleUpgrade(selectedUnit, u, opt)}
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
        </div>
    );
}
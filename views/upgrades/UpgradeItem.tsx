import { IEquipment, ISelectedUnit, IUpgrade } from '../../data/interfaces';
import EquipmentService from '../../services/EquipmentService';
import UpgradeService from '../../services/UpgradeService';
import UpgradeRadio from './controls/UpgradeRadio';
import UpgradeCheckbox from './controls/UpgradeCheckbox';
import UpgradeUpDown from './controls/UpgradeUpDown';
import { Fragment } from 'react';

export default function UpgradeItem({ selectedUnit, upgrade, option }: { selectedUnit: ISelectedUnit, upgrade: IUpgrade, option: IEquipment }) {

    const controlType = UpgradeService.getControlType(selectedUnit, upgrade);

    return (
        <div className="is-flex is-align-items-center">
            <div className="is-flex-grow-1 pr-2">{(() => {
                const equipments = option.type === "combined" ? option.equipment : [option]

                return (
                    equipments.map((e, i) => {
                        const parts = EquipmentService.getStringParts(e);
                        return (
                            <Fragment key={i}>
                                <span style={{ color: "#000000" }}>{parts.name} </span>
                                <span className="mr-2" style={{ color: "#656565" }}>({parts.rules})</span>
                            </Fragment>
                        )
                    })
                );
            })()}</div>
            <div>{option.cost ? `${option.cost}pts` : "Free"}&nbsp;</div>
            {(() => {
                switch (controlType) {
                    case "check": return <UpgradeCheckbox selectedUnit={selectedUnit} upgrade={upgrade} option={option} />;
                    case "radio": return <UpgradeRadio selectedUnit={selectedUnit} upgrade={upgrade} option={option} />;
                    case "updown": return <UpgradeUpDown selectedUnit={selectedUnit} upgrade={upgrade} option={option} />;
                }
            })()}
        </div>
    );
}
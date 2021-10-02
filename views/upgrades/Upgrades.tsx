import { Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store';
import styles from "../../styles/Upgrades.module.css";
import UpgradeGroup from './UpgradeGroup';
import UnitEquipmentTable from '../UnitEquipmentTable';
import RuleList from '../components/RuleList';
import { ISpecialRule, IUpgradePackage } from '../../data/interfaces';
import UnitService from '../../services/UnitService';

export function Upgrades() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army.data);

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    const getUpgradeSet = (id) => army.upgradePackages.filter((s) => s.uid === id)[0];

    const equipmentSpecialRules: ISpecialRule[] = selectedUnit && selectedUnit
        .equipment
        .filter(e => !e.attacks && e.specialRules?.length) // No weapons, and only equipment with special rules
        .reduce((value, e) => value.concat(e.specialRules), []); // Flatten array of special rules arrays

    const unitUpgradeRules: ISpecialRule[] = selectedUnit && UnitService
        .getAllUpgradedRules(selectedUnit);

    const specialRules = selectedUnit && (selectedUnit.specialRules || [])
        .concat(equipmentSpecialRules)
        .concat(unitUpgradeRules)
        .filter(r => r.name !== "-");

    return (
        <div className={styles["upgrade-panel"]}>
            <h3 className="p-4 is-size-4 is-hidden-mobile">{selectedUnit?.customName || selectedUnit?.name} Upgrades</h3>
            {selectedUnit && <Paper square elevation={0}>
                <div className="px-4 pt-4">
                    <UnitEquipmentTable unit={selectedUnit} />
                </div>
                {specialRules?.length > 0 &&
                    <div className="p-4 mb-4">
                        <h4 style={{ fontWeight: 600, fontSize: "14px" }}>Special Rules</h4>
                        <RuleList specialRules={specialRules} />
                    </div>}
            </Paper>}
            {(selectedUnit?.upgrades || [])
                .map((setId) => getUpgradeSet(setId))
                .filter((s) => !!s) // remove empty sets?
                .map((pkg: IUpgradePackage) => (
                    <div key={pkg.uid}>
                        {/* <p className="px-2">{set.id}</p> */}
                        {pkg.sections.map((u, i) => (
                            <div className={"mt-4"} key={i}>
                                <p className="px-4 pt-0" style={{ fontWeight: "bold", fontSize: "14px", lineHeight: 1.7 }}>{u.label}:</p>
                                <UpgradeGroup upgrade={u} />
                            </div>
                        ))}
                    </div>
                ))}
        </div>
    );
}
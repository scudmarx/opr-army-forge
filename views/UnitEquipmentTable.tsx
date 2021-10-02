import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IEquipment, ISelectedUnit, IUpgradeGains, IUpgradeGainsItem, IUpgradeGainsMultiWeapon, IUpgradeGainsRule, IUpgradeGainsWeapon } from '../data/interfaces';
import EquipmentService from '../services/EquipmentService';
import pluralise from "pluralize";
import RuleList from './components/RuleList';
import UnitService from '../services/UnitService';
import DataParsingService from '../services/DataParsingService';
import { groupBy } from '../services/Helpers';
import RulesService from '../services/RulesService';
import { Fragment } from 'react';

export function WeaponRow({ unit, e, isProfile }: { unit: ISelectedUnit, e: IEquipment, isProfile: boolean }) {

    const count = e.count;
    const name = e.count > 1 ? pluralise.plural(e.label) : e.label;
    const originalCount: number = null;
    const multiplier = count / unit.size; // 20 / 10 = "2x Weapons...""
    const displayCount = count > unit.size // 20 hand weapons, unit of 10
        ? originalCount
            ? (count / originalCount)
            : unit.size
        : count;

    const cellStyle = { paddingLeft: "8px", paddingRight: "8px" };
    const borderStyle = {
        borderBottom: "none",
        borderTop: isProfile ? "none" : "1px solid rgb(224, 224, 224)"
    };
    const rules = e.specialRules
        .filter(r => r.indexOf("AP") === -1)
        .map(DataParsingService.parseRule)

    return (
        <TableRow>
            <TableCell style={{ ...borderStyle, ...cellStyle, fontWeight: 600 }}>
                {displayCount > 1 ? `[${displayCount}] ` : " "}{multiplier > 1 ? `${multiplier}x ` : ""}{isProfile ? `- ${name}` : name}
            </TableCell>
            <TableCell style={borderStyle}>{e.range ? e.range + '"' : '-'}</TableCell>
            <TableCell style={borderStyle}>{e.attacks ? "A" + e.attacks : '-'}</TableCell>
            <TableCell style={borderStyle}>{EquipmentService.getAP(e) || '-'}</TableCell>
            <TableCell style={borderStyle}>
                {rules && rules.length > 0 ? <RuleList specialRules={rules} /> : <span>-</span>}
            </TableCell>
        </TableRow>
    );
}

export default function UnitEquipmentTable({ unit }: { unit: ISelectedUnit }) {

    const isWeapon = e => e.attacks;

    const equipment = unit.equipment.filter(e => !isWeapon(e));
    const itemUpgrades = UnitService.getAllUpgradeItems(unit);
    const weapons = unit.equipment.filter(e => isWeapon(e))
    const weaponUpgrades = UnitService.getAllUpgradeWeapons(unit);

    const hasEquipment = equipment.length > 0 || itemUpgrades.length > 0;
    const hasWeapons = weapons.length > 0 || weaponUpgrades.length > 0;

    const upgradeToEquipment = (upgrade: IUpgradeGains): IEquipment => {
        if (upgrade.type === "ArmyBookWeapon") {
            const weapon = upgrade as IUpgradeGainsWeapon;
            const equipment: IEquipment = {
                label: pluralise.singular(weapon.name),
                attacks: weapon.attacks,
                range: weapon.range,
                specialRules: weapon.specialRules.map(r => RulesService.displayName(r)),
                count: upgrade.count
            };
            return equipment
        }
        return {
            label: upgrade.name,
        };
    };
    const upgradedEquipment = weaponUpgrades.map(upgradeToEquipment);
    // Combine upgradedEquipment with weapons
    const combinedWeapons = [];
    const addedUpgrades = [];
    weapons.forEach((w, index) => {
        const weapon = { ...w };
        upgradedEquipment.forEach((e) => {
            if (e.label === w.label) {
                weapon.count += e.count;
                addedUpgrades.push(e.label);
            }
        })
        combinedWeapons.push(weapon);
    });

    upgradedEquipment.forEach((e) => {
        if (!addedUpgrades.includes(e.label)) {
            const index = combinedWeapons.findIndex((w) =>  pluralise.singular(w.label) === pluralise.singular(e.label));

            if (index !== -1) {
                combinedWeapons[index].count += e.count;
            } else {
                combinedWeapons.push(e);
            }
        }
    })

    const weaponGroups = groupBy(combinedWeapons, "name");

    const cellStyle = { paddingLeft: "8px", paddingRight: "8px" };
    const headerStyle = { ...cellStyle, fontWeight: 600 };

    return (
        <>
            {hasWeapons && <TableContainer component={Paper} elevation={0} style={{ border: "1px solid rgba(0,0,0,.12)" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#EBEBEB", fontWeight: 600 }}>
                            <TableCell style={headerStyle}>Weapon</TableCell>
                            <TableCell style={headerStyle}>RNG</TableCell>
                            <TableCell style={headerStyle}>ATK</TableCell>
                            <TableCell style={headerStyle}>AP</TableCell>
                            <TableCell style={headerStyle}>SPE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            combinedWeapons.filter(e => e.count).map((e, i) => {
                                return (
                                    <WeaponRow unit={unit} e={e} isProfile={false} />
                                );
                            })
                        }
                        {
                            Object.keys(weaponGroups).map(key => {
                                const group = weaponGroups[key]
                                const upgrade = group[0];
                                const e = upgradeToEquipment(upgrade);
                                // Upgrade may have been replaced
                                if (!e.count)
                                    return null;

                                if (upgrade.type === "ArmyBookMultiWeapon") {
                                    console.log(upgrade.profiles);
                                    return (
                                        <Fragment key={key}>
                                            <TableRow>
                                                <TableCell style={{ border: "none", borderTop: "1px solid rgb(224, 224, 224)" }} colSpan={5}>{upgrade.name}</TableCell>
                                            </TableRow>
                                            {upgrade.profiles.map((profile, i) => (
                                                <WeaponRow key={i} unit={unit} e={upgradeToEquipment(profile, 1)} isProfile={true} />
                                            ))}
                                        </Fragment>
                                    );
                                }

                                return (
                                    <WeaponRow key={key} unit={unit} e={e} isProfile={false} />
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>}
            {hasEquipment && <TableContainer component={Paper} className="mb-4" elevation={0}>
                <Table size="small">
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#EBEBEB", fontWeight: 600 }}>
                            <TableCell style={{ fontWeight: 600 }}>Equipment</TableCell>
                            <TableCell style={{ fontWeight: 600 }}>SPE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            equipment.filter(e => e.count).map((e, i) => {
                                const isEquippedToAll = e.count === unit.size;

                                return (
                                    <TableRow key={i}>
                                        <TableCell>{e.count > 1 && isEquippedToAll ? '' : `${e.count}x`} {e.count > 1 && !isEquippedToAll ? pluralise.plural(e.label) : e.label}</TableCell>
                                        <TableCell>
                                            <RuleList specialRules={e.specialRules.map(DataParsingService.parseRule)} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                        {
                            itemUpgrades.map((e, i) => {
                                const rules = e.content
                                    .filter(c => c.type === "ArmyBookRule" || c.type === "ArmyBookDefense") as IUpgradeGainsRule[];
                                console.log(rules);

                                return (
                                    <TableRow key={i}>
                                        <TableCell>{e.name}</TableCell>
                                        <TableCell>
                                            <RuleList specialRules={rules} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>}
        </>
    );
}
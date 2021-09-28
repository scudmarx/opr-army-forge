import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { IEquipment, ISelectedUnit, IUpgradeGains, IUpgradeGainsItem, IUpgradeGainsMultiWeapon, IUpgradeGainsRule, IUpgradeGainsWeapon } from '../data/interfaces';
import EquipmentService from '../services/EquipmentService';
import pluralise from "pluralize";
import RuleList from './components/RuleList';
import UnitService from '../services/UnitService';
import DataParsingService from '../services/DataParsingService';
import { groupBy } from '../services/Helpers';
import RulesService from '../services/RulesService';

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

    const borderStyle = {
        borderBottom: "none",
        borderTop: isProfile ? "none" : "1px solid rgb(224, 224, 224)"
    };
    const rules = e.specialRules
        .filter(r => r.indexOf("AP") === -1)
        .map(DataParsingService.parseRule)

    return (
        <TableRow>
            <TableCell style={{ ...borderStyle, fontWeight: 600 }}>
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

    const weaponGroups = groupBy(weaponUpgrades, "name");

    const upgradeToEquipment = (upgrade: IUpgradeGains, count: number): IEquipment => {

        if (upgrade.type === "ArmyBookWeapon") {
            const weapon = upgrade as IUpgradeGainsWeapon;
            const equipment: IEquipment = {
                label: weapon.name,
                attacks: weapon.attacks,
                range: weapon.range,
                specialRules: weapon.specialRules.map(r => RulesService.displayName(r)),
                count: upgrade.count * count
            };
            return equipment
        }
        return {
            label: upgrade.name,
        };
    };

    return (
        <>
            {hasWeapons && <TableContainer component={Paper} className="mb-4" elevation={0}>
                <Table size="small">
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#EBEBEB", fontWeight: 600 }}>
                            <TableCell style={{ fontWeight: 600 }}>Weapon</TableCell>
                            <TableCell style={{ fontWeight: 600 }}>RNG</TableCell>
                            <TableCell style={{ fontWeight: 600 }}>ATK</TableCell>
                            <TableCell style={{ fontWeight: 600 }}>AP</TableCell>
                            <TableCell style={{ fontWeight: 600 }}>SPE</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            weapons.filter(e => e.count).map((e, i) => {
                                return (
                                    <WeaponRow unit={unit} e={e} isProfile={false} />
                                );
                            })
                        }
                        {
                            Object.keys(weaponGroups).map(key => {
                                const group = weaponGroups[key]
                                const upgrade = group[0];
                                const e = upgradeToEquipment(upgrade, group.length);
                                
                                if (upgrade.type === "ArmyBookMultiWeapon") {
                                    console.log(upgrade.profiles);
                                    return (
                                        <>
                                            <TableRow>
                                                <TableCell style={{ border: "none", borderTop: "1px solid rgb(224, 224, 224)" }} colSpan={5}>{upgrade.name}</TableCell>
                                            </TableRow>
                                            {upgrade.profiles.map((profile, i) => (
                                                <WeaponRow unit={unit} e={upgradeToEquipment(profile, 1)} isProfile={true} />
                                            ))}
                                        </>
                                    );
                                }

                                return (
                                    <WeaponRow unit={unit} e={e} isProfile={false} />
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
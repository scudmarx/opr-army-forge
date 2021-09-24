import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ISelectedUnit } from '../data/interfaces';
import EquipmentService from '../services/EquipmentService';
import pluralise from "pluralize";
import RuleList from './components/RuleList';

export default function UnitEquipmentTable({ unit }: { unit: ISelectedUnit }) {

    const isWeapon = e => e.attacks || e.type === "weaponHeader";
    const hasEquipment = unit.selectedEquipment.filter(e => !isWeapon(e)).length > 0;
    const hasWeapons = unit.selectedEquipment.filter(e => isWeapon(e)).length > 0;

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
                            unit.selectedEquipment.filter(e => isWeapon(e) && e.count).map((e, i) => {

                                if (e.type === "weaponHeader")
                                    return (
                                        <TableRow key={i}>
                                            <TableCell style={{ border: "none", borderTop: "1px solid rgb(224, 224, 224)" }} colSpan={5}>{e.name}</TableCell>
                                        </TableRow>
                                    );

                                //const isEquippedToAll = e.count === unit.size;
                                const name = e.count > 1 ? pluralise.plural(e.name) : e.name;

                                const multiplier = e.count / unit.size; // 20 / 10 = "2x Weapons...""
                                const displayCount = e.count > unit.size // 20 hand weapons, unit of 10
                                    ? e.originalCount
                                        ? (e.count / e.originalCount)
                                        : unit.size
                                    : e.count;

                                const isPart = e.type === "weaponPart";
                                const borderStyle = {
                                    borderBottom: "none",
                                    borderTop: isPart ? "none" : "1px solid rgb(224, 224, 224)"
                                };

                                return (
                                    <TableRow key={i} >
                                        <TableCell style={{ ...borderStyle, fontWeight: 600 }}>
                                            {displayCount > 1 ? `[${displayCount}] ` : " "}{multiplier > 1 ? `${multiplier}x ` : ""}{isPart ? `- ${name}` : name}
                                        </TableCell>
                                        <TableCell style={borderStyle}>{e.range ? e.range + '"' : '-'}</TableCell>
                                        <TableCell style={borderStyle}>{e.attacks ? "A" + e.attacks : '-'}</TableCell>
                                        <TableCell style={borderStyle}>{EquipmentService.getAP(e) || '-'}</TableCell>
                                        <TableCell style={borderStyle}>
                                            {(() => {
                                                const rules = e.specialRules?.filter(r => !/^AP/.test(r));
                                                return rules && rules.length > 0 ? <RuleList specialRules={rules} /> : <span>-</span>;
                                            })()}
                                        </TableCell>
                                    </TableRow>
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
                            unit.selectedEquipment.filter(e => !isWeapon(e) && e.count).map((e, i) => {
                                const isEquippedToAll = e.count === unit.size;

                                return (
                                    <TableRow key={i}>
                                        <TableCell>{e.count > 1 && isEquippedToAll ? '' : `${e.count}x`} {e.count > 1 && !isEquippedToAll ? pluralise.plural(e.name) : e.name}</TableCell>
                                        <TableCell>{e.specialRules?.filter(r => !/^AP/.test(r)).join(", ") || '-'}</TableCell>
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
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ISelectedUnit } from '../data/interfaces';
import EquipmentService from '../services/EquipmentService';
import pluralise from "pluralize";

export default function UnitEquipmentTable({ unit }: { unit: ISelectedUnit }) {

    const hasEquipment = unit.selectedEquipment.filter(e => !e.attacks).length > 0;
    const hasWeapons = unit.selectedEquipment.filter(e => e.attacks).length > 0;

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
                            unit.selectedEquipment.filter(e => e.attacks && e.count).map((e, i) => {
                                const isEquippedToAll = e.count === unit.size;

                                return (
                                    <TableRow key={i}>
                                        <TableCell>{e.count > 1 && isEquippedToAll ? '' : `${e.count}x`} {e.count > 1 && !isEquippedToAll ? pluralise.plural(e.name) : e.name}</TableCell>
                                        <TableCell>{e.range ? e.range + '"' : '-'}</TableCell>
                                        <TableCell>{e.attacks ? "A" + e.attacks : '-'}</TableCell>
                                        <TableCell>{EquipmentService.getAP(e) || '-'}</TableCell>
                                        <TableCell>{e.specialRules?.filter(r => !/^AP/.test(r)).join(", ") || '-'}</TableCell>
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
                            unit.selectedEquipment.filter(e => !e.attacks && e.count).map((e, i) => {
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
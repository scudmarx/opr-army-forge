import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ISelectedUnit } from '../data/interfaces';
import EquipmentService from '../services/EquipmentService';

export default function UnitEquipmentTable({ unit }: { unit: ISelectedUnit }) {
    return (
        <TableContainer component={Paper} className="mb-4">
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Equipment</TableCell>
                        <TableCell>RNG</TableCell>
                        <TableCell>ATK</TableCell>
                        <TableCell>AP</TableCell>
                        <TableCell>SPE</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        unit.selectedEquipment.filter(e => e.count).map(e => (
                            <TableRow>
                                <TableCell>{e.count}x {e.name}</TableCell>
                                <TableCell>{e.range ? e.range + '"' : ''}</TableCell>
                                <TableCell>{e.attacks ? "A" + e.attacks : ''}</TableCell>
                                <TableCell>{EquipmentService.getAP(e)}</TableCell>
                                <TableCell>{e.specialRules?.filter(r => !/^AP/.test(r)).join(", ")}</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </TableContainer>
    );
}
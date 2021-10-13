import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../data/store';

export default function SpellsTable() {

  const army = useSelector((state: RootState) => state.army.data);
  const spells = army.spells;

  const cellStyle = { paddingLeft: "8px", paddingRight: "8px", borderBottom: "none" };
  const headerStyle = { ...cellStyle, fontWeight: 600 };

  return (
    <TableContainer component={Paper} elevation={0} style={{ border: "1px solid rgba(0,0,0,.12)" }}>
      <Table size="small">
        <TableHead>
          <TableRow style={{ backgroundColor: "#EBEBEB", fontWeight: 600 }}>
            <TableCell style={headerStyle}>Spell</TableCell>
            <TableCell style={headerStyle}>Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            spells.map(spell => (
              <TableRow key={spell.name}>
                <TableCell style={headerStyle}>{spell.name} ({spell.threshold}+)</TableCell>
                <TableCell style={cellStyle}>{spell.effect}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}
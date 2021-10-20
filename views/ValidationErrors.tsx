import { List, ListItem, ListItemText } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../data/store";
import _ from "lodash";

export default function ValidationErrors() {

  const list = useSelector((state: RootState) => state.list);

  const unitCount = list.units.filter(u => !u.joinToUnit).length;
  const heroCount = list.units.filter(u => u.specialRules.findIndex(rule => rule.name === "Hero") >= 0).length;

  //return null;

  return (
    <>
      <List>
        {list.pointsLimit>0 && list.points > list.pointsLimit && <ListItem>
          <ListItemText>Points limit exceeded: {list.points}/{list.pointsLimit}</ListItemText>
        </ListItem>}
        {heroCount > Math.floor(list.points / 500) && <ListItem>
          <ListItemText>Max 1 hero per full 500pts.</ListItemText>
        </ListItem>}
        {unitCount > Math.floor(list.points / 200) && <ListItem>
          <ListItemText>Max 1 unit per full 200pts (combined units count as just 1 unit).</ListItemText>
        </ListItem>}
        {list.units.filter(u => u.combined && u.size === 2).length > 0 && <ListItem>
          <ListItemText>Cannot combine units of unit size [1].</ListItemText>
        </ListItem>}
        {Object.values(_.groupBy(list.units, u => u.name)).filter((grp: any[]) => grp.length > 3).length > 0 && <ListItem>
          <ListItemText>Cannot have more than 3 copies of a particular unit.</ListItemText>
        </ListItem>}
      </List>
    </>
  );
}
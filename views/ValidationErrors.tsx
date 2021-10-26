import { List, ListItem, ListItemText, Dialog, DialogTitle } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../data/store";
import _ from "lodash";
import ValidationService from "../services/ValidationService";

export default function ValidationErrors({ open, setOpen }) {

  const army = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);

  const errors = ValidationService.getErrors(army, list);

  return (
    <Dialog onClose={() => setOpen(false)} open={open}>
      <DialogTitle>Validation Errors</DialogTitle>
      <List>
        {errors.map((error, index) => (
          <ListItem key={index}>
            <ListItemText>{error}</ListItemText>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
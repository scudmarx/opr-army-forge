import { Snackbar, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from "react-redux";
import { undoRemoveUnit } from "../../data/listSlice";
import { RootState } from "../../data/store";


export default function UndoRemoveUnit({ open, setOpen }) {

  const unit = useSelector((state: RootState) => state.list.undoUnitRemove?.at(0));
  if (!unit) setOpen(false)

  const dispatch = useDispatch();

  const handleUndo = () => {
    dispatch(undoRemoveUnit());
    setOpen(false);
  };

  const action = (
    <>
      <Button color="primary" size="small" onClick={handleUndo}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => setOpen(false)}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <Snackbar
      message={`${unit?.customName ?? unit?.name} has been removed`}
      autoHideDuration={4000}
      action={action}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}
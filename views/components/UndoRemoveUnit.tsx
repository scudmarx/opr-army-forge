import { Snackbar, Button, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch } from "react-redux";
import { undoRemoveUnit } from "../../data/listSlice";


export default function UndoRemoveUnit({ open, setOpen }) {

  const dispatch = useDispatch();

  const handleUndo = () => {
    dispatch(undoRemoveUnit());
    setOpen(false);
  };

  const action = (
    <>
      <Button color="secondary" size="small" onClick={handleUndo}>
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
      message="Unit removed"
      autoHideDuration={4000}
      action={action}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={open}
      onClose={() => setOpen(false)}
    />
  );
}
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Popper, Paper, List, ListItem, ListItemText, ClickAwayListener, Fade, Snackbar, bottomNavigationActionClasses } from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../data/store";
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import PersistenceService from "../../services/PersistenceService";
import { updateCreationTime } from "../../data/listSlice";
import ValidationErrors from "../ValidationErrors";
import ValidationService from "../../services/ValidationService";
import { useMediaQuery } from "react-responsive";

export default function MainMenu({ setListConfigurationOpen, setValidationOpen }) {

  const army = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);
  const dispatch = useDispatch();
  const router = useRouter();
  const [menuAnchorElement, setMenuAnchorElement] = useState(null);
  const [validationAnchorElement, setValidationAnchorElement] = useState(null);
  const [showTextCopiedAlert, setShowTextCopiedAlert] = useState(false);
  const errors = ValidationService.getErrors(army, list);

  const handleLoad = () => {
    router.push("/load");
  };

  const handleSave = () => {
    const creationTime = PersistenceService.createSave(army, list.name, list);
    dispatch(updateCreationTime(creationTime));
    return creationTime;
  };

  const handleShare = () => {
    if (!list.creationTime) {
      const creationTime = handleSave();
      PersistenceService.download({
        ...list,
        creationTime
      });
    } else {
      PersistenceService.download(list);
    }
  };

  const handleTextExport = () => {
    PersistenceService.copyAsText(list);
    setShowTextCopiedAlert(true);
  };

  const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <>
      <AppBar elevation={0} style={{ position: "sticky", top: 0, zIndex: 1 }}>
        <Toolbar className="p-0">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => router.back()}
            style={{ marginLeft: "0" }}
          >
            <BackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {list.name}
          </Typography>
          {errors.length > 0 && <>
            <IconButton
              size="large"
              color="inherit"
              title="Validation warnings"
              style={{ backgroundColor: Boolean(validationAnchorElement) ? "#6EAAE7" : null }}
              onClick={e => setValidationAnchorElement(e.currentTarget)}
              className="mr-2 p-2"
            >
              <NotificationImportantIcon />
            </IconButton>
            <Popper
              placement="bottom-end"
              anchorEl={validationAnchorElement}
              open={Boolean(validationAnchorElement) && isBigScreen}
            // onClose={_ => setValidationAnchorElement(null)}
            >
              <ClickAwayListener onClickAway={_ => setValidationAnchorElement(null)}>
                <Paper>
                  <List>
                    <ListItem divider>
                      <ListItemText>
                        <span style={{ fontWeight: 600 }}>Competitive List Validation</span>
                      </ListItemText>
                    </ListItem>
                    {errors.map((error, index) => (
                      <ListItem key={index} className="mx-4 px-0" style={{ width: "auto" }} divider={index < errors.length - 1}>
                        <ListItemText>{error}</ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </ClickAwayListener>
            </Popper>
          </>}
          {isBigScreen && <IconButton
            size="large"
            color="inherit"
            aria-label="menu"
            title="View list"
            onClick={() => router.push("/view")}
            className="mr-2"
          >
            <VisibilityIcon />
          </IconButton>}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={e => setMenuAnchorElement(e.currentTarget)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={menuAnchorElement}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(menuAnchorElement)}
            onClose={_ => setMenuAnchorElement(null)}
          >
            <MenuItem onClick={() => setListConfigurationOpen(true)}>Edit Details</MenuItem>
            <MenuItem onClick={() => router.push("/view")}>View</MenuItem>
            {!list.creationTime && <MenuItem onClick={handleSave}>Save</MenuItem>}
            <MenuItem onClick={handleShare}>Export as Army Forge File</MenuItem>
            <MenuItem onClick={handleTextExport}>Export as Text</MenuItem>
            <MenuItem onClick={handleLoad}>Load</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <ValidationErrors open={Boolean(validationAnchorElement) && !isBigScreen} setOpen={setValidationAnchorElement} />
      <Snackbar
        open={showTextCopiedAlert}
        onClose={() => setShowTextCopiedAlert(false)}
        message="Army list copied to your clipboard."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={4000} />
    </>
  );
}
import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../data/store";
import UpgradeService from "../../services/UpgradeService";
import PersistenceService from "../../services/PersistenceService";

export default function MainMenu({ setListConfigurationOpen }) {

  const army = useSelector((state: RootState) => state.army);
  const list = useSelector((state: RootState) => state.list);
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoad = () => {
    router.push("/load");
  };

  const handleShare = () => {
    PersistenceService.download(list.name);
  }

  const points = UpgradeService.calculateListTotal(list.units);

  return (
    <AppBar elevation={0} style={{ position: "sticky", top: 0, zIndex: 1 }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={() => router.back()}
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {list.name} • {points}pts
        </Typography>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => router.push("/view")}
          className="mr-4"
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleMenu}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={() => setListConfigurationOpen(true)}>Edit</MenuItem>
          <MenuItem onClick={() => router.push("/view")}>View</MenuItem>
          <MenuItem onClick={handleShare}>Export/Share</MenuItem>
          <MenuItem onClick={handleLoad}>Load</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
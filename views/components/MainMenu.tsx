import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../data/store";
import { loadSavedList } from "../../data/listSlice";
import UpgradeService from "../../services/UpgradeService";

export default function MainMenu() {

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

    const handleSave = () => {
        const unitsJson = JSON.stringify(list.units);
        const saveName = prompt("Saved list name:");
        localStorage["AF_Save_" + saveName] = unitsJson;
    };

    const handleLoad = () => {
        const loadName = prompt("Load list name:");
        const units = JSON.parse(localStorage["AF_Save_" + loadName]);
        dispatch(loadSavedList(units));
    };

    const points = UpgradeService.calculateListTotal(list.units);

    return (
        <AppBar position="static" elevation={0}>
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
                    My List • {points}pts
                </Typography>
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
                    <MenuItem onClick={() => router.push("/cards")}>View Cards</MenuItem>
                    <MenuItem onClick={handleSave}>Save List</MenuItem>
                    <MenuItem onClick={handleLoad}>Load List</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}
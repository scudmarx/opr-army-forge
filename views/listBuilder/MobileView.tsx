import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../data/store'
import { UnitSelection } from "../UnitSelection";
import { MainList } from "../MainList";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-spring-bottom-sheet/dist/style.css';
import { Upgrades } from "../upgrades/Upgrades";
import { BottomSheet } from "react-spring-bottom-sheet";
import { AppBar, Paper, Tab, Tabs, Toolbar, Typography, IconButton, TextField, Menu, MenuItem, Button } from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpgradeService from "../../services/UpgradeService";
import { renameUnit, selectUnit } from "../../data/listSlice";
import { useRouter } from "next/router";
import UpgradePanelHeader from "../components/UpgradePanelHeader";
import Add from "@mui/icons-material/Add";

export default function MobileView() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army);

    const dispatch = useDispatch();
    const router = useRouter();

    const [slider, setSlider] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);

    // Open bottom sheet when unit is selected
    const onUnitSelected = () => {
        setSheetOpen(true);
    };

    // Reset selected unit when sheet is closed
    function onDismissSheet() {
        setSheetOpen(false);
        dispatch(selectUnit(null));
    }

    // Keep Tab bar and carousel in sync
    const handleSlideChange = (event, newValue) => {
        setSlideIndex(newValue);
        slider.slickGoTo(newValue);
    };

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    // Slick carousel settings
    const sliderSettings = {
        dots: false,
        slidesToShow: 1,
        infinite: false,
        arrows: false,
        initialSlide: 1,
        beforeChange: (current, next) => handleSlideChange(null, next)
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <>
            <Paper elevation={2} color="primary" square>
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
                            My List • 100pts
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
                        </Menu>
                    </Toolbar>
                </AppBar>
                <AppBar elevation={0} position="static" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <Tabs value={slideIndex} onChange={handleSlideChange} centered variant="fullWidth" textColor="inherit" indicatorColor="secondary">
                        <Tab label={`${army?.data?.name} v${army?.data?.version}`} />
                        <Tab label={`My List - ${UpgradeService.calculateListTotal(list.units)}pts`} />
                    </Tabs>
                </AppBar>
            </Paper>

            <Slider {...sliderSettings} ref={slider => setSlider(slider)} style={{ maxHeight: "100%" }}>
                <div>
                    <UnitSelection onSelected={() => { }} />
                </div>
                <div className="mt-4">
                    {list.units.length > 0 ? <MainList onSelected={onUnitSelected} /> : (
                        <div className="p-4 has-text-centered">
                            <h3 className="is-size-3 mb-4">Your list is empty</h3>
                            <Button variant="outlined" onClick={() => handleSlideChange(null, 0)}>
                                <Add /> Add Units
                            </Button>
                        </div>
                    )}
                </div>
            </Slider>

            <BottomSheet
                open={sheetOpen}
                onDismiss={onDismissSheet}
                initialFocusRef={false}
                defaultSnap={({ snapPoints, lastSnap }) =>
                    lastSnap ?? Math.min(...snapPoints)
                }
                snapPoints={({ minHeight, maxHeight }) => [
                    minHeight,
                    maxHeight * 0.9
                ]}
                header={
                    <UpgradePanelHeader selectedUnit={selectedUnit} />
                }>
                <Upgrades />
            </BottomSheet>
        </>
    );
}

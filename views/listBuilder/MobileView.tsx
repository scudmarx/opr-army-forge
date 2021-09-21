import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../data/store'
import { UnitSelection } from "../UnitSelection";
import { MainList } from "../MainList";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Upgrades } from "../upgrades/Upgrades";
import { BottomSheet } from "react-spring-bottom-sheet";
import 'react-spring-bottom-sheet/dist/style.css';
import { AppBar, Paper, Tab, Tabs, Toolbar, Typography, IconButton, TextField } from "@mui/material";
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import UpgradeService from "../../services/UpgradeService";
import { renameUnit, selectUnit } from "../../data/listSlice";

export default function MobileView() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army);

    const dispatch = useDispatch();

    const [slider, setSlider] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);

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
        beforeChange: (current, next) => handleSlideChange(null, next)
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
                            sx={{ mr: 2 }}
                        >
                            <MoreVertIcon />
                        </IconButton>
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
                    <MainList onSelected={onUnitSelected} />
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
                    selectedUnit && <div className="is-flex is-align-items-center">
                        {/* <h3 className="is-size-4 is-flex-grow-1 has-text-left">{selectedUnit.name} {selectedUnit.size > 1 ? `[${selectedUnit.size}]` : ''}</h3> */}
                        <TextField
                            variant="standard"
                            className="is-flex-grow-1"
                            value={selectedUnit.customName || selectedUnit.name}
                            onChange={e => dispatch(renameUnit({ unitId: selectedUnit.selectionId, name: e.target.value }))}
                        />
                        <p className="ml-4">{UpgradeService.calculateUnitTotal(selectedUnit)}pts</p>
                    </div>
                }>
                <Upgrades />
            </BottomSheet>
        </>
    );
}

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
import { AppBar, Paper, Tab, Tabs, Button } from "@mui/material";
import UpgradeService from "../../services/UpgradeService";
import { selectUnit } from "../../data/listSlice";
import UpgradePanelHeader from "../components/UpgradePanelHeader";
import Add from "@mui/icons-material/Add";
import MainMenu from "../components/MainMenu";

export default function MobileView() {

  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army);

  const dispatch = useDispatch();

  const [slider, setSlider] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);


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

  return (
    <>
      <Paper elevation={1} color="primary" square style={{ position: "sticky", top: 0, zIndex: 1 }}>
        <MainMenu />
        <AppBar elevation={0} style={{ position: "sticky", top: 0, zIndex: 1 }}>
          <Tabs value={slideIndex} onChange={handleSlideChange} centered variant="fullWidth" textColor="inherit" indicatorColor="primary">
            <Tab label={`${army?.data?.name} v${army?.data?.version}`} />
            <Tab label={`${list.name} - ${UpgradeService.calculateListTotal(list.units)}pts`} />
          </Tabs>
        </AppBar>
      </Paper>

      <Slider {...sliderSettings} ref={slider => setSlider(slider)} style={{ maxHeight: "100%" }}>
        <div>
          <UnitSelection onSelected={() => { }} />
        </div>
        <div className="">
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
        expandOnContentDrag={true}
        onScrollCapture={(e) => e.preventDefault()}
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

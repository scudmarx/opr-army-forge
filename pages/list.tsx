import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { load } from '../data/armySlice'
import { UnitSelection } from "../views/UnitSelection";
import { MainList } from "../views/MainList";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Upgrades } from "../views/Upgrades";
import { useRouter } from "next/router";
import { BottomSheet } from "react-spring-bottom-sheet";
import 'react-spring-bottom-sheet/dist/style.css';
import { AppBar, Box, Tab, Tabs, Typography } from "@material-ui/core";
import SwipeableViews from 'react-swipeable-views';
import { useMediaQuery } from 'react-responsive';
import UpgradeService from "../services/UpgradeService";

export default function List() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army);

    const router = useRouter();
    const dispatch = useDispatch();
    const [slider, setSlider] = useState(null);

    const [open, setOpen] = useState(false);
    function onDismiss() {
        setOpen(false)
    }

    useEffect(() => {
        if (!army.armyFile) {
            router.push("/", null, { shallow: true });
            return;
        }

        // TODO: Test only, add army selection
        fetch(army.armyFile)
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                dispatch(load(data));
            });
    }, []);

    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' });

    const onUnitSelected = () => {
        setOpen(true);
    }

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    const desktopLayout = (
        <div className="columns">
            <div className="column">
                <UnitSelection onSelected={() => { }} />
            </div>
            <div className="column">
                <MainList onSelected={onUnitSelected} />
            </div>
            <div className="column">
                <Upgrades />
            </div>
        </div>
    );

    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
        slider.slickGoTo(newValue);
    };

    const totalPointCost = list
        .units
        .reduce((value, current) => value + UpgradeService.calculateUnitTotal(current), 0);

    const sliderSettings = {
        dots: false,
        slidesToShow: 1,
        infinite: false,
        arrows: false,
        beforeChange: (current, next) => handleChange(null, next)
        //afterChange: index => handleChange(null, index)
    };

    const mobileLayout = (
        <>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} centered variant="fullWidth">
                    <Tab label="Army List" />
                    <Tab label={`My List ${totalPointCost}pts`} />
                </Tabs>
            </AppBar>

            <Slider {...sliderSettings} ref={slider => setSlider(slider)} style={{ maxHeight: "100%" }}>
                <div>
                    <UnitSelection onSelected={() => { }} />
                </div>
                <div className="px-4">
                    <MainList onSelected={onUnitSelected} />
                </div>
            </Slider>

            <BottomSheet
                open={open}
                onDismiss={onDismiss}
                defaultSnap={({ snapPoints, lastSnap }) =>
                    lastSnap ?? Math.min(...snapPoints)
                }
                snapPoints={({ minHeight, maxHeight }) => [
                    minHeight,
                    maxHeight * 0.9
                ]}
                header={
                    <h3 className="is-size-4">{selectedUnit ? selectedUnit.name : null} Upgrades</h3>
                }>
                <div className="m-2">
                    <Upgrades />
                    <button onClick={onDismiss}>Dismiss</button>
                </div>
            </BottomSheet>
        </>
    );

    return (
        <>
            <Head>
                <title>OPR Army Forge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {isBigScreen ? desktopLayout : mobileLayout}
            {/*  */}
            {/* <div className="columns" style={{ minHeight: "100vh" }}>
        {army && (
          <div className="column is-one-quarter">
            <ArmyList />
          </div>
        )}
        <div className="column">
          <MainList />
        </div>
      </div> */}
        </>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

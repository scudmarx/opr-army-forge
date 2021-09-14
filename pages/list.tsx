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

    const settings = {
        dots: true,
        slidesToShow: 3,
        infinite: false,
        arrows: false,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    const selectedUnit = list.selectedUnitId === null || list.selectedUnitId === undefined
        ? null
        : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];

    return (
        <>
            <Head>
                <title>OPR Army Forge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Slider {...settings} ref={slider => setSlider(slider)} style={{ maxHeight: "100%" }}>
                <div>
                    <UnitSelection onSelected={() => slider.slickGoTo(1)} />
                </div>
                <div>
                    <MainList onSelected={() => setOpen(true)} />
                </div>
                <div>
                    <Upgrades />
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

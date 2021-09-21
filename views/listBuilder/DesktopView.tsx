import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store';
import { UnitSelection } from "../UnitSelection";
import { MainList } from "../MainList";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Upgrades } from "../upgrades/Upgrades";
import 'react-spring-bottom-sheet/dist/style.css';
import UpgradeService from "../../services/UpgradeService";

export default function DesktopView() {

    const list = useSelector((state: RootState) => state.list);

    return (
        <div className="columns">
            <div className="column">
                <UnitSelection onSelected={() => { }} />
            </div>
            <div className="column">
                <h3 className="mt-4 is-size-4 is-hidden-mobile mb-4">{`My List - ${UpgradeService.calculateListTotal(list.units)}pts`}</h3>
                <MainList onSelected={() => { }} />
            </div>
            <div className="column">
                <Upgrades />
            </div>
        </div>
    );
}

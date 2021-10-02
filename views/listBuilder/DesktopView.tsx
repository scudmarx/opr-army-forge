import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store';
import { UnitSelection } from "../UnitSelection";
import { MainList } from "../MainList";
import { Upgrades } from "../upgrades/Upgrades";
import UpgradeService from "../../services/UpgradeService";
import MainMenu from "../components/MainMenu";
import { Paper } from "@mui/material";

export default function DesktopView() {

    const list = useSelector((state: RootState) => state.list);

    return (
        <>
            <Paper elevation={1} color="primary" square>
                <MainMenu />
            </Paper>
            <div className="columns">
                <div className="column">
                    <UnitSelection onSelected={() => { }} />
                </div>
                <div className="column">
                    <h3 className="m-4 is-size-4 is-hidden-mobile">{`My List - ${UpgradeService.calculateListTotal(list.units)}pts`}</h3>
                    <MainList onSelected={() => { }} />
                </div>
                <div className="column">
                    <Upgrades />
                </div>
            </div>
        </>
    );
}

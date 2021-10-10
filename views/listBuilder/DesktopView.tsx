import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store';
import { UnitSelection } from "../UnitSelection";
import { MainList } from "../MainList";
import { Upgrades } from "../upgrades/Upgrades";
import UpgradeService from "../../services/UpgradeService";
import MainMenu from "../components/MainMenu";
import { Paper } from "@mui/material";
import UpgradePanelHeader from "../components/UpgradePanelHeader";

export default function DesktopView() {

  const list = useSelector((state: RootState) => state.list);
  const columnStyle: any = { overflowY: "scroll", maxHeight: "100%" };
  return (
    <>
      <Paper elevation={1} color="primary" square>
        <MainMenu />
      </Paper>
      <div className="columns my-0" style={{ height: "calc(100vh - 64px)" }}>
        <div className="column py-0" style={columnStyle}>
          <UnitSelection onSelected={() => { }} />
        </div>
        <div className="column py-0" style={columnStyle}>
          <h3 className="m-4 is-size-4 is-hidden-mobile">{`My List - ${UpgradeService.calculateListTotal(list.units)}pts`}</h3>
          <MainList onSelected={() => { }} />
        </div>
        <div className="column py-0 px-0" style={columnStyle}>
          <div className="px-4 pt-4">
            <UpgradePanelHeader />
          </div>
          <Upgrades />
        </div>
      </div>
    </>
  );
}

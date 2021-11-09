import React, { useState } from "react";
import { useSelector } from 'react-redux';
import { RootState } from '../../data/store';
import { UnitSelection } from "../UnitSelection";
import { MainList } from "../MainList";
import { Upgrades } from "../upgrades/Upgrades";
import MainMenu from "../components/MainMenu";
import { Paper } from "@mui/material";
import UpgradePanelHeader from "../components/UpgradePanelHeader";
import ListConfigurationDialog from "../ListConfigurationDialog";
import ValidationErrors from "../ValidationErrors";
import UndoRemoveUnit from "../components/UndoRemoveUnit";

export default function DesktopView() {

  const list = useSelector((state: RootState) => state.list);
  const [editListOpen, setEditListOpen] = useState(false);
  const [validationOpen, setValidationOpen] = useState(false);
  const [showUndoRemove, setShowUndoRemove] = useState(false);

  const columnStyle: any = { display:"flex", flexDirection: "column", overflowY: "hidden", width: "calc(100% / 3)"};
  //const stickyHeader: any = { position: "sticky", top: 0, backgroundColor: "#FAFAFA", zIndex: 10 };

  return (
    <>
    <MainMenu setListConfigurationOpen={setEditListOpen} setValidationOpen={setValidationOpen} />
    <div className="container" style={{overflow: "clip", maxHeight: "100vh", maxWidth: "100vw"}}>
      <div className="columns my-0" style={{ flex: "1 0 auto", maxHeight: "calc(100vh - 64px)" }}>
        <div className="column py-0 pr-0" style={columnStyle}>
          <UnitSelection onAdded={() => { }} />
        </div>
        <div className="column p-0" style={columnStyle}>
          <MainList onSelected={() => { }} onUnitRemoved={() => setShowUndoRemove(true)} scrollOnAdd />
        </div>
        <div className="column py-0 px-0 mr-4" style={columnStyle}>
          <UpgradePanelHeader />
          <Upgrades />
        </div>
      </div>
      <ValidationErrors
        open={validationOpen}
        setOpen={setValidationOpen} />
      <ListConfigurationDialog
        isEdit={true}
        open={editListOpen}
        setOpen={setEditListOpen}
        customArmies={null} />
      <UndoRemoveUnit
        open={showUndoRemove}
        setOpen={setShowUndoRemove} />
    </div>
    </>
  );
}

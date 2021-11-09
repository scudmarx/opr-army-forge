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

  const columnStyle: any = { overflowY: "scroll", maxHeight: "100%" };

  const setShadow = (header, scroller) => () => {
    (document.getElementById(header).style.boxShadow = document.getElementById(scroller).scrollTop ? "0px 3px 5px 0px lightgrey" : "")
  }

  return (
    <>
      <Paper elevation={1} color="primary" square>
        <MainMenu setListConfigurationOpen={setEditListOpen} setValidationOpen={setValidationOpen} />
      </Paper>
      <div className="columns my-0" style={{ height: "calc(100vh - 64px)" }}>
        <div id="ColumnOne" className="column py-0 pr-0" style={columnStyle} onScroll={setShadow("UnitSelectionHeader", "ColumnOne")}>
          <UnitSelection onSelected={() => { }} />
        </div>
        <div id="ColumnTwo" className="column p-0" style={columnStyle} onScroll={setShadow("MainListHeader", "ColumnTwo")}>
          <MainList onSelected={() => { }} onUnitRemoved={() => setShowUndoRemove(true)} />
        </div>
        <div className="column py-0 px-0 mr-4" style={columnStyle}>
          <Paper square className="px-4 pt-4">
            <UpgradePanelHeader />
          </Paper>
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
    </>
  );
}

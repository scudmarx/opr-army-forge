import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { load, setArmyFile } from '../data/armySlice'
import { useRouter } from 'next/router';
import { Card, AppBar, IconButton, Paper, Toolbar, Typography, CircularProgress } from '@mui/material';
import BackIcon from '@mui/icons-material/ArrowBackIosNew';
import RightIcon from "@mui/icons-material/KeyboardArrowRight";
import WarningIcon from "@mui/icons-material/Warning";
import { dataToolVersion } from "./data";
import { resetList } from "../data/listSlice";
import ListConfigurationDialog from "../views/ListConfigurationDialog";
import ArmyImage from "../views/components/ArmyImage";
import DataService from "../services/DataService";

const isLive = window.location.host === "opr-army-forge.vercel.app";

export default function Files() {

  const army = useSelector((state: RootState) => state.army);
  const [armyFiles, setArmyFiles] = useState(null);
  const [customArmies, setCustomArmies] = useState(null);
  const [driveArmies, setDriveArmies] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [newArmyDialogOpen, setNewArmyDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const useStaging: boolean = false;
  //const webCompanionUrl = `https://opr-list-builder${useStaging ? "-staging" : ""}.herokuapp.com/api`;
  const webCompanionUrl = 'https://opr-list-bui-feature-po-r8wmtp.herokuapp.com/api';

  useEffect(() => {

    // Redirect to game selection screen if no army selected
    if (!army.gameSystem) {
      router.push("/", null, { shallow: true });
      return;
    }

    // Clear any existing units?
    dispatch(resetList());

    // List of "official" armies from AF
    fetch("definitions/army-files.json")
      .then((res) => res.json())
      .then((data) => {
        setArmyFiles(data);
      });

    const driveIds = {
      aof: "15XasmVSfFCASeLysRlyjXdx6qA3WKLlf",
      gf: "1-wSo6Rvi-M5qAcZy-7aQD_kNBynIqWT9",
      aofs: "1U1TmXXe7NG1VX0SV57nCjNGFMOgJzcSO",
      gff: "1gXXoQ2Gj5Xz7OjBHMQ_VfsyonUe2Z1wn"
    };

    fetch("https://www.googleapis.com/drive/v3/files?q='" + driveIds[army.gameSystem] + "'%20in%20parents&key=AIzaSyDsl1Ux-3orA02dV2Mrw4v-Xv0phHUtfnU")
      .then((res) => res.json())
      .then((res) => {
        // No error handling? fingers crossed
        setDriveArmies(res.files.map(f => {
          const name = f.name.substring(f.name.indexOf("-") + 1).trim();
          const match = /(.+)\sv(\d+\.\d+)/.exec(name);
          return {
            name: match[1],
            version: match[2]
          };
        }));
      });

    // AF to Web Companion game type mapping
    const slug = (() => {
      switch (army.gameSystem) {
        case "gf": return "grimdark-future";
        case "gff": return "grimdark-future-firefight";
        case "aof": return "age-of-fantasy";
        case "aofs": return "age-of-fantasy-skirmish";
      }
    })();

    // Load custom data books from Web Companion
    fetch(webCompanionUrl + "/army-books?gameSystemSlug=" + slug)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const valid = data
          .filter(a => a.unitCount > 2)
        //.filter(a => useStaging || a.username === "Darguth" || a.username === "adam");

        setCustomArmies(valid);
      });
  }, []);

  const selectArmy = (filePath: string) => {
    // TODO: Clear existing data

    // Set army file
    dispatch(setArmyFile(filePath));

    // Load army data
    DataService.getJsonData(filePath, data => {
      dispatch(load(data));
      setNewArmyDialogOpen(true);
    });
  };

  const selectCustomList = (customArmy: any) => {

    DataService.getApiData(customArmy.uid, afData => {

      dispatch(load(afData));

      setNewArmyDialogOpen(true);
    });
  };

  const armies = armyFiles?.filter(grp => grp.key === army.gameSystem)[0].items;

  const isActiveArmy = (army) => !isLive || ["Alien Hives", "Battle Brothers", "Robot Legions"].some(a => a === army.name);
  const officialArmies = customArmies?.filter(ca => ca.official);
  const officialActiveArmies = officialArmies?.filter(ca => isActiveArmy(ca));
  const officialInactiveArmies = officialArmies?.filter(ca => !isActiveArmy(ca));

  const gfSection = (armies, enabled) => armies.map((army, index) => <Tile
    key={index}
    army={army}
    enabled={enabled}
    driveArmy={null}
    onSelect={army => selectCustomList(army)} />);

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
              Create new list
            </Typography>
          </Toolbar>
        </AppBar>
      </Paper>
      <div className="container">
        <div className="mx-auto p-4">
          <h3 className="is-size-4 has-text-centered mb-4 pt-4">Choose your army</h3>
          {
            army.gameSystem === "gf" && (
              <>
                {!officialArmies && <div className="column is-flex is-flex-direction-column is-align-items-center	">
                  <CircularProgress />
                  <p>Loading armies...</p>
                </div>}
                {officialArmies && <>
                  <div className="columns is-mobile is-multiline">
                    {gfSection(officialActiveArmies, true)}
                  </div>
                  <h3 className="is-size-4 has-text-centered mb-4 pt-4">Coming Soon...</h3>
                  <div className="columns is-mobile is-multiline">
                    {gfSection(officialInactiveArmies, false)}
                  </div>
                </>}
              </>
            )
          }
          <div className="columns is-mobile is-multiline">
            {
              army.gameSystem === "gf" || !armyFiles ? null : armies.map((file, index) => {
                const driveArmy = driveArmies && driveArmies.filter(army => file.name.toUpperCase() === army?.name?.toUpperCase())[0];

                return (
                  <Tile
                    key={index}
                    army={file}
                    enabled={true}
                    driveArmy={driveArmy}
                    onSelect={army => selectArmy(army.path)} />
                );
              })
            }
          </div>
          {!isLive && (customArmies ? (
            <>
              <h3>Custom Armies</h3>
              <div className="columns is-multiline">
                {customArmies.filter(a => a.official === false).map((customArmy, i) => (
                  <div key={i} className="column is-half">
                    <Card
                      elevation={1}
                      className="interactable"
                      style={{
                        backgroundColor: customArmy.official ? "#F9FDFF" : null,
                        borderLeft: customArmy.official ? "2px solid #0F71B4" : null,
                      }}
                      onClick={(e) => { e.stopPropagation(); selectCustomList(customArmy); }}>
                      <div className="is-flex is-flex-grow-1 is-align-items-center p-4">
                        <div className="is-flex-grow-1">
                          <p className="mb-1" style={{ fontWeight: 600 }}>{customArmy.name}</p>
                          <div className="is-flex" style={{ fontSize: "14px", color: "#666" }}>
                            {customArmy.versionString} by {customArmy.username}
                          </div>
                        </div>
                        {/* <p className="mr-2">{u.cost}pts</p> */}
                        <IconButton color="primary">
                          <RightIcon />
                        </IconButton>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="is-flex is-flex-direction-column is-align-items-center	">
              <CircularProgress />
              <p>Loading custom armies...</p>
            </div>
          )
          )}
        </div>
      </div>
      <ListConfigurationDialog isEdit={false} open={newArmyDialogOpen} setOpen={setNewArmyDialogOpen} showBetaFlag={army.gameSystem === "gf" && army.data?.uid == null} customArmies={customArmies} />
    </>
  );
}

function Tile({ army, enabled, onSelect, driveArmy }) {


  return (
    <div className="column is-half-mobile is-one-third-tablet" style={{ filter: (enabled ? null : "saturate(0.25)") }}>
      <Card
        elevation={2}
        className={enabled ? "interactable" : null}
        onClick={() => enabled ? onSelect(army) : null}>
        <div className="mt-2 is-flex is-flex-direction-column is-flex-grow-1">
          <ArmyImage name={army.name} />
          <div className="is-flex is-flex-grow-1 is-align-items-center">
            <div className="is-flex-grow-1">
              <p className="my-2" style={{ fontWeight: 600, textAlign: "center", fontSize: "14px" }}>{army.name}</p>
            </div>
            {driveArmy && driveArmy.version > army.version && <div className="mr-4" title="Army file may be out of date"><WarningIcon /></div>}
            {army.dataToolVersion && army.dataToolVersion !== dataToolVersion && <div className="mr-4" title="Data file may be out of date"><WarningIcon /></div>}
          </div>
        </div>
      </Card>
    </div>
  );
}
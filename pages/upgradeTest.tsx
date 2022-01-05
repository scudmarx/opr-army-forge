import { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { loadArmyData, loadChildArmyData, setArmyFile } from '../data/armySlice'
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
import _ from "lodash";
import { FormatAlignRightSharp } from "@mui/icons-material";
import DataParsingService from "../services/DataParsingService";
import UpgradeService from "../services/UpgradeService";

export default function UpgradeTest() {
  const [armies, setArmies] = useState([]);
  const webCompanionUrl = 'https://opr-list-bui-feature-po-r8wmtp.herokuapp.com/api';

  useEffect(() => {

    async function fetchArmy(id) {
      const res = await fetch(webCompanionUrl + `/army-books/${id}`);
      const data = await res.json();
      return data;
    }

    async function fetchArmies() {

      const res = await fetch(webCompanionUrl + "/army-books?gameSystemSlug=grimdark-future");
      const data = await res.json();
      const official = data.filter(army => army.official);
      const apiArmies = [];

      let i = 0;
      for (let army of official) {
        // Temp limiting
        // if (i++ > 5)
        //   break;
        const armyData = await fetchArmy(army.uid);
        apiArmies.push(armyData);
      }

      setArmies(apiArmies);
      console.log("Army List", data);
      console.log("Armies", apiArmies);
    }

    fetchArmies();
    // .then((res) => res.json())
    // .then((data) => {
    //   console.log(data);
    //   const valid = data
    //     .filter(a => a.official);
    //   console.log(valid);
    // });
  }, []);

  if (!armies)
    return;

  const sections = [];

  for (let army of armies) {
    for (let pkg of army.upgradePackages) {
      for (let section of pkg.sections) {
        sections.push(section.label);
      }
    }
  }

  const uniqueSections = _.sortBy(Array.from(new Set(sections)));
  const upgrades = uniqueSections.map(s => ({
    ...DataParsingService.parseUpgradeText(s + ":"),
    label: s
  }))

  return (
    <div className="columns">
      <div className="column">
        {
          armies.map(a => (
            <>
              <h3>{a.name}</h3>
              {a.upgradePackages.map(pkg => (
                <Fragment key={pkg.uid}>
                  <h3>{pkg.uid} {pkg.hint}</h3>
                  {pkg.sections.map((section, index) => (
                    <p key={index}>{section.label}</p>
                  ))}
                </Fragment>
              ))}
            </>
          ))
        }
      </div>
      <div className="column">
        {
          uniqueSections.map((section, index) => (
            <p key={index}>{section}</p>
          ))
        }
      </div>
      <div className="column">
        {
          upgrades.map((u, index) => {
            const { label, ...upgrade } = u;
            const display = upgrade.label
            if (label === display)
              return;
            return (
              <div className="mb-2" key={index}>
                <p>{u.label}</p>
                <p>{display}</p>
                <p>{JSON.stringify(upgrade)}</p>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
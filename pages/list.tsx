import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { useRouter } from "next/router";
import { useMediaQuery } from 'react-responsive';
import MobileView from "../views/listBuilder/MobileView";
import DesktopView from "../views/listBuilder/DesktopView";
import { setGameRules } from "../data/armySlice";

export default function List() {

  const army = useSelector((state: RootState) => state.army);
  const router = useRouter();
  const dispatch = useDispatch();

  const [competitive, setCompetitive] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);

  // Load army list file 
  useEffect(() => {
    // Redirect to game selection screen if no army selected
    if (!army.loaded) {
      router.push({pathname: "gameSystem/", query: router.query}, null, { shallow: true });
      return;
    }

    // AF to Web Companion game type mapping
    const slug = (() => {
      switch (army.gameSystem) {
        case "gf": return "grimdark-future";
        case "gff": return "grimdark-future-firefight";
        case "aof": return "age-of-fantasy";
        case "aofs": return "age-of-fantasy-skirmish";
      }
    })();

    // Load army rules
    fetch(`https://opr-list-builder.herokuapp.com/api/content/game-systems/${slug}/special-rules`)
      .then(res => res.json())
      .then(res => {
        const rules = res.map(rule => ({
          name: rule.name,
          description: rule.description
        }));
        dispatch(setGameRules(rules));
      });
  }, []);

  // Break from mobile to desktop layout at 1024px wide
  const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' });

  return (
    <>
      <Head>
        <title>OPR Army Forge</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {army.loaded ? (isBigScreen ? <DesktopView competitive={competitive} setCompetitive={setCompetitive} /> : <MobileView competitive={competitive} setCompetitive={setCompetitive} />) : null}
    </>
  );
}

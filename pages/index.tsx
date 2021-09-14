import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { load } from '../data/armySlice'
import { ArmyList } from "../views/ArmyList";
import { MainList } from "../views/MainList";

export default function Home() {

  const list = useSelector((state: RootState) => state.list);
  const army = useSelector((state: RootState) => state.army);

  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Test only, add army selection
    fetch("definitions/alien-hives.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        dispatch(load(data));
      });
  }, []);

  return (
    <>
      <Head>
        <title>OPR Army Forge</title>
        <meta name="description" content="OPR Army Forge List Builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="columns" style={{ minHeight: "100vh" }}>
        {army && (
          <div className="column is-one-quarter">
            <ArmyList />
          </div>
        )}
        <div className="column">
          <MainList />
        </div>
      </div>
    </>
  );
}

import Head from "next/head";
import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import { RootState } from '../data/store'
import { useRouter } from "next/router";
import { useMediaQuery } from 'react-responsive';
import style from "../styles/Cards.module.css";
import UnitEquipmentTable from "../views/UnitEquipmentTable";
import { Paper } from "@mui/material";

export default function Cards() {

    const list = useSelector((state: RootState) => state.list);
    const army = useSelector((state: RootState) => state.army);
    const router = useRouter();

    // Load army list file 
    useEffect(() => {
        // Redirect to game selection screen if no army selected
        if (!army.armyFile) {
            router.push("/", null, { shallow: true });
            return;
        }
    }, []);

    // Break from mobile to desktop layout at 1024px wide
    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' });



    return (
        <>
            <Head>
                <title>OPR Army Forge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="columns is-multiline m-4">
                {list.units.map((u, i) => {

                    const equipmentSpecialRules = u
                        .selectedEquipment
                        .filter(e => !e.attacks && e.specialRules?.length) // No weapons, and only equipment with special rules
                        .reduce((value, e) => value.concat(e.specialRules), []); // Flatten array of special rules arrays

                    const specialRules = (u.specialRules || []).concat(equipmentSpecialRules);
                    return (
                        <div key={i} className="column is-one-third">
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h3 className="text-center" style={{ fontWeight: 500 }}>{u.name}</h3>
                                    <hr className="mb-0" />

                                    <div className="is-flex mb-2" style={{ justifyContent: "center" }}>

                                        <div className={style.profileStat}>
                                            <p>Quality</p>
                                            <p>
                                                {u.quality}
                                            </p>
                                        </div>
                                        <div className={style.profileStat}>
                                            <p>Defense</p>
                                            <p>
                                                {u.defense}
                                            </p>
                                        </div>

                                    </div>
                                    <UnitEquipmentTable unit={u} />
                                    {specialRules?.length && <Paper square elevation={0}>
                                        <div className="p-4 mb-4">
                                            <h4 style={{ fontWeight: 600 }}>Special Rules</h4>
                                            {specialRules.join(", ")}
                                        </div>
                                    </Paper>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

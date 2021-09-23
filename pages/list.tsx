import Head from "next/head";
import React, { useEffect } from "react";
import { useSelector } from 'react-redux'
import { RootState } from '../data/store'
import { useRouter } from "next/router";
import { useMediaQuery } from 'react-responsive';
import MobileView from "../views/listBuilder/MobileView";
import DesktopView from "../views/listBuilder/DesktopView";

export default function List() {

    const army = useSelector((state: RootState) => state.army);
    const router = useRouter();

    // Load army list file 
    useEffect(() => {
        // Redirect to game selection screen if no army selected
        if (!army.armyFile) {
            router.push("/", null, { shallow: true });
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
        // fetch(`https://opr-list-builder.herokuapp.com/api/content/game-systems/${slug}/special-rules`)
        //     .then(res => res.json())
        //     .then(res => {
        //         console.log(res.map(rule => ({
        //             name: rule.name,
        //             description: rule.description
        //         })));
        //     });
    }, []);

    // Break from mobile to desktop layout at 1024px wide
    const isBigScreen = useMediaQuery({ query: '(min-width: 1024px)' });

    return (
        <>
            <Head>
                <title>OPR Army Forge</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {isBigScreen ? <DesktopView /> : <MobileView />}
        </>
    );
}

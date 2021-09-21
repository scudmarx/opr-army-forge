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

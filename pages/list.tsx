import Head from "next/head";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/router";
import 'react-spring-bottom-sheet/dist/style.css';
import { useMediaQuery } from 'react-responsive';
import MobileView from "../views/listBuilder/MobileView";
import DesktopView from "../views/listBuilder/DesktopView";

export default function List() {

    const army = useSelector((state: RootState) => state.army);
    const router = useRouter();
    const dispatch = useDispatch();
    
    // Load army list file 
    useEffect(() => {
        if (!army.armyFile) {
            router.push("/", null, { shallow: true });
            return;
        }

        // TODO: Test only, add army selection
        
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

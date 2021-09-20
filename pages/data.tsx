import Head from "next/head";
import { useEffect, useState } from "react";
import DataParsingService from "../services/DataParsingService";

export default function Data() {

    const [json, setJson] = useState("");
    const [name, setName] = useState("");
    const [version, setVersion] = useState("2.1");
    const [units, setUnits] = useState("");
    const [upgrades, setUpgrades] = useState("");


    useEffect(() => {
        generateJson();
    }, [units, upgrades, name, version])

    const generateJson = () => {

        try {
            const parsedUnits = DataParsingService.parseUnits(units);
            const parsedUpgrades = DataParsingService.parseUpgrades(upgrades);

            //parseUnits(units);
            setJson(JSON.stringify({
                "$schema": "https://raw.githubusercontent.com/AdamLay/opr-army-forge/master/public/definitions/army.schema.json",
                name,
                version,
                units: parsedUnits,
                upgradeSets: parsedUpgrades
            }, null, 2));
        }
        catch (e) {
            setJson(e);
        }
    };

    const processUnits = (text: string) => {
        const fixedText = text
            .replace(/\n+/gm, ' ')
            .replace(/pts?/gm, 'pts\n');
        setUnits(fixedText.replace(/^\s+/gm, ''));
    };

    const processUpgrades = (text: string) => {
        const fixedText = text
            .replace(/\n+/gm, ' ')
            .replace(/Free/gm, '+0pts')
            .replace(/pts?/gm, 'pts\n')
            .replace(/\:/gm, ':\n');
        setUpgrades(fixedText.replace(/^\s+/gm, ''));
    };

    return (
        <>
            <Head>
                <title>OPR Army Forge - Data Tool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="columns">
                <div className="column">
                    <label>Units</label>
                    <textarea className="textarea" value={units} onChange={(e) => processUnits(e.target.value)} rows={50}></textarea>
                </div>
                <div className="column">
                    <label>Upgrades</label>
                    <textarea className="textarea" value={upgrades} onChange={(e) => processUpgrades(e.target.value)} rows={50}></textarea>
                </div>
                <div className="column">
                    <label>Army Details</label>
                    <div className="columns">
                        <div className="column">
                            <input className="input" placeholder="Army Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="column">
                            <input className="input" placeholder="PDF Version" value={version} onChange={(e) => setVersion(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <label>Output</label>
                        <textarea className="textarea" value={json} rows={46}></textarea>
                    </div>
                </div>
            </div>
        </>
    );
}
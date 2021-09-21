import Head from "next/head";
import { useEffect, useState } from "react";
import DataParsingService from "../services/DataParsingService";

export default function Data() {

    const [json, setJson] = useState("");
    const [name, setName] = useState("");
    const [version, setVersion] = useState("2.1");
    const [units, setUnits] = useState("");
    const [units2, setUnits2] = useState("");
    const [units3, setUnits3] = useState("");
    const [upgrades, setUpgrades] = useState("");


    useEffect(() => {
        generateJson();
    }, [units, units2, units3, upgrades, name, version])

    const generateJson = () => {

        const replaceUpgradeSets = (units: any[], index: number) => {
            if (!units)
                return [];
            return units.map(u => ({
                ...u,
                upgradeSets: u.upgradeSets.map(letter => letter + index)
            }));
        }

        try {
            const parsedUnits: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units), 1);
            const parsedUnits2: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units2), 2);
            const parsedUnits3: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units3), 3);
            const parsedUpgrades = DataParsingService.parseUpgrades(upgrades);

            //parseUnits(units);
            setJson(JSON.stringify({
                "$schema": "https://raw.githubusercontent.com/AdamLay/opr-army-forge/master/public/definitions/army.schema.json",
                name,
                version,
                units: parsedUnits.concat(parsedUnits2).concat(parsedUnits3),
                upgradeSets: parsedUpgrades
            }, null, 2));
        }
        catch (e) {
            setJson(e);
        }
    };

    const processUnits = (text: string, upgradeGroupIndex) => {
        const fixedText = text
            .replace(/\n+/gm, ' ')
            .replace(/(\d+)pts?/gm, '$1pts\n');
        const finalText = fixedText.replace(/^\s+/gm, '');
        if (upgradeGroupIndex === 1)
            setUnits(finalText);
        if (upgradeGroupIndex === 2)
            setUnits2(finalText);
        if (upgradeGroupIndex === 3)
            setUnits3(finalText);
    };

    const processUpgrades = (text: string) => {
        const fixedText = text
            .replace(/\n+/gm, ' ')
            .replace(/Free/gm, '+0pts')
            .replace(/(\d+)pts?/gm, '$1pts\n')
            .replace(/\:\s?/gm, ':\n');
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
                    <textarea className="textarea" value={units} onChange={(e) => processUnits(e.target.value, 1)} rows={20}></textarea>
                    <textarea className="textarea" value={units2} onChange={(e) => processUnits(e.target.value, 2)} rows={20}></textarea>
                    <textarea className="textarea" value={units3} onChange={(e) => processUnits(e.target.value, 3)} rows={20}></textarea>
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
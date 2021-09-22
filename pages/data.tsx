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
    const [units4, setUnits4] = useState("");
    const [units5, setUnits5] = useState("");
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
            const parsedUnits4: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units4), 4);
            const parsedUnits5: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units5), 5);
            const parsedUpgrades = DataParsingService.parseUpgrades(upgrades);

            //parseUnits(units);
            setJson(JSON.stringify({
                "$schema": "https://raw.githubusercontent.com/AdamLay/opr-army-forge/master/public/definitions/army.schema.json",
                name,
                version,
                units: parsedUnits
                    .concat(parsedUnits2)
                    .concat(parsedUnits3)
                    .concat(parsedUnits4)
                    .concat(parsedUnits5),
                upgradeSets: parsedUpgrades
            }, null, 2));
        }
        catch (e) {
            setJson(e);
        }
    };

    const processUnits = (text: string, upgradeGroupIndex) => {
        const fixedText = text
            .replace("–", "-") // Replace dash with hyphen!
            .replace(/\n+/gm, ' ')
            .replace(/(\d+)pts?/gm, '$1pts\n');
        const finalText = fixedText.replace(/^\s+/gm, '');
        if (upgradeGroupIndex === 1)
            setUnits(finalText);
        if (upgradeGroupIndex === 2)
            setUnits2(finalText);
        if (upgradeGroupIndex === 3)
            setUnits3(finalText);
        if (upgradeGroupIndex === 4)
            setUnits4(finalText);
        if (upgradeGroupIndex === 5)
            setUnits5(finalText);
    };

    const processUpgrades = (text: string) => {
        const fixedText = text
            .replace("–", "-") // Replace dash with hyphen!
            .replace(/\n+/gm, ' ') // Remove _all_ line breaks (flatten to one line) and replace with single space
            .replace(/Free /gm, '+0pts ') // Replace "Free" with "0pts" so that it hits the next condition...
            .replace(/(\d+)pts?/gm, '$1pts\n') // ...Add a line break after every "pts" 
            .replace(/((Upgrade|Replace)(.+?)with (one|all|any|up to \d+|\d+)?:?)/gm, '$1\n') // Add line break to upgrade lines that might not have a colon
            .replace(/: /gm, ':\n') // Add line break after every colon that wasn't replaced in the previous case (upgrade text lines)
            
        // .replace(/(\swith:?|:)\s?/gm, '$1\n');
        setUpgrades(fixedText.replace(/^\s+/gm, ''));
    };

    return (
        <>
            <Head>
                <title>OPR Army Forge - Data Tool</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="columns m-2">
                <div className="column">
                    <p className="mb-2">Copy &amp; paste units table from pdf (without table headers) page by page.</p>
                    <label>Units - Page 1</label>
                    <textarea className="textarea" value={units} onChange={(e) => processUnits(e.target.value, 1)} rows={15} placeholder='Warlord [1] 3+ 4+ Pistol (12”, A1), CCW (A3) Bad Shot, Furious, Hero, Tough(3) A, B, D, E 50pts'></textarea>
                    <label>Units - Page 2</label>
                    <textarea className="textarea" value={units2} onChange={(e) => processUnits(e.target.value, 2)} rows={15}></textarea>
                    <label>Units - Page 3</label>
                    <textarea className="textarea" value={units3} onChange={(e) => processUnits(e.target.value, 3)} rows={15}></textarea>
                    <label>Units - Page 4</label>
                    <textarea className="textarea" value={units3} onChange={(e) => processUnits(e.target.value, 4)} rows={15}></textarea>
                    <label>Units - Page 5</label>
                    <textarea className="textarea" value={units3} onChange={(e) => processUnits(e.target.value, 5)} rows={15}></textarea>
                </div>
                <div className="column">
                    <p className="mb-2">Copy &amp; paste upgrade tables (only, no rules/spells) from pdf page by page.</p>
                    <label>Upgrades</label>
                    <textarea className="textarea" value={upgrades} onChange={(e) => processUpgrades(e.target.value)} rows={40} placeholder='A Replace one Pistol:&#10;Carbine (18”, A2) +5pts&#10;Twin Carbine (18”, A4) +10pts'></textarea>
                </div>
                <div className="column">

                    <div className="columns">
                        <div className="column">
                            <label>Army Details</label>
                            <input className="input" placeholder="Army Name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div className="column">
                            <label>PDF Version</label>
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
import Head from "next/head";
import { useEffect, useState } from "react";
import DataParsingService from "../services/DataParsingService";
import { Button } from "@mui/material";

export const dataToolVersion = "0.5.0";

export default function Data() {

    const [json, setJson] = useState("");
    const [name, setName] = useState("");
    const [gameSystem, setGameSystem] = useState("gf");
    const [version, setVersion] = useState("2.1");
    const [units, setUnits] = useState("");
    const [units2, setUnits2] = useState("");
    const [units3, setUnits3] = useState("");
    const [units4, setUnits4] = useState("");
    const [units5, setUnits5] = useState("");
    const [rules, setRules] = useState("");
    const [spells, setSpells] = useState("");
    const [upgrades, setUpgrades] = useState("");

    useEffect(() => {
        generateJson();
    }, [units, units2, units3, upgrades, name, version, rules, spells, gameSystem])

    const generateJson = () => {

        const replaceUpgradeSets = (units: any[], index: number) => {
            if (!units)
                return [];
            return units.map(u => ({
                ...u,
                upgrades: u.upgrades.map(letter => letter + index)
            }));
        }

        try {
            const parsedUnits: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units), 1);
            const parsedUnits2: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units2), 2);
            const parsedUnits3: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units3), 3);
            const parsedUnits4: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units4), 4);
            const parsedUnits5: any[] = replaceUpgradeSets(DataParsingService.parseUnits(units5), 5);
            const parsedUpgrades = DataParsingService.parseUpgrades(upgrades);
            const parsedRules = DataParsingService.parseRules(rules);
            const parsedSpells = DataParsingService.parseSpells(spells);

            const gameDetails = {
                gf: {
                    id: 2,
                    slug: "grimdark-future",
                    name: "Grimdark Future",
                    universe: "Grimdark Future",
                    aberration: "GF",
                    shortname: "Grimdark Future"
                },
                gff: {
                    id: 3,
                    slug: "grimdark-future-firefight",
                    name: "Grimdark Future: Firefight",
                    universe: "Grimdark Future",
                    aberration: "GFF",
                    shortname: "GF: Firefight"
                },
                aof: {
                    id: 4,
                    slug: "age-of-fantasy",
                    name: "Age of Fantasy",
                    universe: "Age of Fantasy",
                    aberration: "AOF",
                    shortname: "Age of Fantasy"
                },
                aofs: {
                    id: 5,
                    slug: "age-of-fantasy-skirmish",
                    name: "Age of Fantasy: Skirmish",
                    universe: "Age of Fantasy",
                    aberration: "AOFS",
                    shortname: "AoF: Skirmish"
                },
                aofr: {
                    id: 6,
                    slug: "age-of-fantasy-regiments",
                    name: "Age of Fantasy: Regiments",
                    universe: "Age of Fantasy",
                    aberration: "AOFR",
                    shortname: "AoF: Regiments"
                }
            }

            const details = gameDetails[gameSystem];

            //parseUnits(units);
            setJson(JSON.stringify({
                gameSystemId: details.id,
                name,
                hint: name,
                background: "",
                "armyWideRule": {},
                version,
                dataToolVersion,
                units: parsedUnits
                    .concat(parsedUnits2)
                    .concat(parsedUnits3)
                    .concat(parsedUnits4)
                    .concat(parsedUnits5),
                upgradePackages: parsedUpgrades,
                specialRules: parsedRules,
                spells: parsedSpells,
                "modifiedAt": new Date().toISOString(),
                "official": true,
                "public": false,
                "versionString": "draft",
                "coverImagePath": null,
                "coverImageCredit": null,
                "isLive": false,
                //"username": "Darguth",
                "gameSystemSlug": details.slug,
                "fullname": details.name,
                "aberration": details.aberration,
                "universe": details.universe,
                "shortname": details.shortname
            }, null, 2));
        }
        catch (e) {
            setJson(e);
        }
    };

    const replaceAt = (str: string, index, replacement) => {
        return str.substr(0, index) + replacement + str.substr(index + replacement.length);
    }

    const processUnits = (text: string, upgradeGroupIndex) => {
        const fixedText = text
            .replace(/\–/gm, "-") // Replace dash with hyphen!
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
            .replace(/\–/gm, "-") // Replace dash with hyphen!
            .replace(/\n+/gm, ' ') // Remove _all_ line breaks (flatten to one line) and replace with single space
            .replace(/Free /gm, '+0pts ') // Replace "Free" with "0pts" so that it hits the next condition...
            .replace(/(\d+)pts?/gm, '$1pts\n') // ...Add a line break after every "pts" 
            .replace(/((Upgrade|Replace)(.+?)with (one|all|any|up to (\d+|one|two|three)|\d+)?:?)/gm, '$1\n') // Add line break to upgrade lines that might not have a colon
            .replace(/(?<!to fire): /gm, ':\n') // Add line break after every colon that wasn't replaced in the previous case (upgrade text lines) but not multi-profile weapons

        // .replace(/(\swith:?|:)\s?/gm, '$1\n');
        setUpgrades(fixedText.replace(/^\s+/gm, ''));
    };

    const processRules = (text: string) => {
        const fixedText = text
            .replace(/\–/gm, "-") // Replace dash with hyphen!
            .replace(/\n+/gm, ' ') // Remove _all_ line breaks (flatten to one line) and replace with single space
            .replace(/: /gm, ':\n') // Add line break after every colon that wasn't replaced in the previous case (upgrade text lines)

        const lines = [];

        // For each line, split on last index of .
        for (let line of fixedText.split('\n')) {
            const lastDotIndex = line.lastIndexOf('.');
            console.log(lastDotIndex, line);

            lines.push(lastDotIndex >= 0 ? replaceAt(line, lastDotIndex, '.\n') : line);
        }

        setRules(lines.join(" ").replace(/^\s+/gm, ''));
    };

    const processSpells = (text: string) => {
        const fixedText = text
            .replace(/\–/gm, "-") // Replace dash with hyphen!
            .replace(/\n+/gm, ' ') // Remove _all_ line breaks (flatten to one line) and replace with single space
            .replace(/: /gm, ':\n') // Add line break after every colon that wasn't replaced in the previous case (upgrade text lines)

        const lines = [];

        // For each line, split on last index of .
        for (let line of fixedText.split('\n')) {
            const lastDotIndex = line.lastIndexOf('.');
            console.log(lastDotIndex, line);

            lines.push(lastDotIndex >= 0 ? replaceAt(line, lastDotIndex, '.\n') : line);
        }

        setSpells(lines.join(" ").replace(/^\s+/gm, ''));
    };

    const autoFormat = () => {
        processUnits(units, 1);
        processUnits(units2, 2);
        processUnits(units3, 3);
        processUnits(units4, 4);
        processUnits(units5, 5);

        processUpgrades(upgrades);
        processRules(rules);
        processSpells(spells);
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
                    <textarea className="textarea" value={units} onChange={(e) => setUnits(e.target.value)} rows={15} placeholder='Warlord [1] 3+ 4+ Pistol (12”, A1), CCW (A3) Bad Shot, Furious, Hero, Tough(3) A, B, D, E 50pts'></textarea>
                    <label>Units - Page 2</label>
                    <textarea className="textarea" value={units2} onChange={(e) => setUnits2(e.target.value)} rows={15}></textarea>
                    <label>Units - Page 3</label>
                    <textarea className="textarea" value={units3} onChange={(e) => setUnits3(e.target.value)} rows={15}></textarea>
                    <label>Units - Page 4</label>
                    <textarea className="textarea" value={units3} onChange={(e) => setUnits4(e.target.value)} rows={15}></textarea>
                    <label>Units - Page 5</label>
                    <textarea className="textarea" value={units3} onChange={(e) => setUnits5(e.target.value)} rows={15}></textarea>
                </div>
                <div className="column">
                    <p className="mb-2">Copy &amp; paste upgrade tables from pdf page by page.</p>
                    <label>Upgrades</label>
                    <textarea className="textarea" value={upgrades} onChange={(e) => setUpgrades(e.target.value)} rows={15} placeholder='A Replace one Pistol:&#10;Carbine (18”, A2) +5pts&#10;Twin Carbine (18”, A4) +10pts'></textarea>
                    <label>Special Rules</label>
                    <textarea className="textarea" value={rules} onChange={(e) => setRules(e.target.value)} rows={15} placeholder='Attack Bomb: Whenever this unit moves over enemies pick one of them and roll 1 die, on a 2+ it takes 3 hits with AP(1).'></textarea>
                    <label>Spells/Psychic</label>
                    <textarea className="textarea" value={spells} onChange={(e) => setSpells(e.target.value)} rows={15} placeholder='Spite Rune (4+): Target enemy unit within 12” gets -1 to hit in melee next time it fights.'></textarea>
                </div>
                <div className="column">

                    <Button variant="outlined" className="mb-2" onClick={() => autoFormat()}>Auto Format Inputs!</Button>

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
                    <label>PDF Version</label>
                    <select className="input" onChange={(e) => setGameSystem(e.target.value)}>
                        <option value="gf">Grimdark Future</option>
                        <option value="gff">Grimdark Future Firefight</option>
                        <option value="aof">Age of Fantasy</option>
                        <option value="aofs">Age of Fantasy Skirmish</option>
                        <option value="aofr">Age of Fantasy Regiments</option>
                    </select>
                    <div>
                        <label>Output</label>
                        <textarea className="textarea" value={json} rows={46}></textarea>
                    </div>
                </div>
            </div>
        </>
    );
}
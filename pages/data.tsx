import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../data/store'
import { load } from '../data/armySlice'
import { UnitSelection } from "../views/UnitSelection";
import { MainList } from "../views/MainList";

function parseEquipment(str) {
    var parts = str
        .split(/(?<!\(\d)\),/)
        .map((part) => part.trim())
        .map((part) => (/(?<!\(\d)\)/.test(part) ? part : part + ")"))
        .map((part) => {
            if (part === "-)") return null;

            if (part.indexOf(" and ") > 0) {
                var multiParts = part.split(" and ");
                return {
                    type: "combined",
                    equipment: multiParts
                        .map(mp => parseEquipment(mp))
                        .reduce((curr, next) => curr.concat(next), [])
                };
            }

            const singleRuleMatch = /^([\w\s]+)\s([-+]\d+)pt/.exec(part);
            if (singleRuleMatch) {
                return {
                    name: singleRuleMatch[1].trim(),
                    specialRules: [singleRuleMatch[1].trim()],
                    cost: parseInt(singleRuleMatch[2]),
                };
            }

            const paramRuleMatch = /^(\w+\(\d+\))\s([-+]\d+)pt/.exec(part);
            if (paramRuleMatch) {
                return {
                    name: paramRuleMatch[1].trim(),
                    specialRules: [paramRuleMatch[1].trim()],
                    cost: parseInt(paramRuleMatch[2]),
                };
            }

            const match = /((\d+)x\s)?(.+?)\((.+)\)\s?([+-]\d+|Free)?/.exec(part);

            const attacksMatch = /A(\d+)[,\)]/.exec(part);
            const rangeMatch = /(\d+)["”][,\)]/.exec(part);
            const rules = match[4].split(",").map((r) => r.trim());
            const specialRules = rules.filter(
                (r) => !/^A\d+/.test(r) && !/^\d+["”]/.test(r)
            );

            return {
                name: match[3].trim(),
                count: match[2] ? parseInt(match[2]) : undefined,
                attacks: attacksMatch ? parseInt(attacksMatch[1]) : undefined,
                range: rangeMatch ? parseInt(rangeMatch[1]) : undefined,
                specialRules: specialRules.length ? specialRules : undefined,
                cost: match[5] ? (match[5] === "Free" ? 0 : parseInt(match[5].trim())) : undefined,
            };
        })
        .filter((p) => !!p);
    return parts;
}

function parseUnits(units: string) {
    const results = [];

    for (let line of units.split("\n").filter((l) => !!l)) {
        const parsedUnit =
            /^(.+)\[(\d+)\]\s(\d+\+)\s(\d+\+)\s(.*?\)\s|-)(.+?)((?:[A-Z],?\s?|-\s?)+)(\d+)pt/gm.exec(
                line
            );

        const parsed = {
            name: parsedUnit[1].trim(),
            size: parseInt(parsedUnit[2]),
            quality: parsedUnit[3],
            defense: parsedUnit[4],
            equipment: parseEquipment(parsedUnit[5]),
            specialRules: parsedUnit[6].split(",").map((s) => s.trim()),
            upgradeSets:
                parsedUnit[7] && parsedUnit[7].trim() === "-"
                    ? []
                    : parsedUnit[7].split(",").map((s) => s.trim()),
            cost: parseInt(parsedUnit[8]),
        };

        results.push(parsed);
    }

    return results;
}

function parseUpgrades(upgrades: string) {
    const results = {};
    const groupNames = {
        setLetter: 1,
        upgradeText: 2,
    };
    let groupIndex = 1;
    let lastGroupId = null;
    let lastUpgradeText = null;
    for (let line of upgrades.split("\n").filter((l) => !!l)) {
        try {
            const parsedUpgrade = /^(\D\s)?(.+?):|(.+?)\s\((.+)\)\s?([+-]\d+)?/.exec(
                line
            );

            const setLetter =
                parsedUpgrade && parsedUpgrade[groupNames.setLetter]?.trim();
            const upgradeText =
                parsedUpgrade && parsedUpgrade[groupNames.upgradeText];
            const isNewGroup = !!setLetter;
            const isUpgrade = !!upgradeText;

            if (isNewGroup) {
                const groupExists = !!results[setLetter + groupIndex];
                const groupId = results[setLetter + groupIndex]
                    ? setLetter + ++groupIndex
                    : setLetter;
                results[groupId] = {
                    id: groupId,
                    upgrades: [
                        {
                            text: upgradeText,
                            options: [],
                        },
                    ],
                };
                lastGroupId = groupId;
                lastUpgradeText = upgradeText;
            } else if (isUpgrade) {
                results[lastGroupId].upgrades.push({
                    text: upgradeText,
                    options: [],
                });
                lastUpgradeText = upgradeText;
            } else {
                // Is Equipment...
                const option = parseEquipment(line);
                // Add to options!
                results[lastGroupId].upgrades
                    .filter((u) => u.text === lastUpgradeText)[0]
                    .options.push(...option);
            }
        } catch (e) {
            console.log(e);
            console.log(line);
        }
    }

    return Object.keys(results).reduce((curr, next) => curr.concat(results[next]), []);

    //const upgradesJson = JSON.stringify(results, null, 2);
}

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
            var parsedUnits = parseUnits(units);
            var parsedUpgrades = parseUpgrades(upgrades);

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

    return (
        <>
            <Head>
                <title>OPR Army Forge</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="columns">
                <div className="column">
                    <label>Units</label>
                    <textarea className="textarea" value={units} onChange={(e) => setUnits(e.target.value)} rows={50}></textarea>
                </div>
                <div className="column">
                    <label>Upgrades</label>
                    <textarea className="textarea" value={upgrades} onChange={(e) => setUpgrades(e.target.value)} rows={50}></textarea>
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
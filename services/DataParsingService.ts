import { IEquipment, IUpgrade } from '../data/interfaces';

export default class DataParsingService {

    // Only 0-9 covered - probably OK?
    public static numberFromName(number: string): number {
        const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const index = numbers.indexOf(number.toLocaleLowerCase());
        if (index >= 0)
            return index;
        return null;
    }

    public static parseUpgradeText(text: string): IUpgrade {
        const groups = {
            type: 1,
            affects: 2,
            upgradeWhat: 3,
            select: 4,
            upTo: 5,
            replaceWhat: 6
        }

        const mountMatch = /mount on/i.test(text);
        if (mountMatch)
            return {
                type: "upgrade",
                select: 1
            };

        const takeMatch = /^Take ([\w\d]+)\s(.+?):/.exec(text);
        if (takeMatch)
            return {
                type: "upgrade",
                select: parseInt(takeMatch[1]) || this.numberFromName(takeMatch[1]) || takeMatch[1] as any
            };

        text = text.endsWith(":") ? text.substring(0, text.length - 1) : text;

        const match = /(Upgrade|Replace)\s?(any|one|all|\d+x)?\s?(?:models?)?(?:(.+)\swith)?\s?(?:with)?\s?(one|any)?(?:up to (.+?)(?:\s|$))?(.+)?/.exec(text);
        //const match = /(Upgrade|Replace)\s?(any|one|all)?\s?(?:models?)?\s?(?:with)?\s?(one|any)?(?:up to (.+?)\s)?(.+?)?:/.exec(text);

        if (!match) {
            console.error("Cannot match: " + text)
            return null;
        }

        const replaceWhat = match[groups.replaceWhat];

        const result: IUpgrade = {
            type: match[groups.type]?.toLowerCase() as any
        };

        if (match[groups.affects])
            result.affects = parseInt(match[groups.affects]) || this.numberFromName(match[groups.affects]) || match[groups.affects] as any;

        if (match[groups.select])
            result.select = parseInt(match[groups.select]) || this.numberFromName(match[groups.select]) || match[groups.select] as any;

        if (match[groups.upTo])
            result.select = parseInt(match[groups.upTo]) || this.numberFromName(match[groups.upTo]) || match[groups.upTo] as any;

        if (match[groups.upgradeWhat])
            result.replaceWhat = match[groups.upgradeWhat];

        if (replaceWhat) {
            result.replaceWhat = replaceWhat.indexOf(" and ") > -1
                ? replaceWhat.split(" and ")
                : replaceWhat;
        }

        // TODO: Better way of doing this?
        if (result.type === "upgrade" && result.replaceWhat && !result.affects && !result.select)
            result.type = "upgradeRule";

        return result;
    }

    public static parseUpgrades(upgrades: string) {
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
                const parsedUpgrade = /^(\D\s)?(.+?):|(.+?)\s\((.+)\)\s?([+-]\d+)?/.exec(line
                );

                const setLetter =
                    parsedUpgrade && parsedUpgrade[groupNames.setLetter]?.trim();
                const upgradeText =
                    parsedUpgrade && parsedUpgrade[groupNames.upgradeText];
                const isNewGroup = !!setLetter;
                const isUpgrade = !!upgradeText;

                if (isNewGroup) {
                    const groupExists = !!results[setLetter + groupIndex];
                    if (groupExists)
                        groupIndex++;

                    const groupId = setLetter + groupIndex;
                    console.log(groupId);

                    results[groupId] = {
                        id: groupId,
                        upgrades: [
                            {
                                text: upgradeText,
                                ...DataParsingService.parseUpgradeText(upgradeText + ":"),
                                options: [],
                            },
                        ],
                    };
                    lastGroupId = groupId;
                    lastUpgradeText = upgradeText;
                } else if (isUpgrade) {
                    results[lastGroupId].upgrades.push({
                        text: upgradeText,
                        ...DataParsingService.parseUpgradeText(upgradeText + ":"),
                        options: [],
                    });
                    lastUpgradeText = upgradeText;
                } else {
                    // Is Equipment...
                    const option = this.parseEquipment(line);
                    // Add to options!
                    results[lastGroupId].upgrades
                        .filter((u) => u.text === lastUpgradeText)[0]
                        .options.push(option);
                }
            } catch (e) {
                console.log(e);
                console.log(line);
            }
        }

        return Object.keys(results).reduce((curr, next) => curr.concat(results[next]), []);
    }

    public static parseUnits(units: string) {
        const results = [];

        for (let line of units.split("\n").filter((l) => !!l)) {
            const parsedUnit =
                /^(.+)\[(\d+)\]\s(\d+\+|-)\s(\d+\+|-)\s(.*?\)\s|-)(.+?)((?:[A-Z],?\s?|-\s?)+)(\d+)pt/gm.exec(
                    line
                );

            const parsed = {
                name: parsedUnit[1].trim(),
                size: parseInt(parsedUnit[2]),
                quality: parsedUnit[3],
                defense: parsedUnit[4],
                equipment: DataParsingService.parseEquipmentList(parsedUnit[5]),
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

    public static parseEquipmentList(str) {

        const groups = {
            count: 2,
            name: 3,
            rules: 4,
            cost: 5
        }

        var parts = str
            .split(/(?<!\(\d)\),/)
            .map((part) => part.trim())
            .map((part) => (/(?<!\(\d)\)/.test(part) ? part : part + ")"))
            .map((part) => {

                // TODO: Can't remember why this is here?
                if (part === "-)")
                    return null;

                return this.parseEquipment(part);
            })
            .filter((p) => !!p);
        return parts;
    }

    public static parseEquipment(part) {

        const groups = {
            name: 1,
            rules: 2,
            cost: 3
        };


        if (/ - /.test(part))
            return this.parseMount(part);

        // "A (...) and B (...) +10pts"
        if (part.indexOf(") and ") > 0) {
            const combinedMatch = /(.+?)(Free$|([-+]\d+)pts)$/.exec(part);
            const multiParts = combinedMatch[1]
                .split(" and ");
            return {
                type: "combined",
                cost: combinedMatch[2] === "Free" ? 0 : parseInt(combinedMatch[3]),
                equipment: multiParts
                    .map(mp => this.parseEquipment(mp))
            };
        }

        const singleRuleMatch = /^([\w\s!]+)\s([-+]\d+)pt/.exec(part);
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

        const match = /(.+?)\((.+)\)\s?([+-]\d+|Free)?/.exec(part);

        const attacksMatch = /A(\d+)[,\)]/.exec(part);
        const rangeMatch = /(\d+)["”][,\)]/.exec(part);
        const rules = match[groups.rules].split(",").map((r) => r.trim());
        const specialRules = rules.filter(
            (r) => !/^A\d+/.test(r) && !/^\d+["”]/.test(r)
        );

        const result: IEquipment = {
            name: match[groups.name].trim()
        };

        // if (match[groups.count])
        //     result.count = parseInt(match[groups.count]);

        if (attacksMatch)
            result.attacks = parseInt(attacksMatch[1]);

        if (rangeMatch)
            result.range = parseInt(rangeMatch[1]);

        if (specialRules?.length > 0)
            result.specialRules = specialRules;

        if (match[groups.cost] !== undefined)
            result.cost = match[groups.cost] === "Free" ? 0 : parseInt(match[groups.cost].trim());

        return result;
    }

    public static parseMount(text: string) {

        const textParts = text.split(" - ");
        const name = textParts[0].trim();
        const match = /(.+)([+-]\d+)pts$/.exec(textParts[1]);
        const weaponRegex = /((.+?)(?<!AP|Impact|Tough|Deadly|Blast|Psychic|Wizard)\((.+?)\))[,\s]/;
        const weaponMatch = weaponRegex.exec(match[1]);
        const rules = match[1].replace(weaponRegex, '').trim().split(/,\s+?/);

        return {
            type: "mount",
            cost: parseInt(match[2]),
            equipment: [
                {
                    name,
                    specialRules: rules
                },
                weaponMatch && {
                    ...this.parseEquipment(weaponMatch[1]),
                    name: name + " - " + weaponMatch[2].trim()
                }
            ].filter(e => !!e)
        };
    }

    public static parseRules(rules: string) {

        const results = [];

        for (let line of rules.split("\n").filter(line => !!line)) {
            const lineParts = line.split(":");
            const rule = lineParts[0].trim();
            const description = lineParts[1].trim();
            results.push({ name: rule, description });
        }

        return results;
    }

    public static parseSpells(spells: string) {

        const results = [];

        for (let line of spells.split("\n").filter(line => !!line)) {
            const lineParts = line.split(":");
            const spell = lineParts[0].trim();
            const description = lineParts[1].trim();
            const spellMatch = /(.+)\s\((.+)\)/.exec(spell);
            results.push({
                name: spellMatch[1],
                test: spellMatch[2],
                description
            });
        }

        return results;
    }
}
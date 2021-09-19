import { IUpgrade } from '../data/interfaces';

export default class DataParsingService {
    public static parseUpgradeText(text: string): IUpgrade {
        const groups = {
            type: 1,
            affects: 2,
            select: 3,
            replaceWhat: 4
        }

        const match = /(Upgrade|Replace)\s?(any|one|all)?\s?(?:models?)?\s?(?:with)?\s?(one|any)?([\w\s-]+?)?:/.exec(text);

        if (!match) {
            console.error("Cannot match: " + text)
            return null;
        }

        return {
            type: match[groups.type]?.toLowerCase() as any,
            affects: match[groups.affects] as any,
            select: match[groups.select] as any,
            replaceWhat: match[groups.replaceWhat]
        }
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
                        .options.push(...option);
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
                /^(.+)\[(\d+)\]\s(\d+\+)\s(\d+\+)\s(.*?\)\s|-)(.+?)((?:[A-Z],?\s?|-\s?)+)(\d+)pt/gm.exec(
                    line
                );
    
            const parsed = {
                name: parsedUnit[1].trim(),
                size: parseInt(parsedUnit[2]),
                quality: parsedUnit[3],
                defense: parsedUnit[4],
                equipment: DataParsingService.parseEquipment(parsedUnit[5]),
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

    public static parseEquipment(str) {
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
                            .map(mp => this.parseEquipment(mp))
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
}
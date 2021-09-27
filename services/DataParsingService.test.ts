import { EightK, RestartAlt } from '@mui/icons-material';
import { IEquipment } from '../data/interfaces';
import DataParsingService from './DataParsingService';

/*
Regex text cases...

Upgrade with:
Upgrade with one:
Upgrade with up to 2:
Upgrade with up to two:
Upgrade with any:
*/

//#region Upgrades "upgrade"

test("Parse 'Upgrade with:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade with:");
    expect(upgrade).toStrictEqual({
        type: "upgrade"
    });
});

test("Parse 'Upgrade with one:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade with one:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: 1
    });
});

test("Parse 'Upgrade with up to 2:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade with up to 2:");
    console.log(upgrade);
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: 2
    });
});

test("Parse 'Upgrade with up to two:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade with up to two:");
    console.log(upgrade);
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: 2
    });
});

test("Parse 'Upgrade with any:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade with any:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: "any"
    });
});

test("Parse 'Upgrade all models with:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        affects: "all"
    });
});

test("Parse 'Upgrade any model with one:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade any model with one:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        affects: "any",
        select: 1
    });
});

test("Parse 'Upgrade all models with one:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with one:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        affects: "all",
        select: 1
    });
});

test("Parse 'Upgrade all models with any:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade all models with any:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        affects: "all",
        select: "any"
    });
});

test("Parse 'Upgrade one model with:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade one model with:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        affects: 1
    });
});

test("Parse 'Upgrade one model with one:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade one model with one:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        affects: 1,
        select: 1
    });
});


test("Parse 'Upgrade all [weapons] with one:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade all Crossbows with one:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: 1,
        affects: "all",
        replaceWhat: "Crossbows"
    });
});

//#endregion

//#region Upgrades "replace"

test("Parse 'Replace [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace Gauss Rifle:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        replaceWhat: "Gauss Rifle"
    });
});

test("Parse 'Replace one [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace one CCW:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        affects: 1,
        replaceWhat: "CCW"
    });
});

test("Parse 'Replace 2x [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace 2x Armblades:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        affects: 2,
        replaceWhat: "Armblades"
    });
});

test("Parse 'Replace any [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace any Assault Rifle:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        affects: "any",
        replaceWhat: "Assault Rifle"
    });
});

test("Parse 'Replace all [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace all Assault Rifles:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        affects: "all",
        replaceWhat: "Assault Rifles"
    });
});

test("Parse 'Replace up to 2 [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace up to two Assault Rifles:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        select: 2,
        replaceWhat: "Assault Rifles"
    });
});

// test("Parse 'Replace 2x [weapon]:'", () => {
//     const upgrade = DataParsingService.parseUpgradeText("Replace 2x Arm Blades:");
//     expect(upgrade).toStrictEqual({
//         type: "replace",
//         replaceWhat: "Arm Blades"
//     });
// });

test("Parse 'Replace all [weapon] and [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace all Pistols and CCWs:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        affects: "all",
        replaceWhat: ["Pistols", "CCWs"]
    });
});

test("Parse 'Replace [weapon] and [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace Pistol and CCW:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        replaceWhat: ["Pistol", "CCW"]
    });
});

test("Parse 'Replace one [weapon] and [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace one Pistol and CCW:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        affects: 1,
        replaceWhat: ["Pistol", "CCW"]
    });
});

test("Parse 'Replace any [weapon] and [weapon]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Replace any Pistol and CCW:");
    expect(upgrade).toStrictEqual({
        type: "replace",
        affects: "any",
        replaceWhat: ["Pistol", "CCW"]
    });
});

//#endregion

//#region Upgrades "upgradeRule"

test("Parse 'Upgrade [rule]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Upgrade Psychic(1):");
    expect(upgrade).toStrictEqual({
        type: "upgradeRule",
        replaceWhat: "Psychic(1)"
    });
});

//#endregion

//#region Upgrade special cases

test("Parse 'Take one [equipment]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Take one Carbine attachment:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: 1
    });
});

// No examples of this?
test("Parse 'Take 1 [equipment]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Take 1 Carbine attachment:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: 1
    });
});

// No examples of this?
test("Parse 'Take any [equipment]:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Take any Carbine attachments:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: "any"
    });
});

// No examples of this?
test("Parse 'Mount on:'", () => {
    const upgrade = DataParsingService.parseUpgradeText("Mount on:");
    expect(upgrade).toStrictEqual({
        type: "upgrade",
        select: 1
    });
});

//#endregion

//#region Equipment

const parse = (str: string, isUpgrade: boolean = false) => {
    const e = DataParsingService.parseEquipment(str, isUpgrade);
    delete e.id;
    if (e.gains)
        for (let g of e.gains)
            delete g.id;
    return e;
}

test("Parse simple melee weapon", () => {
    const e = parse("Sword (A3)");

    expect(e).toStrictEqual({
        label: "Sword",
        attacks: 3,
        specialRules: []
    });
});

test("Parse melee weapon with rules", () => {
    const e = parse("Sword (A3, Rending, AP(1))");

    expect(e).toStrictEqual({
        label: "Sword",
        attacks: 3,
        specialRules: ["Rending", "AP(1)"]
    });
});

test("Parse multiple melee weapon with rules", () => {
    const e = parse("2x Sword (A3, Rending, AP(1))");

    expect(e).toStrictEqual({
        label: "Sword",
        count: 2,
        attacks: 3,
        specialRules: ["Rending", "AP(1)"]
    });
});

test("Parse melee weapon with rules and cost", () => {
    const e = parse("Sword (A3, Rending, AP(1)) +5pts", true);

    expect(e).toStrictEqual({
        label: "Sword (A3, Rending, AP(1))",
        name: "Sword",
        cost: 5,
        attacks: 3,
        specialRules: [
            {
                key: "rending",
                name: "Rending",
                rating: ""
            },
            {
                key: "ap",
                name: "AP",
                rating: "1"
            }
        ],
        type: "ArmyBookWeapon"
    });
});

test("Parse Free weapon", () => {
    const e = parse("Sword (A3, AP(1)) Free", true);

    expect(e).toStrictEqual({
        label: "Sword (A3, AP(1))",
        name: "Sword",
        cost: 0,
        attacks: 3,
        specialRules: [
            {
                key: "ap",
                name: "AP",
                rating: "1"
            }
        ],
        type: "ArmyBookWeapon"
    });
});

test("Parse simple ranged weapon", () => {
    const e = parse("Pistol (6\", A3)");

    expect(e).toStrictEqual({
        label: "Pistol",
        range: 6,
        attacks: 3,
        specialRules: []
    });
});

test("Parse ranged weapon with rules", () => {
    const e = parse("Pistol (6\", A3, Rending, AP(1))");

    expect(e).toStrictEqual({
        label: "Pistol",
        range: 6,
        attacks: 3,
        specialRules: ["Rending", "AP(1)"]
    });
});

test("Parse standard rule", () => {
    const e = parse("Field Radio +5pts", true);

    expect(e).toStrictEqual({
        label: "Field Radio",
        cost: 5,
        gains: [
            {
                key: "field-radio",
                name: "Field Radio",
                label: "Field Radio",
                rating: "",
                type: "ArmyBookRule"
            }
        ]
    });
});

test("Parse standard rule", () => {
    const e = parse("SHOOT! +15pts", true);

    expect(e).toStrictEqual({
        label: "SHOOT!",
        cost: 15,
        gains: [
            {
                key: "shoot!",
                name: "SHOOT!",
                label: "SHOOT!",
                rating: "",
                type: "ArmyBookRule"
            }
        ]
    });
});

test("Parse parameterised rule", () => {
    const e = parse("Psychic(2) +15pts", true);

    expect(e).toStrictEqual({
        "label": "Psychic(2)",
        "cost": 15,
        "gains": [
            {
                "key": "psychic",
                "name": "Psychic",
                "type": "ArmyBookRule",
                "label": "Psychic(2)",
                "rating": "2",
            }
        ]
    });
});

test("Parse weapon pairing with non-standard rules", () => {
    const e = parse("Light Shields (Defense +1 in melee) and Shield Bash (A2) Free", true);

    expect(e).toStrictEqual({
        label: "Light Shields (Defense +1 in melee) and Shield Bash (A2)",
        cost: 0,
        gains: [
            {
                label: "Light Shields (Defense +1 in melee)",
                name: "Light Shields",
                content: [
                    {
                        key: "defense",
                        name: "Defense",
                        rating: "1",
                        condition: "in melee"
                    }
                ],
                type: "ArmyBookItem"
            },
            {
                label: "Shield Bash (A2)",
                name: "Shield Bash",
                attacks: 2,
                specialRules: [],
                type: "ArmyBookWeapon"
            }
        ]
    });
});

test("Parse weapon pairing", () => {
    const e = parse("Plasma Pistol (12”, A1, AP(2)) and CCW (A2) +5pts", true);

    expect(e).toStrictEqual({
        label: "Plasma Pistol (12”, A1, AP(2)) and CCW (A2)",
        cost: 5,
        gains: [
            {
                label: "Plasma Pistol (12”, A1, AP(2))",
                name: "Plasma Pistol",
                range: 12,
                attacks: 1,
                specialRules: [
                    {
                        key: "ap",
                        name: "AP",
                        rating: "2"
                    }
                ],
                type: "ArmyBookWeapon"
            },
            {
                label: "CCW (A2)",
                name: "CCW",
                attacks: 2,
                specialRules: [],
                type: "ArmyBookWeapon"
            }
        ]
    });
});

test("multiple profile weapon 1", () => {
    const e = parse('Grenade Launcher-pick one to fire: HE (24”,A1,Blast(3)) AT (24”, A1, AP(1), Deadly(3)) +5pts', true);
    for (let g of e.gains)
        for (let p of g.profiles)
            delete p.id;

    expect(e).toStrictEqual({
        label: "Grenade Launcher-pick one to fire: HE (24”,A1,Blast(3)) AT (24”, A1, AP(1), Deadly(3))",
        cost: 5,
        gains: [
            {
                name: "Grenade Launcher-pick one to fire",
                type: "ArmyBookMultiWeapon",
                profiles: [
                    {
                        label: "HE (24”,A1,Blast(3))",
                        name: "HE",
                        range: 24,
                        attacks: 1,
                        specialRules: [
                            {
                                key: "blast",
                                name: "Blast",
                                rating: "3"
                            }
                        ],
                        type: "ArmyBookWeapon"
                    },
                    {
                        label: "AT (24”, A1, AP(1), Deadly(3))",
                        name: "AT",
                        range: 24,
                        attacks: 1,
                        specialRules: [
                            {
                                key: "ap",
                                name: "AP",
                                rating: "1"
                            },
                            {
                                key: "deadly",
                                name: "Deadly",
                                rating: "3"
                            }
                        ],
                        type: "ArmyBookWeapon"
                    }
                ]
            }
        ]
    });
});

test("Parse equipment with rule", () => {
    const e = parse("Camo Cloaks (Stealth) +10pts", true);

    expect(e).toStrictEqual({
        label: "Camo Cloaks (Stealth)",
        name: "Camo Cloaks",
        type: "ArmyBookItem",
        cost: 10,
        content: [
            {
                key: "stealth",
                name: "Stealth",
                label: "Stealth",
                rating: "",
                type: "ArmyBookRule"
            }
        ]
    });
});

test("Parse equipment with rule", () => {
    const e = parse("Grenadiers (Defense +1) +10pts", true);

    expect(e).toStrictEqual({
        label: "Grenadiers (Defense +1)",
        name: "Grenadiers",
        type: "ArmyBookItem",
        cost: 10,
        content: [
            {
                key: "defense",
                name: "Defense",
                label: "Defense +1",
                rating: "1",
                condition: "",
                type: "ArmyBookRule"
            }
        ]
    });
});

test("Parse equipment with rule", () => {
    const e = parse("Demo Experts (Rending in melee) +10pts", true);

    expect(e).toStrictEqual({
        label: "Demo Experts (Rending in melee)",
        name: "Demo Experts",
        type: "ArmyBookItem",
        cost: 10,
        content: [
            {
                key: "rending",
                name: "Rending",
                label: "Rending in melee",
                rating: "",
                type: "ArmyBookRule",
                condition: "in melee"
            }
        ]
    });
});

test("Parse AoF format mount 1", () => {
    const mount = parse('Great War-Bear - Claws (A3, AP(1)), Fear, Impact(3), Swift, Tough(+3) +120pts');

    const expected = {
        label: "Great War-Bear - Claws (A3, AP(1)), Fear, Impact(3), Swift, Tough(+3)",
        cost: 120,
        gains: [
            {
                label: "Great War-Bear",
                content: [
                    "Fear", "Impact(3)", "Swift", "Tough(+3)"
                ],
                type: "ArmyBookItem"
            },
            {
                label: "Great War-Bear - Claws",
                attacks: 3,
                specialRules: ["AP(1)"]
            }
        ]
    };

    expect(mount).toStrictEqual(expected);
});

test("Parse AoF format mount 2", () => {
    const mount = DataParsingService.parseMount('Ancestral Stone - Tough(+3) +70pts');

    const expected: IEquipment = {
        type: "mount",
        cost: 70,
        equipment: [
            {
                label: "Ancestral Stone",
                specialRules: ["Tough(+3)"]
            }
        ]
    };

    expect(mount).toStrictEqual(expected);
});

test("Parse AoF format mount 3", () => {
    const mount = DataParsingService.parseMount('Shield Carriers - Hand Weapons (A4), Tough(+3) +80pts');

    const expected: IEquipment = {
        type: "mount",
        cost: 80,
        equipment: [
            {
                label: "Shield Carriers",
                specialRules: ["Tough(+3)"],
            },
            {
                label: "Shield Carriers - Hand Weapons",
                attacks: 4,
            }
        ]
    };

    expect(mount).toStrictEqual(expected);
});

test("Parse AoF format mount 4", () => {
    const mount = DataParsingService.parseMount('Beast - Claws(A1), Impact(1), Swift +15pts');

    const expected: IEquipment = {
        type: "mount",
        cost: 15,
        equipment: [
            {
                label: "Beast",
                specialRules: ["Impact(1)", "Swift"],
            },
            {
                label: "Beast - Claws",
                attacks: 1
            }
        ]
    };

    expect(mount).toStrictEqual(expected);
});

test("Parse GFF format mount", () => {
    const e = DataParsingService.parseEquipment('Combat Bike (Fast, Impact(1), Swift, Twin Assault Rifle (24”,A2)) +30pts');

    expect(e).toStrictEqual({
        type: "mount",
        cost: 30,
        equipment: [
            {
                label: "Combat Bike",
                specialRules: [
                    "Fast",
                    "Impact(1)",
                    "Swift",
                ]
            },
            {
                label: "Combat Bike Twin Assault Rifle",
                attacks: 2,
                range: 24,
            },
        ]
    });
});

//#endregion

//#region Special equipment cases

//
test("Parse melee weapon with rules and cost", () => {
    const e = DataParsingService.parseEquipment("Whip Limb and Sword Claw (A3, Deadly(6)) +10pts");

    expect(e).toStrictEqual({
        label: "Whip Limb and Sword Claw",
        cost: 10,
        attacks: 3,
        specialRules: ["Deadly(6)"]
    });
});

//#endregion

//#region Number from name

test("Parse one", () => {
    const num: number = DataParsingService.numberFromName("one");
    expect(num).toBe(1);
});

test("Parse seven", () => {
    const num: number = DataParsingService.numberFromName("seven");
    expect(num).toBe(7);
});

//#endregion

//#region Parse Upgrades

test("Upgrade section 1", () => {

    const input = `
C Upgrade Psychic(1):
Psychic(2) +15pts
    `.trim();

    const upgradePackage = DataParsingService.parseUpgrades(input);

    expect(upgradePackage).toStrictEqual([{
        "uid": "C1",
        //"hint": "C - Psychic Upgrades",
        "sections": [
            {
                "label": "Upgrade Psychic(1)",
                "type": "upgradeRule",
                "replaceWhat": "Psychic(1)",
                "options": [
                    {
                        "cost": "+15",
                        "type": "ArmyBookUpgradeOption",
                        "gains": [
                            {
                                "key": "psychic",
                                "name": "Psychic",
                                "type": "ArmyBookRule",
                                "label": "Psychic(2)",
                                //"modify": false,
                                "rating": "2",
                                //"condition": ""
                            }
                        ],
                        "label": "Psychic(2)"
                    }
                ]
            }
        ]
    }]);
});

test("Upgrade section 2", () => {
    const input = `
A Replace one CCW
Energy Sword (A2, AP(1), Rending) +5pts
    `;

    const upgradePackage = DataParsingService.parseUpgrades(input);

    // TODO: ...
    expect(upgradePackage).toStrictEqual([{
        uid: "A1",
        sections: [{
            "label": "Replace one CCW",
            "options": [
                {
                    "cost": 5,
                    "type": "ArmyBookUpgradeOption",
                    "gains": [
                        {
                            "name": "Energy Sword",
                            "type": "ArmyBookWeapon",
                            "label": "Energy Sword (A2, AP(1), Rending)",
                            "range": 0,
                            "attacks": 2,
                            "condition": "",
                            "specialRules": [
                                {
                                    "key": "ap",
                                    "name": "AP",
                                    "type": "ArmyBookRule",
                                    "label": "AP(1)",
                                    "modify": false,
                                    "rating": "1",
                                    "condition": ""
                                },
                                {
                                    "key": "rending",
                                    "name": "Rending",
                                    "type": "ArmyBookRule",
                                    "label": "Rending",
                                    "modify": false,
                                    "rating": "",
                                    "condition": ""
                                }
                            ]
                        }
                    ],
                    "label": "Energy Sword (A2, AP(1), Rending)"
                }
            ]
        }]
    }]);
})

//#endregion

//#region Parse Rules

test("Parse rules from pdf", () => {
    const input = `
Attack Bomb: Whenever this unit moves over enemies pick one of them and roll 1 die, on a 2+ it takes 3 hits with AP(1).
Ballistic Master: When the hero is activated pick one friendly Artillery unit within 6”, which may either get +2 to its shooting rolls or move up to 6” during its next activation.
Bombing Run: Whenever this unit moves over enemies pick one of them and roll 3 dice, for each 2+ it takes 3 hits with AP(1).
Drill: The unit may be deployed from Ambush at up to 3” from enemy units.
Grudge: The hero and his unit get +1 to their rolls when fighting in melee.
Slayer: This model gets AP(+2) when fighting units with Tough(3) or higher.
Swift: The hero may ignore the Slow rule.
`;

    const rules = DataParsingService.parseRules(input);

    expect(rules.length).toBe(7);
    expect(rules[2]).toStrictEqual({
        label: "Bombing Run",
        description: "Whenever this unit moves over enemies pick one of them and roll 3 dice, for each 2+ it takes 3 hits with AP(1)."
    });

});

test("Parse special rules with bullets:", () => {
    const input = `
Battle Drills: The hero and his unit get the Furious special rule.
Commander: When the hero and his unit are activated pick one of the following orders, and they get one of these special rules until the end of the round:  Double Time: +3” when moving  Take Aim: +1 to shooting rolls  Focus Fire: AP(+1) when shooting  Fix Bayonets: +1 to melee rolls
    `;

    const rules = DataParsingService.parseRules(input);
    expect(rules).toStrictEqual([
        {
            label: "Battle Drills",
            description: "The hero and his unit get the Furious special rule."
        },
        {
            label: "Commander",
            description: "When the hero and his unit are activated pick one of the following orders, and they get one of these special rules until the end of the round:",
            options: [
                "Double Time: +3” when moving",
                "Take Aim: +1 to shooting rolls",
                "Focus Fire: AP(+1) when shooting",
                "Fix Bayonets: +1 to melee rolls"
            ]
        }
    ]);
});

test('Parse special rules with bullets 2', () => {
    const input = `
    Captain: When the hero and his unit are activated pick one of the following orders, and they get one of these special rules until the end of the round: • At the Double: +3” when moving • Precision Fire: +1 to shooting rolls • Crank Up: AP(+1) when shooting • Assault Stance: +1 to melee rolls
    Good Shot: This model shoots at Quality 4+.
    Trickster: When this model fights in melee roll one die and apply one bonus: • 1-3: Unit gets AP(+1) • 4-6: Enemies get -1 to hit
`;
    const rules = DataParsingService.parseRules(input);
    expect(rules).toStrictEqual([
        {
            label: "Captain",
            description: "When the hero and his unit are activated pick one of the following orders, and they get one of these special rules until the end of the round:",
            options: [
                "At the Double: +3” when moving",
                "Precision Fire: +1 to shooting rolls",
                "Crank Up: AP(+1) when shooting",
                "Assault Stance: +1 to melee rolls"
            ]
        },
        {
            label: "Good Shot",
            description: "This model shoots at Quality 4+."
        },
        {
            label: "Trickster",
            description: "When this model fights in melee roll one die and apply one bonus:",
            options: [
                "1-3: Unit gets AP(+1)",
                "4-6: Enemies get -1 to hit"
            ]
        }
    ]);
})

//#endregion

//#region Parse Spells

test("Parse Spells from pdf", () => {
    const input = `
Spite Rune (4+): Target enemy unit within 12” gets -1 to hit in melee next time it fights.
Smiting Rune (4+): Target enemy unit within 12” takes 4 automatic hits.
Battle Rune (5+): Target friendly unit within 12” gets +6” next time it moves.
Breaking Rune (5+): Target enemy model within 12” takes 2 automatic hits with AP(2).
Drill Rune (6+): Target piece of terrain within 6” may be moved by up to 6” in any direction or may be removed from play.
Cleaving Rune (6+): Target 2 enemy units within 12” take 6 automatic hits each.
`;

    const spells = DataParsingService.parseSpells(input);

    expect(spells.length).toBe(6);
    expect(spells[2]).toStrictEqual({
        label: "Battle Rune",
        test: "5+",
        description: "Target friendly unit within 12” gets +6” next time it moves."
    });
});

//#endregion


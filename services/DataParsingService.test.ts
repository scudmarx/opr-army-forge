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

test("Parse simple melee weapon", () => {
    const e = DataParsingService.parseEquipment("Sword (A3)");

    expect(e).toStrictEqual({
        name: "Sword",
        attacks: 3
    });
});

test("Parse melee weapon with rules", () => {
    const e = DataParsingService.parseEquipment("Sword (A3, Rending, AP(1))");

    expect(e).toStrictEqual({
        name: "Sword",
        attacks: 3,
        specialRules: ["Rending", "AP(1)"]
    });
});

test("Parse multiple melee weapon with rules", () => {
    const e = DataParsingService.parseEquipment("2x Sword (A3, Rending, AP(1))");

    expect(e).toStrictEqual({
        name: "2x Sword",
        //count: 2,
        attacks: 3,
        specialRules: ["Rending", "AP(1)"]
    });
});

test("Parse melee weapon with rules and cost", () => {
    const e = DataParsingService.parseEquipment("Sword (A3, Rending, AP(1)) +5pts");

    expect(e).toStrictEqual({
        name: "Sword",
        cost: 5,
        attacks: 3,
        specialRules: ["Rending", "AP(1)"]
    });
});

test("Parse Free weapon", () => {
    const e = DataParsingService.parseEquipment("Sword (A3, AP(1)) Free");

    expect(e).toStrictEqual({
        name: "Sword",
        cost: 0,
        attacks: 3,
        specialRules: ["AP(1)"]
    });
});

test("Parse simple ranged weapon", () => {
    const e = DataParsingService.parseEquipment("Pistol (6\", A3)");

    expect(e).toStrictEqual({
        name: "Pistol",
        range: 6,
        attacks: 3
    });
});

test("Parse ranged weapon with rules", () => {
    const e = DataParsingService.parseEquipment("Pistol (6\", A3, Rending, AP(1))");

    expect(e).toStrictEqual({
        name: "Pistol",
        range: 6,
        attacks: 3,
        specialRules: ["Rending", "AP(1)"]
    });
});

test("Parse standard rule", () => {
    const e = DataParsingService.parseEquipment("Field Radio +5pts");

    expect(e).toStrictEqual({
        name: "Field Radio",
        cost: 5,
        specialRules: ["Field Radio"]
    });
});

test("Parse standard rule", () => {
    const e = DataParsingService.parseEquipment("SHOOT! +15pts");

    expect(e).toStrictEqual({
        name: "SHOOT!",
        cost: 15,
        specialRules: ["SHOOT!"]
    });
});

test("Parse parameterised rule", () => {
    const e = DataParsingService.parseEquipment("Psychic(2) +10pts");

    expect(e).toStrictEqual({
        name: "Psychic(2)",
        cost: 10,
        specialRules: ["Psychic(2)"]
    });
});

test("Parse weapon pairing with non-standard rules", () => {
    const e = DataParsingService.parseEquipment("Light Shields (Defense +1 in melee) and Shield Bash (A2) Free");
    expect(e).toStrictEqual({
        type: "combined",
        cost: 0,
        equipment: [
            {
                name: "Light Shields",
                specialRules: ["Defense +1 in melee"]
            },
            {
                name: "Shield Bash",
                attacks: 2
            }
        ]
    });
});

test("Parse weapon pairing", () => {
    const e = DataParsingService.parseEquipment("Plasma Pistol (12”, A1, AP(2)) and CCW (A2) +5pts");
    expect(e).toStrictEqual({
        type: "combined",
        cost: 5,
        equipment: [
            {
                name: "Plasma Pistol",
                range: 12,
                attacks: 1,
                specialRules: ["AP(2)"]
            },
            {
                name: "CCW",
                attacks: 2
            }
        ]
    });
});

''
'Ancestral Stone - Tough(+3) +70pts'
'Shield Carriers - Hand Weapons (A4), Tough(+3) +80pts'
'Great War-Bear - Claws (A3, AP(1)), Fear, Impact(3), Swift, Tough(+3) +120pts'

test("Parse AoF format mount 1", () => {
    const mount = DataParsingService.parseMount('Great War-Bear - Claws (A3, AP(1)), Fear, Impact(3), Swift, Tough(+3) +120pts');

    const expected: IEquipment = {
        type: "mount",
        cost: 120,
        equipment: [
            {
                name: "Great War-Bear",
                specialRules: ["Fear", "Impact(3)", "Swift", "Tough(+3)"],
            },
            {
                name: "Great War-Bear - Claws",
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
                name: "Ancestral Stone",
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
                name: "Shield Carriers",
                specialRules: ["Tough(+3)"],
            },
            {
                name: "Shield Carriers - Hand Weapons",
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
                name: "Beast",
                specialRules: ["Impact(1)", "Swift"],
            },
            {
                name: "Beast - Claws",
                attacks: 1
            }
        ]
    };

    expect(mount).toStrictEqual(expected);
});

//#endregion

//#region Special equipment cases

//
test("Parse melee weapon with rules and cost", () => {
    const e = DataParsingService.parseEquipment("Whip Limb and Sword Claw (A3, Deadly(6)) +10pts");

    expect(e).toStrictEqual({
        name: "Whip Limb and Sword Claw",
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
        name: "Bombing Run",
        description: "Whenever this unit moves over enemies pick one of them and roll 3 dice, for each 2+ it takes 3 hits with AP(1)."
    });

});

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
        name: "Battle Rune",
        test: "5+",
        description: "Target friendly unit within 12” gets +6” next time it moves."
    });
});

//#endregion

//#region PDF Input Parsing

test("Alien Hives Upgrades", () => {

    const input = `
A Replace any Razor Claws:
Piercing Claws (A4, AP(2), Rending) +5pts
Smashing Claws (A4, AP(4)) +10pts
Serrated Claws (A8, AP(2)) +15pts
Sword Claws (A4, AP(2), Deadly(3)) +15pts
Whip Limb and Sword Claw
(A3, AP(1), Deadly(6))

+20pts
B Replace any Razor Claws:
Twin Bio-Pistols (12”, A6) -5pts
Bio-Carbine (18”, A3) -5pts
Bio-Spitter (24”, A1, Blast(3)) -5pts
Heavy Bio-Carbine (18”, A6, AP(1)) +10pts
Barb Cannon
(36”, A1, AP(1), Blast(3))

+10pts

Acid Cannon
(36”, A1, AP(3), Deadly(3))

+15pts

Heavy Bio-Spitter
(24”, A2, AP(1), Blast(3))

+20pts

Heavy Barb Cannon
(36”, A1, AP(1), Blast(6))

+40pts

Heavy Acid Cannon
(36”, A1, AP(3), Deadly(6))

+45pts
Upgrade with one:
Tail Pincer (A2, AP(2), Rending) +10pts
Tail Mace (A2, AP(4)) +10pts
Tail Whip (A4, AP(2)) +15pts
Tail Scythe (A2, AP(2), Deadly(3)) +15pts
C Upgrade any model with one:
Poison Hooks (6”, A3, Poison) +5pts
Shredding Hooks (6”, A3, Rending) +5pts
Shock Hooks (6”, A3, AP(2)) +5pts
Acid Hooks (6”, A3, Deadly(3)) +5pts
D Upgrade with any:
Bio-Recovery (Regeneration) +70pts
E Upgrade with:
Wings (Ambush, Flying) +15pts
F Upgrade one model with any:
Psychic Barrier +10pts
Pheromones +15pts
G Upgrade Psychic(1):
Psychic(2) +15pts
H Upgrade any model with:
Razor Claws (A3) +5pts
Upgrade one model with:
Psychic(1) +20pts

I Replace any Razor Claws:
Piercing Claws (A4, AP(1), Rending) +5pts
Smashing Claws (A4, AP(3)) +5pts
Serrated Claws (A8, AP(1)) +10pts
Sword Claws (A4, AP(1), Deadly(3)) +10pts
Whip Limb and Sword Claw
(A3, Deadly(6))

+10pts
J Replace any Bio-Carbine:
Razor Claws (A4, AP(1)) +5pts
Twin Bio-Pistols (12”, A6) +5pts
Heavy Bio-Carbine (18”, A3, AP(1)) +5pts
Bio-Spitter (24”, A1, Blast(3), AP(1)) +10pts
Replace one Bio-Carbine:
Shredder Cannon
(24” A4, Rending)

+10pts

Barb Cannon
(36”, A1, AP(1), Blast(3))

+15pts

Acid Cannon
(36”, A1, AP(3), Deadly(3))

+15pts
K Upgrade all models with:
Wings (Ambush, Flying) +35pts
L Replace any Bio-Gun:
Twin Bio-Pistols (12”, A2) +5pts
Bio-Spike (18”, A1, AP(1)) +5pts
Bio-Carbine (18”, A3) +10pts
Replace one Bio-Gun:
Bio-Shredder (6”, A2, Rending) +5pts
Shock-Gun (12”, A1, AP(2)) +5pts
Bio-Flamer (12”, A6) +10pts
Acid-Gun (6”, A1, AP(3), Deadly(3)) +10pts
Bio-Rifle (18”, A1, AP(1), Sniper) +10pts
Upgrade all models with any:
Adrenaline (Furious) +10pts
Toxic Bite (Poison in melee) +10pts
M Replace any Razor Claws:
Serrated Claws (A6) +5pts
Piercing Claws (A3, Rending) +5pts
Smashing Claws (A3, AP(2)) +5pts
Sword Claws (A3, Deadly(3)) +5pts
Upgrade all models with any:
Adrenaline (Furious) +10pts
Toxic Bite (Poison in melee) +10pts
N Upgrade all models with any:
Burrow Attack (Ambush) +5pts
Twin Bio-Pistols (12”, A6) +10pts

O Upgrade all models with one:
Tunnel Attack (Ambush) +20pts
Adrenaline Rush (Scout) +20pts
P Any model may replace
one Razor Claws:

Heavy Shock-Gun
(24”, A1, AP(2), Blast(3))

+10pts

Bio-Harpoon
(24”, A2, AP(4), Deadly(3))

+30pts
`;

});

//#endregion

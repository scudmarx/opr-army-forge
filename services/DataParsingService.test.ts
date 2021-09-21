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
        name: "Sword",
        count: 2,
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
var units = `
Captain [1] 3+ 2+ Assault Rifle (24”, A1), CCW (A1) Fearless, Hero, Relentless, Tough(3) A, B, C 90pts
Champion [1] 3+ 2+ Assault Rifle (24”, A1), CCW (A1) Fearless, Hero, Tough(3) A, B, C 80pts
Engineer [1] 3+ 2+ Assault Rifle (24”, A1), CCW (A1) Fearless, Hero, Repair, Tough(3) A, B 90pts
Psychic [1] 3+ 2+ Assault Rifle (24”, A1), CCW (A1) Fearless, Hero, Psychic(1), Tough(3) A, B, D 100pts
Pathfinders [5] 3+ 4+ Assault Rifles (24”, A1), CCWs (A1) Fearless, Strider A, H 140pts
Battle Brothers [5] 3+ 2+ Assault Rifles (24”, A1), CCWs (A1) Fearless A, E 150pts
Assault Brothers [5] 3+ 2+ Pistols (12”, A1), CCWs (A2) Fearless A, F 150pts
Support Brothers [5] 3+ 2+ Assault Rifles (24”, A1), CCWs (A1) Fearless, Relentless A, G 160pts
Brother Bikers [3] 3+ 2+ Assault Rifles (24”, A1), CCWs (A1) Fast, Fearless, Impact(1) A, I 125pts
Pathfinder Bikers[3] 3+ 4+ Assault Rifles (24”, A1), CCWs (A1) Fast, Fearless, Impact(1), Scout A, J 130pts
Support Bike [1] 3+ 2+ Heavy Flamethrower (12”, A6, AP(1)), Assault Rifle (24”, A1), CCW (A1) Fast, Fearless, Impact(3), Tough(3) A, K 115pts
Destroyers [5] 3+ 2+ Storm Rifles (24”, A2), Energy Fists (A2, AP(3)) Ambush, Fearless, Tough(3) A 490pts
Heavy Exo-Suits [3] 3+ 2+ Twin Flamethrowers (12”,A12), CCWs (A1,AP(1)) Fearless, Slow, Tough(6) B 490pts
APC [1] 3+ 2+ Storm Rifle (24”, A2) Fast, Fearless, Impact(6), Tough(6), Transport(11) C 200pts
Attack APC [1] 3+ 2+ Twin Heavy Flamethrower (12”, A12, AP(1)) Fast, Fearless, Impact(6), Tough(6), Transport(6) C, D 220pts
Drop Pod [1] 3+ 2+ Storm Rifle (24”, A2) Ambush, Fearless, Immobile, Large Cargo, Tough(6), Transport(11) E 160pts
Attack Speeder [1] 3+ 2+ 2x Heavy Flamethrower (12”, A6, AP(1)) Ambush, Fast, Fearless, Impact(6), Strider, Tough(6) F 220pts
Artillery Cannon[1] 3+ 2+ Cannon (48”, A2, AP(1), Blast(3), Indirect), Engineer (A2, AP(2)) Fearless, Repair, Slow, Tough(6) - 245pts
Battle Tank [1] 3+ 2+ Autocannon (48”, A2, AP(2)) Fast, Fearless, Impact(6), Tough(12) A, B, C 345pts
Heavy Battle Tank [1] 3+ 2+ Twin Heavy Machinegun (36”, A6, AP(1)), 2x Assault Rifle Arrays (24”, A6) Fast, Fearless, Impact(6), Tough(18), Transport(11) A, B, D 580pts
Attack Walker[1] 3+ 2+ Storm Rifle (24”, A2),Walker Fist (A4, AP(4)), Assault Rifle Array (24”, A6), Stomp (A2, AP(1)) Fear, Fearless, Tough(12) B, H 370pts
Talon Gunship[1] 3+ 2+ Twin Minigun (24”, A8, AP(1)), Twin Heavy Machinegun (36”, A6, AP(1)) Aircraft, Fearless, Tough(6) E 260pts
Hawk Interceptor [1] 3+ 2+ Twin Minigun (24”, A8, AP(1)), Twin Heavy Machinegun (36”, A6, AP(1)), Laser Talon (24”, A2, AP(4), Deadly(3)) Aircraft, Fearless, Tough(6) F 310pts
Raven Heavy Gunship [1] 3+ 2+ Twin Minigun (24”, A8, AP(1)), Twin Heavy Machinegun (36”, A6, AP(1)), Storm Missiles (48”, A1, AP(3), Deadly(3)) Aircraft, Fearless, Tough(12), Transport(11) G 465pts
`;

var upgrades = `
A Replace Bio-Carbine:
Razor Claws (A4, AP(1)) +5pts
Twin Bio-Pistols (12”, A6) +5pts
Heavy Bio-Carbine (18”, A3, AP(1)) +5pts
Bio-Spitter (24”, A1, Blast(3), AP(1)) +10pts
Shredder Cannon (24” A4, Rending) +10pts
Barb Cannon (36”, A1, AP(1), Blast(3)) +15pts
Acid Cannon (36”, A1, AP(3), Deadly(3)) +15pts
Upgrade with one:
Poison Hooks (6”, A3, Poison) +5pts
Shredding Hooks (6”, A3, Rending) +5pts
Shock Hooks (6”, A3, AP(2)) +5pts
Acid Hooks (6”, A3, Deadly(3)) +5pts
Upgrade with:
Wings (Ambush, Flying) +15pts
B Replace any Razor Claws:
Piercing Claws (A4, AP(1), Rending) +5pts
Smashing Claws (A4, AP(3)) +5pts
Serrated Claws (A8, AP(1)) +10pts
Sword Claws (A4, AP(1), Deadly(3)) +10pts
Whip Limb and Sword Claw (A3, Deadly(6)) +10pts
`;

function parseEquipment(str) {
  var parts = str
    .split(/(?<!\(\d)\),/)
    .map((part) => part.trim())
    .map((part) => (/(?<!\(\d)\)/.test(part) ? part : part + ")"))
    .map((part) => {
      if (part === "-)") return null;

      const match = /((\d+)x\s)?(.+?)\((.+)\)\s?([+-]\d+)?/.exec(part);
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
        cost: match[5] ? parseInt(match[4].trim()) : undefined,
      };
    })
    .filter((p) => !!p);
  return parts;
}

function parseUnits() {
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
    console.log(parsed);
    results.push(parsed);
  }

  const unitsJson = JSON.stringify(results, null, 2);

  console.log(unitsJson);
  console.log(results);
}

function parseUpgrades() {
  const results = {};
  const groupNames = {
    setLetter: 1,
    upgradeText: 2,
  };
  let groupIndex = 1;
  let lastGroupId = null;
  let lastUpgradeText = null;
  for (let line of upgrades.split("\n").filter((l) => !!l)) {
    const parsedUpgrade = /^(\D\s)?(.+?):|(.+?)\s\((.+)\)\s?([+-]\d+)?/.exec(
      line
    );

    const setLetter = parsedUpgrade[groupNames.setLetter]?.trim();
    const upgradeText = parsedUpgrade[groupNames.upgradeText];
    const isNewGroup = !!setLetter;
    const isUpgrade = !!upgradeText;

    if (isNewGroup) {
      const groupExists = !!results[setLetter+groupIndex];
      const groupId = results[setLetter+groupIndex] ? setLetter + (++groupIndex) : setLetter;
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
        .options.push(option);
    }

    console.log(results);
  }

  const upgradesJson = JSON.stringify(results, null, 2);

  console.log(upgradesJson);
  console.log(results);
}

parseUpgrades();

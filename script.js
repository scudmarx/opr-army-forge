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
A Replace any Razor Claws:
Piercing Claws (A4, AP(2), Rending) +5pts
Smashing Claws (A4, AP(4)) +10pts
Serrated Claws (A8, AP(2)) +15pts
Sword Claws (A4, AP(2), Deadly(3)) +15pts
Whip Limb and Sword Claw (A3, AP(1), Deadly(6)) +20pts
B Replace any Razor Claws:
Twin Bio-Pistols (12”, A6) -5pts
Bio-Carbine (18”, A3) -5pts
Bio-Spitter (24”, A1, Blast(3)) -5pts
Heavy Bio-Carbine (18”, A6, AP(1)) +10pts
Barb Cannon (36”, A1, AP(1), Blast(3)) +10pts
Acid Cannon (36”, A1, AP(3), Deadly(3)) +15pts
Heavy Bio-Spitter (24”, A2, AP(1), Blast(3)) +20pts
Heavy Barb Cannon (36”, A1, AP(1), Blast(6)) +40pts
Heavy Acid Cannon (36”, A1, AP(3), Deadly(6)) +45pts
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
Whip Limb and Sword Claw (A3, Deadly(6)) +10pts
J Replace any Bio-Carbine:
Razor Claws (A4, AP(1)) +5pts
Twin Bio-Pistols (12”, A6) +5pts
Heavy Bio-Carbine (18”, A3, AP(1)) +5pts
Bio-Spitter (24”, A1, Blast(3), AP(1)) +10pts
Replace one Bio-Carbine:
Shredder Cannon (24” A4, Rending) +10pts
Barb Cannon (36”, A1, AP(1), Blast(3)) +15pts
Acid Cannon (36”, A1, AP(3), Deadly(3)) +15pts
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
P Any model may replace one Razor Claws:
Heavy Shock-Gun (24”, A1, AP(2), Blast(3)) +10pts
Bio-Harpoon (24”, A2, AP(4), Deadly(3)) +30pts
`;

function parseEquipment(str) {
  var parts = str
    .split(/(?<!\(\d)\),/)
    .map((part) => part.trim())
    .map((part) => (/(?<!\(\d)\)/.test(part) ? part : part + ")"))
    .map((part) => {
      if (part === "-)") return null;

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
          .options.push(option);
      }
    } catch (e) {
      console.log(e);
      console.log(line);
    }
  }

  const upgradesJson = JSON.stringify(results, null, 2);

  console.log(upgradesJson);
  console.log(results);
}

parseUpgrades();

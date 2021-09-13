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

var results = [];

function parseEquipment(str) {
  var parts = str
    .split(/(?<!\(\d)\),/)
    .map((part) => part.trim())
    .map((part) => (/(?<!\(\d)\)/.test(part) ? part : part + ")"))
    .map((part) => {
      if (part === "-)") return null;

      const match = /((\d+)x\s)?(.+?)\((.+)\)/.exec(part);
      const attacksMatch = /A(\d+)[,\)]/.exec(part);
      const rangeMatch = /(\d+)["”][,\)]/.exec(part);
      const rules = match[4].split(",").map((r) => r.trim());
      const specialRules = rules.filter(
        (r) => !/A\d+/.test(r) && !/\d+["”]/.test(r)
      );

      return {
        name: match[3].trim(),
        count: match[2] ? parseInt(match[2]) : undefined,
        attacks: attacksMatch ? parseInt(attacksMatch[1]) : undefined,
        range: rangeMatch ? parseInt(rangeMatch[1]) : undefined,
        specialRules: specialRules.length ? specialRules : undefined,
      };
    })
    .filter((p) => !!p);
  return parts;
}

for (var line of units.split("\n").filter((l) => !!l)) {
  var match =
    /^(.+)\[(\d+)\]\s(\d+\+)\s(\d+\+)\s(.*?\)\s|-)(.+?)((?:[A-Z],?\s?|-\s?)+)(\d+)pt/gm.exec(
      line
    );

  var parsed = {
    name: match[1].trim(),
    size: parseInt(match[2]),
    quality: match[3],
    defense: match[4],
    equipment: parseEquipment(match[5]),
    specialRules: match[6].split(",").map((s) => s.trim()),
    upgradeSets:
      match[7] && match[7].trim() === "-"
        ? []
        : match[7].split(",").map((s) => s.trim()),
    cost: parseInt(match[8]),
  };
  console.log(parsed);
  results.push(parsed);
}


console.log(JSON.stringify(results, null, 2));
console.log(results);

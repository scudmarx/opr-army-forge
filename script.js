var units = `
Hive Lord [1] 3+ 2+ 3x Razor Claws (A4, AP(2)), Stomp (A2, AP(1)) Fear, Fearless, Hero, Tough(12) A, B, C, D, E, F 345pts
Prime Warrior [1] 3+ 2+ 2x Razor Claws (A4, AP(2)) Fear, Hero, Tough(6) A,B,C,E,F 170pts
Veteran Warrior [1] 4+ 3+ Bio-Carbine (18”, A3), Razor Claws (A4, AP(1)) Hero, Tough(6) C,E,F,I,J 100pts
Snatcher Lord [1] 3+ 3+ 2x Piercing Claws (A3, AP(2), Rending) Fast, Fear, Hero, Psychic(1), Scout, Strider, Tough(6) G 190pts
Snatcher Veteran [1] 3+ 4+ 2x Piercing Claws (A3, Rending) Fast,Hero,Scout,Strider,Tough(3) H 80pts
Grunts [10] 5+ 5+ Bio-Guns (12”, A1), Razor Claws (A2) Strider L 130pts
Assault Grunts [10] 5+ 5+ Razor Claws (A3) Fast, Strider M 170pts
Winged Grunts [10] 5+ 5+ Bio-Guns (12”, A1), Razor Claws (A2) Ambush, Flying L 190pts
Soul-Snatchers [5] 3+ 4+ Piercing Claws (A3, Rending) Fast, Scout, Strider H 215pts
Hive Swarm [3] 6+ 6+ Swarm Attacks (A3, Poison) Fearless, Tough(3) N 60pts
Hive Warriors [3] 4+ 3+ Bio-Carbines (18”, A3), Razor Claws (A4, AP(1)) Fearless, Tough(3) C,F,I,J,K 190pts
Ravenous Beasts [3] 4+ 3+ 2x Razor Claws (A4, AP(1)) Fast, Strider, Tough(3) I, O 205pts
Venom Floaters [3] 4+ 3+ Whip Limbs (A8, Poison) Shrouding Mist, Stealth, Tough(3) - 235pts
Synapse Floaters [3] 4+ 3+ Psychic Blast (18”, A1, AP(1), Blast(3)), Psychic Shock (A1) Regeneration, Psychic Synapse, Stealth, Tough(3) F 285pts
Hive Guardians [3] 3+ 2+ 2x Razor Claws (A4, AP(2)) Relentless, Tough(3) A, P 275pts
Shadow Hunter [1] 3+ 3+ 2x Razor Claws (A4, AP(2)) Ambush, Fast, Fear, Stealth, Strider, Tough(6) A, C 180pts
`;

var results = [];

function parseEquipment(str) {
  var parts = str
    .split(/(?<!\(\d)\),/)
    .map((part) => part.trim())
    .map((part) => (part.endsWith(")") ? part : part + ")"))
    .map((part) => {
      const match = /((\d+)x\s)?(.+?)\((.+)\)/.exec(part);
      const attacksMatch = /A(\d+)[,\)]/.exec(part);
      const rangeMatch = /(\d+)["”][,\)]/.exec(part);
      const rules = match[4].split(",").map((r) => r.trim());
      const specialRules = rules.filter(
        (r) => !/A\d+/.test(r) && !/\d+"/.test(r)
      );

      return {
        name: match[3].trim(),
        count: match[2] ? parseInt(match[2]) : undefined,
        attacks: attacksMatch ? parseInt(attacksMatch[1]) : undefined,
        range: rangeMatch ? parseInt(rangeMatch[1]) : undefined,
        specialRules: specialRules.length ? specialRules : undefined,
      };
    });
  return parts;
}

for (var line of units.split("\n").filter((l) => !!l)) {
  var match =
    /^(.+)\[(\d+)\]\s(\d+\+)\s(\d+\+)\s(.*?\)\s)(.+?)((?:[A-Z],?\s|-\s?)+)(\d+)pt/gm.exec(
      line
    );

  var parsed = {
    name: match[1].trim(),
    size: parseInt(match[2]),
    quality: match[3],
    defense: match[4],
    equipment: parseEquipment(match[5]),
    specials: match[6].split(",").map((s) => s.trim()),
    upgrades: match[7].split(",").map((s) => s.trim()),
    cost: parseInt(match[8]),
  };
  console.log(parsed);
  results.push(parsed);
}

console.log(JSON.stringify(results, null, 2));
console.log(results);

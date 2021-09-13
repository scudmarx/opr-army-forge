import fs from 'node';

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
Carnivo-Rex [1] 4+ 2+ Vicious Jaws (A4, AP(3)), 2x Razor Claws (A4, AP(2)), Stomp (A2, AP(1)) Fear, Fearless, Tough(12) A, B, C, D 305pts
Toxico-Rex [1] 4+ 2+ Acid Spurt (12”, A1, Blast(6), Poison),Whip Limbs (A16, Poison), Stomp (A2, AP(1))Fear, Fearless, Shrouding Mist,Stealth, Tough(12) A, D 375pts
Psycho-Rex [1] 4+ 2+ Psychic Blast (18”, A2, AP(1), Blast(3)), 2x Razor Claws (A4, AP(2)), Stomp (A2, AP(1)) Fear, Fearless, Psychic(2), Regeneration, Stealth, Tough(12) A, B, D, E 405pts
Burrower [1] 3+ 2+ 3x Razor Claws (A4, AP(2)), Stomp (A3, AP(2)) Fear, Surprise Attack, Tough(18) B, D, F 480pts
Devourer Beast [1] 3+ 2+ Tongue (12”, A3, AP(4), Deadly(3), Sniper), 2x Razor Claws (A4, AP(2)), Stomp (A3, AP(2)) Fear, Tough(18) B, F 490pts
Tyrant Beast [1] 3+ 2+ Toxic Spray (18”, A18, AP(1)), 2x Razor Claws (A4, AP(2)), Stomp (A3, AP(2)) Fear, Tough(18) B, F, G 505pts
Artillery Beast [1] 3+ 2+ Bio-Artillery (36”, A3, Blast(6), Indirect), 2x Razor Claws (A4, AP(2)), Stomp (A3, AP(2)) Fear, Tough(18) B, F, H 560pts
Spawning Beast [1] 3+ 2+ Stinger Cannon (18”, A12, AP(1)), 2x Razor Claws (A4, AP(2)), Stomp (A3, AP(2)) Fear, Spawn Brood, Tough(18) B, F 630pts
Flamer Beast [1] 4+ 2+ Spit Flames (18”, A12, AP(1), Indirect), Razor Claws (A4, AP(2)) Fear, Fearless, Tough(6) B 205pts
Mortar Beast [1] 4+ 2+ Spore Gun (24”, A1, Blast(9), Indirect, Spores), Razor Claws (A4, AP(2)) Fear, Fearless, Tough(6) B 265pts
Invasion Carrier [1] 5+ 2+ Razor Tendrils (A5, AP(1)) Ambush, Fear, Fearless, Tough(6), Transport Spore I, J 160pts
Invasion Artillery [1] 5+ 2+ Spit Spores (12”, A1, Blast(9), Indirect, Spores), Razor Tendrils (A5, AP(1)) Ambush, Fear, Fearless, Slow, Tough(6) I, J 210pts
Rapacious Beast [1] 4+ 2+ Caustic Cannon (12”, A6, AP(2)) Aircraft, Fearless, Tough(6) I, K 155pts
Hive Titan [1] 3+ 2+ Vicious Jaws (A3, AP(4), Deadly(6)), Titanic Stomp (A12, AP(2)) Regeneration, Terrifying, Tough(24) L 840pts
Spores [3] 6+ 6+ - Explosive Head - 40pts
Massive Spore [1] 6+ 6+ - Explosive Head, Tough(3) - 40pts
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

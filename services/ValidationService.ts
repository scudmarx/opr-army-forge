import { ListState } from "../data/listSlice";
import _ from "lodash";
import { ArmyState } from "../data/armySlice";

export default class ValidationService {
  public static getErrors(army: ArmyState, list: ListState): string[] {

    if (!army || !list)
      return [];

    const errors = [];

    if (list.pointsLimit > 0 && list.points > list.pointsLimit)
      errors.push(`Points limit exceeded: ${list.points}/${list.pointsLimit}`)

    const points = list.pointsLimit || list.points;

    if (list.competitive) {
      if (army.gameSystem === "gf") {

        const unitCount = list.units.filter(u => !u.joinToUnit).length;
        const heroes = list.units.filter(u => u.specialRules.some(rule => rule.name === "Hero"))
        const heroCount = heroes.length;
        const joinedHeroes = heroes.filter(u => (u.joinToUnit && list.units.some(t => t.selectionId === u.joinToUnit)))
        const joinedIds = joinedHeroes.map(u => u.joinToUnit)
        console.log(joinedHeroes, joinedIds)

        if (heroCount > Math.floor(points / 500))
          errors.push(`Max 1 hero per full 500pts.`);
        if (unitCount > Math.floor(points / 200))
          errors.push(`Max 1 unit per full 200pts (combined units count as just 1 unit).`);
        if (list.units.some(u => u.combined && u.size === 1))
          errors.push(`Cannot combine units of unit size [1].`);
        if (list.units.some(u => u.size === 1 && joinedIds.includes(u.selectionId)))
          errors.push(`Heroes cannot join units that only contain a single model.`);
        if (new Set(joinedIds).size < joinedIds.length)
          errors.push(`A unit can only have a maximum of one Hero attached.`);
        if (Object.values(_.groupBy(list.units.filter(u => !(u.combined && (!u.joinToUnit))), u => u.name)).some((grp: any[]) => grp.length > 3))
          errors.push(`Cannot have more than 3 copies of a particular unit.`); // combined units still count as one
      }
    }
    return errors;
  }
}
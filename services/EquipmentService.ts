import { IUpgradeGains, IUpgradeGainsItem, IUpgradeGainsMultiWeapon, IUpgradeGainsRule, IUpgradeGainsWeapon } from "../data/interfaces";
import pluralise from "pluralize";
import RulesService from "./RulesService";

export default class EquipmentService {

  public static GenericTerms = ["weapon", "equipment", "gun", "model"]

  public static compareEquipmentNames(hasItem: string, searchItem: string): boolean {
    let find = searchItem.toLowerCase()
    // generic terms that match to any equipment (so long as there is any equipment)
    if (this.GenericTerms.includes(pluralise.singular(find))) return !!hasItem
    //return pluralise.singular(a).indexOf(pluralise.singular(b)) > -1;
    return pluralise.singular(hasItem.toLowerCase() || "") === pluralise.singular(find || "");
  }

  public static find(list: IUpgradeGainsWeapon[], match: string): IUpgradeGainsWeapon[] {
    return list
      .filter(e => this.compareEquipmentNames(e.label, match));
  }

  public static findLast(list: IUpgradeGainsWeapon[], match: string): IUpgradeGainsWeapon {
    const matches = list
      .filter(e => this.compareEquipmentNames(e.label, match));
    return matches[matches.length - 1];
  }

  public static findLastIndex(array: IUpgradeGainsWeapon[], match: string) {
    let l = array.length;
    while (l--) {
      if (this.compareEquipmentNames(array[l].label, match))
        return l;
    }
    return -1;
  }

  static getAP(e: IUpgradeGainsWeapon): number {
    if (!e || !e.specialRules) return null;

    const ap = e.specialRules.find(r => r.name === "AP");
    return ap ? parseInt(ap.rating) : null;
  }

  static formatString(eqp: IUpgradeGainsWeapon): string {
    const name = eqp.count > 1 ? pluralise.plural(eqp.name) : eqp.name;
    const range = eqp.range ? `${eqp.range}"` : null;
    const attacks = eqp.attacks ? `A${eqp.attacks}` : null;

    return `${name} (${[range, attacks || null] // Range, then attacks
      .concat(eqp.specialRules.map(RulesService.displayName)) // then special rules
      .filter((m) => !!m) // Remove empty/null entries
      .join(", ")})`; // comma separated list
  }

  static getStringParts(eqp: IUpgradeGains, count: number): { name: string, rules: string } {
    const name = count > 1 ? pluralise.plural(eqp.name || eqp.label) : eqp.name || eqp.label;
    const weapon = eqp.type === "ArmyBookWeapon" ? eqp as IUpgradeGainsWeapon : null;
    const item = eqp.type === "ArmyBookItem" ? eqp as IUpgradeGainsItem : null;
    const rule = eqp.type === "ArmyBookItem" ? eqp as IUpgradeGainsRule : null;
    const range = weapon && weapon.range ? `${weapon.range}"` : null;
    const attacks = weapon && weapon.attacks ? `A${weapon.attacks}` : null;
    const specialRules = weapon?.specialRules
      || item?.content.filter(c => c.type === "ArmyBookRule" || c.type === "ArmyBookDefense") as IUpgradeGainsRule[]
      || [];

    return {
      name: name,
      rules: [range, attacks] // Range, then attacks
        .concat(specialRules.map(RulesService.displayName)) // then special rules
        .filter((m) => !!m) // Remove empty/null entries
        .join(", ") // csv
    }
  }
}
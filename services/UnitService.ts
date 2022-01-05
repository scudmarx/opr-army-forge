import { nanoid } from "@reduxjs/toolkit";
import { IUnit, ISelectedUnit, IUpgradeGains, IUpgradeGainsItem, IUpgradeGainsMultiWeapon, IUpgradeGainsRule, IUpgradeGainsWeapon } from "../data/interfaces";
import { ListState } from "../data/listSlice";
import _ from "lodash";
import EquipmentService from "./EquipmentService";

export default class UnitService {

  public static getSelected(list: ListState): ISelectedUnit {
    return list.selectedUnitId === null || list.selectedUnitId === undefined
      ? null
      : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];
  }

  public static getEquipmentCount(unit: ISelectedUnit, item: IUpgradeGains|string): number {
    return UnitService.getAllEquipment(unit).filter(e => {
      //if (unit.name != "TestUnit") console.log(`comparing`, e, "to", item, ":", EquipmentService.compareEquipment(e, item))
      return EquipmentService.compareEquipment(e, item) && e.count}
      ).reduce((count, next) => {return count + next.count}, 0)
  }
  public static getModCount(unit: ISelectedUnit, item: IUpgradeGains|string): number {
    return UnitService.getAllEquipment(unit).filter(e => {
      //if (unit.name != "TestUnit") console.log(`comparing`, e, "to", item, ":", EquipmentService.compareEquipment(e, item))
      return EquipmentService.compareEquipment(e, item) && e.mods}
      ).reduce((count, next) => {return count + next.mods}, 0)
  }
  public static getModSlots(unit: ISelectedUnit, item: IUpgradeGains|string, slots: number): number {
    let items = UnitService.getEquipmentCount(unit, item)
    let availableslots = (items * slots)
    return availableslots
  }
  public static getModSlotsAvailable(unit: ISelectedUnit, item: IUpgradeGains|string, slots: number): number {
    let mods = UnitService.getModCount(unit, item)
    let modslots = UnitService.getModSlots(unit, item, slots)
    let availableslots = modslots - mods
    //if (unit.name != "TestUnit") console.log("Mod Slots:", availableslots, "being", modslots, "slots and", mods, "mods applied.")
    return availableslots
  }

  public static getAllEquipment(unit: ISelectedUnit): IUpgradeGains[] {
    //return (unit.equipment as IUpgradeGains[]).concat(this.getAllUpgrades(unit, true))
    return unit.equipment;
    //return unit.equipment.flatMap(e => {return (e as IUpgradeGainsItem).content ? [e, ...(e as IUpgradeGainsItem).content.map((g) => ({...g, count: e.count * (g.count ?? 1)}))] : [e]})
  }

  public static getAllUpgrades(unit: ISelectedUnit, excludeModels: boolean): IUpgradeGains[] {
    return unit
      .selectedUpgrades
      .filter(u => excludeModels ? !u.isModel : true)
      .reduce((value, option) => value.concat(option.gains), []);
  }

  public static getAllUpgradedRules(unit: ISelectedUnit): IUpgradeGainsRule[] {
    const upgrades = this.getAllUpgrades(unit, true);

    const rules = upgrades.filter(u => u.type === "ArmyBookRule") || [];
    const rulesFromitems = upgrades
      .filter(u => u.type === "ArmyBookItem")
      .reduce((value, u: IUpgradeGainsItem) => value.concat(u.content.filter(c => c.type === "ArmyBookRule" || c.type === "ArmyBookDefense")), []) || [];

    const allRules: IUpgradeGainsRule[] = rules.concat(rulesFromitems) as IUpgradeGainsRule[];

    return allRules;
  }

  public static getAllItemsOfTypes(unit: ISelectedUnit, types: IUpgradeGains["type"][]): IUpgradeGains[] {
    return this.getAllEquipment(unit).filter(e => {return types.includes(e.type) && e.count !== 0});
  }
  public static getAllItemsOfType(unit: ISelectedUnit, type: IUpgradeGains["type"]) {
    return this.getAllItemsOfTypes(unit, [type])
  }
  public static getAllItemsNotOfTypes(unit: ISelectedUnit, types: IUpgradeGains["type"][]): IUpgradeGains[] {
    return this.getAllEquipment(unit).filter(e => {return (!types.includes(e.type)) && e.count > 0})
  }
  public static getAllItemsNotOfType(unit: ISelectedUnit, type: IUpgradeGains["type"]): IUpgradeGains[] {
    return this.getAllItemsNotOfTypes(unit, [type])
  }
  public static getAllWeapons(unit: ISelectedUnit): IUpgradeGainsWeapon[] {
    return this.getAllItemsOfTypes(unit, ["ArmyBookWeapon", "ArmyBookMultiWeapon"]) as IUpgradeGainsWeapon[]
  }
  public static getAllNonWeapons(unit: ISelectedUnit): IUpgradeGains[] {
    return this.getAllItemsNotOfTypes(unit, ["ArmyBookWeapon", "ArmyBookMultiWeapon"])
  }

  public static getAllUpgradeWeapons(unit: ISelectedUnit): (IUpgradeGainsWeapon | IUpgradeGainsMultiWeapon)[] {

    const isWeapon = u => u.type === "ArmyBookWeapon" || u.type === "ArmyBookMultiWeapon";
    const itemWeapons = this
      .getAllUpgradeItems(unit)
      .reduce((value, i) => value.concat(i.content.filter(isWeapon)), []);

    const all = this
      .getAllUpgrades(unit, false)
      .filter(isWeapon)
      .concat(itemWeapons) as (IUpgradeGainsWeapon | IUpgradeGainsMultiWeapon)[];

    return all;
  }

  public static getAllUpgradeItems(unit: ISelectedUnit): IUpgradeGainsItem[] {
    return this
      .getAllUpgrades(unit, false)
      .filter(u => u.type === "ArmyBookItem") as IUpgradeGainsItem[];
  }

  public static getSize(unit: ISelectedUnit): number {
    const extraModelCount = unit.selectedUpgrades.filter(u => u.isModel).length;
    return unit.size + extraModelCount;
  }
  
  public static getRealUnit(unit: IUnit, dummy = false): ISelectedUnit {
    return {
      ...unit,
      selectionId: dummy ? "dummy" : nanoid(5),
      selectedUpgrades: [],
      combined: false,
      joinToUnit: null,
      equipment: unit.equipment.map(eqp => ({
        ...eqp,
        count: eqp.count || unit.size // Add count to unit size if not already present
      }))
    }
  }

  public static getAttachedUnits(list: ListState, unit: ISelectedUnit) : ISelectedUnit[] {
    return list.units.filter(u => u.joinToUnit === unit.selectionId)
  }
  public static getChildren(list: ListState, unit: ISelectedUnit) : ISelectedUnit[] {
    return list.units.filter(u => u.selectionId === unit.joinToUnit)
  }
  public static getFamily(list: ListState, unit: ISelectedUnit) : ISelectedUnit[] {
    let parents = UnitService.getAttachedUnits(list, unit)
    let grandparents = parents.flatMap(u => {return UnitService.getAttachedUnits(list, u)})
    let children = UnitService.getChildren(list, unit)
    let grandchildren = children.flatMap(u => {return UnitService.getChildren(list, u)})
    return _.uniq([...grandparents, ...parents, unit, ...children, ...grandchildren])
  }

  /**
   * Adds an item to a unit's equipment table.
   */
  public static addItem(unit: ISelectedUnit, item: IUpgradeGains|string) {
    //console.log("Adding ", item, "to ", JSON.parse(JSON.stringify(unit)))
    let count = (item as IUpgradeGains).count ?? 1
    const currentItem = this.getAllEquipment(unit).find(i => EquipmentService.compareEquipment(i, item))
    if (currentItem) {
      currentItem.count = currentItem.count ? currentItem.count + count : count
    } else {
      if ((item as IUpgradeGains).type) {
        unit.equipment.push({...(item as IUpgradeGains), count: count} as IUpgradeGains)
      } else {
        // trying to add an item but only have its name, not an actual item? Treat it as a custom special rule.
        unit.equipment.push({name: item as string, type: "ArmyBookRule", count: count})
      }
    }
    if ((item as IUpgradeGainsItem).content) {
      (item as IUpgradeGainsItem).content.forEach(gain => {
        this.addItem(unit, gain)
      });
    }
  }

  /**
   * Removes an item from a unit's equipment table.
   * @param item The item to remove, either as an (IUpgradeGains) actual item or as a (string) search term to validate against.
   * @returns true if item was removed successfully, false if it was not (presumably because it wasn't there to remove).
   */
  public static removeItem(unit: ISelectedUnit, item: IUpgradeGains|string, allowedMods? : number) {
    //if (unit.name != "TestUnit") console.log("Removing", item, "from unit", JSON.parse(JSON.stringify(unit)))
    let count = (item as IUpgradeGains).count ?? 1
    if ((UnitService.getEquipmentCount(unit, (item as any)?.name ?? item) - ((allowedMods ?? true) ? UnitService.getModCount(unit, (item as any)?.name ?? item) : 0)) < count) {
      //if (unit.name != "TestUnit") console.log(`Failed! Item not found!`)
      //if (unit.name != "TestUnit") console.log("Found : ", UnitService.getEquipmentCount(unit, (item as any)?.name ?? item), "but wanted:", count)
      return false
    }
    if ((item as IUpgradeGainsItem).content) {
      let testunit = {
        ...unit,
        equipment: unit.equipment.map(g => ({...g}))
      };
      let contentReplaced = true;
      (item as IUpgradeGainsItem).content.forEach(gain => {
        if (!UnitService.removeItem(testunit, gain)) {
          //if (testunit.name != "TestUnit") console.log(`Failed! ${(item as IUpgradeGainsItem).name} is incomplete: ${gain.name} is missing!`)
          contentReplaced = false
        }
      });
      if (!contentReplaced) {
        //if (testunit.name != "TestUnit") console.log(`Leaving unit as: `, JSON.parse(JSON.stringify(unit)))
        return false
      }
      unit.equipment = testunit.equipment.map(g => ({...g}))
    }
    
    for (let i = 0; i < count; count--) {
      const currentItem = UnitService.getAllEquipment(unit).findLast(equ => {return EquipmentService.compareEquipment(equ, (item as any)?.name ?? item) && equ.count >= 1})
      if (currentItem) {
        currentItem.count -= 1
      } else {
        //console.log(`Somehow failed! Item expected but not found!`)
        return false
      }
    }
    //if (unit.name != "TestUnit") console.log(`Success! ${(item as IUpgradeGainsItem).name || (item as any).label || item} removed from unit:`, JSON.parse(JSON.stringify(unit)))
    return true
  }
}

import { current, nanoid } from "@reduxjs/toolkit";
import { IUnit, ISelectedUnit, IUpgradeGains, IUpgradeGainsItem, IUpgradeGainsMultiWeapon, IUpgradeGainsRule, IUpgradeGainsWeapon, IUpgrade, IUpgradeOption } from "../data/interfaces";
import { ListState } from "../data/listSlice";
import _ from "lodash";
import EquipmentService from "./EquipmentService";
import UpgradeService from "./UpgradeService";

export default class UnitService {
  
  public static getSelected(list: ListState): ISelectedUnit {
    return list.selectedUnitId === null || list.selectedUnitId === undefined
      ? null
      : list.units.filter(u => u.selectionId === list.selectedUnitId)[0];
  }

  public static getEquipmentCount(unit: ISelectedUnit, item: IUpgradeGains|string): number {
    return UnitService.getAllEquipment(unit).filter(e => {
      //if (unit.name != "Dummy") console.log(`comparing`, e, "to", item, ":", EquipmentService.compareEquipment(e, item))
      return EquipmentService.compareEquipment(e, item) && e.count}
      ).reduce((count, next) => {return count + next.count}, 0)
  }
  public static getModCount(unit: ISelectedUnit, modId?: string, item?: IUpgradeGains|string): number {
    return UnitService.getAllEquipment(unit).filter(e => EquipmentService.compareEquipment(e, item))
      .reduce((count, next) => {return count + next.mods.filter(m => !modId || m == modId).length}, 0)
  }
  public static getModSlots(unit: ISelectedUnit, item: IUpgradeGains|string, slots: number = 1): number {
    let items = UnitService.getEquipmentCount(unit, item)
    let availableslots = (items * slots)
    //console.log("Mod Slots:", availableslots, " on unit: ", JSON.parse(JSON.stringify(unit)))
    return availableslots
  }
  public static getModSlotsAvailable(unit: ISelectedUnit, modId: string, item: IUpgradeGains|string, slots: number = 1): number {
    let logging = false
    let mods = UnitService.getModCount(unit, modId)
    let modslots = UnitService.getModSlots(unit, item, slots)
    let availableslots = modslots - mods
    if (logging) console.log("Mod Slots:", availableslots, "being", modslots, "slots and", mods, "mods applied.")
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
  
  /**
   * Converts a Unit into an actual SelectedUnit, with fields.
   */
  public static getRealUnit(unit: IUnit, dummy = false): ISelectedUnit {
    return {
      ...unit,
      selectionId: dummy ? "dummy" : nanoid(5),
      selectedUpgrades: [],
      combined: false,
      joinToUnit: null,
      equipment: unit.equipment.map(eqp => ({
        ...eqp,
        count: eqp.count || unit.size, // Add count to unit size if not already present
        mods: []
      }))
    }
  }
  
  /**
   * Creates and returns a copy of a unit.
   */
  public static createDummyCopy(unit: ISelectedUnit) {
    let clone = _.cloneDeep(unit)
    clone.name = "Dummy"
    return clone
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
  public static addItem(unit: ISelectedUnit, item: IUpgradeGains|string, mods: string[] = []) {
    let logging = false && unit.name != "Dummy"
    if (logging) console.log("Adding ", item, "to ", JSON.parse(JSON.stringify(unit)))
    
    let count = (item as IUpgradeGains).count ?? 1
    const currentItem = this.getAllEquipment(unit).find(i => EquipmentService.compareEquipment(i, item))
    if (currentItem) {
      currentItem.count = currentItem.count ? currentItem.count + count : count
      mods.forEach(mod => currentItem.mods.push(mod))
    } else {
      if ((item as IUpgradeGains).type) {
        unit.equipment.push({...(item as IUpgradeGains), count: count, mods: mods} as IUpgradeGains)
      } else {
        // trying to add an item but only have its name, not an actual item? Treat it as a custom special rule.
        unit.equipment.push({name: item as string, type: "ArmyBookRule", count: count, mods: mods})
      }
    }

    // if item is a bundle of other items, add those too
    if ((item as IUpgradeGainsItem).content) {
      (item as IUpgradeGainsItem).content.forEach(gain => {
        UnitService.addItem(unit, gain)
      });
    }
  }

  /**
   * Removes an item from a unit's equipment table.
   * @param item The item to remove, either as an (IUpgradeGains) actual item or as a (string) search term to validate against.
   * @returns true if item was removed successfully, false if it was not (presumably because it wasn't there to remove), or an array of the mods found on the replaced item.
   */
  public static removeItem(unit: ISelectedUnit, item: IUpgradeGains|string) {
    let logging = false && unit.name != "Dummy"
    if (logging) console.log("Removing", item, "from unit", JSON.parse(JSON.stringify(unit)))
    
    // if removing a granted gain which gave multiple of an item, remove them all
    let count = (item as IUpgradeGains).count ?? 1
    
    // If unit doesn't have enough items...
    if (UnitService.getEquipmentCount(unit, (item as any)?.name ?? item) < count) {
      if (logging) console.log("Insufficient items found : ", UnitService.getEquipmentCount(unit, (item as any)?.name ?? item), ` found but ${count} wanted.`)
      return false
    }

    // if the item we're removing is a bundle of other items, we need to find all of those too...
    if ((item as IUpgradeGainsItem).content) {
      let testunit = UnitService.createDummyCopy(unit)
      let contentReplaced = true;
      (item as IUpgradeGainsItem).content.forEach(gain => {
        if (!UnitService.removeItem(testunit, gain)) {
          if (logging) console.log(`Failed! ${(item as IUpgradeGainsItem).name} is incomplete: ${gain.name} is missing!`)
          contentReplaced = false
        }
      });
      if (!contentReplaced) {
        if (logging) console.log(`Leaving unit as: `, JSON.parse(JSON.stringify(unit)))
        return false
      }
      unit.equipment = testunit.equipment.map(g => ({...g}))
    }
    
    let mods
    for (let i = 0; i < count; count--) {
      const currentItem = UnitService.getAllEquipment(unit).findLast(equ => {return EquipmentService.compareEquipment(equ, (item as any)?.name ?? item) && equ.count >= 1})
      if (currentItem) {
        currentItem.count -= 1
        mods = []
        let modcounts = _.countBy(currentItem.mods, (mod => mod))
        for(let mod in modcounts) {
          if (modcounts[mod] > currentItem.count) mods.push(mod)
        }
        mods.forEach(mod => currentItem.mods.splice(currentItem.mods.indexOf(mod), 1))
      } else {
        if (logging) console.log(`Somehow failed! Item expected but not found!`)
        return false
      }
    }
    if (logging) console.log(`Success! ${(item as IUpgradeGainsItem).name || (item as any).label || item} removed from unit:`, JSON.parse(JSON.stringify(unit)))
    return mods ?? true
  }

  /**
   * Adds all items from an Upgrade Option's list of granted upgrade items.
   * @param mods An array of mods to apply to the new items.
   */
  public static addGrantedItems (unit: ISelectedUnit, option: IUpgradeOption) {
    let logging = false && unit.name != "Dummy"
    if (logging) console.log("Adding gains items...")
    for (let gain of option.gains) {
      UnitService.addItem(unit, gain)
    }
    if (logging) console.log("Added", option.gains, "to unit:", JSON.parse(JSON.stringify(unit)))
  }

  /**
   * Removes all items from an Upgrade Option's list of granted upgrade items.
   */
   public static removeGrantedItems (unit: ISelectedUnit, upgrade: IUpgrade, option: IUpgradeOption, movedMods: string[] = []) {
    let logging = false && unit.name != "Dummy"
    if (logging) console.log("Removing granted items...")
    let testunit = UnitService.createDummyCopy(unit)
    let replaced = true
    for (let gain of option.gains) {
      replaced = UnitService.removeItem(unit, gain)
      if (!replaced) {
        if (logging) console.log("Failed! Could not remove:", gain)
        return false
      }
    }
    if (replaced) unit.equipment = testunit.equipment
    if (logging) console.log("Removed", option.gains, "from unit:", JSON.parse(JSON.stringify(unit)))
  }

}

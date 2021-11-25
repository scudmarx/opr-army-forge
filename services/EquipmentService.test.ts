import { IUpgradeGainsItem, IUpgradeGainsRule } from '../data/interfaces';
import DataParsingService from './DataParsingService';
import EquipmentService from './EquipmentService';

test("Item string parts", () => {
  const parts = EquipmentService.getStringParts({
    label: "Light Shields (Defense +1 in melee)",
    name: "Light Shields",
    content: [
      {
        key: "defense",
        name: "Defense",
        rating: "1",
        condition: "in melee"
      }
    ],
    type: "ArmyBookItem"
  } as any, 1);

  expect(parts).toStrictEqual({
    name: "Light Shields",
    rules: ""
  });

  const parts2 = EquipmentService.getStringParts({
    label: "Shield Bash (A2)",
    name: "Shield Bash",
    attacks: 2,
    specialRules: [],
    type: "ArmyBookWeapon"
  } as any, 1);

  expect(parts2).toStrictEqual({
    name: "Shield Bash",
    rules: "A2"
  });
});

test("String parts for item", () => {

  const item: IUpgradeGainsItem = {
    id: "1",
    content: [
      {
        condition: "in melee",
        key: "defense",
        name: "Defense",
        rating: "1",
        type: "ArmyBookDefense"
      } as IUpgradeGainsRule
    ],
    label: "Light Shields (Defense +1 in melee)",
    name: "Light Shields",
    type: "ArmyBookItem",
    count: 3,
    originalCount: 3
  };

  const parts = EquipmentService.getStringParts(item, 3);
});

test("String parts for weapon platform", () => {
  var input = 'Gun Platform (Star Cannon (36”, A2, AP(2))) +20pts';
  var upgrade = DataParsingService.parseEquipment(input, true);
  var parts = EquipmentService.getStringParts(upgrade, 1);
  expect(parts).not.toStrictEqual({});
})

//#region compareEquipmentNames

test("Positive: [Weapon] matches [Weapon]", () => {
  const hasWhat = "Rifle"
  const replaceWhat = "Rifle"
  const match = EquipmentService.compareEquipmentNames(hasWhat, replaceWhat)
  expect (match).toBe(true)
})

test("Negative: [OtherWeapon] does NOT match [weapon]", () => {
  const hasWhat = "Rifle"
  const replaceWhat = "Carbine"
  const match = EquipmentService.compareEquipmentNames(hasWhat, replaceWhat)
  expect (match).toBe(false)
})

test("Generic: 'weapon' matches [weapon]", () => {
  const hasWhat = "Rifle"
  const replaceWhat = "weapon"
  const match = EquipmentService.compareEquipmentNames(hasWhat, replaceWhat)
  expect (match).toBe(true)
})

test("Case: [Weapon] matches [weapon]", () => {
  const hasWhat = "Rifle"
  const replaceWhat = "rifle"
  const match = EquipmentService.compareEquipmentNames(hasWhat, replaceWhat)
  expect (match).toBe(true)
})

test("Plural: [Weapon] matches [Weapons]", () => {
  const hasWhat = "Rifle"
  const replaceWhat = "Rifles"
  const match = EquipmentService.compareEquipmentNames(hasWhat, replaceWhat)
  expect (match).toBe(true)
})

test("Case and Plural: [Weapon] matches [weapons]", () => {
  const hasWhat = "Rifle"
  const replaceWhat = "rifles"
  const match = EquipmentService.compareEquipmentNames(hasWhat, replaceWhat)
  expect (match).toBe(true)
})

//#endregion
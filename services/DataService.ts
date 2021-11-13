import { nanoid } from "nanoid";
import { IUnit, IUpgradeOption } from "../data/interfaces";
import DataParsingService from "./DataParsingService";
import { groupBy } from "./Helpers";
import router from "next/router";
import _ from "lodash";

export default class DataService {

  private static useStaging: boolean = false;
  //const webCompanionUrl = `https://opr-list-builder${useStaging ? "-staging" : ""}.herokuapp.com/api`;
  private static webCompanionUrl = 'https://army-forge.onepagerules.com/api';

  public static getJsonData(filePath: string, callback: (armyData: any) => void, fallback?: (err: string) => void) {

    fetch(filePath)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        callback(data);
      }, fallback);
  }

  public static getApiData(armyId: string, callback: (armyData: any) => void, fallback?: (err: string) => void) {

    let dataSourceUrl = router.query.dataSourceUrl ? `https://${router.query.dataSourceUrl}.herokuapp.com/api` : this.webCompanionUrl
    fetch(dataSourceUrl + `/army-books/${armyId}`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);

        const afData = DataService.transformApiData(data, fallback);
        //console.log(afData);

        callback(afData);
      })
  }

  public static transformApiData(input, fallback?: (err: string) => void) {
    try {
    const countRegex = /^(\d+)x\s/;

    const data = {
      ...input,
      units: input.units.map((u: IUnit) => ({
        ...u,
        equipment: u.equipment.map(e => {
          // Capture the count digit from the name
          const countMatch = countRegex.exec(e.label);
          const label = e.label.replace(countRegex, "");
          return {
            ...e,
            label: label,
            name: e.name || label,
            count: e.count
              ? e.count * u.size
              : (countMatch ? parseInt(countMatch[1]) * u.size : u.size)
          }
        })
      })),
      upgradePackages: input.upgradePackages.map(pkg => ({
        ...pkg,
        sections: pkg.sections.map(section => {
          const upgrade = DataParsingService.parseUpgradeText(section.label + (section.label.endsWith(":") ? "" : ":"));
          
          // Sanitise dodgy/old data
          delete section.select;
          delete section.affects;
          delete section.replaceWhat;

          return {
            ...section,
            ...upgrade,
            options: section.options.map((opt: IUpgradeOption) => {
              const gains = [];
              // Iterate backwards through gains array so we can push new 
              if (opt.gains) for (let original of opt.gains) {
                // Match "2x ", etc

                // Replace "2x " in label/name of original gain
                const gain = {
                  ...original,
                  label: original.label?.replace(countRegex, ""),
                  name: original.name?.replace(countRegex, "")
                };
                // Capture the count digit from the name
                const countMatch = countRegex.exec(original.name);
                // Parse the count if present, otherwise default to 1
                const count = countMatch ? parseInt(countMatch[1]) : 1;
                // Push the gain into the array as many times as the count
                for (let y = 0; y < count; y++) {
                  gains.push(gain);
                }
              }

              // Group/combine gains with same name...
              const gainsGroups = _.groupBy(gains, g => g.label);

              return ({
                ...opt,
                isModel: upgrade.attachModel ?? false,
                cost: typeof (opt.cost ?? 0) === "number" ? opt.cost : parseInt((opt.cost as any).toString().replace(/pts?/, "")),
                id: opt.id || nanoid(5), // Assign ID to upgrade option if one doesn't exist

                // Group same items back together and sum the count
                gains: Object.values(gainsGroups).map((grp: any[]) => {
                  const count = grp.reduce((c, next) => c + (next.count || 1), 0);
                  console.log(grp[0].label + " " + count, grp);
                  return {
                    ...grp[0],
                    count: count
                  }
                })
              });
            })
          };
        })
      }))
    };

    for (let unit of data.units) {
      // Group equipment by name
      const groups = groupBy(unit.equipment, "name");

      // Take first equipment in each group, with a count set to how many are in the group
      unit.equipment = Object
        .values(groups)
        .map((group: any[]) => {
          const countInGroup = group.reduce((count, next) => count + (next.count ?? 1), 0);
          return {
            ...group[0],
            count: countInGroup// * unit.size
          };
        });
    }

    return data;
    } catch (err) { if (typeof(fallback) == "function") fallback(err) }
}
}
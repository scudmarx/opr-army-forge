import { Dispatch } from "react";
import { ArmyState, load, setGameSystem } from "../data/armySlice";
import { ISaveData } from "../data/interfaces";
import { ListState, loadSavedList } from "../data/listSlice";
import DataService from "./DataService";
import UpgradeService from "./UpgradeService";

export default class PersistenceService {

  private static prefix = "AF_Save_";

  public static saveImport(saveName: any, json: string) {
    localStorage[this.prefix + saveName] = json;
  }

  public static createSave(army: ArmyState, name: string) {

    const saveData: ISaveData = {
      gameSystem: army.gameSystem,
      armyId: army.data.uid,
      armyFile: army.armyFile,
      armyName: army.data.name,
      modified: new Date().toJSON(),
      listPoints: 0,
      list: {
        name: name,
        units: []
      }
    };

    console.log("Creating save...", saveData);

    const json = JSON.stringify(saveData);

    localStorage[this.prefix + name] = json;
  }

  public static updateSave(list: ListState) {

    const existingSave: ISaveData = JSON.parse(localStorage["AF_Save_" + list.name]);
    const points: number = UpgradeService.calculateListTotal(list.units);

    const saveData: ISaveData = {
      ...existingSave,
      modified: new Date().toJSON(),
      listPoints: points,
      list,
    };

    console.log("Updating save...", saveData);

    const json = JSON.stringify(saveData);

    localStorage[this.prefix + list.name] = json;
  }

  public static delete(saveName: string) {
    delete localStorage[this.prefix + saveName];
  }

  public static load(dispatch: Dispatch<any>, save: ISaveData, callback: (armyData: any) => void) {

    console.log("Loading save...", save);

    const loaded = data => {
      dispatch(setGameSystem(save.gameSystem));
      dispatch(load(data));
      dispatch(loadSavedList(save.list));
    };

    if (save.armyId) {
      DataService.getApiData(save.armyId, data => {
        loaded(data);
        callback(data);
      });
    } else {
      DataService.getJsonData(save.armyFile, data => {
        loaded(data);
        callback(data);
      });
    }
  }

  public static download(name: string) {
    const saveData = localStorage[this.prefix + name];
    const blob = new Blob([saveData], { type: "application/json" })
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name}.json`;
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent('click'));
  }

  public static checkExists(name: string): boolean {
    return !!localStorage[this.prefix + name];
  }
}
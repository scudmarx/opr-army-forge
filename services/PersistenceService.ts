import { Dispatch } from "react";
import { ArmyState, load, setGameSystem } from "../data/armySlice";
import { ISaveData } from "../data/interfaces";
import { ListState, loadSavedList } from "../data/listSlice";
import DataService from "./DataService";
import UpgradeService from "./UpgradeService";

export default class PersistenceService {

  private static prefix = "AF_Save_";

  private static getSaveKey(list: ListState) {
    return this.prefix + list.name + list.creationTime;
  }

  public static saveImport(saveName: any, json: string) {
    localStorage[this.prefix + saveName] = json;
  }

  public static createSave(army: ArmyState, name: string, existingList?: ListState): string {

    const creationTime = new Date().getTime().toString();
    const list: ListState = existingList
      ? {
        ...existingList,
        creationTime: creationTime
      }
      : {
        creationTime: creationTime,
        name: name,
        units: [],
        points: 0
      };

    const saveData: ISaveData = {
      gameSystem: army.gameSystem,
      armyId: army.data.uid,
      armyFile: army.armyFile,
      armyName: army.data.name,
      modified: new Date().toJSON(),
      listPoints: 0,
      list
    };

    console.log("Creating save...", saveData);

    const json = JSON.stringify(saveData);

    localStorage[this.getSaveKey(list)] = json;

    return creationTime;
  }

  public static updateSave(list: ListState) {

    const localSave = localStorage[this.getSaveKey(list)];
    if (!localSave)
      return;

    const existingSave: ISaveData = JSON.parse(localSave);
    const points: number = UpgradeService.calculateListTotal(list.units);

    const saveData: ISaveData = {
      ...existingSave,
      modified: new Date().toJSON(),
      listPoints: points,
      list,
    };

    console.log("Updating save...", saveData);

    const json = JSON.stringify(saveData);

    localStorage[this.getSaveKey(list)] = json;
  }

  public static delete(list: ListState) {
    delete localStorage[this.getSaveKey(list)];
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

  public static download(list: ListState) {
    const saveData = localStorage[this.getSaveKey(list)];
    const blob = new Blob([saveData], { type: "application/json" })
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${list.name}${list.creationTime}.json`;
    document.body.appendChild(a);
    a.dispatchEvent(new MouseEvent('click'));
  }

  public static checkExists(list: ListState): boolean {
    return !!localStorage[this.getSaveKey(list)];
  }
}
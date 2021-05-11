import { state, defaultSettings } from "./state";
import localforage from "localforage";
import { ISettingsServiceState } from "./types";
import debug from "debug";
import clone from "clone";
import { watch } from "@vue/composition-api";

localforage.config({
  description: "",
  driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
  name: "material-e621",
  storeName: "material_e621",
});

const log = debug("app:PersistanceService");

class PersistanceService {
  public async saveState() {
    await this.saveToLocalStorage("state", state);
    log("saved state");
  }
  public async loadState() {
    const savedState = await this.getFromLocalStorage<ISettingsServiceState>(
      "state",
    );
    if (savedState?.snackbar) {
      savedState.snackbar = null;
    }
    if (savedState) {
      Object.assign(state, savedState);
    }
  }
  public async stateToFile() {
    return new File([this.serializeState()], "material-e621-settings.json", {
      type: "text/plain",
    });
  }
  public async loadStateFromFile(file: File) {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const fileContent = event?.target?.result;
        if (typeof fileContent !== "string") {
          return reject("file content must be a string");
        }
        const settings = JSON.parse(fileContent);
        // TODO: test if correct
        Object.assign(state, settings);
        return resolve();
      };

      reader.readAsText(file, "utf");
    });
  }

  public persist() {
    this.loadState().then(() => {
      watch(state, () => this.saveState(), { deep: true });
    });
  }

  public resetStateToDefault() {
    Object.assign(state, clone(defaultSettings));
  }

  private serializeState() {
    return JSON.stringify(state);
  }

  private saveToLocalStorage<T>(key: string, value: T): Promise<T> {
    return localforage.setItem<T>(key, value);
  }
  private getFromLocalStorage<T>(key: string): Promise<T | null> {
    return localforage.getItem<T>(key);
  }
  private deleteFromLocalStorage(key: string): Promise<void> {
    return localforage.removeItem(key);
  }
}

export const persistanceService = new PersistanceService();

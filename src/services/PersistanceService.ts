import { state } from "./state";
import localforage from "localforage";
import { ISettingsServiceState } from "./types";
import debug from "debug";
import clone from "clone";
import { reactive, watch, set } from "@vue/composition-api";
import { defaultSettings, focusSearchShortcut } from "./defaultSettings";

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
      this.setState(savedState);
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
        this.setState(settings);
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
    this.setState(clone(defaultSettings));
  }

  private serializeState() {
    return JSON.stringify(state);
  }

  private setState(newState: ISettingsServiceState) {
    // migrations
    if (!newState.configVersion) {
      newState.configVersion = 1;
    }
    if (newState.configVersion < 2) {
      newState.shortcuts = reactive(clone(defaultSettings.shortcuts));
      newState.configVersion = 2;
    }
    if (newState.configVersion < 3) {
      newState.favorites = reactive(clone(defaultSettings.favorites));
      newState.configVersion = 3;
    }
    if (newState.configVersion < 4) {
      set(
        newState.posts,
        "lazyLoadImages",
        defaultSettings.posts.lazyLoadImages,
      );
      newState.configVersion = 4;
    }
    if (newState.configVersion < 5) {
      newState.shortcuts.push(focusSearchShortcut);
      newState.configVersion = 5;
    }
    Object.assign(state, newState);
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

// const migrations = {
//   2: (state: ISettingsServiceState) => {
//     // other migrations
//     state.configVersion = 2;
//   },
// } as const;

export const persistanceService = new PersistanceService();

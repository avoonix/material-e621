import { useMainStore } from "./state";
import localforage from "localforage";
// TODO: remove localforage and implement persistance ourselves
import type {
  ISettingsServiceState
} from "./types";
import {
  DataSaverType,
  FullscreenZoomUiMode
} from "./types";
import clone from "clone";
import { reactive, toRaw, watch } from "vue";
import {
  defaultSettings,
  focusSearchShortcut,
  fullscreenFavoriteShortcuts,
} from "./defaultSettings";
import { debug } from "@/misc/util/debug";

localforage.config({
  description: "",
  driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
  name: "material-e621",
  storeName: "material_e621",
});

const log = debug("app:PersistanceService");

class PersistanceService {
  constructor(private main: ReturnType<typeof useMainStore>) { }

  public async saveState() {
    await this.saveToLocalStorage("state", this.getState());
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

  public async persist() {
    await this.loadState();
    this.main.$subscribe(() => this.saveState(), { deep: true });
  }

  public resetStateToDefault() {
    this.setState(clone(defaultSettings));
  }

  private serializeState() {
    return JSON.stringify(this.main.$state);
  }

  public getState() {
    return toRaw(this.main.$state);
  }

  public setState(newState: ISettingsServiceState) {
    // migrations
    if (!newState.configVersion) {
      newState.configVersion = 1;
      newState.configVersion = 1; // to satisfy ts
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
      newState.posts.lazyLoadImages = defaultSettings.posts.lazyLoadImages
      newState.configVersion = 4;
    }
    if (newState.configVersion < 5) {
      newState.shortcuts.push(focusSearchShortcut);
      newState.configVersion = 5;
    }
    if (newState.configVersion < 6) {
      // remove need for fallbacks in stores
      if (!newState.appearance.toolbar) {
        newState.appearance.toolbar = defaultSettings.appearance.toolbar;
      }
      if (typeof newState.posts.fullscreenZoomUiMode !== "number") {
        newState.posts.fullscreenZoomUiMode = defaultSettings.posts.fullscreenZoomUiMode;
      }
      if (!newState.posts.dataSaver) {
        newState.posts.dataSaver = DataSaverType.auto;
      }
      newState.configVersion = 6;
    }
    if (newState.configVersion < 7) {
      newState.shortcuts.push(...fullscreenFavoriteShortcuts);
      newState.configVersion = 7;
    }
    if (newState.configVersion < 8) {
      newState.posts.autoLoadNext = defaultSettings.posts.autoLoadNext;
      newState.configVersion = 8;
    }
    if (newState.configVersion < 9) {
      newState.misc = reactive(clone(defaultSettings.misc));
      newState.configVersion = 9;
    }
    if (newState.configVersion < 10) {
      newState.searches = reactive(clone(defaultSettings.searches));
      newState.configVersion = 10;
    }
    if (newState.configVersion < 11) {
      const old = newState.blacklist.tags as unknown as string[];
      newState.blacklist.tags = reactive(old.map(tag => [tag]));
      newState.appearance.hideGithubInfo = defaultSettings.appearance.hideGithubInfo;
      newState.blacklist.hideServerSideBlacklisted = defaultSettings.blacklist.hideServerSideBlacklisted;
      newState.configVersion = 11;
    }
    if (newState.configVersion < 12) {
      newState.appearance.hideMigrationInfo = defaultSettings.appearance.hideMigrationInfo;
      newState.configVersion = 12;
    }

    this.main.$state = newState;
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

let persistanceService: PersistanceService | null = null;

export const usePersistanceService = () => {
  if (!persistanceService)
    persistanceService = new PersistanceService(useMainStore());
  return persistanceService;
};

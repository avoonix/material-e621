import { state } from "./state";
import { Shortcut } from "./types";
import Mousetrap from "mousetrap";
import mitt from "mitt";

export type Events = {
  focusSearch: void;
  fullscreenNext: void;
  fullscreenPrevious: void;
  fullscreenExit: void;
};

class ShortcutService {
  public emitter = mitt<Events>();

  public get shortcuts() {
    return state.shortcuts;
  }

  public deleteShortcut(index: number) {
    state.shortcuts.splice(index, 1);
  }
  public addShortcut(shortcut: Shortcut) {
    state.shortcuts.unshift(shortcut);
  }
  public updateShortcut(index: number, shortcut: Shortcut) {
    Object.assign(state.shortcuts[index], shortcut);
  }

  public setUpShortcuts() {
    Mousetrap.reset();
    for (const { action, sequence } of this.shortcuts) {
      Mousetrap.bind(sequence, async (e) => {
        const { appRouter } = await import("@/misc/util/router");
        switch (action) {
          case "go_to_settings":
            appRouter.push({ name: "Settings" });
            break;
          case "go_to_posts":
            appRouter.push({ name: "Posts" });
            break;
          case "focus_search":
            this.emitter.emit("focusSearch");
            break;
          case "fullscreen_exit":
            this.emitter.emit("fullscreenExit");
            break;
          case "fullscreen_next_post":
            this.emitter.emit("fullscreenNext");
            break;
          case "fullscreen_previous_post":
            this.emitter.emit("fullscreenPrevious");
            break;
          default:
            console.log(action, e); // TODO
            break;
        }
      });
    }
  }
}

export const shortcutService = new ShortcutService();

import mitt from "mitt";
import Mousetrap from "mousetrap";
import { useShortcutStore } from "./ShortcutStore";

export type Events = {
  focusSearch: void;
  fullscreenNext: void;
  fullscreenPrevious: void;
  fullscreenExit: void;
  fullscreenAddFavorite: void;
  fullscreenRemoveFavorite: void;
  fullscreenToggleFavorite: void;
};

class ShortcutService {
  public emitter = mitt<Events>();

  public setUpShortcuts() {
    Mousetrap.reset();
    const shortcutStore = useShortcutStore();
    console.log("setting up shortcuts");
    for (const { action, sequence } of shortcutStore.shortcuts) {
      Mousetrap.bind(sequence, (e) => {
        switch (action) {
          case "go_to_settings":
            import("@/misc/util/router").then(({ appRouter }) =>
              appRouter.push({ name: "Settings" }),
            );
            break;
          case "go_to_posts":
            import("@/misc/util/router").then(({ appRouter }) =>
              appRouter.push({ name: "Posts" }),
            );
            break;
          case "focus_search":
            this.emitter.emit("fullscreenExit"); // search can't be focused otherwise
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
          case "fullscreen_add_favorite":
            this.emitter.emit("fullscreenAddFavorite");
            break;
          case "fullscreen_remove_favorite":
            this.emitter.emit("fullscreenRemoveFavorite");
            break;
          case "fullscreen_toggle_favorite":
            this.emitter.emit("fullscreenToggleFavorite");
            break;
          default:
            expectNever(action);
            return true;
        }
        return false; // abort handling
      });
    }
  }
}

const expectNever = (arg: never) => console.log("unexpected", arg);

const shortcutService = new ShortcutService();

export const useShortcutService = () => shortcutService;

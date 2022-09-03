import mitt from "mitt";
import Mousetrap from "mousetrap";
import { useShortcutStore } from "./ShortcutStore";

export type Events = {
  focusSearch: void;
  fullscreenNext: void;
  fullscreenPrevious: void;
  fullscreenExit: void;
};

class ShortcutService {
  public emitter = mitt<Events>();

  public setUpShortcuts() {
    Mousetrap.reset();
    const shortcutStore = useShortcutStore();
    console.log("setting up shortcuts");
    for (const { action, sequence } of shortcutStore.shortcuts) {
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
          default: // TODO
            console.log(action, e);
            break;
        }
      });
    }
  }
}

const shortcutService = new ShortcutService();

export const useShortcutService = () => shortcutService;

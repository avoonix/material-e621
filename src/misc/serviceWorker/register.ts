import { snackbarService } from "@/services";
import { registerSW } from "virtual:pwa-register";

const intervalMS = 60 * 60 * 1000;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const updateSW = registerSW({
  onRegistered(r) {
    r &&
      setInterval(() => {
        r.update();
      }, intervalMS);
  },
  onNeedRefresh() {
    snackbarService.addMessage("Update available - refreshing in 10 seconds!");
    wait(10 * 1000);
    snackbarService.addMessage(
      "Go to Settings > Info > About to see what changed",
    );
    wait(100);
    updateSW();
  },
  onOfflineReady() {
    console.log("offline ready");
  },
});

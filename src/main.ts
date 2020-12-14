import "./plugins";
import "./legacyMain.js";
import { showConsoleMessage } from "./utilities/consoleMessage";
import { registerServiceWorker } from "./worker/serviceWorker/register";

registerServiceWorker();

process.env.NODE_ENV !== "development" && showConsoleMessage();

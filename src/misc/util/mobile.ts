import { UAParser } from "ua-parser-js";

const parser = new UAParser();

const deviceType = parser.getDevice().type || "unknown";

export const isMobile =
  ["mobile", "tablet", "wearable"].indexOf(deviceType) !== -1;

export const bitrate = (bytes, seconds, format) => {
  var DIVISORS = {
    bps: 0.125,
    kbps: 125,
    mbps: 125000,
    Bps: 1,
    KBps: 1000,
    MBps: 1000000,
  };
  if (format === undefined || format === null) format = "kbps";
  if (typeof format !== "string")
    throw new TypeError("Expected 'format' to be a string");
  divisor = format.replace("/", "p");

  var divisor = DIVISORS[divisor];
  if (!divisor) throw new Error("'format' is an invalid string");

  return bytes / seconds / divisor;
};

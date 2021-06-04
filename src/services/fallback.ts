export const withFallback = <T>(actual: T | undefined, fallback: T) => {
  return typeof actual === "undefined" ? fallback : actual;
};

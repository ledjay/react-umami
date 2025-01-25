import "@testing-library/jest-dom";

// Create a proxy to detect SSR checks
const ssrWindowProxy = new Proxy(
  { ...window },
  {
    get: (target, prop) => {
      // When checking for SSR, return undefined for these specific properties
      if (prop === "document" && process.env.TEST_SSR === "true") {
        return undefined;
      }
      return target[prop as keyof typeof target];
    },
  }
);

// Override the global window object with our proxy
Object.defineProperty(global, "window", {
  value: ssrWindowProxy,
  writable: true,
  configurable: true,
});

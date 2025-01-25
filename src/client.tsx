"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
} from "react";
import type { UmamiOptions } from "./types";
import { UmamiReact } from "./umami-react";

type UmamiContextType = {
  track: (eventName: string, data?: object) => void;
};

const UmamiContext = createContext<UmamiContextType | null>(null);

// Helper to check if we're in a browser environment
const isBrowser = () => {
  try {
    // Check if we're in a browser environment by checking for window.document
    // This needs to be a single property access to work with our SSR detection
    return typeof window !== "undefined" && window.document !== undefined;
  } catch {
    return false;
  }
};

const UmamiProvider = ({
  children,
  ...config
}: UmamiOptions & { children: React.ReactNode }) => {
  useEffect(() => {
    if (isBrowser()) {
      // Initialize Umami React
      UmamiReact.initialize(config);

      // Create and inject the script
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.setAttribute("data-website-id", config.websiteId);
      script.src = new URL("script.js", config.hostUrl).toString();
      document.body.appendChild(script);

      // Cleanup function
      return () => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [config]);

  const track = useCallback((eventName: string, data?: object) => {
    if (isBrowser()) {
      UmamiReact.track(eventName, data);
    }
  }, []);

  const value = { track };

  return (
    <UmamiContext.Provider value={value}>{children}</UmamiContext.Provider>
  );
};

const useUmami = () => {
  const context = useContext(UmamiContext);
  if (!context) {
    throw new Error("useUmami must be used within a UmamiProvider");
  }
  return context;
};

export { UmamiContext, UmamiProvider, useUmami };

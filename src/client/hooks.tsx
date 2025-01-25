"use client";

import { useContext } from "react";
import { UmamiContext } from "./provider";
import Logger from "../utils/logger";

export const useUmami = () => {
  const context = useContext(UmamiContext);

  Logger.debug("Hook called with context:", {
    hasContext: !!context,
    isReady: context?.isReady,
    hasTrack: !!context?.track,
    hasDefaultTracking: !!context?.defaultTracking,
  });

  if (!context) {
    Logger.warn("No provider found, returning no-op implementation");
    return {
      track: (eventName: string, data?: Record<string, any>) => {
        Logger.warn("No provider found, event will be ignored:", eventName, data);
      },
      isReady: false,
    };
  }

  Logger.debug("Returning context with isReady:", context.isReady);
  return {
    track: context.track,
    isReady: context.isReady,
  };
};

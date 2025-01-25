"use client";

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { UmamiOptions, TrackingObject } from "../types";
import { UmamiReact } from "../umami-react";
import Logger from "../utils/logger"; // Update the import path to point to utils/logger

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, data?: Record<string, any>) => void;
    };
  }
}

type UmamiContextType = {
  track: (eventName: string, data?: Record<string, any>) => void;
  defaultTracking?: TrackingObject;
  isReady: boolean;
};

export const UmamiContext = createContext<UmamiContextType>({
  track: () => {},
  isReady: false,
});

// Helper to check if we're in a browser environment
const isBrowser = () => {
  try {
    return typeof window !== "undefined" && window.document !== undefined;
  } catch {
    return false;
  }
};

export interface UmamiProviderProps extends UmamiOptions {
  children: React.ReactElement | React.ReactElement[] | string | null;
  disabled?: boolean;
}

export function UmamiProvider({
  children,
  disabled = false,
  websiteId,
  defaultTracking,
  ...config
}: UmamiProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const initialized = useRef(false);
  const [error, setError] = useState<Error | null>(null);
  const queuedEvents = useRef<{ name: string; data?: Record<string, any> }[]>(
    []
  );

  const track = useCallback(
    (eventName: string, data?: Record<string, any>) => {
      Logger.log("info", `📊 Tracking event: ${eventName}`);
      Logger.debug("Track parameters:", { eventName, data });
      Logger.debug("Provider state:", {
        isReady,
        hasWindow: typeof window !== "undefined",
        hasUmami: typeof window !== "undefined" && !!window.umami,
        hasQueuedEvents: queuedEvents.current.length > 0,
        disabled,
        websiteId,
        hasDefaultTracking: !!defaultTracking,
      });

      if (!isReady) {
        Logger.debug("Not ready, queueing event:", eventName);
        queuedEvents.current.push({ name: eventName, data });
        Logger.log(
          "warn",
          `⏳ Umami not initialized. Event "${eventName}" queued (${queuedEvents.current.length} events in queue)`
        );
        return;
      }

      if (!window.umami) {
        Logger.log(
          "warn",
          "❌ window.umami not found even though provider is ready"
        );
        queuedEvents.current.push({ name: eventName, data });
        Logger.debug("Queue size:", queuedEvents.current.length);
        return;
      }

      try {
        if (defaultTracking) {
          Logger.debug("Using default tracking data");
          const mergedData = {
            ...defaultTracking.data,
            ...data,
          };
          const finalEventName = eventName || defaultTracking.name;
          Logger.debug("Tracking with merged data:", {
            eventName: finalEventName,
            data: mergedData,
          });
          window.umami.track(finalEventName, mergedData);
          Logger.log(
            "info",
            `✅ Event "${finalEventName}" tracked successfully with default tracking`
          );
        } else {
          Logger.debug("Tracking event directly:", {
            eventName,
            data,
          });
          window.umami.track(eventName, data);
          Logger.log("info", `✅ Event "${eventName}" tracked successfully`);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        Logger.log(
          "error",
          `❌ Failed to track event "${eventName}":`,
          error.message
        );
        // Queue the event if tracking fails
        queuedEvents.current.push({ name: eventName, data });
        Logger.debug(
          "Event queued after error. Queue size:",
          queuedEvents.current.length
        );
      }
    },
    [isReady, defaultTracking, disabled, websiteId]
  );

  // Initialize Umami
  useEffect(() => {
    // Skip if already initialized or disabled
    if (initialized.current || disabled || !isBrowser()) {
      return;
    }

    // Skip if required props are missing
    if (!websiteId) {
      const err = new Error("[UmamiProvider] websiteId is required");
      Logger.log("error", err.message);
      setError(err);
      return;
    }

    const initializeUmami = async () => {
      try {
        initialized.current = true;
        Logger.log("info", "Waiting for Umami to be ready...");

        // Initialize UmamiReact
        UmamiReact.initialize({
          websiteId,
          ...config,
        });

        // Wait for script to load with timeout
        const checkScript = () => {
          return new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Timeout waiting for Umami script"));
            }, 5000); // 5 second timeout

            const check = () => {
              if (window.umami) {
                clearTimeout(timeout);
                resolve();
              } else {
                setTimeout(check, 100);
              }
            };
            check();
          });
        };

        try {
          await checkScript();
          Logger.log("info", "Script loaded and ready");

          // Process any queued events
          while (queuedEvents.current.length > 0) {
            const event = queuedEvents.current.shift();
            if (event && window.umami) {
              Logger.log("debug", "Processing queued event:", event);
              if (defaultTracking) {
                const mergedData = {
                  ...defaultTracking.data,
                  ...event.data,
                };
                const finalEventName = event.name || defaultTracking.name;
                window.umami.track(finalEventName, mergedData);
              } else {
                window.umami.track(event.name, event.data);
              }
            }
          }

          setIsReady(true);
        } catch (timeoutErr) {
          Logger.log(
            "warn",
            "[UmamiProvider] Script load timeout, proceeding anyway"
          );
          setIsReady(true); // Set ready anyway to not block the app
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        Logger.log("error", "Failed to initialize:", error.message);
        setError(error);
        setIsReady(true); // Set ready anyway to not block the app
      }
    };

    initializeUmami();
  }, [websiteId, disabled, config, defaultTracking]);

  const value = useMemo(
    () => ({
      track,
      defaultTracking,
      isReady,
    }),
    [track, defaultTracking, isReady]
  );

  if (error) {
    Logger.log("error", "Error:", error.message);
    return <>{children}</>;
  }

  return (
    <UmamiContext.Provider value={value}>{children}</UmamiContext.Provider>
  );
}

import type { UmamiOptions } from "./types";
import Logger from "./utils/logger";

/**
 * React integration for Umami Analytics
 * @class UmamiReact
 */
export class UmamiReact {
  private static initialized = false;
  private static debug = false;
  private static scriptLoaded = false;
  private static eventQueue: { name: string; data?: Record<string, any> }[] =
    [];

  private static log(message: string, data?: any) {
    if (this.debug) {
      Logger.log("info", `[UmamiReact] ${message}`, data ? data : "");
    }
  }

  private static logDebug(message: string, data?: any) {
    // Always log debug messages regardless of debug setting
    Logger.log("debug", `[UmamiReact Debug] ${message}`, data ? data : "");
  }

  private static logState() {
    this.logDebug("Current State:", {
      initialized: this.initialized,
      scriptLoaded: this.scriptLoaded,
      debug: this.debug,
      queueLength: this.eventQueue.length,
      hasUmamiObject: typeof window !== "undefined" && !!window.umami,
    });
  }

  private static processQueue() {
    this.logDebug(`Processing queue with ${this.eventQueue.length} events`);

    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (event && window.umami) {
        this.logDebug(`Processing queued event:`, event);
        window.umami.track(event.name, event.data);
        this.log(`Processed queued event: ${event.name}`, event.data);
      } else {
        this.logDebug(`Failed to process event:`, event);
      }
    }

    this.logDebug("Queue processing complete");
  }

  private static waitForScript(): Promise<void> {
    this.logDebug("Starting to wait for Umami script...");
    return new Promise((resolve) => {
      const maxAttempts = 50; // 5 seconds total (50 * 100ms)
      let attempts = 0;

      const checkUmami = () => {
        this.logDebug("Checking for Umami object...", {
          hasWindow: typeof window !== "undefined",
          hasUmami: typeof window !== "undefined" && !!window.umami,
          attempt: attempts + 1,
        });

        if (window.umami) {
          this.scriptLoaded = true;
          this.logDebug("Umami object found!");
          resolve();
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          Logger.log("warn", "Timeout waiting for Umami script to load");
          resolve(); // Resolve anyway to not block the app
          return;
        }

        setTimeout(checkUmami, 100);
      };
      checkUmami();
    });
  }

  /**
   * Initialize the Umami tracking script with the provided configuration
   * @param {UmamiOptions} options - Configuration options for Umami
   * @throws {Error} If websiteId is not provided
   */
  static initialize(options: UmamiOptions): void {
    this.logDebug("Initializing with options:", options);
    this.logState();

    if (!options.websiteId) {
      this.logDebug("Missing websiteId!");
      throw new Error("websiteId is required");
    }

    if (this.initialized) {
      this.logDebug("Already initialized, skipping");
      return;
    }

    // Set debug mode before any other operations
    this.debug = Boolean(options.debug);
    this.log("Initializing with options:", options);

    try {
      // Validate hostUrl
      if (options.hostUrl && !options.hostUrl.startsWith("https://")) {
        throw new Error("hostUrl must use HTTPS protocol");
      }

      // Ensure hostUrl ends with /script.js
      const scriptUrl = options.hostUrl
        ? options.hostUrl.endsWith("/script.js")
          ? options.hostUrl
          : `${options.hostUrl.replace(/\/$/, "")}/script.js`
        : "https://analytics.umami.is/script.js";

      // Create and inject the script
      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.setAttribute("data-website-id", options.websiteId);
      script.setAttribute("src", scriptUrl);

      // Add optional attributes
      if (options.domains) {
        script.setAttribute("data-domains", options.domains.join(","));
      }
      if (options.autoTrack === false) {
        script.setAttribute("data-auto-track", "false");
      }

      this.logDebug("Created script element:", {
        src: script.getAttribute("src"),
        attributes: Array.from(script.attributes).map((attr) => ({
          name: attr.name,
          value: attr.value,
        })),
      });

      // Handle script load
      script.onload = () => {
        this.logDebug("Script onload triggered");
        this.waitForScript().then(() => {
          this.logDebug("Script fully loaded and Umami object available");
          this.processQueue();
        });
      };

      // Handle script error with more detailed error reporting
      script.onerror = (error: Event | string) => {
        const errorDetails =
          error instanceof Event
            ? {
                type: error.type,
                target: error.target,
                currentTarget: error.currentTarget,
                eventPhase: error.eventPhase,
                isTrusted: error.isTrusted,
              }
            : error;

        this.logDebug("Script load error:", errorDetails);
        Logger.log("error", "Failed to load script:", errorDetails);

        // Try to fetch the script URL to get more error details
        fetch(scriptUrl, { method: "HEAD" })
          .then((response) => {
            if (!response.ok) {
              Logger.log(
                "error",
                "Failed to load Umami script. Response status:",
                response.status
              );
            } else {
              Logger.log("info", "Response headers:");
              response.headers.forEach((value, key) => {
                Logger.log("info", `${key}: ${value}`);
              });
            }
          })
          .catch((fetchError) => {
            Logger.log(
              "error",
              "Failed to load Umami script. No response received."
            );
          });
      };

      // Try to append to head first, fall back to body
      const target = document.head || document.body;
      target.appendChild(script);
      this.initialized = true;
      this.logDebug(
        `Script appended to ${target === document.head ? "head" : "body"}`
      );
      this.logState();
    } catch (error) {
      this.logDebug("Initialization failed:", error);
      Logger.log("error", "Failed to initialize:", error);
      throw error;
    }
  }

  /**
   * Track a custom event with optional event data
   * @param {string} eventName - Name of the event to track
   * @param {Record<string, any>} [eventData] - Optional data to associate with the event
   */
  static track(eventName: string, eventData?: Record<string, any>): void {
    this.logDebug(`Track called for event: ${eventName}`, { eventData });
    this.logState();

    if (!this.initialized) {
      this.logDebug("Track called before initialization");
      Logger.log("warn", "UmamiReact: Please call initialize() first");
      return;
    }

    if (typeof window === "undefined") {
      this.logDebug("Window not defined, skipping track");
      return;
    }

    // If script is not loaded yet, queue the event
    if (!this.scriptLoaded || !window.umami) {
      this.logDebug(`Queueing event: ${eventName}`, {
        eventData,
        scriptLoaded: this.scriptLoaded,
        hasUmami: !!window.umami,
      });
      this.eventQueue.push({ name: eventName, data: eventData });
      return;
    }

    // If script is loaded, track immediately
    this.logDebug(`Tracking event immediately: ${eventName}`, eventData);
    window.umami.track(eventName, eventData);
    this.log(`Tracked event: ${eventName}`, eventData);
  }
}

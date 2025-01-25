/**
 * Configuration options for the Umami tracker
 * @interface UmamiOptions
 */
interface UmamiOptions {
  /** The website ID from your Umami instance */
  websiteId: string;
  /** Custom analytics server URL. By default, Umami will send data to wherever the script is located */
  hostUrl?: string;
  /** Enable/disable automatic page tracking. Defaults to true */
  autoTrack?: boolean;
  /** List of allowed domains. Helps when working in staging/development environments */
  domains?: string[];
  /** Tag to collect events under. Events can be filtered in the dashboard by this tag */
  tag?: string;
  /** Enable debug mode to log all tracking actions to the console */
  debug?: boolean;
}

/**
 * React integration for Umami Analytics
 * @class UmamiReact
 */
export class UmamiReact {
  private static initialized = false;
  private static debug = false;

  private static log(message: string, data?: any) {
    if (this.debug) {
      console.log(`[UmamiReact] ${message}`, data ? data : "");
    }
  }

  /**
   * Initialize the Umami tracking script with the provided configuration
   * @param {UmamiOptions} options - Configuration options for Umami
   * @throws {Error} If websiteId is not provided
   * @example
   * ```typescript
   * UmamiReact.initialize({
   *   websiteId: 'your-website-id',
   *   hostUrl: 'https://analytics.mywebsite.com',
   *   autoTrack: false,
   *   domains: ['mywebsite.com'],
   *   tag: 'production',
   *   debug: true
   * });
   * ```
   */
  static initialize(options: UmamiOptions): void {
    // Always log this to verify the method is being called
    console.log("[UmamiReact] initialize called with options:", options);

    if (typeof window === "undefined") {
      console.log(
        "[UmamiReact] Skipping initialization: window is undefined (SSR environment)"
      );
      return;
    }

    if (!options.websiteId) {
      console.error("UmamiReact: websiteId is required");
      return;
    }

    if (this.initialized) {
      console.warn("UmamiReact: already initialized");
      return;
    }

    // Set debug mode before any other operations
    this.debug = Boolean(options.debug);
    console.log("[UmamiReact] Debug mode:", this.debug);

    this.log("Initializing with options:", options);

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.setAttribute("data-website-id", options.websiteId);
    script.src = options.hostUrl || "https://analytics.umami.is/script.js";

    if (options.hostUrl) {
      script.setAttribute("data-host-url", options.hostUrl);
      this.log("Setting custom host URL:", options.hostUrl);
    }

    if (options.autoTrack === false) {
      script.setAttribute("data-auto-track", "false");
      this.log("Auto-tracking disabled");
    }

    if (options.domains) {
      script.setAttribute("data-domains", options.domains.join(","));
      this.log("Setting allowed domains:", options.domains);
    }

    if (options.tag) {
      script.setAttribute("data-tag", options.tag);
      this.log("Setting tag:", options.tag);
    }

    document.head.appendChild(script);
    this.initialized = true;
    this.log("Script added to document head");

    // Add script load event handlers
    script.onload = () => {
      this.log("Umami script loaded successfully");
    };
    script.onerror = (error) => {
      console.error("[UmamiReact] Failed to load script:", error);
    };
  }

  /**
   * Track a custom event with optional event data
   * @param {string} eventName - Name of the event to track
   * @param {Record<string, any>} [eventData] - Optional data to associate with the event
   * @example
   * ```typescript
   * // Track a simple event
   * UmamiReact.track('Button Click');
   *
   * // Track an event with data
   * UmamiReact.track('Purchase', {
   *   product: 'Premium Plan',
   *   price: 99.99
   * });
   * ```
   */
  static track(eventName: string, eventData?: Record<string, any>): void {
    if (typeof window === "undefined") {
      this.log("Skipping track: window is undefined (SSR environment)");
      return;
    }

    if (!this.initialized) {
      console.warn("UmamiReact: Please call initialize() first");
      return;
    }

    this.log("Tracking event:", { name: eventName, data: eventData });

    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(eventName, eventData);
      this.log("Event tracked successfully");
    } else {
      this.log("Failed to track event: window.umami.track is not available");
    }
  }
}

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

export type { UmamiOptions };
export default UmamiReact;

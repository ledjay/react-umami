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
}

/**
 * React integration for Umami Analytics
 * @class UmamiReact
 */
export class UmamiReact {
  private static initialized = false;

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
   *   tag: 'production'
   * });
   * ```
   */
  static initialize(options: UmamiOptions): void {
    if (typeof window === "undefined") return;

    if (!options.websiteId) {
      console.error("UmamiReact: websiteId is required");
      return;
    }

    if (this.initialized) {
      console.warn("UmamiReact: already initialized");
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.setAttribute("data-website-id", options.websiteId);
    script.src = "https://analytics.umami.is/script.js";

    if (options.hostUrl) {
      script.setAttribute("data-host-url", options.hostUrl);
    }

    if (options.autoTrack === false) {
      script.setAttribute("data-auto-track", "false");
    }

    if (options.domains) {
      script.setAttribute("data-domains", options.domains.join(","));
    }

    if (options.tag) {
      script.setAttribute("data-tag", options.tag);
    }

    document.head.appendChild(script);
    this.initialized = true;
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
    if (typeof window === "undefined") return;

    if (!this.initialized) {
      console.warn("UmamiReact: Please call initialize() first");
      return;
    }

    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(eventName, eventData);
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

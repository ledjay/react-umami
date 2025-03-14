/**
 * React integration for Umami Analytics
 * @packageDocumentation
 */

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

export type { UmamiOptions } from "./types";
export { UmamiReact } from "./umami-react";
export { UmamiAnalytics } from "./client/analytics";
export { useUmami } from "./client/hooks";

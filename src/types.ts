/**
 * Configuration options for the Umami tracker
 * @interface UmamiOptions
 */

export interface TrackingObject {
  /** Name of the event */
  name: string;
  /** Optional data to associate with the event */
  data?: Record<string, any>;
}

export interface UmamiOptions {
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
  /** Default tracking object to be merged with all tracking calls */
  defaultTracking?: TrackingObject;
}

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
    track: (eventName: string, eventData?: Record<string, any>) => void;
  }
}

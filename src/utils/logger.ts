export type LogLevel = "debug" | "info" | "warn" | "error";

class Logger {
  private static isDebugEnabled = Logger.checkDebugMode();
  private static prefix = "[UmamiReact]";

  private static formatTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `[${hours}:${minutes}]`;
  }

  private static checkDebugMode(): boolean {
    // Check Node.js environment first (including Next.js public env)
    if (typeof process !== "undefined" && 
      (process.env.NEXT_PUBLIC_UMAMI_DEBUG === "true" || 
       process.env.UMAMI_DEBUG === "true")) {
      return true;
    }
    
    // Check browser environment
    if (typeof window !== "undefined" && (window as any).UMAMI_DEBUG === true) {
      return true;
    }

    return false;
  }

  static setDebug(enabled: boolean) {
    // Allow manual override of debug mode
    this.isDebugEnabled = enabled;
    
    // Also set window variable for browser environment
    if (typeof window !== "undefined") {
      (window as any).UMAMI_DEBUG = enabled;
    }
  }

  static setPrefix(prefix: string) {
    this.prefix = prefix;
  }

  static log(level: LogLevel, message: string, ...args: any[]) {
    // Return early if debug is not enabled (except for errors)
    if (!this.isDebugEnabled && level !== "error") {
      return;
    }

    const time = this.formatTime();
    const logMessage = `${this.prefix}${time} [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case "debug":
        console.debug(logMessage, ...args);
        break;
      case "info":
        console.info(logMessage, ...args);
        break;
      case "warn":
        console.warn(logMessage, ...args);
        break;
      case "error":
        console.error(logMessage, ...args);
        break;
    }
  }

  static debug(message: string, ...args: any[]) {
    this.log("debug", message, ...args);
  }

  static info(message: string, ...args: any[]) {
    this.log("info", message, ...args);
  }

  static warn(message: string, ...args: any[]) {
    this.log("warn", message, ...args);
  }

  static error(message: string, ...args: any[]) {
    this.log("error", message, ...args);
  }
}

export default Logger;

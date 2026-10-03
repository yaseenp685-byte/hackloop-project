type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  level: LogLevel;
  message: string;
  context?: string;
  data?: unknown;
  timestamp: string;
}

export const logger = {
  info(message: string, context?: string, data?: unknown) {
    this.log("info", message, context, data);
  },
  warn(message: string, context?: string, data?: unknown) {
    this.log("warn", message, context, data);
  },
  error(message: string, context?: string, data?: unknown) {
    this.log("error", message, context, data);
  },
  debug(message: string, context?: string, data?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      this.log("debug", message, context, data);
    }
  },
  log(level: LogLevel, message: string, context?: string, data?: unknown) {
    const payload: LogPayload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
    };
    if (level === "error") {
      console.error(JSON.stringify(payload));
    } else if (level === "warn") {
      console.warn(JSON.stringify(payload));
    } else {
      console.log(JSON.stringify(payload));
    }
  },
};

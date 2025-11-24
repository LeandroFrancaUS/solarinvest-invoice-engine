export type LogLevel = "info" | "warn" | "error" | "debug";

export class Logger {
  constructor(private context: string) {}

  public log(level: LogLevel, message: string, extra?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const payload = extra ? ` | extra=${JSON.stringify(extra)}` : "";
    console.log(`[${timestamp}] [${this.context}] [${level.toUpperCase()}] ${message}${payload}`);
  }

  public info(message: string, extra?: Record<string, unknown>): void {
    this.log("info", message, extra);
  }

  public warn(message: string, extra?: Record<string, unknown>): void {
    this.log("warn", message, extra);
  }

  public error(message: string, extra?: Record<string, unknown>): void {
    this.log("error", message, extra);
  }

  public debug(message: string, extra?: Record<string, unknown>): void {
    this.log("debug", message, extra);
  }
}

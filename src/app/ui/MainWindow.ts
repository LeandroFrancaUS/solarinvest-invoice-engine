import { BrowserWindow } from "electron";

export class MainWindow {
  private window: BrowserWindow | null = null;

  public create(): BrowserWindow {
    this.window = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    this.window.loadURL(
      "data:text/html;charset=utf-8,<h1>SolarInvest Invoice Engine</h1><p>Interface principal (stub FASE 1).</p>"
    );

    this.window.on("closed", () => {
      this.window = null;
    });

    return this.window;
  }
}

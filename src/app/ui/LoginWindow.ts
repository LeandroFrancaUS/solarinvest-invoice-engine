import { BrowserWindow } from "electron";

export class LoginWindow {
  private window: BrowserWindow | null = null;

  public create(): BrowserWindow {
    this.window = new BrowserWindow({
      width: 400,
      height: 300,
      webPreferences: {
        nodeIntegration: true,
      },
    });

    this.window.loadURL("data:text/html;charset=utf-8,<h1>SolarInvest Login (Stub)</h1>");
    this.window.on("closed", () => {
      this.window = null;
    });

    return this.window;
  }
}

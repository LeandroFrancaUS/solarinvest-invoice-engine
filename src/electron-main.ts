import { app, BrowserWindow } from "electron";
import { initializeApp } from "./app/bootstrap/init";
import { MainWindow } from "./app/ui/MainWindow";

let mainWindow: BrowserWindow | null = null;

async function createWindow(): Promise<void> {
  await initializeApp();

  mainWindow = new MainWindow().create();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createWindow();
  }
});

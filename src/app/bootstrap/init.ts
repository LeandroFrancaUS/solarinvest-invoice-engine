import { app } from "electron";
import { InMemoryDatabase } from "../../infra/db";
import { Logger } from "../../infra/logging/logger";

const logger = new Logger("Bootstrap");
const db = new InMemoryDatabase();

export async function initializeApp(): Promise<void> {
  logger.info("Inicializando aplicação SolarInvest Invoice Engine (stub FASE 1)");
  await db.connect();

  app.on("before-quit", async () => {
    logger.info("Encerrando aplicação, desligando recursos");
    await db.disconnect();
  });
}

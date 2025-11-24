export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export class InMemoryDatabase implements DatabaseConnection {
  private connected = false;

  public async connect(): Promise<void> {
    this.connected = true;
    console.log("[DB] Conexão in-memory estabelecida (stub FASE 1)");
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
    console.log("[DB] Conexão in-memory encerrada (stub FASE 1)");
  }

  public isConnected(): boolean {
    return this.connected;
  }
}

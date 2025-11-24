export interface RawInvoiceData {
  distribuidora: string | null;
  uf: string | null;
  mesReferencia: string | null;
  consumoKWh: number | null;
  energiaCompensadaKWh?: number | null;
  creditosAnterioresKWh?: number | null;
  creditosAtuaisKWh?: number | null;
  tarifaCheiaRSKWh: number | null;
  tarifaPisoComDescontoRSKWh?: number | null;
  valorCIP: number | null;
  valorBandeira: number | null;
  outrosEncargos?: number | null;
  nomeTitular?: string | null;
  enderecoInstalacao?: string | null;
  numeroUC?: string | null;
}

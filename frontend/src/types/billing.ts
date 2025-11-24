import { RawInvoiceData } from './invoice';

export interface ContractParams {
  idContrato: string;
  kcEnergiaContratadaKWh: number;
  descontoPercentual: number;
  incluirCIPNaCobranca: boolean;
  incluirBandeiraNaCobranca: boolean;
  incluirOutrosEncargosNaCobranca: boolean;
}

export interface BillingItem {
  codigo: string;
  descricao: string;
  valor: number;
  incluidoNaCobranca: boolean;
}

export interface BillingMeta {
  uf: string;
  distribuidora: string;
  mesReferencia: string;
  idContrato: string;
  dataCalculoISO: string;
  versaoRegra: string;
}

export interface BillingResult {
  totalAPagarRS: number;
  itens: BillingItem[];
  resumoTextoExplicativo: string;
  meta: BillingMeta;
}

export interface BillingInput {
  rawInvoice: RawInvoiceData;
  contrato: ContractParams;
}

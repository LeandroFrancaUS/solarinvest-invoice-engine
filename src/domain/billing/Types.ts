export interface OriginalInvoice {
  uf: string;
  distribuidora: string;
  mesReferencia: string;
  consumoKWh: number;
  valorEnergiaRS: number;
  valorTusdRS: number;
  taxaMinimaRS: number;
  outrosEncargosRS: number;
  numeroUc: string;
}

export interface LeasingContract {
  idContrato: string;
  nomeCliente: string;
  documentoCliente: string;
  unidadeConsumidora: string;
  uf: string;
  kWhContratadoMensal: number;
  descontoPercentual: number;
  permiteCobrancaExcedente: boolean;
  incluirTusdTaxaMinimaPorPadrao: boolean;
}

export interface UfConfig {
  uf: string;
  distribuidora: string;
  regraTarifaria: {
    incluirTusdNaTarifaCheia: boolean;
  };
  versaoNorma?: string;
}

export interface BillingInput {
  originalInvoice: OriginalInvoice;
  contract: LeasingContract;
  ufConfig: UfConfig;
  options: {
    incluirComponentesDaFatura: boolean;
  };
}

export interface BillingBreakdownItem {
  codigo: string;
  descricao: string;
  quantidade?: number;
  tarifaUnit?: number;
  valor: number;
  incluidoNaCobranca: boolean;
}

export interface BillingResult {
  totalAPagarRS: number;
  itens: BillingBreakdownItem[];
  resumoTextoExplicativo: string;
  meta: {
    uf: string;
    distribuidora: string;
    mesReferencia: string;
    idContrato: string;
    dataCalculo: string;
    versaoRegra: string;
  };
}

import {
  BillingInput,
  BillingResult,
  BillingBreakdownItem,
} from "./Types";

export class BillingEngine {
  public calcular(input: BillingInput): BillingResult {
    const itens: BillingBreakdownItem[] = [];

    itens.push({
      codigo: "STUB",
      descricao: "Cálculo de faturamento ainda não implementado (FASE 1).",
      valor: 0,
      incluidoNaCobranca: false,
    });

    const result: BillingResult = {
      totalAPagarRS: 0,
      itens,
      resumoTextoExplicativo:
        "Cálculo de faturamento ainda não implementado. Esta é apenas a estrutura base (FASE 1).",
      meta: {
        uf: input.originalInvoice.uf,
        distribuidora: input.originalInvoice.distribuidora,
        mesReferencia: input.originalInvoice.mesReferencia,
        idContrato: input.contract.idContrato,
        dataCalculo: new Date().toISOString(),
        versaoRegra: input.ufConfig.versaoNorma || "DESCONHECIDA",
      },
    };

    return result;
  }
}

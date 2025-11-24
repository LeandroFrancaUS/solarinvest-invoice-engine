import { BillingEngine } from "../domain/billing/BillingEngine";
import { BillingInput } from "../domain/billing/Types";
import { getUfConfig } from "../domain/uf";
import { Logger } from "../infra/logging/logger";

const logger = new Logger("CLI");

function buildStubInput(): BillingInput {
  const ufConfig = getUfConfig("GO");

  if (!ufConfig) {
    throw new Error("UF GO não configurada");
  }

  return {
    originalInvoice: {
      uf: "GO",
      distribuidora: ufConfig.distribuidora,
      mesReferencia: "2024-01",
      consumoKWh: 500,
      valorEnergiaRS: 350,
      valorTusdRS: 120,
      taxaMinimaRS: 20,
      outrosEncargosRS: 10,
      numeroUc: "UC123456",
    },
    contract: {
      idContrato: "CONTRATO-STUB-001",
      nomeCliente: "Cliente Exemplo",
      documentoCliente: "000.000.000-00",
      unidadeConsumidora: "UC123456",
      uf: "GO",
      kWhContratadoMensal: 400,
      descontoPercentual: 12,
      permiteCobrancaExcedente: true,
      incluirTusdTaxaMinimaPorPadrao: true,
    },
    ufConfig,
    options: {
      incluirComponentesDaFatura: true,
    },
  };
}

function main(): void {
  logger.info("Executando stub da BillingEngine");

  const engine = new BillingEngine();
  const input = buildStubInput();
  const result = engine.calcular(input);

  console.log("Resultado do cálculo (FASE 1):");
  console.log(JSON.stringify(result, null, 2));
}

main();

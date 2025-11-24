import { calcularFaturaSolarInvest } from '../backend/src/engine/billingEngine';
import { BillingInput } from '../backend/src/engine/types';

function buildInput(): BillingInput {
  return {
    rawInvoice: {
      distribuidora: 'EQUATORIAL',
      uf: 'GO',
      mesReferencia: '2024-01',
      consumoKWh: 2300,
      energiaCompensadaKWh: 400,
      creditosAnterioresKWh: 200,
      creditosAtuaisKWh: 0,
      tarifaCheiaRSKWh: 1.1,
      tarifaPisoComDescontoRSKWh: 0.88,
      valorCIP: 24.5,
      valorBandeira: 18,
      outrosEncargos: 5,
      nomeTitular: 'Cliente Demo',
      numeroUC: 'UC123',
      numeroInstalacao: null,
      numeroContaContrato: null,
    },
    contrato: {
      idContrato: 'CONTRATO-STUB-001',
      kcEnergiaContratadaKWh: 2000,
      descontoPercentual: 0.2,
      incluirCIPNaCobranca: true,
      incluirBandeiraNaCobranca: true,
      incluirOutrosEncargosNaCobranca: false,
    },
  };
}

function main() {
  const input = buildInput();
  const result = calcularFaturaSolarInvest(input);
  console.log(JSON.stringify(result, null, 2));
}

main();

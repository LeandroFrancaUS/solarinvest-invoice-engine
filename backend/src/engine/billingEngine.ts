import { env } from '../config/env';
import { BillingInput, BillingItem, BillingMeta, BillingResult } from './types';

export function calcularFaturaSolarInvest(input: BillingInput): BillingResult {
  const { rawInvoice, contrato } = input;
  if (rawInvoice.consumoKWh == null) {
    throw new Error('Consumo da fatura não encontrado');
  }

  const uf = rawInvoice.uf || env.defaults.uf;
  const distribuidora = rawInvoice.distribuidora || env.defaults.distribuidora;
  const mesReferencia = rawInvoice.mesReferencia || '0000-00';
  const consumoReal = rawInvoice.consumoKWh;
  const creditos = (rawInvoice.creditosAnterioresKWh || 0) + (rawInvoice.creditosAtuaisKWh || 0);
  const tarifaCheia = rawInvoice.tarifaCheiaRSKWh ?? 1.1;
  const tarifaPiso = rawInvoice.tarifaPisoComDescontoRSKWh ?? tarifaCheia * (1 - contrato.descontoPercentual);

  const itens: BillingItem[] = [];

  const pisoValor = contrato.kcEnergiaContratadaKWh * tarifaPiso;
  itens.push({
    codigo: 'PISO',
    descricao: `Energia contratada (${contrato.kcEnergiaContratadaKWh} kWh)`,
    valor: pisoValor,
    incluidoNaCobranca: true,
  });

  const excedenteKWh = Math.max(consumoReal - contrato.kcEnergiaContratadaKWh - creditos, 0);
  if (excedenteKWh > 0) {
    itens.push({
      codigo: 'EXCEDENTE',
      descricao: `Excedente (${excedenteKWh.toFixed(0)} kWh)`,
      valor: excedenteKWh * tarifaCheia,
      incluidoNaCobranca: true,
    });
  }

  if (contrato.incluirCIPNaCobranca && rawInvoice.valorCIP != null) {
    itens.push({
      codigo: 'CIP',
      descricao: 'Contribuição de iluminação pública',
      valor: rawInvoice.valorCIP,
      incluidoNaCobranca: true,
    });
  }

  if (contrato.incluirBandeiraNaCobranca && rawInvoice.valorBandeira != null) {
    itens.push({
      codigo: 'BANDEIRA',
      descricao: 'Bandeira tarifária',
      valor: rawInvoice.valorBandeira,
      incluidoNaCobranca: true,
    });
  }

  if (contrato.incluirOutrosEncargosNaCobranca && rawInvoice.outrosEncargos != null) {
    itens.push({
      codigo: 'OUTROS',
      descricao: 'Outros encargos',
      valor: rawInvoice.outrosEncargos,
      incluidoNaCobranca: true,
    });
  }

  const totalAPagarRS = itens.filter((i) => i.incluidoNaCobranca).reduce((sum, item) => sum + item.valor, 0);

  const meta: BillingMeta = {
    uf,
    distribuidora,
    mesReferencia,
    idContrato: contrato.idContrato,
    dataCalculoISO: new Date().toISOString(),
    versaoRegra: 'ENGINE-v1',
  };

  const resumoTextoExplicativo = `Cálculo com base em Kc=${contrato.kcEnergiaContratadaKWh} kWh, consumo real ${consumoReal} kWh, créditos ${creditos} kWh, tarifa piso R$ ${tarifaPiso.toFixed(2)}/kWh e tarifa cheia R$ ${tarifaCheia.toFixed(2)}/kWh.`;

  return {
    totalAPagarRS,
    itens,
    resumoTextoExplicativo,
    meta,
  };
}

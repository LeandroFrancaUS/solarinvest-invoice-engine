import { env } from '../config/env';
import { BillingInput, BillingItem, BillingMeta, BillingResult } from './types';

export function calcularFaturaSolarInvest(input: BillingInput): BillingResult {
  const { rawInvoice, contrato } = input;

  if (!contrato || contrato.kcEnergiaContratadaKWh <= 0) {
    throw new Error('Contrato inválido: kcEnergiaContratadaKWh deve ser maior que zero');
  }

  const uf = rawInvoice.uf || env.defaults.uf;
  const distribuidora = rawInvoice.distribuidora || env.defaults.distribuidora;
  const mesReferencia = rawInvoice.mesReferencia || '0000-00';
  const consumoReal = rawInvoice.consumoKWh ?? 0;
  const creditos = (rawInvoice.creditosAnterioresKWh || 0) + (rawInvoice.creditosAtuaisKWh || 0);
  const tarifaCheia = rawInvoice.tarifaCheiaRSKWh ?? 0;
  const tarifaPiso =
    rawInvoice.tarifaPisoComDescontoRSKWh ?? (rawInvoice.tarifaCheiaRSKWh ?? 0) * (1 - contrato.descontoPercentual);

  const itens: BillingItem[] = [];

  const pisoKWh = Math.min(consumoReal, contrato.kcEnergiaContratadaKWh);
  const excedenteBruto = Math.max(consumoReal - contrato.kcEnergiaContratadaKWh, 0);
  const creditosUsados = Math.min(creditos, excedenteBruto);
  const excedenteLiquido = excedenteBruto - creditosUsados;

  const pisoValor = contrato.kcEnergiaContratadaKWh * tarifaPiso;
  itens.push({
    codigo: 'PISO',
    descricao: `Energia contratada (${contrato.kcEnergiaContratadaKWh} kWh a R$ ${tarifaPiso.toFixed(2)}/kWh)`,
    valor: pisoValor,
    incluidoNaCobranca: true,
  });

  if (excedenteLiquido > 0) {
    itens.push({
      codigo: 'EXCEDENTE',
      descricao: `Excedente (${excedenteLiquido.toFixed(0)} kWh a R$ ${tarifaCheia.toFixed(2)}/kWh)`,
      valor: excedenteLiquido * tarifaCheia,
      incluidoNaCobranca: true,
    });
  }

  if (creditosUsados > 0) {
    itens.push({
      codigo: 'CREDITOS',
      descricao: `Créditos utilizados (${creditosUsados.toFixed(0)} kWh)`,
      valor: -1 * creditosUsados * tarifaCheia,
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

  const resumoTextoExplicativo = `Cálculo com base em Kc=${contrato.kcEnergiaContratadaKWh} kWh, consumo real ${consumoReal} kWh, créditos ${creditos} kWh (utilizados ${creditosUsados.toFixed(0)} kWh), tarifa piso R$ ${tarifaPiso.toFixed(2)}/kWh e tarifa excedente R$ ${tarifaCheia.toFixed(2)}/kWh.`;

  return {
    totalAPagarRS,
    itens,
    resumoTextoExplicativo,
    meta,
  };
}

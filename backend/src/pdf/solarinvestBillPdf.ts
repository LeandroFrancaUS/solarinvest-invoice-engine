import PDFDocument from 'pdfkit';
import { BillingResult, ContractParams, RawInvoiceData } from '../engine/types';
import { formatCurrencyBR } from '../utils/brNumber';

export function gerarPdfFatura(billing: BillingResult, rawInvoice?: RawInvoiceData, contrato?: ContractParams): Buffer {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const buffers: Buffer[] = [];
  doc.on('data', (data) => buffers.push(data));

  doc.fontSize(20).fillColor('#0F172A').text('Fatura SolarInvest', { align: 'center' });
  doc.moveDown();

  doc.fontSize(12).fillColor('#1F2937').text(`Contrato: ${billing.meta.idContrato}`);
  doc.text(`Distribuidora: ${billing.meta.distribuidora} - ${billing.meta.uf}`);
  doc.text(`Mês de referência: ${billing.meta.mesReferencia}`);
  doc.text(`Emitido em: ${new Date(billing.meta.dataCalculoISO).toLocaleString('pt-BR')}`);
  if (rawInvoice?.nomeTitular) {
    doc.text(`Titular: ${rawInvoice.nomeTitular}`);
  }
  if (contrato?.kcEnergiaContratadaKWh) {
    doc.text(`Energia contratada (Kc): ${contrato.kcEnergiaContratadaKWh} kWh`);
  }
  doc.moveDown();

  doc.fontSize(14).fillColor('#111827').text('Resumo do cálculo', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(`Valor total: ${formatCurrencyBR(billing.totalAPagarRS)}`);
  doc.text(billing.resumoTextoExplicativo);
  doc.moveDown();

  doc.fontSize(14).fillColor('#111827').text('Itens faturados', { underline: true });
  doc.moveDown(0.5);
  billing.itens.forEach((item) => {
    doc.fontSize(12).fillColor('#111827').text(`${item.codigo} — ${item.descricao}`);
    doc.fillColor(item.valor >= 0 ? '#10B981' : '#EF4444').text(`${formatCurrencyBR(item.valor)}${item.incluidoNaCobranca ? '' : ' (não cobrado)'}`);
    doc.moveDown(0.3);
  });

  doc.moveDown();
  doc.fontSize(12).fillColor('#6B7280').text('QR Code para pagamento', { underline: true });
  doc.rect(doc.x, doc.y + 4, 120, 120).stroke('#9CA3AF');
  doc.text('QR Code aqui', doc.x + 20, doc.y + 40, { align: 'left' });
  doc.moveDown(8);

  doc.fontSize(12).fillColor('#9CA3AF').text('Histórico mensal será exibido aqui em versões futuras.');

  doc.end();
  return Buffer.concat(buffers);
}

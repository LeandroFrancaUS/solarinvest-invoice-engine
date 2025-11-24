import React from 'react';
import QRCode from 'qrcode.react';
import { useInvoiceStore } from '../store/invoiceStore';
import { generateBillPdf } from '../api/client';
import { formatCurrencyBR } from '../utils/brNumber';

export default function SolarInvestBillPreview(): JSX.Element {
  const billing = useInvoiceStore((s) => s.billingResult);
  const rawInvoice = useInvoiceStore((s) => s.rawInvoice);
  const contrato = useInvoiceStore((s) => s.contractParams);

  const handleDownload = async () => {
    if (!billing) return;
    const pdfBlob = await generateBillPdf(billing, rawInvoice || undefined, contrato || undefined);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fatura-solarinvest.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!billing) {
    return <p>Realize o cálculo primeiro.</p>;
  }

  const qrValue = `SOLARINVEST|${billing.meta.idContrato}|${billing.totalAPagarRS}|${billing.meta.mesReferencia}`;

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>Fatura SolarInvest</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>Contrato {billing.meta.idContrato}</p>
          <p style={{ margin: 0, color: '#6b7280' }}>
            {billing.meta.distribuidora} - {billing.meta.uf} · {billing.meta.mesReferencia}
          </p>
        </div>
        <button
          onClick={handleDownload}
          style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}
        >
          Baixar PDF
        </button>
      </div>

      <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Stat label="Energia contratada (Kc)" value={`${contrato?.kcEnergiaContratadaKWh ?? '-'} kWh`} />
        <Stat label="Consumo real (Kr)" value={`${rawInvoice?.consumoKWh ?? '-'} kWh`} />
        <Stat
          label="Créditos"
          value={`${(rawInvoice?.creditosAnterioresKWh || 0) + (rawInvoice?.creditosAtuaisKWh || 0)} kWh`}
        />
        <Stat label="Valor total" value={formatCurrencyBR(billing.totalAPagarRS)} large />
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 12 }}>
            <th>Código</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {billing.itens.map((item) => (
            <tr key={item.codigo} style={{ borderTop: '1px solid #e5e7eb' }}>
              <td>{item.codigo}</td>
              <td>{item.descricao}</td>
              <td>{formatCurrencyBR(item.valor)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <p style={{ marginTop: 0, color: '#6b7280' }}>QR Code para pagamento</p>
          <QRCode value={qrValue} size={140} />
          <p style={{ color: '#6b7280' }}>Use o app do seu banco para pagar.</p>
        </div>
        <div style={{ flex: 2, minWidth: 300, border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <p style={{ marginTop: 0, fontWeight: 700 }}>Explicação</p>
          <p style={{ margin: 0, color: '#111827' }}>{billing.resumoTextoExplicativo}</p>
          <div style={{ marginTop: 12, color: '#6b7280' }}>
            Histórico mensal será exibido aqui em versões futuras.
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, large }: { label: string; value: string; large?: boolean }) {
  return (
    <div>
      <div style={{ color: '#6b7280', fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: large ? 22 : 16 }}>{value}</div>
    </div>
  );
}

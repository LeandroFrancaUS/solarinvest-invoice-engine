import React from 'react';
import { useInvoiceStore } from '../store/invoiceStore';
import { generateBillPdf } from '../api/client';
import { formatCurrencyBR } from '../../backend/src/utils/brNumber';

export default function SolarInvestBillPreview(): JSX.Element {
  const billing = useInvoiceStore((s) => s.billingResult);
  const rawInvoice = useInvoiceStore((s) => s.rawInvoice);

  const handleDownload = async () => {
    if (!billing) return;
    const pdfBlob = await generateBillPdf(billing, rawInvoice || undefined);
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

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>Fatura SolarInvest</h3>
          <p style={{ margin: 0, color: '#6b7280' }}>Contrato {billing.meta.idContrato}</p>
        </div>
        <button
          onClick={handleDownload}
          style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}
        >
          Baixar PDF
        </button>
      </div>
      <div style={{ background: '#f9fafb', padding: 12, borderRadius: 8 }}>
        <p style={{ margin: 0 }}>Distribuidora: {billing.meta.distribuidora}</p>
        <p style={{ margin: 0 }}>UF: {billing.meta.uf}</p>
        <p style={{ margin: 0 }}>Mês referência: {billing.meta.mesReferencia}</p>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: '#6b7280' }}>Valor a pagar</p>
          <p style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>{formatCurrencyBR(billing.totalAPagarRS)}</p>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: '#6b7280' }}>Resumo</p>
          <p style={{ margin: 0 }}>{billing.resumoTextoExplicativo}</p>
        </div>
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
    </div>
  );
}

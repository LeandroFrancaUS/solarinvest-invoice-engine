import React from 'react';
import { useInvoiceStore } from '../store/invoiceStore';
import { formatCurrencyBR } from '../utils/brNumber';

export default function ExtractedDataPanel(): JSX.Element {
  const rawInvoice = useInvoiceStore((s) => s.rawInvoice);
  const ocrPreview = useInvoiceStore((s) => s.ocrPreview);
  const fileName = useInvoiceStore((s) => s.fileName);

  if (!rawInvoice) {
    return <p>Nenhuma fatura carregada ainda.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <Card label="Arquivo" value={fileName || '-'} />
        <Card label="Distribuidora" value={rawInvoice.distribuidora || '-'} />
        <Card label="UF" value={rawInvoice.uf || '-'} />
        <Card label="Mês de referência" value={rawInvoice.mesReferencia || '-'} />
        <Card label="Consumo (kWh)" value={rawInvoice.consumoKWh ?? '-'} />
        <Card label="Créditos (kWh)" value={(rawInvoice.creditosAnterioresKWh || 0) + (rawInvoice.creditosAtuaisKWh || 0)} />
        <Card label="Tarifa cheia" value={rawInvoice.tarifaCheiaRSKWh != null ? formatCurrencyBR(rawInvoice.tarifaCheiaRSKWh) : '-'} />
        <Card
          label="Tarifa piso"
          value={
            rawInvoice.tarifaPisoComDescontoRSKWh != null ? formatCurrencyBR(rawInvoice.tarifaPisoComDescontoRSKWh) : '-'
          }
        />
        <Card label="CIP" value={rawInvoice.valorCIP != null ? formatCurrencyBR(rawInvoice.valorCIP) : '-'} />
        <Card label="Bandeira" value={rawInvoice.valorBandeira != null ? formatCurrencyBR(rawInvoice.valorBandeira) : '-'} />
      </div>
      {ocrPreview && (
        <div style={{ background: '#0f172a', color: '#e5e7eb', borderRadius: 8, padding: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Preview OCR</div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{ocrPreview}</pre>
        </div>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }): JSX.Element {
  return (
    <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, border: '1px solid #e5e7eb' }}>
      <div style={{ color: '#6b7280', fontSize: 12 }}>{label}</div>
      <div style={{ fontWeight: 700 }}>{value}</div>
    </div>
  );
}

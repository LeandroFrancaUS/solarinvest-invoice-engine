import React from 'react';
import { useInvoiceStore } from '../store/invoiceStore';

export default function ExtractedDataPanel(): JSX.Element {
  const rawInvoice = useInvoiceStore((s) => s.rawInvoice);

  if (!rawInvoice) {
    return <p>Nenhuma fatura carregada ainda.</p>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
      <Card label="Distribuidora" value={rawInvoice.distribuidora || '-'} />
      <Card label="UF" value={rawInvoice.uf || '-'} />
      <Card label="Mês de referência" value={rawInvoice.mesReferencia || '-'} />
      <Card label="Consumo (kWh)" value={rawInvoice.consumoKWh ?? '-'} />
      <Card label="Créditos" value={(rawInvoice.creditosAnterioresKWh || 0) + (rawInvoice.creditosAtuaisKWh || 0)} />
      <Card label="Tarifa cheia" value={rawInvoice.tarifaCheiaRSKWh ?? '-'} />
      <Card label="Tarifa piso" value={rawInvoice.tarifaPisoComDescontoRSKWh ?? '-'} />
      <Card label="CIP" value={rawInvoice.valorCIP ?? '-'} />
      <Card label="Bandeira" value={rawInvoice.valorBandeira ?? '-'} />
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

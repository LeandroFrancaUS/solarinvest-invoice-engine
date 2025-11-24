import React from 'react';
import InvoiceUploadCard from '../components/InvoiceUploadCard';

export default function UploadInvoicePage(): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Upload de Fatura</h2>
      <p style={{ margin: 0, color: '#6b7280' }}>Envie o PDF ou imagem da fatura para extração via OCR.</p>
      <InvoiceUploadCard />
    </div>
  );
}

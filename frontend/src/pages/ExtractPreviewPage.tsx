import React, { useEffect } from 'react';
import ExtractedDataPanel from '../components/ExtractedDataPanel';
import { Link, useNavigate } from 'react-router-dom';
import { useInvoiceStore } from '../store/invoiceStore';

export default function ExtractPreviewPage(): JSX.Element {
  const rawInvoice = useInvoiceStore((s) => s.rawInvoice);
  const navigate = useNavigate();

  useEffect(() => {
    if (!rawInvoice) navigate('/upload');
  }, [rawInvoice, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Dados Extraídos</h2>
      <ExtractedDataPanel />
      <div>
        <Link to="/interpretacao" style={{ ...linkStyle }}>
          Continuar para Interpretação
        </Link>
      </div>
    </div>
  );
}

const linkStyle: React.CSSProperties = {
  background: '#0ea5e9',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: 8,
  textDecoration: 'none',
};

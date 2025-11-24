import React from 'react';
import ExtractedDataPanel from '../components/ExtractedDataPanel';
import { Link } from 'react-router-dom';

export default function ExtractPreviewPage(): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h2 style={{ margin: 0 }}>Dados Extraídos</h2>
      <ExtractedDataPanel />
      <div>
        <Link to="/interpretacao" style={{ ...linkStyle }}>
          Continuar para Interpretação / Cálculo
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

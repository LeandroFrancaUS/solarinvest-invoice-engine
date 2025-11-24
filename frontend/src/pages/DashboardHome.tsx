import React from 'react';
import { Link } from 'react-router-dom';

export default function DashboardHome(): JSX.Element {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Visão Geral</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <InfoCard title="Faturas processadas hoje" value="3" />
        <InfoCard title="Último cálculo" value="há 2 horas" />
        <InfoCard title="Status do OCR" value="Simulado ativo" />
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/upload" style={ctaStyle}>
          Enviar nova fatura
        </Link>
        <Link to="/fatura-solarinvest" style={ctaStyle}>
          Ver última Fatura SolarInvest
        </Link>
      </div>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }): JSX.Element {
  return (
    <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', padding: 16, borderRadius: 12 }}>
      <p style={{ margin: 0, color: '#6b7280' }}>{title}</p>
      <p style={{ margin: 0, fontWeight: 800, fontSize: 20 }}>{value}</p>
    </div>
  );
}

const ctaStyle: React.CSSProperties = {
  background: '#22c55e',
  color: '#fff',
  padding: '10px 16px',
  borderRadius: 8,
  textDecoration: 'none',
  fontWeight: 700,
};

import { NavLink } from 'react-router-dom';
import { colors } from '../theme/dashboardTheme';
import { Home, Upload, FileText, Calculator, Receipt } from 'lucide-react';
import React from 'react';

const links = [
  { to: '/', label: 'Visão Geral', icon: <Home size={18} /> },
  { to: '/upload', label: 'Upload de Faturas', icon: <Upload size={18} /> },
  { to: '/dados-extraidos', label: 'Dados Extraídos', icon: <FileText size={18} /> },
  { to: '/interpretacao', label: 'Cálculo SolarInvest', icon: <Calculator size={18} /> },
  { to: '/fatura-solarinvest', label: 'Fatura SolarInvest', icon: <Receipt size={18} /> },
];

export default function Sidebar(): JSX.Element {
  return (
    <aside
      style={{
        width: 240,
        background: colors.sidebarBg,
        color: colors.sidebarText,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 32 }}>SolarInvest</div>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              color: colors.sidebarText,
              background: isActive ? colors.sidebarActive : 'transparent',
              fontWeight: isActive ? 700 : 500,
            })}
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

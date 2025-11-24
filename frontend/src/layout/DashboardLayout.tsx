import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { colors } from '../theme/dashboardTheme';
import React from 'react';

export default function DashboardLayout(): JSX.Element {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.surfaceMuted }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: '24px 32px',
          overflowY: 'auto',
          background: colors.surfaceMuted,
        }}
      >
        <div style={{ background: colors.surface, padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

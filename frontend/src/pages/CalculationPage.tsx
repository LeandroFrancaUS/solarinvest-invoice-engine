import React, { useEffect } from 'react';
import CalculationSummaryCard from '../components/CalculationSummaryCard';
import { useInvoiceStore } from '../store/invoiceStore';
import { useNavigate, Link } from 'react-router-dom';

export default function CalculationPage(): JSX.Element {
  const billing = useInvoiceStore((s) => s.billingResult);
  const navigate = useNavigate();

  useEffect(() => {
    if (!billing) navigate('/interpretacao');
  }, [billing, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Cálculo SolarInvest</h2>
      <CalculationSummaryCard />
      <div>
        <Link to="/fatura-solarinvest" style={{ background: '#0ea5e9', color: '#fff', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>
          Ver Fatura SolarInvest
        </Link>
      </div>
    </div>
  );
}

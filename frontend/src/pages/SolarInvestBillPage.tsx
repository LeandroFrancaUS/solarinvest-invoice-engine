import React, { useEffect } from 'react';
import SolarInvestBillPreview from '../components/SolarInvestBillPreview';
import CalculationSummaryCard from '../components/CalculationSummaryCard';
import { useInvoiceStore } from '../store/invoiceStore';
import { useNavigate } from 'react-router-dom';

export default function SolarInvestBillPage(): JSX.Element {
  const billing = useInvoiceStore((s) => s.billingResult);
  const navigate = useNavigate();

  useEffect(() => {
    if (!billing) navigate('/interpretacao');
  }, [billing, navigate]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Fatura SolarInvest</h2>
      <CalculationSummaryCard />
      <SolarInvestBillPreview />
    </div>
  );
}

import React from 'react';
import SolarInvestBillPreview from '../components/SolarInvestBillPreview';
import CalculationSummaryCard from '../components/CalculationSummaryCard';

export default function SolarInvestBillPage(): JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Fatura SolarInvest</h2>
      <CalculationSummaryCard />
      <SolarInvestBillPreview />
    </div>
  );
}

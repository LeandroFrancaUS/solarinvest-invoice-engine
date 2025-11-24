import React, { useState } from 'react';
import { useInvoiceStore } from '../store/invoiceStore';
import { calculateInvoice } from '../api/client';
import { ContractParams } from '../../backend/src/engine/types';
import { useNavigate } from 'react-router-dom';

const initialContract: ContractParams = {
  idContrato: 'CONTRATO-STUB-001',
  kcEnergiaContratadaKWh: 2000,
  descontoPercentual: 0.2,
  incluirCIPNaCobranca: true,
  incluirBandeiraNaCobranca: true,
  incluirOutrosEncargosNaCobranca: false,
};

export default function InterpretationPage(): JSX.Element {
  const rawInvoice = useInvoiceStore((s) => s.rawInvoice);
  const setContract = useInvoiceStore((s) => s.setContractParams);
  const setBilling = useInvoiceStore((s) => s.setBillingResult);
  const navigate = useNavigate();
  const [contract, setContractState] = useState<ContractParams>(initialContract);
  const [status, setStatus] = useState('');

  if (!rawInvoice) {
    return <p>Envie uma fatura primeiro.</p>;
  }

  const handleChange = (field: keyof ContractParams, value: string | boolean) => {
    setContractState((prev) => ({
      ...prev,
      [field]: typeof value === 'string' ? (Number.isNaN(Number(value)) ? value : Number(value)) : value,
    }) as ContractParams);
  };

  const handleSubmit = async () => {
    setStatus('Calculando...');
    try {
      const billing = await calculateInvoice(rawInvoice, contract);
      setContract(contract);
      setBilling(billing);
      setStatus('Cálculo concluído.');
      navigate('/fatura-solarinvest');
    } catch (error: any) {
      setStatus(error?.message || 'Erro ao calcular');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Interpretação & Cálculo</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
        <Field label="Contrato" value={contract.idContrato} onChange={(v) => handleChange('idContrato', v)} />
        <Field
          label="Energia contratada (Kc)"
          type="number"
          value={contract.kcEnergiaContratadaKWh}
          onChange={(v) => handleChange('kcEnergiaContratadaKWh', v)}
        />
        <Field
          label="Desconto (%)"
          type="number"
          value={contract.descontoPercentual * 100}
          onChange={(v) => handleChange('descontoPercentual', String(Number(v) / 100))}
        />
        <Toggle label="Incluir CIP" checked={contract.incluirCIPNaCobranca} onChange={(v) => handleChange('incluirCIPNaCobranca', v)} />
        <Toggle label="Incluir bandeira" checked={contract.incluirBandeiraNaCobranca} onChange={(v) => handleChange('incluirBandeiraNaCobranca', v)} />
        <Toggle
          label="Incluir outros encargos"
          checked={contract.incluirOutrosEncargosNaCobranca}
          onChange={(v) => handleChange('incluirOutrosEncargosNaCobranca', v)}
        />
      </div>
      <button
        onClick={handleSubmit}
        style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}
      >
        Calcular Fatura SolarInvest
      </button>
      {status && <p style={{ color: '#6b7280' }}>{status}</p>}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text' }: { label: string; value: string | number; onChange: (v: string) => void; type?: string }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14, color: '#111827' }}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

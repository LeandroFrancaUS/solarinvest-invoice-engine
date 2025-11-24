import React, { useEffect, useState } from 'react';
import { useInvoiceStore } from '../store/invoiceStore';
import { calculateInvoice } from '../api/client';
import { ContractParams } from '../types/billing';
import { RawInvoiceData } from '../types/invoice';
import { useNavigate } from 'react-router-dom';
import { parseNumberFromInput } from '../utils/brNumber';

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
  const [invoiceForm, setInvoiceForm] = useState<RawInvoiceData | null>(rawInvoice);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!rawInvoice) {
      navigate('/upload');
    } else {
      setInvoiceForm(rawInvoice);
    }
  }, [rawInvoice, navigate]);

  if (!invoiceForm) {
    return <p>Redirecionando para upload...</p>;
  }

  const numericFields: (keyof RawInvoiceData)[] = [
    'consumoKWh',
    'creditosAnterioresKWh',
    'creditosAtuaisKWh',
    'tarifaCheiaRSKWh',
    'tarifaPisoComDescontoRSKWh',
    'valorCIP',
    'valorBandeira',
  ];

  const handleInvoiceChange = (field: keyof RawInvoiceData, value: string) => {
    setInvoiceForm((prev) => ({
      ...(prev as RawInvoiceData),
      [field]: value === '' ? null : numericFields.includes(field) ? parseNumberFromInput(value) : value,
    }));
  };

  const handleContractChange = (field: keyof ContractParams, value: string | boolean) => {
    setContractState((prev) => ({
      ...prev,
      [field]:
        field === 'idContrato' ? String(value) : typeof value === 'boolean' ? value : Number(value),
    }));
  };

  const handleSubmit = async () => {
    setStatus('Calculando...');
    try {
      const filledInvoice: RawInvoiceData = {
        ...invoiceForm,
        consumoKWh: Number(invoiceForm.consumoKWh) || 0,
        tarifaCheiaRSKWh: Number(invoiceForm.tarifaCheiaRSKWh) || 0,
        valorCIP: Number(invoiceForm.valorCIP) || 0,
        valorBandeira: Number(invoiceForm.valorBandeira) || 0,
      } as RawInvoiceData;
      const billing = await calculateInvoice(filledInvoice, contract);
      setContract(contract);
      setBilling(billing);
      setStatus('Cálculo concluído.');
      navigate('/calculo');
    } catch (error: any) {
      setStatus(error?.message || 'Erro ao calcular');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h2 style={{ margin: 0 }}>Interpretação & Cálculo</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Dados da fatura</h3>
          <InvoiceFields invoice={invoiceForm} onChange={handleInvoiceChange} />
        </section>
        <section style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
          <h3 style={{ marginTop: 0 }}>Parâmetros do contrato</h3>
          <ContractFields contract={contract} onChange={handleContractChange} />
        </section>
      </div>
      <button
        onClick={handleSubmit}
        style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: 8, cursor: 'pointer', alignSelf: 'flex-start' }}
      >
        Calcular Fatura SolarInvest
      </button>
      {status && <p style={{ color: '#6b7280' }}>{status}</p>}
    </div>
  );
}

function InvoiceFields({ invoice, onChange }: { invoice: RawInvoiceData; onChange: (field: keyof RawInvoiceData, value: string) => void }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
      <Field label="Distribuidora" value={invoice.distribuidora || ''} onChange={(v) => onChange('distribuidora', v)} />
      <Field label="UF" value={invoice.uf || ''} onChange={(v) => onChange('uf', v)} />
      <Field label="Mês referência" value={invoice.mesReferencia || ''} onChange={(v) => onChange('mesReferencia', v)} />
      <Field label="Consumo (kWh)" value={invoice.consumoKWh ?? ''} type="number" onChange={(v) => onChange('consumoKWh', v)} />
      <Field label="Créditos anteriores" value={invoice.creditosAnterioresKWh ?? ''} type="number" onChange={(v) => onChange('creditosAnterioresKWh', v)} />
      <Field label="Créditos atuais" value={invoice.creditosAtuaisKWh ?? ''} type="number" onChange={(v) => onChange('creditosAtuaisKWh', v)} />
      <Field label="Tarifa cheia (R$/kWh)" value={invoice.tarifaCheiaRSKWh ?? ''} type="number" onChange={(v) => onChange('tarifaCheiaRSKWh', v)} />
      <Field
        label="Tarifa piso (R$/kWh)"
        value={invoice.tarifaPisoComDescontoRSKWh ?? ''}
        type="number"
        onChange={(v) => onChange('tarifaPisoComDescontoRSKWh', v)}
      />
      <Field label="CIP" value={invoice.valorCIP ?? ''} type="number" onChange={(v) => onChange('valorCIP', v)} />
      <Field label="Bandeira" value={invoice.valorBandeira ?? ''} type="number" onChange={(v) => onChange('valorBandeira', v)} />
    </div>
  );
}

function ContractFields({
  contract,
  onChange,
}: {
  contract: ContractParams;
  onChange: (field: keyof ContractParams, value: string | boolean) => void;
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
      <Field label="Contrato" value={contract.idContrato} onChange={(v) => onChange('idContrato', v)} />
      <Field
        label="Energia contratada (Kc)"
        type="number"
        value={contract.kcEnergiaContratadaKWh}
        onChange={(v) => onChange('kcEnergiaContratadaKWh', v)}
      />
      <Field
        label="Desconto (%)"
        type="number"
        value={contract.descontoPercentual * 100}
        onChange={(v) => onChange('descontoPercentual', String(Number(v) / 100))}
      />
      <Toggle label="Incluir CIP" checked={contract.incluirCIPNaCobranca} onChange={(v) => onChange('incluirCIPNaCobranca', v)} />
      <Toggle
        label="Incluir bandeira"
        checked={contract.incluirBandeiraNaCobranca}
        onChange={(v) => onChange('incluirBandeiraNaCobranca', v)}
      />
      <Toggle
        label="Incluir outros encargos"
        checked={contract.incluirOutrosEncargosNaCobranca}
        onChange={(v) => onChange('incluirOutrosEncargosNaCobranca', v)}
      />
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

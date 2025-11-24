import React from 'react';
import { useInvoiceStore } from '../store/invoiceStore';
import { formatCurrencyBR } from '../utils/brNumber';

export default function CalculationSummaryCard(): JSX.Element {
  const billing = useInvoiceStore((s) => s.billingResult);

  if (!billing) {
    return <p>Calcule a fatura para ver o resumo.</p>;
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16 }}>
      <h3 style={{ marginTop: 0 }}>Resumo do cálculo</h3>
      <p style={{ fontWeight: 700, fontSize: 18 }}>Total a pagar: {formatCurrencyBR(billing.totalAPagarRS)}</p>
      <p style={{ color: '#6b7280' }}>{billing.resumoTextoExplicativo}</p>
      <table style={{ width: '100%', marginTop: 12, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', color: '#6b7280', fontSize: 12 }}>
            <th>Código</th>
            <th>Descrição</th>
            <th>Valor</th>
            <th>Incluído</th>
          </tr>
        </thead>
        <tbody>
          {billing.itens.map((item) => {
            const isPiso = item.codigo === 'PISO';
            const isExcedente = item.codigo === 'EXCEDENTE';
            return (
              <tr key={item.codigo} style={{ borderTop: '1px solid #e5e7eb', background: isPiso ? '#ecfdf3' : isExcedente ? '#fef3c7' : 'transparent' }}>
                <td>{item.codigo}</td>
                <td>{item.descricao}</td>
                <td>{formatCurrencyBR(item.valor)}</td>
                <td>
                  <span
                    style={{
                      padding: '4px 8px',
                      borderRadius: 12,
                      background: item.incluidoNaCobranca ? '#d1fae5' : '#fee2e2',
                      color: item.incluidoNaCobranca ? '#065f46' : '#991b1b',
                      fontSize: 12,
                    }}
                  >
                    {item.incluidoNaCobranca ? 'Sim' : 'Não'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

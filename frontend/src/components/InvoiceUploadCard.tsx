import React, { useRef, useState } from 'react';
import { uploadInvoice } from '../api/client';
import { useInvoiceStore } from '../store/invoiceStore';
import { useNavigate } from 'react-router-dom';

export default function InvoiceUploadCard(): JSX.Element {
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<string>('');
  const setRawInvoice = useInvoiceStore((s) => s.setRawInvoice);
  const navigate = useNavigate();

  const handleSelect = () => fileInput.current?.click();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setStatus('Enviando para OCR...');
    try {
      const { rawInvoice } = await uploadInvoice(files[0]);
      setRawInvoice(rawInvoice);
      setStatus('Dados extraídos com sucesso. Redirecionando...');
      navigate('/dados-extraidos');
    } catch (error: any) {
      setStatus(`Falha no upload: ${error?.message || 'erro desconhecido'}`);
    }
  };

  return (
    <div style={{ border: '1px dashed #cbd5e1', padding: 24, borderRadius: 12, textAlign: 'center' }}>
      <input
        type="file"
        accept="application/pdf,image/png,image/jpeg"
        style={{ display: 'none' }}
        ref={fileInput}
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p style={{ marginBottom: 12 }}>Arraste e solte uma fatura ou clique para selecionar.</p>
      <button
        onClick={handleSelect}
        style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}
      >
        Selecionar arquivo
      </button>
      {status && <p style={{ marginTop: 12, color: '#6b7280' }}>{status}</p>}
    </div>
  );
}

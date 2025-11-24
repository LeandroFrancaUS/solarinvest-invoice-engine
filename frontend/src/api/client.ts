import axios from 'axios';
import { BillingResult, ContractParams, RawInvoiceData } from '../../backend/src/engine/types';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export async function uploadInvoice(file: File): Promise<{ rawInvoice: RawInvoiceData; ocrPreview: string }> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/invoices/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function calculateInvoice(rawInvoice: RawInvoiceData, contrato: ContractParams): Promise<BillingResult> {
  const { data } = await api.post('/invoices/calculate', { rawInvoice, contrato });
  return data;
}

export async function generateBillPdf(billingResult: BillingResult, rawInvoice?: RawInvoiceData): Promise<Blob> {
  const { data } = await api.post(
    '/invoices/generate-bill-pdf',
    { billingResult, rawInvoice },
    { responseType: 'blob' },
  );
  return data;
}

import axios from 'axios';
import { BillingResult, ContractParams } from '../types/billing';
import { RawInvoiceData } from '../types/invoice';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export async function uploadInvoice(file: File): Promise<{ rawInvoice: RawInvoiceData; ocrPreview: string; fileName: string }> {
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

export async function generateBillPdf(
  billingResult: BillingResult,
  rawInvoice?: RawInvoiceData,
  contrato?: ContractParams,
): Promise<Blob> {
  const { data } = await api.post(
    '/invoices/generate-bill-pdf',
    { billingResult, rawInvoice, contrato },
    { responseType: 'blob' },
  );
  return data;
}

import { create } from 'zustand';
import { BillingResult, ContractParams } from '../types/billing';
import { RawInvoiceData } from '../types/invoice';

interface InvoiceState {
  rawInvoice: RawInvoiceData | null;
  contractParams: ContractParams | null;
  billingResult: BillingResult | null;
  ocrPreview: string | null;
  fileName: string | null;
  setUploadResult: (raw: RawInvoiceData, ocrPreview: string, fileName: string) => void;
  setContractParams: (contract: ContractParams | null) => void;
  setBillingResult: (billing: BillingResult | null) => void;
  resetAll: () => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  rawInvoice: null,
  contractParams: null,
  billingResult: null,
  ocrPreview: null,
  fileName: null,
  setUploadResult: (raw, ocrPreview, fileName) => set({ rawInvoice: raw, ocrPreview, fileName }),
  setContractParams: (contract) => set({ contractParams: contract }),
  setBillingResult: (billing) => set({ billingResult: billing }),
  resetAll: () => set({ rawInvoice: null, contractParams: null, billingResult: null, ocrPreview: null, fileName: null }),
}));

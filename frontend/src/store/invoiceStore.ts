import { create } from 'zustand';
import { BillingResult, ContractParams, RawInvoiceData } from '../../backend/src/engine/types';

interface InvoiceState {
  rawInvoice: RawInvoiceData | null;
  contractParams: ContractParams | null;
  billingResult: BillingResult | null;
  setRawInvoice: (raw: RawInvoiceData | null) => void;
  setContractParams: (contract: ContractParams | null) => void;
  setBillingResult: (billing: BillingResult | null) => void;
  resetAll: () => void;
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  rawInvoice: null,
  contractParams: null,
  billingResult: null,
  setRawInvoice: (raw) => set({ rawInvoice: raw }),
  setContractParams: (contract) => set({ contractParams: contract }),
  setBillingResult: (billing) => set({ billingResult: billing }),
  resetAll: () => set({ rawInvoice: null, contractParams: null, billingResult: null }),
}));

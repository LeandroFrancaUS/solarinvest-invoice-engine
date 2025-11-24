import dotenv from 'dotenv';

dotenv.config();

const parseNumber = (value: string | undefined, fallback: number): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  port: parseNumber(process.env.PORT, 3001),
  ocr: {
    url: process.env.OCR_API_URL || null,
    apiKey: process.env.OCR_API_KEY || null,
    timeoutMs: parseNumber(process.env.OCR_API_TIMEOUT_MS, 30000),
  },
  defaults: {
    uf: process.env.BILLING_DEFAULT_UF || 'GO',
    distribuidora: process.env.BILLING_DEFAULT_DISTRIBUIDORA || 'EQUATORIAL GO',
  },
};

export const isOcrConfigured = (): boolean => Boolean(env.ocr.url && env.ocr.apiKey);

if (!isOcrConfigured()) {
  console.warn('OCR externo não configurado — usando modo STUB');
}

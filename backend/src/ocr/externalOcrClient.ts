import axios from 'axios';
import FormData from 'form-data';
import { env, isOcrConfigured } from '../config/env';

export async function runExternalOcr(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  if (!isOcrConfigured()) {
    console.warn('OCR externo não configurado — retornando texto simulado para desenvolvimento');
    return `DISTRIBUIDORA: EQUATORIAL GO\nUF: GO\nMES REFERENCIA: 01/2024\nCONSUMO: 2300 kWh\nENERGIA COMPENSADA: 400 kWh\nTARIFA CHEIA: 1,10\nTARIFA PISO: 0,88\nCIP: 24,50\nBANDEIRA: 18,00\nOUTROS: 5,00`;
  }

  const formData = new FormData();
  formData.append('file', fileBuffer, { filename: fileName, contentType: mimeType });

  try {
    const response = await axios.post(env.ocr.url, formData, {
      headers: {
        ...formData.getHeaders(),
        Authorization: `Bearer ${env.ocr.apiKey}`,
      },
      timeout: env.ocr.timeoutMs,
    });

    const text: string | undefined = response.data?.text || response.data?.result || response.data;
    if (!text || typeof text !== 'string') {
      throw new Error('Formato de resposta inesperado do OCR');
    }
    return text;
  } catch (error: any) {
    const message = error?.message || 'Falha ao conectar ao OCR externo';
    throw new Error(message);
  }
}

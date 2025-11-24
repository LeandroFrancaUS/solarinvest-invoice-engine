import axios from 'axios';
import FormData from 'form-data';
import { env, isOcrConfigured } from '../config/env';

export async function runExternalOcr(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  if (!isOcrConfigured()) {
    console.warn('[OCR] Modo STUB ativo — retornando texto simulado');
    const sanitized = fileName.toUpperCase();
    const consumo = sanitized.includes('ALTA') ? 850 : sanitized.includes('MEDIA') ? 450 : 320;
    return `DISTRIBUIDORA: EQUATORIAL GO\nUF: GO\nMES REFERENCIA: 01/2024\nCONSUMO: ${consumo} kWh\nCREDITOS: 120 kWh\nTARIFA: 0,95 R$/kWh\nCIP: 12,90\nBANDEIRA: 8,50\nOUTROS: 4,10\n`; 
  }

  const formData = new FormData();
  formData.append('file', fileBuffer, { filename: fileName, contentType: mimeType });

  try {
    const response = await axios.post(env.ocr.url as string, formData, {
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

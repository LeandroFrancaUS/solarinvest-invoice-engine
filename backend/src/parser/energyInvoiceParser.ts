import { RawInvoiceData } from '../engine/types';
import { parseBRNumber } from '../utils/brNumber';

const monthMap: Record<string, string> = {
  JAN: '01',
  FEV: '02',
  MAR: '03',
  ABR: '04',
  MAI: '05',
  JUN: '06',
  JUL: '07',
  AGO: '08',
  SET: '09',
  OUT: '10',
  NOV: '11',
  DEZ: '12',
};

function normalizeMesReferencia(text: string | null): string | null {
  if (!text) return null;
  const monthYearRegex = /(\d{2})\s*[\/\-]\s*(\d{4})/;
  const match = text.match(monthYearRegex);
  if (match) {
    return `${match[2]}-${match[1]}`;
  }

  const verbalRegex = new RegExp(`(${Object.keys(monthMap).join('|')})\/?\s*(\d{4})`, 'i');
  const verbal = text.match(verbalRegex);
  if (verbal) {
    const month = monthMap[verbal[1].toUpperCase()];
    return `${verbal[2]}-${month}`;
  }

  return null;
}

function extractNumber(label: string, text: string): number | null {
  const regex = new RegExp(`${label}[\n\r\t\s:]*([\d\.]+,\d{2}|\d+)`, 'i');
  const match = text.match(regex);
  if (!match) return null;
  return parseBRNumber(match[1]);
}

function extractCurrencyPerKWh(text: string): number | null {
  const regex = /R\$\s*([\d\.]+,\d{2})\s*\/\s*kwh/i;
  const match = text.match(regex);
  return match ? parseBRNumber(match[1]) : null;
}

export function parseEnergyInvoice(ocrText: string): RawInvoiceData {
  const upper = ocrText.toUpperCase();
  const distribuidoraMatch = upper.match(/EQUATORIAL|ENEL|CPFL|CEMIG|LIGHT|COPEL|CEB|CELESC/);
  const ufMatch = upper.match(/\b(A[CL]|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)\b/);
  const mesReferenciaMatch = upper.match(/(JAN|FEV|MAR|ABR|MAI|JUN|JUL|AGO|SET|OUT|NOV|DEZ)\/?\s*\d{4}|\d{2}[\/-]\d{4}/);

  const raw: RawInvoiceData = {
    distribuidora: distribuidoraMatch?.[0] || null,
    uf: ufMatch?.[0] || null,
    mesReferencia: normalizeMesReferencia(mesReferenciaMatch?.[0] || null),
    consumoKWh: extractNumber('CONSUMO', upper) || extractNumber('ENERGIA ATIVA', upper) || null,
    energiaCompensadaKWh: extractNumber('ENERGIA COMPENSADA', upper) || null,
    creditosAnterioresKWh: extractNumber('CREDITOS ANTERIORES', upper) || extractNumber('CREDITOS', upper) || null,
    creditosAtuaisKWh: extractNumber('CREDITOS ATUAIS', upper) || null,
    tarifaCheiaRSKWh: extractNumber('TARIFA CHEIA', upper) || extractCurrencyPerKWh(upper),
    tarifaPisoComDescontoRSKWh: extractNumber('TARIFA PISO', upper) || extractNumber('PISO', upper),
    valorCIP: extractNumber('CIP', upper) || extractNumber('ILUMINACAO', upper),
    valorBandeira: extractNumber('BANDEIRA', upper),
    outrosEncargos: extractNumber('OUTROS', upper),
    nomeTitular: null,
    enderecoInstalacao: null,
    numeroUC: null,
  };

  return raw;
}

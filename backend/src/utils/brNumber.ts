export function parseBRNumber(input: string | null | undefined): number | null {
  if (!input) return null;
  const normalized = input.replace(/\./g, '').replace(/,/g, '.').trim();
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export function formatCurrencyBR(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

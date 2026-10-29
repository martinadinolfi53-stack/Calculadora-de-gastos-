// Los importes se manejan siempre como enteros en centésimos (1.250,50 → 125050)
// para evitar errores de punto flotante. Solo se convierten a texto al mostrarlos.

export type Currency = 'UYU' | 'USD';

const MAX_CENTS = 99_999_999_999; // $ 999.999.999,99

/**
 * Convierte lo que escribe el usuario a centésimos.
 * Acepta formato uruguayo ("1.250,50"), con punto decimal ("1250.50") o entero ("1250").
 * Devuelve null si el texto no es un importe válido.
 */
export function parseAmount(input: string): number | null {
  const raw = input.replace(/[\s$]/g, '').replace(/^U\$S|^USD|^UYU/i, '');
  if (raw === '' || !/^[\d.,]+$/.test(raw)) return null;

  let integer: string;
  let decimals = '';
  const lastComma = raw.lastIndexOf(',');
  const lastDot = raw.lastIndexOf('.');

  if (lastComma >= 0) {
    // La coma es el separador decimal; los puntos son de miles.
    if (raw.indexOf(',') !== lastComma) return null;
    integer = raw.slice(0, lastComma);
    decimals = raw.slice(lastComma + 1);
    if (!isThousandsGrouped(integer, '.')) return null;
    integer = integer.replace(/\./g, '');
  } else if (lastDot >= 0 && raw.indexOf('.') === lastDot && raw.length - lastDot - 1 <= 2) {
    // Un solo punto con 1 o 2 dígitos después: punto decimal ("12.5", "1250.50").
    integer = raw.slice(0, lastDot);
    decimals = raw.slice(lastDot + 1);
  } else {
    // Solo puntos de miles ("1.250" o "1.250.000").
    if (!isThousandsGrouped(raw, '.')) return null;
    integer = raw.replace(/\./g, '');
  }

  if (decimals.length > 2 || !/^\d*$/.test(decimals)) return null;
  if (integer === '' && decimals === '') return null;

  const cents = Number(integer || '0') * 100 + Number(decimals.padEnd(2, '0') || '0');
  if (!Number.isSafeInteger(cents) || cents > MAX_CENTS) return null;
  return cents;
}

function isThousandsGrouped(value: string, sep: string): boolean {
  if (!value.includes(sep)) return /^\d*$/.test(value);
  const parts = value.split(sep);
  return /^\d{1,3}$/.test(parts[0]) && parts.slice(1).every((p) => /^\d{3}$/.test(p));
}

const formatters = new Map<Currency, Intl.NumberFormat>();

/** Formatea centésimos como importe uruguayo: 125050 → "$ 1.250,50". */
export function formatMoney(cents: number, currency: Currency = 'UYU'): string {
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    formatters.set(currency, f);
  }
  // Se divide recién al mostrar; el valor guardado sigue siendo entero.
  return f.format(cents / 100);
}

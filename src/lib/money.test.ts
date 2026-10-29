import { describe, expect, it } from 'vitest';
import { formatMoney, parseAmount } from './money';

describe('parseAmount', () => {
  it.each([
    ['1250', 125000],
    ['1.250', 125000],
    ['1.250,50', 125050],
    ['1250,5', 125050],
    ['1250.50', 125050],
    ['12.5', 1250],
    ['0,99', 99],
    [',5', 50],
    ['$ 1.250.000', 125000000],
    ['  300 ', 30000],
  ])('"%s" → %i centésimos', (input, expected) => {
    expect(parseAmount(input)).toBe(expected);
  });

  it.each(['', 'abc', '1,2,3', '12,345', '1.25.0', '12a', '-50', '1.2345', '9999999999999'])(
    'rechaza "%s"',
    (input) => {
      expect(parseAmount(input)).toBeNull();
    },
  );

  it('no acumula errores de punto flotante', () => {
    const total = ['0,10', '0,20'].map((v) => parseAmount(v)!).reduce((a, b) => a + b, 0);
    expect(total).toBe(30); // 0,1 + 0,2 en decimales daría 0.30000000000000004
  });
});

describe('formatMoney', () => {
  const clean = (s: string) => s.replace(/ /g, ' ');

  it('usa formato uruguayo', () => {
    expect(clean(formatMoney(125050))).toBe('$ 1.250,50');
    expect(clean(formatMoney(0))).toBe('$ 0,00');
  });

  it('distingue dólares', () => {
    expect(clean(formatMoney(1000, 'USD'))).toBe('US$ 10,00');
  });
});

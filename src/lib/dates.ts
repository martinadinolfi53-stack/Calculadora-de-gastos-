// Las fechas se manejan como texto AAAA-MM-DD, sin hora,
// para que un gasto del 31 no se corra al 30 por la zona horaria.

export function todayISO(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

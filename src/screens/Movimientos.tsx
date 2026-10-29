import { useState } from 'react';
import { ArrowLeftRight, ReceiptText, Search } from 'lucide-react';
import { useSheets } from '../components/sheets';
import { EmptyState, Field, TopBar } from '../components/ui';
import { formatMoney } from '../lib/money';

type Tipo = 'todos' | 'gastos' | 'ingresos' | 'transferencias';
type Periodo = 'mes' | 'mes-anterior' | 'tres-meses' | 'anio' | 'rango';

const TIPOS: { value: Tipo; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'gastos', label: 'Gastos' },
  { value: 'ingresos', label: 'Ingresos' },
  { value: 'transferencias', label: 'Transferencias' },
];

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: 'mes', label: 'Este mes' },
  { value: 'mes-anterior', label: 'Mes anterior' },
  { value: 'tres-meses', label: 'Últimos 3 meses' },
  { value: 'anio', label: 'Este año' },
  { value: 'rango', label: 'Rango' },
];

export function Movimientos() {
  const { open } = useSheets();
  const [texto, setTexto] = useState('');
  const [tipo, setTipo] = useState<Tipo>('todos');
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');

  // Los movimientos se guardan desde la Fase 3; hoy la lista filtrada siempre está vacía.
  const resultados: never[] = [];
  const total = 0;

  return (
    <>
      <TopBar
        title="Movimientos"
        actions={
          <button type="button" className="btn icon-btn glass-thin" onClick={() => open('transferir')} aria-label="Transferir">
            <ArrowLeftRight size={20} />
          </button>
        }
      />

      <div className="stack">
        <label className="search glass">
          <Search size={18} aria-hidden="true" />
          <span className="visually-hidden">Buscar</span>
          <input
            type="search"
            placeholder="Buscar, por ejemplo «UTE»"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </label>

        <div className="chips" role="group" aria-label="Tipo">
          {TIPOS.map((t) => (
            <button key={t.value} type="button" className="btn chip" aria-pressed={tipo === t.value} onClick={() => setTipo(t.value)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="chips" role="group" aria-label="Período">
          {PERIODOS.map((p) => (
            <button key={p.value} type="button" className="btn chip" aria-pressed={periodo === p.value} onClick={() => setPeriodo(p.value)}>
              {p.label}
            </button>
          ))}
        </div>

        {periodo === 'rango' && (
          <div className="pair">
            <Field label="Desde">
              <input className="input" type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
            </Field>
            <Field label="Hasta">
              <input className="input" type="date" value={hasta} min={desde || undefined} onChange={(e) => setHasta(e.target.value)} />
            </Field>
          </div>
        )}

        <Field label="Gasto fijo">
          <select className="input" defaultValue="todos">
            <option value="todos">Todos los gastos fijos</option>
          </select>
        </Field>

        <div className="totals num" aria-live="polite">
          <span>{resultados.length} movimientos</span>
          <span>Total {formatMoney(total)}</span>
        </div>

        <EmptyState
          icon={ReceiptText}
          title="No hay movimientos"
          text="Todavía no registraste gastos ni ingresos. Cuando lo hagas, los vas a poder buscar y filtrar acá."
          action={
            <button type="button" className="btn" onClick={() => open('gasto')}>
              Registrar un gasto
            </button>
          }
        />
      </div>
    </>
  );
}

import { CalendarClock, Minus, Plus, ReceiptText } from 'lucide-react';
import { useSheets } from '../components/sheets';
import { EmptyState, Section, TopBar } from '../components/ui';
import { navigate } from '../lib/router';

// Sin cuentas todavía no hay saldos que calcular: se muestra «—» en vez de inventar un $ 0.
const NO_DATA = '—';

export function Inicio() {
  const { open } = useSheets();
  return (
    <>
      <TopBar title="Inicio" />

      <div className="card glass">
        <p className="hero-label">Saldo real</p>
        <p className="hero-value num">{NO_DATA}</p>
        <p className="hint">Aparece cuando crees tu primera cuenta.</p>
      </div>

      <div className="kpis" style={{ marginTop: 12 }}>
        <div className="kpi glass">
          <span className="kpi-label">Ingresos del mes</span>
          <span className="kpi-value income num">{NO_DATA}</span>
        </div>
        <div className="kpi glass">
          <span className="kpi-label">Gastos del mes</span>
          <span className="kpi-value num">{NO_DATA}</span>
        </div>
        <div className="kpi glass projected">
          <span className="kpi-label">Saldo proyectado · estimado</span>
          <span className="kpi-value num">≈ {NO_DATA}</span>
        </div>
        <div className="kpi glass">
          <span className="kpi-label">Pendientes del mes</span>
          <span className="kpi-value num">{NO_DATA}</span>
        </div>
      </div>

      <div className="quick-actions section">
        <button type="button" className="quick glass" onClick={() => open('gasto')}>
          <span className="quick-icon expense" aria-hidden="true">
            <Minus size={24} />
          </span>
          Nuevo gasto
        </button>
        <button type="button" className="quick glass" onClick={() => navigate('/fijos')}>
          <span className="quick-icon fixed" aria-hidden="true">
            <CalendarClock size={24} />
          </span>
          Gastos fijos
        </button>
        <button type="button" className="quick glass" onClick={() => open('ingreso')}>
          <span className="quick-icon income" aria-hidden="true">
            <Plus size={24} />
          </span>
          Nuevo ingreso
        </button>
      </div>

      <Section title="Próximos vencimientos">
        <EmptyState
          icon={CalendarClock}
          title="Nada por pagar"
          text="Agregá tus gastos fijos, como UTE, OSE o el alquiler, y acá vas a ver cuándo vence cada uno."
          action={
            <button type="button" className="btn" onClick={() => open('fijo-gasto')}>
              Agregar gasto fijo
            </button>
          }
        />
      </Section>

      <Section title="Últimos movimientos">
        <EmptyState
          icon={ReceiptText}
          title="Sin movimientos todavía"
          text="Cuando registres un gasto o un ingreso va a aparecer acá."
        />
      </Section>
    </>
  );
}

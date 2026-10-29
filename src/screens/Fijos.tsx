import { useState } from 'react';
import { CalendarClock, Plus, Repeat } from 'lucide-react';
import { useSheets } from '../components/sheets';
import { EmptyState, Segmented, TopBar } from '../components/ui';

type Pestana = 'gastos' | 'ingresos';

export function Fijos() {
  const { open } = useSheets();
  const [pestana, setPestana] = useState<Pestana>('gastos');
  const nuevo = () => open(pestana === 'gastos' ? 'fijo-gasto' : 'fijo-ingreso');

  return (
    <>
      <TopBar
        title="Fijos"
        actions={
          <button
            type="button"
            className="btn icon-btn glass-thin"
            onClick={nuevo}
            aria-label={pestana === 'gastos' ? 'Nuevo gasto fijo' : 'Nuevo ingreso recurrente'}
          >
            <Plus size={20} />
          </button>
        }
      />

      <div className="stack">
        <Segmented
          label="Tipo de obligación"
          value={pestana}
          onChange={setPestana}
          options={[
            { value: 'gastos', label: 'Gastos fijos' },
            { value: 'ingresos', label: 'Ingresos recurrentes' },
          ]}
        />

        {pestana === 'gastos' ? (
          <EmptyState
            icon={CalendarClock}
            title="Sin gastos fijos"
            text="Alquiler, UTE, OSE, Antel, suscripciones. La app te avisa cuándo vencen y vos confirmás cada pago: nunca se descuentan solos."
            action={
              <button type="button" className="btn btn-primary" onClick={nuevo}>
                Nuevo gasto fijo
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={Repeat}
            title="Sin ingresos recurrentes"
            text="Por ejemplo, el sueldo. Un ingreso previsto no suma al saldo hasta que confirmes que lo recibiste."
            action={
              <button type="button" className="btn btn-primary" onClick={nuevo}>
                Nuevo ingreso recurrente
              </button>
            }
          />
        )}
      </div>
    </>
  );
}

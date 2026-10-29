import { Plus, Wallet } from 'lucide-react';
import { useSheets } from '../components/sheets';
import { EmptyState, TopBar } from '../components/ui';

export function Cuentas() {
  const { open } = useSheets();
  return (
    <>
      <TopBar
        title="Cuentas"
        actions={
          <button type="button" className="btn icon-btn glass-thin" onClick={() => open('cuenta')} aria-label="Nueva cuenta">
            <Plus size={20} />
          </button>
        }
      />
      <EmptyState
        icon={Wallet}
        title="Agregá tu primera cuenta"
        text="Itaú, BROU, Santander, efectivo, una billetera digital o una tarjeta de crédito. Cada una muestra su saldo y sus movimientos."
        action={
          <button type="button" className="btn btn-primary" onClick={() => open('cuenta')}>
            Nueva cuenta
          </button>
        }
      />
    </>
  );
}

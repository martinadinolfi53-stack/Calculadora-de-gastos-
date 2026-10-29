import { useEffect } from 'react';
import { Sidebar, TabBar } from './components/Navigation';
import { SheetProvider, useSheets } from './components/sheets';
import type { SheetName } from './components/sheets';
import { EmptyState, TopBar } from './components/ui';
import { useRoute } from './lib/router';
import { Cuentas } from './screens/Cuentas';
import { Fijos } from './screens/Fijos';
import { Inicio } from './screens/Inicio';
import { Apariencia, Categorias, Consolidado, Estadisticas, Mas, Perfiles, Respaldo } from './screens/Mas';
import { Movimientos } from './screens/Movimientos';
import {
  CuentaForm,
  MovimientoForm,
  PerfilForm,
  ProgramadoForm,
  SelectorPerfil,
  TransferenciaForm,
} from './sheets/Formularios';
import { SearchX } from 'lucide-react';

const SCREENS: Record<string, () => JSX.Element> = {
  '/': Inicio,
  '/movimientos': Movimientos,
  '/fijos': Fijos,
  '/cuentas': Cuentas,
  '/mas': Mas,
  '/mas/estadisticas': Estadisticas,
  '/mas/consolidado': Consolidado,
  '/mas/perfiles': Perfiles,
  '/mas/categorias': Categorias,
  '/mas/respaldo': Respaldo,
  '/mas/apariencia': Apariencia,
};

function NoEncontrada() {
  return (
    <>
      <TopBar title="No encontrada" back="/" />
      <EmptyState
        icon={SearchX}
        title="Esta pantalla no existe"
        text="Puede ser un enlace viejo. Volvé al inicio para seguir."
        action={
          <a className="btn" href="#/">
            Ir al inicio
          </a>
        }
      />
    </>
  );
}

function CurrentSheet({ name }: { name: SheetName }) {
  switch (name) {
    case 'gasto':
      return <MovimientoForm tipo="gasto" />;
    case 'ingreso':
      return <MovimientoForm tipo="ingreso" />;
    case 'transferir':
      return <TransferenciaForm />;
    case 'fijo-gasto':
      return <ProgramadoForm sentido="gasto" />;
    case 'fijo-ingreso':
      return <ProgramadoForm sentido="ingreso" />;
    case 'cuenta':
      return <CuentaForm />;
    case 'perfil':
      return <PerfilForm />;
    case 'selector-perfil':
      return <SelectorPerfil />;
  }
}

const SHORTCUTS: Record<string, SheetName> = { g: 'gasto', i: 'ingreso', t: 'transferir' };

function Shell() {
  const path = useRoute();
  const { current, open } = useSheets();
  const Screen = SCREENS[path] ?? NoEncontrada;

  // Atajos de teclado para la computadora, solo fuera de campos de texto y sin hojas abiertas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (current || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable]')) return;
      const sheet = SHORTCUTS[e.key.toLowerCase()];
      if (sheet) {
        e.preventDefault();
        open(sheet);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, open]);

  return (
    <div className="layout">
      <div className="backdrop" aria-hidden="true" />
      <Sidebar path={path} />
      <main className="main" aria-hidden={current ? true : undefined}>
        <div key={path} className="screen-in">
          <Screen />
        </div>
      </main>
      <TabBar path={path} />
      {current && <CurrentSheet name={current} />}
    </div>
  );
}

export default function App() {
  return (
    <SheetProvider>
      <Shell />
    </SheetProvider>
  );
}

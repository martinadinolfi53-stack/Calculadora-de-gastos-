import { useEffect, useState } from 'react';
import { ChartColumn, DatabaseBackup, Layers, Palette, ShieldCheck, Tags, Users } from 'lucide-react';
import { useSheets } from '../components/sheets';
import { EmptyState, Notice, RowLink, Section, Segmented, TopBar } from '../components/ui';
import { applyThemePref, getThemePref } from '../lib/theme';
import type { ThemePref } from '../lib/theme';

export function Mas() {
  return (
    <>
      <TopBar title="Más" />
      <nav className="list glass" aria-label="Más opciones">
        <RowLink icon={ChartColumn} title="Estadísticas" to="/mas/estadisticas" />
        <RowLink icon={Layers} title="Resumen consolidado" to="/mas/consolidado" />
        <RowLink icon={Users} title="Perfiles" to="/mas/perfiles" />
        <RowLink icon={Tags} title="Categorías" to="/mas/categorias" />
        <RowLink icon={DatabaseBackup} title="Respaldo y datos" to="/mas/respaldo" />
        <RowLink icon={Palette} title="Apariencia" to="/mas/apariencia" />
      </nav>
      <p className="hint" style={{ textAlign: 'center', marginTop: 24 }}>
        Calculadora de gastos · versión {__APP_VERSION__}
        <br />
        Tus datos se guardan solo en este dispositivo.
      </p>
    </>
  );
}

type Periodo = 'mes' | 'tres-meses' | 'anio';

export function Estadisticas() {
  const [periodo, setPeriodo] = useState<Periodo>('mes');
  return (
    <>
      <TopBar title="Estadísticas" back="/mas" />
      <div className="stack">
        <Segmented
          label="Período"
          value={periodo}
          onChange={setPeriodo}
          options={[
            { value: 'mes', label: 'Este mes' },
            { value: 'tres-meses', label: '3 meses' },
            { value: 'anio', label: 'Este año' },
          ]}
        />
        <EmptyState
          icon={ChartColumn}
          title="Sin datos para graficar"
          text="Con tus primeros movimientos vas a ver gastos por categoría, ingresos contra gastos y la evolución del saldo."
        />
      </div>
    </>
  );
}

export function Consolidado() {
  const { open } = useSheets();
  return (
    <>
      <TopBar title="Resumen consolidado" back="/mas" />
      <EmptyState
        icon={Layers}
        title="Todavía no hay perfiles"
        text="Acá vas a ver todos tus perfiles juntos, separando tu plata personal de la de cada negocio, sin contar dos veces lo que pasa de uno a otro."
        action={
          <button type="button" className="btn" onClick={() => open('perfil')}>
            Crear perfil
          </button>
        }
      />
    </>
  );
}

export function Perfiles() {
  const { open } = useSheets();
  return (
    <>
      <TopBar title="Perfiles" back="/mas" />
      <EmptyState
        icon={Users}
        title="Creá tu primer perfil"
        text="Un perfil para tus finanzas personales y uno por cada negocio, como KND Burger. Cada uno tiene sus propias cuentas y movimientos."
        action={
          <button type="button" className="btn btn-primary" onClick={() => open('perfil')}>
            Nuevo perfil
          </button>
        }
      />
    </>
  );
}

export function Categorias() {
  const { open } = useSheets();
  return (
    <>
      <TopBar title="Categorías" back="/mas" />
      <EmptyState
        icon={Tags}
        title="Sin categorías"
        text="Cada perfil arranca con categorías básicas (Supermercado, Servicios, Transporte, Sueldo…) que después podés editar."
        action={
          <button type="button" className="btn" onClick={() => open('perfil')}>
            Crear perfil
          </button>
        }
      />
    </>
  );
}

type Persistencia = 'cargando' | 'protegido' | 'no-protegido' | 'no-disponible';

export function Respaldo() {
  const [estado, setEstado] = useState<Persistencia>('cargando');

  useEffect(() => {
    if (!navigator.storage?.persisted) {
      setEstado('no-disponible');
      return;
    }
    navigator.storage.persisted().then((ok) => setEstado(ok ? 'protegido' : 'no-protegido'));
  }, []);

  const proteger = async () => {
    const ok = await navigator.storage.persist();
    setEstado(ok ? 'protegido' : 'no-protegido');
  };

  return (
    <>
      <TopBar title="Respaldo y datos" back="/mas" />
      <div className="stack">
        <Notice>
          Tus datos se guardan solo en este dispositivo, no en internet. Se pueden perder si borrás los datos del
          navegador o cambiás de celular. Por eso conviene hacer un respaldo seguido.
        </Notice>

        <Section title="Almacenamiento">
          <div className="card glass stack">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="row-icon" aria-hidden="true">
                <ShieldCheck size={18} />
              </span>
              <div className="row-body" aria-live="polite">
                <div className="row-title">
                  {estado === 'cargando' && 'Revisando…'}
                  {estado === 'protegido' && 'Protegido'}
                  {estado === 'no-protegido' && 'Sin protección'}
                  {estado === 'no-disponible' && 'No disponible en este navegador'}
                </div>
                <div className="row-sub">
                  {estado === 'protegido'
                    ? 'El navegador no va a borrar tus datos para liberar espacio.'
                    : 'El navegador podría borrar los datos si le falta espacio. Instalar la app ayuda.'}
                </div>
              </div>
            </div>
            {estado === 'no-protegido' && (
              <button type="button" className="btn" onClick={proteger}>
                Pedir protección
              </button>
            )}
          </div>
        </Section>

        <Section title="Exportar e importar">
          <p className="hint" style={{ margin: '0 4px' }}>
            Guardar un archivo de respaldo y restaurarlo llega en la Fase 6, junto con las validaciones del archivo.
          </p>
        </Section>
      </div>
    </>
  );
}

export function Apariencia() {
  const [tema, setTema] = useState<ThemePref>(getThemePref);
  const cambiar = (pref: ThemePref) => {
    setTema(pref);
    applyThemePref(pref);
  };
  return (
    <>
      <TopBar title="Apariencia" back="/mas" />
      <Section title="Tema">
        <Segmented
          label="Tema"
          value={tema}
          onChange={cambiar}
          options={[
            { value: 'auto', label: 'Automático' },
            { value: 'claro', label: 'Claro' },
            { value: 'oscuro', label: 'Oscuro' },
          ]}
        />
        <p className="hint" style={{ margin: '8px 4px 0' }}>
          Automático sigue la configuración de tu dispositivo.
        </p>
      </Section>
    </>
  );
}

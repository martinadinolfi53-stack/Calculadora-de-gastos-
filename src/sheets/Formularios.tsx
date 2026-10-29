import { useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Briefcase, Heart, Home, Store, User, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Sheet, useSheets } from '../components/sheets';
import { AmountField, EmptyState, Field, Notice, Segmented } from '../components/ui';
import type { Currency } from '../lib/money';
import { todayISO } from '../lib/dates';

/**
 * Formulario dentro de una hoja. Cualquier cambio lo marca como «con datos sin guardar»,
 * así al cerrarlo se pregunta antes de descartar.
 * Guardar se conecta a la base de datos en la Fase 3: hasta entonces el botón está
 * deshabilitado y la hoja lo explica, en vez de simular que guarda.
 */
function FormSheet({ title, children }: { title: string; children: ReactNode }) {
  const { requestClose, setDirty } = useSheets();
  const formId = `form-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const onSubmit = (e: FormEvent) => e.preventDefault();
  return (
    <Sheet
      title={title}
      footer={
        <>
          <button type="button" className="btn" onClick={requestClose}>
            Cancelar
          </button>
          <button type="submit" form={formId} className="btn btn-primary" disabled aria-describedby={`${formId}-aviso`}>
            Guardar
          </button>
        </>
      }
    >
      <form id={formId} className="stack" onSubmit={onSubmit} onInput={() => setDirty(true)} noValidate>
        {children}
        <div id={`${formId}-aviso`}>
          <Notice>Vista previa: «Guardar» se habilita en la próxima entrega, cuando conectemos la base de datos.</Notice>
        </div>
      </form>
    </Sheet>
  );
}

function CuentaSelect({ label }: { label: string }) {
  return (
    <Field label={label}>
      <select className="input" defaultValue="">
        <option value="" disabled>
          Primero creá una cuenta
        </option>
      </select>
    </Field>
  );
}

function CategoriaSelect() {
  return (
    <Field label="Categoría">
      <select className="input" defaultValue="">
        <option value="" disabled>
          Elegí una categoría
        </option>
      </select>
    </Field>
  );
}

function FechaField({ label = 'Fecha' }: { label?: string }) {
  return (
    <Field label={label}>
      <input className="input" type="date" defaultValue={todayISO()} />
    </Field>
  );
}

/** Nuevo gasto y Nuevo ingreso comparten la misma hoja: solo cambian textos y color. */
export function MovimientoForm({ tipo }: { tipo: 'gasto' | 'ingreso' }) {
  const [importe, setImporte] = useState('');
  const esGasto = tipo === 'gasto';
  return (
    <FormSheet title={esGasto ? 'Nuevo gasto' : 'Nuevo ingreso'}>
      <AmountField label="Importe" value={importe} onChange={setImporte} tone={esGasto ? 'expense' : 'income'} />
      <Field label={esGasto ? 'Establecimiento o concepto' : 'Origen o concepto'}>
        <input
          className="input"
          autoComplete="off"
          placeholder={esGasto ? 'Por ejemplo: Ta-Ta, UTE, farmacia' : 'Por ejemplo: sueldo, venta'}
        />
      </Field>
      <CuentaSelect label={esGasto ? 'Cuenta' : 'Cuenta que recibe'} />
      <CategoriaSelect />
      <FechaField />
      <details className="more">
        <summary>Más detalles</summary>
        <div className="stack">
          {esGasto && (
            <Field label="Descripción">
              <input className="input" />
            </Field>
          )}
          <Field label="Observaciones">
            <textarea className="input" />
          </Field>
        </div>
      </details>
    </FormSheet>
  );
}

type TipoTransferencia = 'cuentas' | 'tarjeta' | 'perfiles';

export function TransferenciaForm() {
  const [importe, setImporte] = useState('');
  const [tipo, setTipo] = useState<TipoTransferencia>('cuentas');
  return (
    <FormSheet title="Transferir">
      <Segmented
        label="Tipo de transferencia"
        value={tipo}
        onChange={setTipo}
        options={[
          { value: 'cuentas', label: 'Entre cuentas' },
          { value: 'tarjeta', label: 'Pagar tarjeta' },
          { value: 'perfiles', label: 'Entre perfiles' },
        ]}
      />
      <AmountField label="Importe" value={importe} onChange={setImporte} />
      <CuentaSelect label="Desde" />
      {tipo === 'perfiles' ? (
        <Field label="Hacia el perfil">
          <select className="input" defaultValue="">
            <option value="" disabled>
              Primero creá otro perfil
            </option>
          </select>
        </Field>
      ) : (
        <CuentaSelect label={tipo === 'tarjeta' ? 'Tarjeta de crédito' : 'Hacia'} />
      )}
      <Field label="Nombre">
        <input
          className="input"
          autoComplete="off"
          placeholder={
            tipo === 'tarjeta' ? 'Por ejemplo: Visa octubre' : tipo === 'perfiles' ? 'Por ejemplo: Sueldo de la hamburguesería' : 'Opcional'
          }
        />
      </Field>
      <FechaField />
      <p className="hint">
        {tipo === 'cuentas' && 'Mover plata entre tus cuentas no cuenta como gasto ni como ingreso.'}
        {tipo === 'tarjeta' && 'Lo que compraste con la tarjeta ya se contó como gasto; el pago solo baja la deuda.'}
        {tipo === 'perfiles' &&
          'Sale del negocio como «Retiro» y entra en el perfil personal como ingreso. En el resumen consolidado no se cuenta dos veces.'}
      </p>
    </FormSheet>
  );
}

const PERIODICIDADES = [
  ['semanal', 'Semanal'],
  ['quincenal', 'Cada 15 días'],
  ['mensual', 'Mensual'],
  ['bimestral', 'Bimestral'],
  ['trimestral', 'Trimestral'],
  ['semestral', 'Semestral'],
  ['anual', 'Anual'],
  ['personalizado', 'Personalizado'],
] as const;

export function ProgramadoForm({ sentido }: { sentido: 'gasto' | 'ingreso' }) {
  const [importe, setImporte] = useState('');
  const [periodicidad, setPeriodicidad] = useState('mensual');
  const esGasto = sentido === 'gasto';
  return (
    <FormSheet title={esGasto ? 'Nuevo gasto fijo' : 'Nuevo ingreso recurrente'}>
      <Field label="Nombre">
        <input className="input" autoComplete="off" placeholder={esGasto ? 'Por ejemplo: UTE' : 'Por ejemplo: Sueldo'} />
      </Field>
      <AmountField label="Importe estimado" value={importe} onChange={setImporte} tone={esGasto ? 'expense' : 'income'} />
      <Field label="Periodicidad">
        <select className="input" value={periodicidad} onChange={(e) => setPeriodicidad(e.target.value)}>
          {PERIODICIDADES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      {periodicidad === 'personalizado' && (
        <div className="pair">
          <Field label="Cada">
            <input className="input" type="number" inputMode="numeric" min={1} defaultValue={1} />
          </Field>
          <Field label="Unidad">
            <select className="input" defaultValue="meses">
              <option value="dias">Días</option>
              <option value="semanas">Semanas</option>
              <option value="meses">Meses</option>
            </select>
          </Field>
        </div>
      )}
      <FechaField label="Próximo vencimiento" />
      <CuentaSelect label={esGasto ? 'Cuenta habitual' : 'Cuenta que recibe'} />
      <CategoriaSelect />
      <Field label="Observaciones">
        <textarea className="input" />
      </Field>
      <p className="hint">
        {esGasto
          ? 'Cada vencimiento queda pendiente hasta que toques «Confirmar pago». Nunca se descuenta solo.'
          : 'El ingreso no suma al saldo hasta que confirmes que lo recibiste.'}
      </p>
    </FormSheet>
  );
}

const TIPOS_CUENTA = [
  ['banco', 'Cuenta bancaria'],
  ['efectivo', 'Efectivo'],
  ['billetera', 'Billetera digital'],
  ['ahorro', 'Ahorro'],
  ['credito', 'Tarjeta de crédito'],
] as const;

export function CuentaForm() {
  const [tipo, setTipo] = useState<string>('banco');
  const [moneda, setMoneda] = useState<Currency>('UYU');
  const [saldo, setSaldo] = useState('');
  const esCredito = tipo === 'credito';
  return (
    <FormSheet title="Nueva cuenta">
      <Field label="Nombre">
        <input className="input" autoComplete="off" placeholder="Por ejemplo: Itaú, BROU, Efectivo" />
      </Field>
      <Field label="Tipo">
        <select className="input" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          {TIPOS_CUENTA.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <Segmented
        label="Moneda"
        value={moneda}
        onChange={setMoneda}
        options={[
          { value: 'UYU', label: 'Pesos (UYU)' },
          { value: 'USD', label: 'Dólares (USD)' },
        ]}
      />
      <AmountField label={esCredito ? 'Deuda actual' : 'Saldo actual'} value={saldo} onChange={setSaldo} currency={moneda} />
      <p className="hint">
        {esCredito
          ? 'Las compras con tarjeta se cuentan como gasto el día que comprás; la deuda baja cuando la pagás.'
          : 'Es el punto de partida: desde acá la app suma y resta tus movimientos.'}
      </p>
    </FormSheet>
  );
}

const COLORES = [
  { hue: 222, nombre: 'Azul' },
  { hue: 268, nombre: 'Violeta' },
  { hue: 330, nombre: 'Rosa' },
  { hue: 18, nombre: 'Naranja' },
  { hue: 145, nombre: 'Verde' },
  { hue: 190, nombre: 'Turquesa' },
];

const ICONOS: { id: string; icon: LucideIcon; nombre: string }[] = [
  { id: 'user', icon: User, nombre: 'Persona' },
  { id: 'store', icon: Store, nombre: 'Local' },
  { id: 'briefcase', icon: Briefcase, nombre: 'Trabajo' },
  { id: 'home', icon: Home, nombre: 'Casa' },
  { id: 'heart', icon: Heart, nombre: 'Familia' },
];

export function PerfilForm() {
  const [tipo, setTipo] = useState<'personal' | 'negocio'>('personal');
  const [hue, setHue] = useState(222);
  const [icono, setIcono] = useState('user');
  return (
    <FormSheet title="Nuevo perfil">
      <Field label="Nombre">
        <input className="input" autoComplete="off" placeholder="Por ejemplo: Personal, KND Burger" />
      </Field>
      <Segmented
        label="Tipo"
        value={tipo}
        onChange={setTipo}
        options={[
          { value: 'personal', label: 'Personal' },
          { value: 'negocio', label: 'Negocio' },
        ]}
      />
      <div className="field">
        <span>Color</span>
        <div className="swatches" role="group" aria-label="Color">
          {COLORES.map((c) => (
            <button
              key={c.hue}
              type="button"
              className="swatch"
              style={{ background: `hsl(${c.hue} 78% 52%)` }}
              aria-pressed={hue === c.hue}
              aria-label={c.nombre}
              onClick={() => setHue(c.hue)}
            />
          ))}
        </div>
      </div>
      <div className="field">
        <span>Ícono</span>
        <div className="swatches" role="group" aria-label="Ícono">
          {ICONOS.map(({ id, icon: Icon, nombre }) => (
            <button
              key={id}
              type="button"
              className="btn icon-btn"
              aria-pressed={icono === id}
              aria-label={nombre}
              onClick={() => setIcono(id)}
              style={icono === id ? { background: `hsl(${hue} 78% 52%)`, color: '#fff' } : undefined}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>
      </div>
    </FormSheet>
  );
}

export function SelectorPerfil() {
  const { replace } = useSheets();
  return (
    <Sheet title="Perfiles">
      <EmptyState
        icon={Users}
        title="Todavía no hay perfiles"
        text="Creá uno para tus finanzas personales y otro por cada negocio. Cambiás entre ellos desde acá."
        action={
          <button type="button" className="btn btn-primary" onClick={() => replace('perfil')}>
            Nuevo perfil
          </button>
        }
      />
    </Sheet>
  );
}

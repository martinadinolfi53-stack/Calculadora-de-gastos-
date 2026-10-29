import { useId } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, ChevronRight, Info } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { navigate } from '../lib/router';
import { formatMoney, parseAmount } from '../lib/money';
import type { Currency } from '../lib/money';
import { ProfilePill } from './ProfilePill';

type TopBarProps = {
  title: string;
  /** Ruta a la que vuelve la flecha. Sin ella, la pantalla es una sección principal. */
  back?: string;
  actions?: ReactNode;
};

export function TopBar({ title, back, actions }: TopBarProps) {
  return (
    <header className="topbar">
      {back ? (
        <button type="button" className="btn icon-btn glass-thin" onClick={() => navigate(back)} aria-label="Atrás">
          <ArrowLeft size={20} />
        </button>
      ) : (
        <ProfilePill />
      )}
      <h1>{title}</h1>
      {actions}
    </header>
  );
}

export function Section({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="section">
      <div className="section-head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: ReactNode;
};

/** Toda lista vacía explica qué va ahí y ofrece cómo crear el primero. */
export function EmptyState({ icon: Icon, title, text, action }: EmptyStateProps) {
  return (
    <div className="empty glass">
      <div className="empty-icon" aria-hidden="true">
        <Icon size={26} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

type RowLinkProps = {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  to: string;
};

export function RowLink({ icon: Icon, title, subtitle, to }: RowLinkProps) {
  return (
    <a className="row" href={`#${to}`}>
      <span className="row-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <span className="row-body">
        <span className="row-title">{title}</span>
        {subtitle && <span className="row-sub"> · {subtitle}</span>}
      </span>
      <ChevronRight size={18} className="chev" aria-hidden="true" />
    </a>
  );
}

type SegmentedProps<T extends string> = {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

export function Segmented<T extends string>({ label, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="segmented" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}

type AmountFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  currency?: Currency;
  tone?: 'expense' | 'income';
};

/** Importe grande con vista previa del valor que se va a guardar. */
export function AmountField({ label, value, onChange, currency = 'UYU', tone = 'expense' }: AmountFieldProps) {
  const id = useId();
  const cents = parseAmount(value);
  const invalid = value.trim() !== '' && cents === null;
  return (
    <div className={`amount ${tone === 'income' ? 'income' : ''}`}>
      <label htmlFor={id} className="kpi-label">
        {label}
      </label>
      <input
        id={id}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={`${id}-preview`}
      />
      <span id={`${id}-preview`} className={invalid ? 'field-error' : 'amount-preview'} aria-live="polite">
        {invalid ? 'Revisá el importe: por ejemplo 1.250,50' : cents !== null ? formatMoney(cents, currency) : 'Escribí el importe'}
      </span>
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="notice" role="note">
      <Info size={18} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

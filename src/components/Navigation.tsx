import { CalendarClock, Ellipsis, House, ReceiptText, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { sectionOf } from '../lib/router';
import { ProfilePill } from './ProfilePill';

type NavItem = { path: string; label: string; icon: LucideIcon };

// Las mismas cinco secciones en celular y computadora; solo cambia dónde se ubican.
export const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Inicio', icon: House },
  { path: '/movimientos', label: 'Movimientos', icon: ReceiptText },
  { path: '/fijos', label: 'Fijos', icon: CalendarClock },
  { path: '/cuentas', label: 'Cuentas', icon: Wallet },
  { path: '/mas', label: 'Más', icon: Ellipsis },
];

export function TabBar({ path }: { path: string }) {
  const active = sectionOf(path);
  return (
    <nav className="tabbar glass-thin" aria-label="Secciones">
      {NAV_ITEMS.map(({ path: to, label, icon: Icon }) => (
        <a key={to} className="tab" href={`#${to}`} aria-current={active === to ? 'page' : undefined}>
          <Icon size={22} aria-hidden="true" />
          {label}
        </a>
      ))}
    </nav>
  );
}

export function Sidebar({ path }: { path: string }) {
  const active = sectionOf(path);
  return (
    <aside className="sidebar glass-thin">
      <ProfilePill />
      <nav aria-label="Secciones">
        {NAV_ITEMS.map(({ path: to, label, icon: Icon }) => (
          <a key={to} className="side-link" href={`#${to}`} aria-current={active === to ? 'page' : undefined}>
            <Icon size={20} aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>
      <p className="side-foot">
        Atajos: <kbd>G</kbd> gasto · <kbd>I</kbd> ingreso · <kbd>T</kbd> transferir
      </p>
    </aside>
  );
}

import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export type SheetName =
  | 'gasto'
  | 'ingreso'
  | 'transferir'
  | 'fijo-gasto'
  | 'fijo-ingreso'
  | 'cuenta'
  | 'perfil'
  | 'selector-perfil';

type SheetApi = {
  current: SheetName | null;
  open: (name: SheetName) => void;
  /** Cambia a otra hoja sin apilarla (por ejemplo, del selector de perfil a «Nuevo perfil»). */
  replace: (name: SheetName) => void;
  requestClose: () => void;
  setDirty: (dirty: boolean) => void;
};

const SheetContext = createContext<SheetApi | null>(null);

const DISCARD_MESSAGE = '¿Descartar lo que escribiste?';

/**
 * Las hojas se abren sumando una entrada al historial, así el botón Atrás
 * del celular (o del navegador) las cierra en vez de salir de la pantalla.
 */
export function SheetProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<SheetName | null>(null);
  const dirty = useRef(false);

  const open = useCallback((name: SheetName) => {
    dirty.current = false;
    window.history.pushState({ sheet: name }, '');
    setCurrent(name);
  }, []);

  const replace = useCallback((name: SheetName) => {
    dirty.current = false;
    window.history.replaceState({ sheet: name }, '');
    setCurrent(name);
  }, []);

  const requestClose = useCallback(() => {
    if (dirty.current && !window.confirm(DISCARD_MESSAGE)) return;
    dirty.current = false;
    if (window.history.state?.sheet) window.history.back();
    else setCurrent(null);
  }, []);

  const setDirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);

  const currentRef = useRef(current);
  currentRef.current = current;

  useEffect(() => {
    const onPop = (event: PopStateEvent) => {
      const prev = currentRef.current;
      const next = (event.state?.sheet as SheetName | undefined) ?? null;
      // Atrás con datos sin guardar: se pregunta y, si se cancela, la hoja queda.
      if (prev && !next && dirty.current) {
        if (!window.confirm(DISCARD_MESSAGE)) {
          window.history.pushState({ sheet: prev }, '');
          return;
        }
        dirty.current = false;
      }
      setCurrent(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const api = useMemo(
    () => ({ current, open, replace, requestClose, setDirty }),
    [current, open, replace, requestClose, setDirty],
  );
  return <SheetContext.Provider value={api}>{children}</SheetContext.Provider>;
}

export function useSheets(): SheetApi {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('useSheets necesita SheetProvider');
  return ctx;
}

const FOCUSABLE = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])';

type SheetProps = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Hoja de vidrio: sube desde abajo en el celular y aparece centrada en la computadora. */
export function Sheet({ title, children, footer }: SheetProps) {
  const { requestClose } = useSheets();
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const first = panel.current?.querySelector<HTMLElement>('input, select, textarea') ??
      panel.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      previous?.focus?.({ preventScroll: true });
    };
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      requestClose();
      return;
    }
    // Mantiene el foco del teclado dentro de la hoja.
    if (event.key === 'Tab' && panel.current) {
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && requestClose()}>
      <div
        ref={panel}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
      >
        <div className="sheet-grip" aria-hidden="true" />
        <div className="sheet-head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="btn icon-btn" onClick={requestClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  );
}

export type ThemePref = 'auto' | 'claro' | 'oscuro';

const KEY = 'tema';

// Se guarda en el navegador: es una preferencia de pantalla, no un dato financiero.
export function getThemePref(): ThemePref {
  try {
    const value = localStorage.getItem(KEY);
    if (value === 'claro' || value === 'oscuro') return value;
  } catch {
    // Navegación privada o almacenamiento bloqueado: se usa el automático.
  }
  return 'auto';
}

export function applyThemePref(pref: ThemePref): void {
  const root = document.documentElement;
  if (pref === 'claro') root.dataset.theme = 'light';
  else if (pref === 'oscuro') root.dataset.theme = 'dark';
  else delete root.dataset.theme;
  try {
    if (pref === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    // Si no se puede guardar, el tema igual se aplica en esta visita.
  }
}

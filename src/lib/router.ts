import { useEffect, useState } from 'react';

// Rutas con hash (#/movimientos): GitHub Pages no sabe redirigir rutas,
// y con hash el botón Atrás del navegador funciona siempre.

function currentPath(): string {
  const path = window.location.hash.replace(/^#/, '');
  return path === '' ? '/' : path;
}

export function useRoute(): string {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onChange = () => {
      setPath(currentPath());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path;
}

export function navigate(path: string): void {
  window.location.hash = path;
}

/** Sección principal a la que pertenece una ruta, para marcarla en la navegación. */
export function sectionOf(path: string): string {
  const first = path.split('/')[1] ?? '';
  return `/${first}`;
}

# Calculadora de gastos

Aplicación web instalable (PWA) para administrar finanzas personales y de negocios. Funciona sin internet y guarda los datos solo en el dispositivo.

Publicada en: https://martinadinolfi53-stack.github.io/Calculadora-de-gastos-/

## Estado

| Fase | Contenido | Estado |
| --- | --- | --- |
| 1 | Análisis, arquitectura y modelo de datos | Hecha |
| 2 | Sistema visual Liquid Glass, navegación y pantallas | Esta entrega |
| 3 | Perfiles, cuentas, gastos, ingresos y base de datos | Próxima |
| 4 | Gastos fijos e ingresos recurrentes | Pendiente |
| 5 | Filtros, buscador, historiales y estadísticas | Pendiente |
| 6 | Transferencias, tarjetas, proyecciones y respaldos | Pendiente |
| 7 | Validación completa | Pendiente |

## Tecnología

- Vite + React + TypeScript.
- PWA con `vite-plugin-pwa` (manifest y Service Worker).
- Rutas con hash (`#/movimientos`) para que funcione en GitHub Pages.
- Importes como enteros en centésimos (`src/lib/money.ts`), nunca con decimales flotantes.

## Comandos

```bash
npm install     # instala dependencias
npm run dev     # servidor local con recarga
npm test        # pruebas automáticas
npm run build   # versión para publicar, en dist/
```

Cada cambio en `main` se prueba y se publica solo en GitHub Pages (`.github/workflows/deploy.yml`).

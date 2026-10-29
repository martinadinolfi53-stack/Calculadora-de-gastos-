# Calculadora de gastos

PWA de finanzas personales y de negocios. Idioma de la interfaz y del código: español rioplatense. Moneda por defecto: UYU.

## Reglas

- Importes siempre como enteros en centésimos; formatear solo al mostrar (`src/lib/money.ts`).
- Fechas como texto `AAAA-MM-DD`, sin hora (`src/lib/dates.ts`).
- Colores, vidrio y medidas salen de `src/styles/tokens.css`; no usar colores sueltos.
- Formularios en hojas (`Sheet`); toda pantalla secundaria tiene «Atrás» (`TopBar back=`).
- No simular funciones: si algo no está implementado, decirlo en la interfaz.
- Antes de dar algo por terminado: `npm test` y `npm run build` sin errores.

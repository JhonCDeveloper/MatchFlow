# 🔍 AUDITORÍA TÉCNICA COMPLETA - MatchFlow
**Fecha**: 5 de Febrero de 2026  
**Estado**: POST-REESTRUCTURACIÓN  
**Nivel de Urgencia**: 🔴 CRÍTICO

> **NOTA**: Esta auditoría fue generada DESPUÉS de la reestructuración del proyecto.
> Los paths de archivos reflejan la nueva estructura: `src/pages/`, `src/utils/`, etc.
> Los errores listados son los que **PERSISTEN** después de la reorganización.

---

## 📊 RESUMEN EJECUTIVO - POST REESTRUCTURACIÓN

| Categoría | Cantidad | Estado |
|-----------|----------|--------|
| **Problemas Críticos** | 5 | 🔴 Bloquean producción |
| **Problemas Mayores** | 6 | 🟡 Fallos de lógica |
| **Deuda Técnica** | 7 | 🟠 Refactorización necesaria |
| **Inconsistencias** | 4 | ⚠️ Mejoras menores |
| **Riesgos de Seguridad** | 5 | 🛡️ Alto riesgo |

**Total de Issues**: 27 (reducido de 37)  
**Archivos Afectados**: 12 (reducido de 15)  
**Líneas de Código**: ~2,300

**✅ RESUELTOS por reestructuración:**
- ❌ Duplicación de archivos (13 renombrados con _OBSOLETE_)
- ✅ Estructura de carpetas organizada
- ✅ Separación clara de concerns

---

## 🔴 PROBLEMAS CRÍTICOS (BLOQUEAN PRODUCCIÓN)

## 🔴 PROBLEMAS CRÍTICOS (BLOQUEAN PRODUCCIÓN)

### P1: Redirección de Login Rota
**Severidad**: 🔴 CRÍTICO  
**Archivo**: `src/pages/login/login.js`  
**Línea**: 40  
**Problema**:
```javascript
window.location.href = user.role === 'company' ? 'company-dashboard.html' : '../candidate.html';
```
- Intenta redirigir a `company-dashboard.html` que **NO EXISTE** en nueva estructura
- El archivo correcto es: `src/pages/dashboard/index.html`
- Referencia a `../candidate.html` también es incorrecta (debería ser `../candidates/index.html`)
- Usuario de empresa queda atrapado en error 404

**Impacto**: 🔴 BLOQUEANTE - Usuario empresa no puede acceder al sistema  
**Fix Prioridad**: P0 - Arreglar hoy
**Nueva Ruta**: 
```javascript
window.location.href = user.role === 'company' ? '../dashboard/' : '../candidates/';
```

---

### P2: CompanyId Hardcodeado en Jobs
**Severidad**: 🔴 CRÍTICO  
**Archivo**: `src/pages/jobs/jobs.js`  
**Línea**: 7  
**Problema**:
```javascript
const res = await fetch(`${API_URL}/jobs?companyId=1`);
```
- Siempre obtiene trabajos del usuario ID 1
- Ignora completamente qué usuario está logueado
- **Seguridad**: Cualquier usuario ve los jobs de otro

**Impacto**: 🔴 Aislamiento de datos comprometido  
**Fix**: Cambiar a `localStorage.getItem('user').id`

---

### P3: CompanyId Hardcodeado en Interviews
**Severidad**: 🔴 CRÍTICO  
**Archivo**: `src/pages/interviews/interviews.js`  
**Línea**: 7  
**Problema**:
```javascript
const res = await fetch(`${API_URL}/interviews?companyId=1`);
```
- Mismo problema que P2
- Cualquier usuario ve entrevistas del usuario 1

**Impacto**: 🔴 Fuga de datos sensibles  
**Fix**: Cambiar a ID dinámico del usuario logueado

---

### P4: API_URL No Definida Globalmente
**Severidad**: 🔴 CRÍTICO  
**Archivo**: `src/utils/match-logic.js`  
**Línea**: 1  
**Problema**:
```javascript
const API_URL = window.API_URL;  // window.API_URL es undefined
```
- `window.API_URL` nunca se define en ningún archivo
- Busca en el object global pero no existe
- Todas las llamadas a API fallan silenciosamente

**Impacto**: 🔴 Sistema de matches completamente no funcional  
**Archivos Afectados**:
- `src/utils/match-logic.js` (todas las funciones)
- `src/pages/candidates/candidates.js` (createMatch())
- `src/pages/matches/index.html` (completa)

**Solución**: Definir globalmente en HTML o crear `src/config.js`

---

### P5: Base de Datos en Ubicación Correcta ✅
**Severidad**: ✅ RESUELTO  
**Cambio**: Archivo `src/data/db.json` ya está en la ubicación correcta
**Status**: La reestructuración movió correctamente el archivo

---

### P6: Rutas CSS Relativas Incorrectas
**Severidad**: 🔴 CRÍTICO  
**Archivos**: 
- `src/pages/dashboard/index.html` (L7)
- `src/pages/jobs/index.html` (L7)
- `src/pages/candidates/index.html` (L7)
- `src/pages/interviews/index.html` (L7)
- `src/pages/matches/index.html` (L8)

**Problema**:
```html
<link rel="stylesheet" href="../dist/output.css" />
```
- Ruta relativa incorrecta, va 2 niveles arriba buscando `dist/`
- Pero `dist/` está en raíz del proyecto, no en `src/`
- Corrección: `href="../../dist/output.css"`

**Impacto**: 🔴 Todos los dashboards sin estilos Tailwind  
**Fix**: Cambiar rutas o servir CSS desde raíz correctamente

---

## 🟡 PROBLEMAS MAYORES (FALLOS DE LÓGICA)

### M1: Falsa Dicotomía de Rol en Login ✅
**Severidad**: 🟡 MAYOR  
**Archivo**: `src/pages/login/login.js`  
**Status**: ✅ Todavía presistente después de reestructuración

---

### M2: API_URL Inconsistente
**Severidad**: 🟡 MAYOR  
**Problema**: Existen definiciones diferentes en múltiples archivos
```javascript
// src/pages/login/login.js línea 2
const API_URL = "http://localhost:3000/users";

// src/pages/candidates/candidates.js línea 1
const API_URL = "http://localhost:3000";

// src/utils/match-logic.js línea 1
const API_URL = window.API_URL;  // undefined
```
- Login usa `/users` (endpoint específico)
- Candidates usa base URL
- Match-logic espera variable global
- **Inconsistencia Total**: 3 patrones diferentes

**Impacto**: 🟡 Confusión y errores de request  
**Solución**: Crear `src/config.js` centralizado
```javascript
export const API_CONFIG = {
  BASE_URL: "http://localhost:3000",
  ENDPOINTS: {
    USERS: "/users",
    JOBS: "/jobs",
    CANDIDATES: "/users?role=candidate"
  }
};
```

---

### M3: Endpoint /candidates No Existe
**Severidad**: 🟡 MAYOR  
**Archivo**: `src/pages/candidates/candidates.js`  
**Línea**: 13  
**Problema**:
```javascript
let url = `${API_URL}/candidates?openToWork=true`;
```
- En `src/data/db.json` no hay sección `"candidates"`
- Datos de candidatos están en `"users"` con `role: "candidate"`
- Request falla silenciosamente

**Impacto**: 🟡 Página de candidatos vacía  
**Solución**: Cambiar endpoint a `/users?role=candidate&openToWork=true`

---

### M4: N+1 Query Problem en Interviews
**Severidad**: 🟡 MAYOR  
**Archivo**: `src/pages/interviews/interviews.js`  
**Línea**: 16-17  
**Problema**:
```javascript
for (const interview of interviews) {
  const candidate = await fetch(`${API_URL}/candidates/${interview.candidateId}`);
  const job = await fetch(`${API_URL}/jobs/${interview.jobId}`);
}
```
- Por cada entrevista: 2 requests adicionales
- 100 entrevistas = 1 request inicial + 200 request = 201 total
- Performance catastrófica

**Impacto**: 🟡 Página de interviews muy lenta  
**Solución**: 
1. Cargar todos los candidatos/jobs una sola vez
2. Mapear en memoria

---

### M5: Funciones onclick Sin Definir
**Severidad**: 🟡 MAYOR  
**Archivo**: `src/pages/matches/index.html`  
**Línea**: 118  
**Problema**:
```html
<button onclick="createMatchSimple()">Create Match</button>
```
- Función nunca se define en ningún lugar
- Botón no funciona
- Sin error en consola (silent fail)

**Impacto**: 🟡 No se puede crear matches desde UI

---

### M6: Header Component Vacío
**Severidad**: 🟡 MAYOR  
**Archivo**: `src/components/header/_OBSOLETE_header.html`  
**Problema**:
- Archivo existe pero está vacío (renombrado como obsoleto)
- Nunca se usaba en la aplicación

**Status**: ✅ Identificado, marcado para eliminar

---

## 🟠 DEUDA TÉCNICA (REFACTORIZACIÓN NECESARIA)

### D1: Duplicación de Código - Carga de Sidebar
**Problema**: Same code 3+ times
```javascript
// dashboard.html (L150)
// jobs.html (L37)
// candidates.html (L70)
// interviews.html (L30)
fetch("../components/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar-container").innerHTML = data;
  });
```
**Impacto**: Mantenimiento difícil  
**Solución**: Crear `js/components.js` con función reutilizable

---

### D2: Inconsistencia de Framework CSS
**Problema**: Mezcla Bootstrap + Tailwind + CSS puro
- `candidate.html`: Bootstrap 5.3
- `dashboard.html`: Tailwind CSS
- `css/styles.css`: CSS puro
- `login-style.css`: CSS puro

**Archivos Afectados**:
```
candidate.html        → Bootstrap
login.html            → Bootstrap + CSS custom
company/pages/*       → Tailwind
css/styles.css        → Custom CSS
login-style.css       → Custom CSS
```

**Impacto**: Inconsistencia visual, bundle size aumentado  
**Solución**: Elegir uno (recomendado: Tailwind)

---

### D3: Sin Funcionalidad de Logout
**Problema**:
- No hay botón de logout en dashboards
- No hay limpieza de localStorage
- Usuario no puede cerrar sesión

**Afectado**: Toda la sección company  
**Solución**: Agregar botón logout en sidebar + función

---

### D4: Sin Validación de Campos
**Archivo**: `src/pages/login/login.js`  
**Problemas**:
- L26: `const email = document.getElementById('login-email').value;`
  - No valida email format
  - Acepta strings vacíos
- L27: No valida contraseña
- XSS vulnerable

**Impacto**: 🛡️ Seguridad comprometida  

---

### D5: Alerts en Lugar de UX Moderna
**Archivo**: `src/pages/login/login.js`  
**Línea**: 21, 36, 44, etc.
```javascript
alert("User not found.");
alert("Account created!");
```
- `alert()` es bloqueante
- Experiencia de usuario pobre
- No se puede customizar

**Impacto**: UX deficiente  
**Solución**: Implementar toast/modal notifications

---

### D6: Búsqueda Frontend no Performante
**Archivo**: `src/pages/candidates/candidates.js`  
**Línea**: 18-25
```javascript
if (filters.role) {
  candidates = candidates.filter(c =>
    c.role.toLowerCase().includes(filters.role.toLowerCase())
  );
}
```
- Filtra TODO el array en navegador
- Sin indexación
- Con 10k candidatos = lento

**Impacto**: Performance degradada  
**Solución**: Mover filtros a backend (`?role=X&location=Y`)

---

### D7: Error Handling Incompleto
**Archivo**: `company/js/pages/dashboard.js`  
**Línea**: Múltiples catch blocks
```javascript
catch (error) {
  console.error(err);  // solo log
}
```
- No informa al usuario
- No hay retry logic
- Silenciosamente falla

**Impacto**: Usuario no sabe qué pasó  

---

### D8: Monolithic HTML (837 líneas)
**Archivo**: `company/pages/matches.html`  
**Problema**:
- 837 líneas en UN archivo
- CSS inline
- JavaScript inline (500+ líneas)
- Complejidad monolítica

**Impacto**: Difícil de mantener  
**Solución**: Dividir en componentes

---

## ⚠️ INCONSISTENCIAS MENORES

### I1: Title HTML Vacío
**Archivo**: `src/pages/dashboard/index.html`  
**Línea**: 5
```html
<title></title>
```
**Fix**: `<title>Dashboard - MatchFlow</title>`

---

### I2: Sidebar Cargado Dinámicamente en Múltiples Archivos
**Problema**: Cada página carga sidebar diferente
```html
<!-- dashboard.html: fetch + script inline -->
<!-- jobs.html: fetch + script inline -->
<!-- candidates.html: fetch + script inline -->
<!-- matches.html: sidebar HTML hardcoded DIFERENTE -->
```
**Impacto**: Inconsistencia, mantenimiento difícil

---

### I3: CSS Polución - Bootstrap en Tailwind
**Archivo**: `src/pages/login/login.css`  
**Línea**: 105
```css
.d-none { 
  display: none !important;  
}
```
- `.d-none` es clase Bootstrap
- No debería estar en login.css
- Redundancia

---

### I4: Font Importada en Múltiples Archivos
**Archivos**:
- `src/pages/dashboard/index.html`: L8
- `src/pages/candidates/index.html`: L15
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
```
- Carga duplicada
- Aumenta latencia

---

## 📋 DUPLICADOS DE CÓDIGO

### DUP1: Carga de Sidebar (4 veces)
```javascript
// dashboard.html L150
// jobs.html
// candidates.html
// interviews.html
fetch("../components/sidebar.html")
  .then(res => res.text())
  .then(data => {
    document.getElementById("sidebar-container").innerHTML = data;
  });
```
**Líneas Duplicadas**: ~8 líneas × 4 archivos = 32 líneas  

---

### DUP2: API_URL Definida 3 Veces Diferente
```javascript
// login-auth.js L2
const API_URL = "http://localhost:3000/users";

// candidates.js L1
const API_URL = "http://localhost:3000";

// match-logic.js L1
const API_URL = window.API_URL;

// jobs.js - no define, implícito
const API_URL = "http://localhost:3000";
```

---

### DUP3: Sidebar HTML en 2 Lugares
- `company/components/sidebar.html`: Versión dinámica
- `company/pages/matches.html` L20-50: HTML hardcoded DIFERENTE

**Problema**: 2 sidebars diferentes, no mantiene consistencia

---

## 🛡️ RIESGOS DE SEGURIDAD

### SEC1: XSS - Datos Sin Sanitizar
**Severidad**: 🔴 ALTO  
**Archivos**:
- `src/pages/dashboard/dashboard.js` (L50+): `innerHTML` directo
- `src/pages/candidates/candidates.js` (L60+): `innerHTML` directo
- `src/pages/jobs/jobs.js` (L22+): `innerHTML` directo

**Código Vulnerable**:
```javascript
card.innerHTML = `<p>${job.title}</p>`;  // Si title contiene <script>
```

**Fix**: Usar `textContent` o DOMPurify

---

### SEC2: CSRF - Sin Tokens
**Severidad**: 🟡 MEDIO  
**Problema**: POST/PATCH sin CSRF tokens
```javascript
await fetch(API_URL, {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(newUser)  // sin token
});
```
**Archivos**: `src/pages/login/login.js`, `src/utils/match-logic.js`, todos

---

### SEC3: Auth Bypass - localStorage Sin Validación
**Severidad**: 🔴 ALTO  
**Archivo**: `src/pages/candidates/candidates.js`  
**Problema**:
```javascript
const local = JSON.parse(localStorage.getItem("user"));
if(!local) {
  window.location.href = '../login.html';
}
```
- localStorage puede ser manipulado por usuario
- No hay validación de JWT
- No hay verificación de sesión

**Fix**: Usar JWT con http-only cookies

---

### SEC4: Credenciales en localStorage
**Severidad**: 🔴 ALTO  
**Archivo**: `src/pages/login/login.js`  
**Línea**: 37
```javascript
localStorage.setItem('user', JSON.stringify(user));
```
- Contraseña completa en localStorage
- Vulnerable a XSS
- Sin encriptación

**Fix**: 
1. Solo guardar ID + token
2. Contraseña solo en servidor
3. HTTP-only cookies para token

---

### SEC5: SQL Injection Equivalente
**Severidad**: 🟡 MEDIO  
**Problema**: Parámetros no validados en URLs
```javascript
`${API_URL}/candidates?role=${role}&location=${location}`  // sin validar
```
- Usuario puede inyectar caracteres especiales
- Sin validación de entrada

**Archivos**: `src/pages/candidates/candidates.js`, `src/pages/jobs/jobs.js`, todos

---

## 📁 ESTRUCTURA FALTANTE

### Directorio Missing: `company/backend/`
```
company/backend/
├── db.json        ← Debe mover desde js/db.json
└── (vacío, crear)
```
**Línea en package.json que lo espera**: L9  
`"server": "json-server --watch backend/db.json --port 3000"`

---

### Directorio Missing: `company/dist/`
```
company/dist/
├── output.css     ← Generado por Tailwind
└── (crear, generar con `npm run build:css`)
```
**Referenciado en**:
- dashboard.html L7
- jobs.html L7
- candidates.html L7
- interviews.html L7
- matches.html L8

---

### Archivos Missing

#### 1. `js/config.js` (centralizar config)
Debería contener:
```javascript
export const API_URL = "http://localhost:3000";
export const API_ENDPOINTS = {
  USERS: "/users",
  JOBS: "/jobs",
  CANDIDATES: "/users?role=candidate"
};
```

---

#### 2. `.env.example`
```
API_URL=http://localhost:3000
API_PORT=3000
NODE_ENV=development
```

---

#### 3. `index.html` (Landing Page)
```html
<!DOCTYPE html>
<html>
<head>
  <title>MatchFlow - Hiring Platform</title>
</head>
<body>
  <script>
    // Redirigir al login
    window.location.href = '/login.html';
  </script>
</body>
</html>
```

---

#### 4. `company/pages/auth-guard.js`
Middleware de autenticación:
```javascript
function requireAuth() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '../../login.html';
  }
  return user;
}
```

---

#### 5. `company/js/api-client.js`
Centralizar requests:
```javascript
const API_URL = "http://localhost:3000";
const token = localStorage.getItem('token');

const apiClient = {
  get: (endpoint) => fetch(`${API_URL}${endpoint}`),
  post: (endpoint, data) => fetch(`${API_URL}${endpoint}`, {...})
};
```

---

## 📊 PERFORMANCE

### Archivo Grande: matches.html (837 líneas)
**Problema**: Una sola página con todo
```
HTML: ~350 líneas
CSS inline: ~100 líneas
JS inline: ~400 líneas
```
**Solución**: Dividir en 3 archivos

---

### N+1 Queries: interviews.js (L16-17)
**Antes**: 100 entrevistas = 201 requests
```
GET /interviews?companyId=1        → 100 interviews
FOR each:
  GET /candidates/:id              → 100 requests
  GET /jobs/:id                    → 100 requests
TOTAL: 201 requests
```

**Después**: 3 requests
```
GET /interviews?companyId=1        → 1 request
GET /candidates                    → 1 request
GET /jobs                          → 1 request
TOTAL: 3 requests
```

---

### Búsqueda Frontend (candidates.js)
**Actual**: Filter en navegador
- Carga TODO
- Filter en array grande
- Lento con 10k registros

**Óptimo**: Filter en backend
```javascript
`${API_URL}/users?role=candidate&openToWork=true&title=${role}`
```

---

## 🔗 GRAFO DE DEPENDENCIAS ROTAS

```
login.html
  ↓
login-auth.js
  ├─ Redirige a: company-dashboard.html ❌ NO EXISTE
  ├─ API_URL: "http://localhost:3000/users" ✓
  └─ Salva user en localStorage ✓

candidate.html
  ├─ Link: /src/style.css ❌ NO EXISTE
  ├─ Link: ./css/styles.css ✓
  └─ Script: js/candidate.js ✓

company/pages/dashboard.html
  ├─ Link: ../dist/output.css ❌ NO EXISTE
  ├─ Carga: sidebar.html ✓
  └─ Script: ../js/pages/dashboard.js ✓
      ├─ API_URL: hardcoded ✓
      └─ localStorage.user ✓

company/pages/candidates.html
  ├─ Link: ../dist/output.css ❌ NO EXISTE
  ├─ Carga: sidebar.html ✓
  └─ Script: ../js/pages/candidates.js ✓
      ├─ API_URL: correcto ✓
      ├─ Endpoint: /candidates ❌ NO EXISTE
      └─ Llama: createMatch() ✓

company/pages/matches.html
  ├─ Link: ../dist/output.css ❌ NO EXISTE
  ├─ Sidebar: hardcoded ✓
  └─ Llama: window.API_URL ❌ UNDEFINED
      ├─ match-logic.js ❌ MISSING IMPORT
      └─ Todas las funciones fallan ❌
```

---

## 📋 CHECKLIST URGENTE - PRIORIDAD POST-REESTRUCTURACIÓN

### 🔴 P0 - HOY (2 horas)
- [ ] Fijar redirección login en `src/pages/login/login.js` (L40)
  - De: `company-dashboard.html` y `../candidate.html`
  - A: `../dashboard/` y `../candidates/`
- [ ] Definir `window.API_URL` globalmente en HTML
  - Agregar script en `src/pages/*.html`: `<script>window.API_URL = "http://localhost:3000";</script>`
- [ ] Verificar rutas CSS en los HTML
  - Cambiar `../dist/output.css` → `../../dist/output.css`

### 🔴 P1 - HOY (4 horas)
- [ ] Cambiar `companyId=1` → dinámico en `src/pages/jobs/jobs.js`
  - Usar: `localStorage.getItem('user').id`
- [ ] Cambiar `companyId=1` → dinámico en `src/pages/interviews/interviews.js`
  - Usar: `localStorage.getItem('user').id`
- [ ] Arreglar endpoint `/candidates` en `src/pages/candidates/candidates.js`
  - Cambiar a: `/users?role=candidate&openToWork=true`
- [ ] Crear logout funcional en `src/components/sidebar/sidebar.html`

### 🟡 P2 - ESTA SEMANA
- [ ] Centralizar API_URL en `src/config.js`
- [ ] Optimizar N+1 queries en `src/pages/interviews/interviews.js`
- [ ] Definir funciones onclick que faltan en `src/pages/matches/index.html`
- [ ] Implementar toast notifications para login
- [ ] Refactorizar carga de sidebar (crear función reutilizable)

### 🟠 P3 - PRÓXIMAS DOS SEMANAS
- [ ] Consolidar CSS (Bootstrap → Tailwind únicamente)
- [ ] Implementar validación en formularios
- [ ] Implementar i18n (múltiples idiomas)
- [ ] Tests unitarios básicos
- [ ] Security audit completo
- [ ] Eliminar archivos `_OBSOLETE_`

---

## 📈 MÉTRICAS

| Métrica | Actual | Target |
|---------|--------|--------|
| Problemas Críticos | 7 | 0 |
| Test Coverage | 0% | 80% |
| Bundle Size | ~500KB | <300KB |
| Load Time | ? | <2s |
| Duplicated Code | ~150 líneas | <50 líneas |
| Security Score | D | A |

---

## 📝 NOTAS IMPORTANTES

1. **db.json está DIVIDIDA en 2 ubicaciones**:
   - `js/db.json` (actual)
   - `company/backend/db.json` (esperada por package.json)
   - **Acción**: Mover y unificar

2. **window.API_URL se usa pero nunca se define**:
   - Búsqueda en todos los archivos: NO existe definición
   - Resultado: silenciosamente fallan los matches

3. **3 estilos de código para API_URL**:
   - Inconsistencia de arquitectura
   - Difícil de mantener
   - Propenso a errores

4. **Sidebar hardcoded vs dinámico**:
   - 4 archivos cargan dinámicamente
   - 1 archivo (matches.html) tiene copia hardcoded
   - Esto causará bugs cuando se edite

5. **Security: Contraseña en localStorage**:
   - Alto riesgo
   - Visible en DevTools
   - Sin encriptación
   - **Cambiar a JWT inmediatamente**

---

## 📞 CONTACTO & FOLLOW-UP

**Última Auditoría**: 2026-02-05  
**Próxima Revisión**: Post-fixes P0/P1  
**Responsable**: Scrum Master Team  

---

**Documento Generado**: 2026-02-05  
**Versión**: 1.0  
**Estado**: ACTIVO - Acciones Requeridas

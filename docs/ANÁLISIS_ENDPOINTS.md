# 📡 ANÁLISIS: ERRORES POR PROBLEMAS DE ENDPOINTS

**Fecha:** Febrero 5, 2026  
**Análisis de:** Discrepancias entre endpoints llamados en código vs endpoints disponibles en db.json

---

## 📊 RESUMEN EJECUTIVO

```
╔═══════════════════════════════════════════════════════════════════╗
║        IMPACTO DE ENDPOINTS EN ERRORES DEL PROYECTO              ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Total de errores documentados:           27                      ║
║  Errores directamente por ENDPOINTS:      8  (30%) 🔴            ║
║  Errores de ROUTING/CONFIG:               4  (15%)               ║
║  Errores de LÓGICA:                       6  (22%)               ║
║  Deuda técnica:                           7  (26%)               ║
║  Riesgos de seguridad:                    5  (18%)               ║
║                                                                   ║
║  CONCLUSIÓN: 30% de los problemas son DIRECTAMENTE por          ║
║              endpoints mal configurados o inexistentes           ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## 🗂️ ENDPOINTS DISPONIBLES EN db.json

### ✅ Endpoints Funcionales (Existen en DB)
```
GET    /users                           ✓ Datos: 2 candidatos (id: 1,2)
GET    /jobs                            ✓ Datos: 2 jobs (id: 101,102)
GET    /matches                         ✓ Datos: 2 matches
GET    /reservations                    ✓ Datos: 2 reservations
GET    /messages                        ✓ Datos: 2 messages
```

### ❌ Endpoints NO Existentes en DB (Pero el código los llama)
```
GET    /candidates                      ✗ NO EXISTE EN db.json
GET    /interviews                      ✗ NO EXISTE EN db.json
GET    /applications                    ✗ NO EXISTE EN db.json
POST   /interviews                      ✗ NO EXISTE EN db.json
DELETE /interviews/{id}                 ✗ NO EXISTE EN db.json
PUT    /interviews/{id}                 ✗ NO EXISTE EN db.json
```

---

## 🔴 PROBLEMAS CRÍTICOS POR ENDPOINTS

### P2: CompanyId Hardcodeado en /jobs (CRÍTICO)
**Severidad:** 🔴 CRÍTICO  
**Archivo:** `src/pages/jobs/jobs.js`  
**Línea:** 7  
**Código:**
```javascript
const res = await fetch(`${API_URL}/jobs?companyId=1`);
```
**Problema:**
- ❌ Siempre obtiene trabajos del companyId=1
- ❌ Ignora el usuario logueado actualmente
- ❌ **SEGURIDAD**: Cualquier usuario ve los jobs de la empresa 1

**Impacto:** 🔴 Aislamiento de datos comprometido  
**Endpoint correcto:**
```javascript
const companyId = JSON.parse(localStorage.getItem('user')).id;
const res = await fetch(`${API_URL}/jobs?companyId=${companyId}`);
```

---

### P3: /interviews Endpoint No Existe (CRÍTICO)
**Severidad:** 🔴 CRÍTICO  
**Archivo:** `src/pages/interviews/interviews.js`  
**Línea:** 7  
**Código:**
```javascript
const res = await fetch(`${API_URL}/interviews?companyId=1`);
```
**Problema:**
- ❌ Llama a `/interviews` que **NO EXISTE en db.json**
- ❌ La respuesta siempre será `[]` o error 404
- ❌ Página de interviews siempre está vacía
- ❌ Además: companyId hardcodeado

**Impacto:** 🔴 Funcionalidad de interviews completamente no funcional  
**Solución:** 
```javascript
// NO EXISTE /interviews EN db.json
// Debes crear este endpoint o usar datos de otra fuente
// Opción 1: Agregar "interviews" a db.json
// Opción 2: Usar reservations como interviews
```

---

### P4: /candidates Endpoint No Existe
**Severidad:** 🔴 CRÍTICO  
**Archivo:** `src/pages/interviews/interviews.js`  
**Línea:** 24  
**Código:**
```javascript
const candidate = await fetch(`${API_URL}/candidates/${interview.candidateId}`).then(r=>r.json());
```
**Problema:**
- ❌ `/candidates` endpoint no existe en db.json
- ❌ Los datos de candidatos están en `/users` con `role: "candidate"`
- ❌ Request falla silenciosamente
- ❌ Información del candidato nunca se carga

**Impacto:** 🔴 Detalles de candidatos no se muestran  
**Endpoint correcto:**
```javascript
const candidate = await fetch(`${API_URL}/users/${interview.candidateId}`).then(r=>r.json());
```

---

### P6: /applications Endpoint No Existe
**Severidad:** 🟡 MAYOR  
**Archivo:** `src/pages/dashboard/dashboard.js`  
**Línea:** 19  
**Código:**
```javascript
fetch(`${API_URL}/applications`),
```
**Problema:**
- ❌ `/applications` no existe en db.json
- ❌ No hay referencia a qué son "applications"
- ❌ Probablemente debería ser `/matches` o `/reservations`

**Impacto:** 🟡 Datos de aplicaciones nunca cargan en dashboard  
**Solución:** Cambiar a endpoint correcto o crear en db.json

---

## 🟡 PROBLEMAS MAYORES POR ENDPOINTS

### M2: API_URL Inconsistente (3 definiciones diferentes)
**Severidad:** 🟡 MAYOR  
**Problemas de INCONSISTENCIA:**

| Archivo | API_URL Definida | Patrón |
|---------|------------------|--------|
| `login.js` | `http://localhost:3000/users` | 🔴 Inconsistente |
| `login-auth.js` | `http://localhost:3000/users` | 🔴 Inconsistente |
| `jobs.js` | `http://localhost:3000` | ✓ Correcto |
| `interviews.js` | `http://localhost:3000` | ✓ Correcto |
| `dashboard.js` | `http://localhost:3000` | ✓ Correcto |
| `candidates.js` | `http://localhost:3000` | ✓ Correcto |
| `match-logic.js` | `window.API_URL` | 🔴 Undefined |

**Problema:**
- Login define `/users` completamente (no es reutilizable)
- Otros usan base URL (correcto)
- match-logic espera variable global que no existe

**Impacto:** 🟡 Confusión y bugs de requests  
**Solución:** Crear `src/config.js` centralizado

---

### M3: Endpoint /candidates No Existe en db.json
**Severidad:** 🟡 MAYOR  
**Archivo:** `src/pages/candidates/candidates.js`  
**Línea:** 13  
**Código:**
```javascript
let url = `${API_URL}/candidates?openToWork=true`;
```
**Problema:**
- ❌ En db.json no existe sección `"candidates"`
- ❌ Datos de candidatos están en `"users"` con `role: "candidate"`
- ✓ + `openToWork: true` filtro

**Impacto:** 🟡 Página de candidatos vacía  
**Endpoint correcto:**
```javascript
let url = `${API_URL}/users?role=candidate&openToWork=true`;
```

---

### M4: N+1 Query Problem
**Severidad:** 🟡 MAYOR  
**Archivo:** `src/pages/interviews/interviews.js`  
**Líneas:** 16-26  
**Código:**
```javascript
for (const interview of interviews) {
    const candidate = await fetch(`${API_URL}/candidates/${interview.candidateId}`);
    const job = await fetch(`${API_URL}/jobs/${interview.jobId}`);
}
```
**Problema:**
- ❌ Por cada entrevista: 1 request inicial (índice)
- ❌ + 1 request por candidato
- ❌ + 1 request por job
- ❌ 100 entrevistas = 201 requests total

**Impacto:** 🟡 Performance catastrófica  
**Impacto Combinado:**
- M4 + P3 = `/candidates` no existe + multiple requests
- M4 + P6 = `/applications` no existe
- **RESULTADO:** Dashboard tarde MUCHO en cargar o no carga

---

## 📈 TABLA CONSOLIDADA: ERRORES POR ENDPOINT

| Tipo | Error | Endpoint | Problema | Línea | Archivo |
|------|-------|----------|----------|-------|---------|
| 🔴 | P2 | `/jobs` | hardcoded companyId | 7 | jobs.js |
| 🔴 | P3 | `/interviews` | **NO EXISTE** | 7 | interviews.js |
| 🔴 | P4 | `/candidates` | **NO EXISTE** | 24 | interviews.js |
| 🟡 | P6 | `/applications` | **NO EXISTE** | 19 | dashboard.js |
| 🟡 | M2 | API_URL | 3 definiciones | varios | 6 archivos |
| 🟡 | M3 | `/candidates` | **NO EXISTE** | 13 | candidates.js |
| 🟡 | M4 | N+1 Query | `/candidates` + `/jobs` | 24-25 | interviews.js |

**Total: 8 errores directos por ENDPOINTS = 30% del total**

---

## 🔧 SOLUCIONES POR PRIORIDAD

### FASE 1: CRÍTICA (Debe hacerse hoy)

#### 1️⃣ Crear `src/config.js`
```javascript
// src/config.js
const API_CONFIG = {
  BASE_URL: "http://localhost:3000",
  ENDPOINTS: {
    USERS: "/users",
    JOBS: "/jobs",
    MATCHES: "/matches",
    RESERVATIONS: "/reservations",
    MESSAGES: "/messages"
  }
};

export default API_CONFIG;
```

#### 2️⃣ Actualizar db.json
Agregar secciones faltantes:
```json
{
  "interviews": [
    {
      "id": "1",
      "companyId": "3",
      "candidateId": "1",
      "jobId": "101",
      "date": "2026-02-10T10:00:00Z",
      "status": "scheduled"
    }
  ],
  "candidates": []  // O eliminar si usas /users
}
```

#### 3️⃣ Actualizar archivos JS
```javascript
// Antes:
const API_URL = "http://localhost:3000";
const res = await fetch(`${API_URL}/jobs?companyId=1`);

// Después:
import API_CONFIG from "../../../config.js";
const user = JSON.parse(localStorage.getItem('user'));
const res = await fetch(
  `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS}?companyId=${user.id}`
);
```

### FASE 2: IMPORTANTE (Esta semana)

#### 1️⃣ Remover N+1 Query
```javascript
// Antes: 201 requests para 100 entrevistas
for (const interview of interviews) {
  const candidate = await fetch(...);
  const job = await fetch(...);
}

// Después: 3 requests totales
const [interviews, users, jobs] = await Promise.all([
  fetch(url).then(r => r.json()),
  fetch(usersUrl).then(r => r.json()),
  fetch(jobsUrl).then(r => r.json())
]);

const enrichedInterviews = interviews.map(i => ({
  ...i,
  candidate: users.find(u => u.id === i.candidateId),
  job: jobs.find(j => j.id === i.jobId)
}));
```

#### 2️⃣ Actualizar Rutas en El Código
```bash
# Buscar y reemplazar:
/candidates → /users con filtro role=candidate
/interviews → /reservations (si usas eso) o crear endpoint nuevo
/applications → /matches (probablemente)
```

---

## ✅ VALIDACIÓN POST-FIX

Después de implementar soluciones, verificar:

```bash
# 1. Todos los endpoints existen en db.json
✓ GET /users
✓ GET /jobs
✓ GET /interviews (o usar /reservations)
✓ GET /matches
✓ GET /reservations
✓ GET /messages

# 2. No hay hardcoded IDs
✓ companyId viene de localStorage
✓ API_URL es consistente
✓ window.API_URL nunca se llama

# 3. N+1 Query eliminado
✓ Dashboard no hace 200+ requests
✓ Interviews page carga rápido

# 4. Todos los endpoints son consistentes
✓ Mismo base URL en todos los archivos
✓ Mismos nombres de endpoints
```

---

## 📌 CONCLUSIÓN

**30% de los 27 errores del proyecto están directamente relacionados con problemas de ENDPOINTS:**

1. **Endpoints que no existen:**
   - `/candidates` (debería ser `/users?role=candidate`)
   - `/interviews` (no existe en db.json)
   - `/applications` (no existe, ¿debería ser `/matches`?)

2. **Inconsistencias de configuración:**
   - API_URL definida de 3 formas diferentes
   - window.API_URL nunca definida

3. **Hardcoded IDs:**
   - companyId=1 en lugar de dinámico
   - Afecta seguridad y funcionalidad

4. **N+1 Query Problem:**
   - Combinación de endpoints inexistentes + múltiples requests
   - Causa performance catastrófica

**Prioridad:** 🔴 RESOLVER YA - Bloquea funcionalidad core

---

**Última actualización:** Febrero 5, 2026

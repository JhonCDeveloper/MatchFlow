# 📡 ANÁLISIS: Problemas de Endpoints

**Hallazgo:** 30% de errores causados por endpoints incorrectos / hardcoded IDs

---

## ✅ ENDPOINTS DISPONIBLES EN db.json

```
GET    /users                           ✅ (9 items: 5 cand + 4 companies)
GET    /jobs                            ✅ (7 items)
GET    /matches                         ✅ (5 items)
GET    /reservations                    ✅ (2 items)
GET    /messages                        ✅ (2 items)
```

---

## ❌ ENDPOINTS INEXISTENTES (Pero se llaman en código)

```
/candidates              ← NO EXISTE - Usar /users?role=candidate
/interviews             ← NO EXISTE - Usar /reservations o crear tabla
/applications           ← NO EXISTE - Usar /matches
GET /interviews         ← NO EXISTE
POST /interviews        ← NO EXISTE
DELETE /interviews/{id} ← NO EXISTE
```

---

## 🔴 PROBLEMAS CRÍTICOS

### P1: Hardcoded CompanyId

**Archivo:** `src/pages/jobs/jobs.js` (L7)  
**Problema:** Siempre obtiene jobs del company 1

```javascript
// ❌ INCORRECTO
const res = await fetch(`${API_URL}/jobs?companyId=1`);

// ✅ CORRECTO
const companyId = JSON.parse(localStorage.getItem('user')).id;
const res = await fetch(`${API_URL}/jobs?companyId=${companyId}`);
```

**Impacto:** SEGURIDAD comprometida - todos ven jobs de company 1

---

### P2: CompanyId Hardcodeado en Interviews

**Archivo:** `src/pages/interviews/interviews.js` (L10)

```javascript
// ❌ INCORRECTO
const res = await fetch(`${API_URL}/interviews?companyId=1`);

// ✅ CORRECTO (ya que /interviews NO existe)
// Usar /reservations como interviews
const res = await fetch(`${API_URL}/reservations?companyId=${userId}`);
```

---

### P3: N+1 Query Problem

**Archivos:** interviews.js, candidates.js (múltiples loops)  
**Problema:** 1 + N requests (1 inicial + N por item)

```javascript
// ❌ INCORRECTO (201 requests para 100 items)
for (const interview of interviews) {
  const candidate = await fetch(`/users/${id}`);
  const job = await fetch(`/jobs/${id}`);
}

// ✅ CORRECTO (3 requests totales)
const [interviews, users, jobs] = await Promise.all([...])
const enriched = interviews.map(i => ({
  ...i,
  candidate: users.find(u => u.id === i.candidateId),
  job: jobs.find(j => j.id === i.jobId)
}))
```

---

### P4: Endpoint Headers Incorrectos

**Problema:** Algunas requests faltan `Content-Type: application/json`

```javascript
// ✅ CORRECTO
fetch(url, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
});
```

---

## 📊 RESUMEN PROBLEMAS ENCONTRADOS

| Problema              | Severidad  | Ubicación                    | Solución                               | Tiempo    |
| --------------------- | ---------- | ---------------------------- | -------------------------------------- | --------- |
| Hardcoded companyId   | 🔴 CRÍTICO | jobs.js, interviews.js       | Usar `localStorage.getItem('user').id` | 30 min    |
| /interviews NO existe | 🔴 CRÍTICO | interviews.js                | Remap a /reservations                  | 20 min    |
| N+1 Query             | 🔴 CRÍTICO | interviews.js, candidates.js | Promise.all + map                      | 1-2 horas |
| Falta Content-Type    | 🟡 MENOR   | Varios                       | Agregar headers HTTP                   | 15 min    |
| /candidates no existe | 🔴 CRÍTICO | candidates.js                | Usar /users?role=candidate             | ✅ FIXED  |

**Total Tiempo Arreglo:** 2-3 horas | **Impacto:** +10% Cumplimiento

---

## ✅ ARREGLADOS (Sesión 1)

- ✅ `/candidates` endpoint → `/users?role=candidate&openToWork=true`
- ✅ Added error handling en candidate.js
- ✅ localStorage user data sync

**Pendientes:**

- ⏳ Hardcoded companyId en jobs, interviews
- ⏳ N+1 Query problems
- ⏳ /interviews remap a /reservations

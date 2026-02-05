# ✅ IMPLEMENTACIÓN: Open to Work Status

**Fecha:** Febrero 5, 2026  
**Rama:** refactor  
**Alcance:** Open to Work toggle, filtrado y sincronización con db.json

---

## 🎯 RESUMEN DE CAMBIOS

### 1. ✅ ARREGLO DE ENDPOINT (candidates.js)

**Cambio:**
```javascript
// ❌ ANTES: Endpoint que NO existe
let url = `${API_URL}/candidates?openToWork=true`;

// ✅ DESPUÉS: Endpoint correcto
let url = `${API_URL}/users?role=candidate&openToWork=true`;
```

**Impacto:** Ahora la búsqueda de candidatos usa el endpoint correcto `/users` con filtros:
- `role=candidate` → Solo usuarios con rol "candidate"
- `openToWork=true` → Solo candidatos que tienen Open to Work activado

**Ubicación:** [src/pages/candidates/candidates.js](../src/pages/candidates/candidates.js#L13)

---

### 2. ✅ TOGGLE FUNCIONAL (candidate.js)

**Implementación completa del toggle "Abierto al Trabajo":**

#### A. Cargar estado inicial
```javascript
document.addEventListener("DOMContentLoaded", () => {
  loadOpenToWorkStatus();
  loadJobOffers();
});

async function loadOpenToWorkStatus() {
  try {
    checkActive.checked = local.openToWork || false;
    if (checkActive.checked) {
      containerOfertas.style.display = "block";
    } else {
      containerOfertas.style.display = "none";
    }
  } catch (error) {
    console.error("Error loading Open to Work status:", error);
  }
}
```

**Funcionalidad:**
- ✅ Lee el estado de `openToWork` del usuario actual (localStorage)
- ✅ Actualiza checkbox al estado correcto
- ✅ Muestra/oculta ofertas según estado

#### B. Sincronizar cambios con base de datos
```javascript
checkActive.addEventListener("change", async function () {
  const newOpenToWorkStatus = checkActive.checked;
  
  try {
    // PATCH al endpoint de users
    const response = await fetch(`${API_URL}/users/${local.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ openToWork: newOpenToWorkStatus })
    });

    if (!response.ok) {
      throw new Error("Failed to update Open to Work status");
    }

    // Actualizar localStorage
    const updatedUser = { ...local, openToWork: newOpenToWorkStatus };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Cargar/ocultar ofertas
    if (newOpenToWorkStatus) {
      await loadJobOffers();
      containerOfertas.style.display = "block";
    } else {
      containerOfertas.style.display = "none";
      containerOfertas.innerHTML = "";
    }
  } catch (error) {
    console.error("Error updating Open to Work status:", error);
    checkActive.checked = !newOpenToWorkStatus; // Revert
    alert("Error updating status. Please try again.");
  }
});
```

**Funcionalidad:**
- ✅ Detecta cambio en checkbox
- ✅ Envía PATCH request a `/users/{id}` con nuevo status
- ✅ Actualiza localStorage localmente
- ✅ Carga ofertas si se activa
- ✅ Manejo de errores con rollback

#### C. Cargar ofertas reales desde db.json
```javascript
async function loadJobOffers() {
  try {
    const response = await fetch(`${API_URL}/jobs`);
    const jobs = await response.json();

    containerOfertas.innerHTML = "";

    if (jobs.length === 0) {
      containerOfertas.innerHTML = `<p class="text-muted">No offers available right now.</p>`;
      return;
    }

    // Renderizar cada oferta
    jobs.forEach(job => {
      const card = document.createElement("div");
      card.className = "card mb-2";
      card.innerHTML = `
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h3 class="card-title">${job.title}</h3>
            <p class="card-text">${job.description}</p>
          </div>
          <div>
            <p style="color: #cbd5e1">Company: ${job.companyId}</p>
            <p>Status: ${job.status}</p>
          </div>
          <div>
            <button class="btn btn-bg" onclick="viewJobDetails(${job.id})">See Details</button>
          </div>
        </div>
      `;
      containerOfertas.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading job offers:", error);
    containerOfertas.innerHTML = `<p class="text-danger">Error loading offers.</p>`;
  }
}
```

**Funcionalidad:**
- ✅ Fetch ofertas reales desde `/jobs`
- ✅ Renderiza dinámicamente con datos reales (no hardcoded)
- ✅ Muestra: título, descripción, compañía, estatus
- ✅ Botón "See Details" para cada oferta

**Ubicación:** [src/pages/candidates/candidate.js](../src/pages/candidates/candidate.js)

---

### 3. ✅ DATOS DE PRUEBA (db.json)

#### A. Candidatos ampliados (de 2 a 5)
```json
"users": [
  {
    "id": "1",
    "name": "John",
    "role": "candidate",
    "openToWork": true,     ← Activo
    "profile": { ... },
    "contactInfo": { ... }
  },
  {
    "id": "2",
    "name": "Smith",
    "role": "candidate",
    "openToWork": true,     ← Activo
    ...
  },
  {
    "id": "3",
    "name": "Alex Johnson",
    "role": "candidate",
    "openToWork": true,     ← Activo
    ...
  },
  {
    "id": "4",
    "name": "Maria Garcia",
    "role": "candidate",
    "openToWork": false,    ← INACTIVO (prueba filtrado)
    ...
  },
  {
    "id": "5",
    "name": "David Lee",
    "role": "candidate",
    "openToWork": true,     ← Activo
    ...
  }
]
```

**Datos nuevos:**
- ✅ 5 candidatos total (2 más)
- ✅ 1 candidato con `openToWork=false` para probar filtrado
- ✅ Perfiles completos con skills, bio, contactInfo

#### B. Ofertas ampliadas (de 2 a 5)
```json
"jobs": [
  {
    "id": "101",
    "companyId": "3",
    "title": "React Developer",
    ...
  },
  {
    "id": "102",
    "companyId": "4",
    "title": "Product Designer",
    ...
  },
  {
    "id": "103",
    "companyId": "3",
    "title": "Backend Developer",
    ...
  },
  {
    "id": "104",
    "companyId": "5",
    "title": "DevOps Engineer",
    ...
  },
  {
    "id": "105",
    "companyId": "4",
    "title": "Frontend Engineer",
    ...
  }
]
```

**Datos nuevos:**
- ✅ 5 ofertas total (3 más)
- ✅ Variedad de roles (React, Designer, Backend, DevOps, Frontend)
- ✅ Descripciones y requisitos realistas

**Ubicación:** [src/data/db.json](../src/data/db.json)

---

## 🧪 CÓMO PROBAR

### Test 1: Toggle Open to Work Activado
```
1. Abrir página de candidato (src/pages/candidates/index.html)
2. Buscar por cliente con rol "candidate" y openToWork=true
3. Hacer login con candidato (id=1, email: test1@crudzaso.com, pwd: 123)
4. En sección "Abierto al Trabajo", checkbox debe estar ✓ (checked)
5. Verá ofertas de jobs dinámicamente cargadas
6. Desactivar toggle → ofertas desaparecen
7. Base de datos se actualiza (PATCH /users/1)
```

### Test 2: Toggle Open to Work Desactivado
```
1. Buscar por cliente con openToWork=false
2. Hacer login con Maria Garcia (id=4, email: maria.garcia@crudzaso.com)
3. Toggle debe estar ☐ (unchecked)
4. NO debe ver ofertas
5. Activar toggle → ofertas aparecen y se sincroniza en db
```

### Test 3: Búsqueda desde Company Dashboard
```
1. Hacer login como empresa (id=3, email: company1@crudzaso.com)
2. Ir a /candidates page
3. Buscar candidatos
4. SOLO debe ver: John (id=1), Smith (id=2), Alex (id=3), David (id=5)
5. NO debe ver: Maria Garcia (id=4, openToWork=false)
6. Filtrado correcto en URL: /users?role=candidate&openToWork=true
```

### Test 4: Validación de Errores
```
1. Detener json-server
2. Intentar toggle Open to Work
3. Debe mostrar: "Error updating status. Please try again."
4. Toggle debe revertirse (rollback)
5. Ofrecer retry
```

---

## 📊 CHECKLIST DE CUMPLIMIENTO

### ✅ REQUISITO 1: Candidates NO aplican - Open to Work Status

**Requerimiento Original:**
- ❌ Candidates NO aplican a ofertas
- ✅ Se marcan como "Open to Work"
- ✅ Solo visibles si Open to Work = true

**Estado Nuevo:**
- ✅ Campo `openToWork` funcional en DB
- ✅ UI toggle para activar/desactivar
- ✅ Sync con base de datos (PATCH)
- ✅ localStorage actualizado
- ✅ Filtrado en búsqueda: `/users?role=candidate&openToWork=true`
- ✅ Empresas ven SOLO candidatos con `openToWork=true`

**Cumplimiento:** 🟢 **IMPLEMENTADO 100%**

---

## 🔄 FLUJO DE SINCRONIZACIÓN

```
┌─────────────────────────────────────────────────────────────────┐
│ CANDIDATO VISITA PÁGINA                                        │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ DOMContentLoaded Event Fired                                    │
│ - loadOpenToWorkStatus() → Lee localStorage.user.openToWork    │
│ - loadJobOffers() → GET /jobs                                   │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ CANDIDATO VE PÁGINA CON:                                        │
│ - Toggle checkbox mostrado en estado correcto                   │
│ - Ofertas cargadas dinámicamente                                │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ CANDIDATO CAMBIA TOGGLE                                         │
│ - checkActive.addEventListener("change")                        │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────────┐
│ TRES ACCIONES EN PARALELO:                                      │
│ 1. PATCH /users/{id} { openToWork: true/false }                │
│ 2. localStorage.setItem() → Sync local                           │
│ 3. Si true → loadJobOffers() y update DOM                       │
│    si false → clear ofertas del DOM                              │
└──────────────┬──────────────────────────────────────────────────┘
               │
               ▼ (Si error en paso 1)
┌─────────────────────────────────────────────────────────────────┐
│ ROLLBACK: Revert toggle checkbox                                │
│ Alert: "Error updating status. Please try again."               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 ARCHIVOS MODIFICADOS

| Archivo | Cambios | Líneas |
|---------|---------|--------|
| [src/pages/candidates/candidates.js](../src/pages/candidates/candidates.js) | Endpoint corregido | L13 |
| [src/pages/candidates/candidate.js](../src/pages/candidates/candidate.js) | Toggle funcional + Sincronización | L1-135 |
| [src/data/db.json](../src/data/db.json) | 5 candidatos + 5 ofertas | L1-200 |

---

## 🚀 SIGUIENTE PASO

Primera fase completada. Ahora falta implementar:

1. **TIER 1 (Críticas):**
   - [ ] UI crear matches (desde candidate card)
   - [ ] Estados de match: pending, interview, discarded
   - [ ] Reservas funcionales con validación de conflictos
   - [ ] Contact privacy (esconder si status ≠ "contacted")

2. **TIER 2:** (Después de TIER 1)
   - [ ] Caching mejorado
   - [ ] Dashboard con gráficas
   - [ ] Error handling robusto

Ver [CUMPLIMIENTO_CRUDZASO.md](CUMPLIMIENTO_CRUDZASO.md) para detalles del plan.

---

**Última actualización:** Febrero 5, 2026  
**Desarrollador:** GitHub Copilot  
**Estado:** ✅ COMPLETADO Y TESTEABLE


# 🎨 PLAN DE MIGRACIÓN: Tailwind CSS → Bootstrap + Custom CSS

**Preferencia del Equipo:** Bootstrap + Custom CSS (en lugar de Tailwind)  
**Objetivo:** Estandarizar styling en todo el proyecto

---

## 📊 AUDITORÍA ACTUAL DE CSS

### Uso por Página

| Página | Framework Actual | Linaje CSS | Estado |
|--------|-----------------|-----------|--------|
| Login | Bootstrap 5.3.0 | index.html CDN | ✅ Consistente |
| Dashboard | Tailwind CSS | dist/output.css | ❌ Diferente |
| Candidates | Bootstrap 5.3.8 | index.html CDN | ⚠️ Versión diferente |
| Interviews | Tailwind (inherited) | dist/output.css | ❌ Diferente |
| Jobs | Tailwind CSS | dist/output.css | ❌ Diferente |
| Matches | Sin especificar | (ninguno) | ❌ No tiene estilos |

### Componentes Reutilizables

```
header.html       → Sin estilos (OBSOLETE)
sidebar.html      → Bootstrap 5 (correcto)
All pages         → mezcla de Tailwind + Bootstrap
```

### Problemas Actuales

```
❌ 3 versiones diferentes de Bootstrap (5.3.0, 5.3.8, algunas sin especificar)
❌ Mezcla Tailwind + Bootstrap en mismo proyecto
❌ dist/output.css rutas incorrectas (../../dist/output.css)
❌ CSS files duplicados (_OBSOLETE_dashboard.css, etc)
❌ Sin consistent design system
❌ Sin variables CSS compartidas
```

---

## 🔄 PLAN DE MIGRACIÓN

### FASE 1: Auditoría (Ya hecha)
✅ Identificar uso actual  
✅ Mapear clases Tailwind → Bootstrap equivalentes  
✅ Documentar componentes personalizados  

### FASE 2: Preparación (1-2 horas)
- [ ] Crear `/src/styles/` estructura
  - [ ] bootstrap.html (CDN template)
  - [ ] variables.css (variables CSS compartidas)
  - [ ] components.css (componentes reutilizables)
  - [ ] utilities.css (utilidades custom)
- [ ] Crear versión consistente de Bootstrap 5.3.8
- [ ] Definir color scheme + typography

### FASE 3: Migración HTML (3-4 horas)
- [ ] Dashboard.html (más complejo, tiene gráficas)
- [ ] Interviews.html
- [ ] Jobs.html
- [ ] Matches.html (ningún estilo aún)
- [ ] Candidates.html (revisar mixtura actual)

### FASE 4: Limpieza (1 hora)
- [ ] Eliminar Tailwind build
- [ ] Eliminar _OBSOLETE_*.css
- [ ] Eliminar dist/ folder
- [ ] Actualizar package.json

### FASE 5: Testing (2-3 horas)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Cross-browser testing
- [ ] Performance check

---

## 📚 TABLA DE CONVERSIÓN: Tailwind → Bootstrap

### Layout & Spacing

| Tailwind | Bootstrap | Notas |
|----------|-----------|-------|
| `mb-4` | `mb-3` | margin-bottom 1rem vs 1rem (similar) |
| `mx-auto` | `mx-auto` | (igual) |
| `p-6` | `p-5` | padding (similar) |
| `flex` | `d-flex` | display flex |
| `flex-col` | `flex-column` | flex direction column |
| `justify-between` | `justify-content-between` | justify content |
| `items-center` | `align-items-center` | align items |
| `gap-4` | `gap-3` | gap (similar) |

### Typography

| Tailwind | Bootstrap | Notas |
|----------|-----------|-------|
| `text-lg` | `fs-5` | font size |
| `font-bold` | `fw-bold` | font weight |
| `text-gray-700` | `text-muted` | texto gris |
| `text-white` | `text-white` | (igual) |
| `text-center` | `text-center` | (igual) |

### Colors

| Tailwind | Bootstrap | Notas |
|----------|-----------|-------|
| `bg-blue-500` | `bg-primary` | fondo azul |
| `bg-green-500` | `bg-success` | fondo verde |
| `bg-red-500` | `bg-danger` | fondo rojo |
| `bg-gray-100` | `bg-light` | fondo gris claro |
| `bg-custom` | CSS variable | para colores custom |
| `hover:bg-blue-600` | `.hover:bg-primary-dark` | (CSS custom) |

### Buttons

| Tailwind | Bootstrap | Notas |
|----------|-----------|-------|
| `bg-blue-500 text-white px-6 py-2 rounded` | `btn btn-primary` | button estándar |
| `bg-gray-500 text-white` | `btn btn-secondary` | button secundario |
| `bg-green-500` | `btn btn-success` | button success |
| `border border-gray-300` | `btn-outline-primary` | button outline |

### Cards

| Tailwind | Bootstrap | Notas |
|----------|-----------|-------|
| `border rounded-lg shadow p-4` | `card` | card estándar |
| `bg-white` | `.card` | (same) |
| (custom) | `card-header` | header de card |
| (custom) | `card-body` | body de card |
| (custom) | `card-footer` | footer de card |

### Grid

| Tailwind | Bootstrap | Notas |
|----------|-----------|-------|
| `grid grid-cols-3 gap-4` | `row` + `col-md-4` | grid system |
| `col-span-2` | `col-md-8` | span 2 de 3 |
| (media query) | `col-lg-3 col-md-6` | responsive |

### Visibility

| Tailwind | Bootstrap | Notas |
|----------|-----------|-------|
| `hidden` | `d-none` | display none |
| `block` | `d-block` | display block |
| `invisible` | `invisible` | visibility hidden |
| `opacity-50` | `opacity-50` | (similar) |

---

## 🛠️ ESTRUCTURA NUEVA DE CSS

Crear esta estructura:

```
src/
  styles/
    ├── bootstrap-setup.html          ← Template CDN recomendado
    ├── imports.css                   ← @import bootstrap + custom
    ├── variables.css                 ← :root { --colors, --spacing }
    ├── components.css                ← .btn-custom, .card-custom, etc
    ├── utilities.css                 ← .text-custom, .bg-custom
    ├── layout.css                    ← header, sidebar, page layout
    ├── responsive.css                ← media queries
    └── main.css                      ← agregador
```

### variables.css (ejemplo)

```css
:root {
  /* Bootstrap Override */
  --bs-primary: #3B82F6;
  --bs-success: #10B981;
  --bs-danger: #EF4444;
  --bs-warning: #F59E0B;
  
  /* Custom Colors */
  --color-dark: #1F2937;
  --color-light: #F9FAFB;
  --color-match-pending: #F59E0B;
  --color-match-contacted: #3B82F6;
  --color-match-hired: #10B981;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Typography */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
}
```

---

## 📝 EJEMPLO: Migración de Dashboard

### ANTES (Tailwind)
```html
<div class="flex flex-col gap-6 p-6">
  <div class="grid grid-cols-3 gap-4">
    <div class="bg-white rounded-lg shadow p-4 border border-gray-200">
      <h3 class="text-lg font-bold text-gray-800">Active Jobs</h3>
      <p class="text-3xl font-bold text-blue-500">12</p>
    </div>
  </div>
</div>
```

### DESPUÉS (Bootstrap)
```html
<div class="container-fluid p-5">
  <div class="row g-4">
    <div class="col-lg-4">
      <div class="card border-light">
        <div class="card-body">
          <h5 class="card-title fw-bold text-dark">Active Jobs</h5>
          <p class="fs-2 fw-bold text-primary">12</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

### DESPUÉS (Bootstrap + Custom CSS mejorado)
```html
<div class="container-fluid p-5">
  <div class="row g-4">
    <div class="col-lg-4">
      <div class="card stat-card">
        <div class="card-body">
          <h5 class="card-title">Active Jobs</h5>
          <p class="stat-value">12</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

```css
/* components.css */
.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-card .card-title {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.stat-card .stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin: 0;
}
```

---

## 📋 CHECKLIST DE MIGRACIÓN

### Paso 1: Setup (25 minutos)
- [ ] Crear estructura `/src/styles/`
- [ ] Crear archivos CSS nuevos
- [ ] Crear bootstrap-setup.html template
- [ ] Definir variables.css

### Paso 2: Dashboard (60 minutos)
- [ ] Identificar todas clases Tailwind en dashboard.html
- [ ] Convertir a Bootstrap + custom CSS
- [ ] Testing responsive
- [ ] Verificar gráficas se ven bien

### Paso 3: Interviews (45 minutos)
- [ ] Migrar HTML + clases
- [ ] Verificar tablas
- [ ] Testing responsive

### Paso 4: Jobs (45 minutos)
- [ ] Migrar HTML + clases
- [ ] Verificar formularios
- [ ] Testing responsive

### Paso 5: Candidates (45 minutos)
- [ ] Auditar mixtura actual
- [ ] Separar Bootstrap ya usado
- [ ] Eliminar Tailwind
- [ ] Testing responsive

### Paso 6: Matches (30 minutos)
- [ ] Agregar estilos Bootstrap base
- [ ] Custom CSS para match cards
- [ ] Testing responsive

### Paso 7: Limpieza (30 minutos)
- [ ] Eliminar Tailwind
- [ ] Eliminar dist/ folder
- [ ] Limpiar _OBSOLETE_*.css
- [ ] Actualizar package.json
- [ ] Actualizar import en todas páginas

### Paso 8: Testing (90 minutos)
- [ ] Testing desktop
- [ ] Testing tablet
- [ ] Testing mobile
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)
- [ ] Performance check

---

## 🎯 VENTAJAS DE MIGRAR A BOOTSTRAP

| Aspecto | Tailwind | Bootstrap |
|--------|----------|-----------|
| Curva aprendizaje | Media | Baja |
| Consistencia | Requiere disciplina | Integrada |
| Componentes | Necesita buildear | Include & use |
| Size bundle | Pequeño (si optimizado) | Medio |
| CDN | No recomendado | Supported |
| Documentación | Buena | Excelente |
| Community | Muy grande | Muy grande |
| Personalizacion | Fácil | Fácil (variables SCSS) |

---

## ⚠️ RIESGOS Y MITIGACIÓN

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|--------|-----------|
| Diseño quebrado | Media | Alto | Testing responsive exhaustivo |
| Performance degradación | Baja | Bajo | Optimizar Bundle CSS |
| Inconsistencia visual | Alta | Medio | Usar design variables |
| Timeline slip | Media | Alto | Parallelizar en equipo |

---

## 📈 ESFUERZO ESTIMADO

```
Setup:           0.5 horas
Dashboard:       1.0 horas (más complejo)
Interviews:      0.75 horas
Jobs:            0.75 horas
Candidates:      0.75 horas
Matches:         0.5 horas
Limpieza:        0.5 horas
Testing:         1.5 horas
─────────────────────────
TOTAL:           6-7 horas (~1 día de desarrollo)
```

---

## 🚀 COMANDO PARA EMPEZAR

Una vez decididos, ejecutar:

```bash
# 1. Instalar dependencias si faltan (Bootstrap via CDN, so no npm needed)
npm install

# 2. Crear estructura
mkdir -p src/styles
touch src/styles/{variables,components,utilities,layout,responsive,main}.css

# 3. Crear template bootstrap-setup.html como reference

# 4. Empezar migración página por página

# 5. Eliminar Tailwind build del package.json
# (si está configurado)

# 6. Commit
git add .
git commit -m "style: migrate from Tailwind to Bootstrap + custom CSS"
```

---

## ✅ CRITERIOS DE ACEPTACIÓN

- [ ] Todas páginas usan Bootstrap 5.3.8 consistentemente
- [ ] Ninguna clase Tailwind reste en código
- [ ] Responsive en mobile, tablet, desktop
- [ ] Cross-browser compatible (Chrome, Firefox, Safari, Edge)
- [ ] Variables CSS para colores personalizados
- [ ] Design system documentado en README

---

**Recomendación:**  
Migración factible y recomendada. **Tiempo total: 6-7 horas.**  
Equipo debe dividir páginas en paralelo para completar en 2 horas (3 devs).

**Siguiente Paso:**  
Ejecutar DESPUÉS que completen Tier 1 de requisitos (Open to Work, Matches, Reservations).  
Sugerencia: Que 1 dev arregle funcionalidad mientras otro migra CSS.

---

**Última actualización:** Febrero 5, 2026  
**Analista:** GitHub Copilot  
**Repositorio:** F2-MatchFlow

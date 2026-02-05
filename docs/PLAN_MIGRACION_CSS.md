# 🎨 PLAN MIGRACIÓN CSS: Tailwind → Bootstrap

**Estado:** Pendiente | **Estimación:** 6-7 horas distribuidas

---

## 📊 ESTADO ACTUAL

| Página | Framework | Versión | Estado |
|--------|-----------|---------|--------|
| Login | Bootstrap | 5.3.0 | ✅ |
| Candidates | Bootstrap | 5.3.8 | ✅ |
| Dashboard | Tailwind | output.css | ❌ |
| Jobs | Tailwind | output.css | ❌ |
| Interviews | Tailwind | output.css | ❌ |
| Matches | Ninguno | - | ❌ |
| Sidebar | Bootstrap | 5 | ✅ |

**Problemas:**
- 3 versiones Bootstrap diferentes (5.3.0, 5.3.8, etc)
- Mezcla Tailwind + Bootstrap
- Rutas CSS incorrectas
- No hay design system
- 8 archivos _OBSOLETE_*.css PRESERVADOS para esta migración

---

## 🔄 PLAN DE EJECUCIÓN

### FASE 1: Setup (30 min)
```bash
# 1. Standardizar Bootstrap 5.3.8 en TODAS las páginas
# 2. Crear /src/styles/bootstrap-base.html template
# 3. Crear /src/styles/custom.css para variables compartidas
```

### FASE 2: Migración HTML (3-4 horas)
1. **Dashboard** (1.5h) → Más complido, tiene gráficas
2. **Jobs, Interviews** (1h cada) → Similar
3. **Matches** (0.5h) → Sin estilos aún
4. **Candidates** (0.5h) → Revisar mezcla

### FASE 3: Limpieza (30 min)
- Eliminar Tailwind build (`dist/output.css`)
- Eliminar _OBSOLETE_*.css
- Eliminar `tailwind.config.js`
- Actualizar `package.json`

### FASE 4: Testing (1-2 horas)
- Responsive en mobile, tablet, desktop
- Cross-browser check
- Performance

---

## 🔀 TABLA CONVERSIÓN Tailwind → Bootstrap

### Layout & Flex
| Tailwind | Bootstrap | Ejemplo |
|----------|-----------|---------|
| `flex` | `d-flex` | `<div class="d-flex">` |
| `flex-col` | `flex-column` | `<div class="d-flex flex-column">` |
| `justify-center` | `justify-content-center` | `<div class="d-flex justify-content-center">` |
| `items-center` | `align-items-center` | `<div class="d-flex align-items-center">` |
| `gap-4` | `gap-3` | `<div class="d-flex gap-3">` |
| `m-4` | `m-3` | `<div class="m-3">` |
| `p-6` | `p-5` | `<div class="p-5">` |

### Colors & Text
| Tailwind | Bootstrap |
|----------|-----------|
| `text-gray-700` | `text-muted` |
| `bg-blue-500` | `bg-primary` |
| `text-sm` | `fs-6` |
| `font-bold` | `fw-bold` |
| `text-center` | `text-center` |

### Box & Cards
| Tailwind | Bootstrap |
|----------|-----------|
| `rounded-lg` | `rounded-3` |
| `shadow-md` | `shadow-sm` |
| (card styling) | Use `.card` class |

---

## ✅ CHECKLIST MIGRACIÓN

- [ ] Ses 8, Parte 1: Crear template Bootstrap base
- [ ] Ses 8, Parte 2: Migrar Dashboard
- [ ] Ses 8, Parte 3: Migrar Jobs, Interviews, Matches, Candidates
- [ ] Ses 8, Parte 4: Eliminar Tailwind setup
- [ ] Ses 8, Parte 5: Testing responsivo
- [ ] Actualizar documentación con BS classes

**Nota:** Parallelizable con otras sesiones. Hacer cuando tenga CSS files limpios.

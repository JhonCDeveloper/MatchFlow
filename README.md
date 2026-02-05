# MatchFlow

Una plataforma moderna de gestión de candidatos y procesos de selección.

## 📋 Descripción

MatchFlow es una aplicación web diseñada para simplificar y automatizar el proceso de selección de candidatos, proporcionando herramientas intuitivas para empresas que buscan encontrar el talento perfecto.

## 📁 Estructura del Proyecto

```
project-root/
│
├── src/
│   ├── pages/                          # Páginas principales de la aplicación
│   │   ├── login/
│   │   │   ├── index.html             # Página de login
│   │   │   ├── login.js               # Lógica de autenticación
│   │   │   └── login.css              # Estilos de login
│   │   │
│   │   ├── dashboard/
│   │   │   ├── index.html             # Panel de control
│   │   │   ├── dashboard.js           # Lógica del dashboard
│   │   │   └── dashboard.css          # Estilos del dashboard
│   │   │
│   │   ├── candidates/
│   │   │   ├── index.html             # Gestión de candidatos
│   │   │   ├── candidates.js          # Lógica de candidatos
│   │   │   └── candidates.css         # Estilos de candidatos
│   │   │
│   │   ├── interviews/
│   │   │   ├── index.html             # Gestión de entrevistas
│   │   │   ├── interviews.js          # Lógica de entrevistas
│   │   │   └── interviews.css         # Estilos de entrevistas
│   │   │
│   │   ├── jobs/
│   │   │   ├── index.html             # Gestión de ofertas de empleo
│   │   │   ├── jobs.js                # Lógica de empleos
│   │   │   └── jobs.css               # Estilos de empleos
│   │   │
│   │   └── matches/
│   │       ├── index.html             # Resultados de matching
│   │       ├── matches.js             # Lógica de matching
│   │       └── matches.css            # Estilos de matches
│   │
│   ├── components/                    # Componentes reutilizables
│   │   ├── header/
│   │   │   ├── header.html            # Componente de encabezado
│   │   │   ├── header.js              # Lógica del header
│   │   │   └── header.css             # Estilos del header
│   │   │
│   │   └── sidebar/
│   │       ├── sidebar.html           # Barra lateral de navegación
│   │       ├── sidebar.js             # Lógica del sidebar
│   │       └── sidebar.css            # Estilos del sidebar
│   │
│   ├── assets/                        # Recursos de la aplicación
│   │   ├── images/
│   │   │   └── company/               # Logos e imágenes de empresa
│   │   │       └── logo.png
│   │   │
│   │   └── designs/                   # Prototipos y diseños
│   │       ├── CompanyDashboard.png
│   │       ├── Dashboard.png
│   │       ├── LoginView.png
│   │       └── SearchView.png
│   │
│   ├── styles/                        # Estilos globales
│   │   ├── main.css                   # Estilos principales
│   │   ├── tailwind.css               # Configuración de Tailwind
│   │   └── variables.css              # Variables CSS
│   │
│   ├── utils/                         # Funciones utilitarias
│   │   ├── match-logic.js             # Lógica del algoritmo de matching
│   │   └── api.js                     # Funciones de API
│   │
│   └── data/                          # Datos de la aplicación
│       └── db.json                    # Base de datos JSON
│
├── dist/                              # Archivos compilados
│   └── output.css                     # CSS compilado por Tailwind
│
├── public/                            # Archivos públicos estáticos
│   └── favicon.ico                    # Favicon de la aplicación
│
├── node_modules/                      # Dependencias del proyecto
│
├── .gitignore                         # Archivos a ignorar en Git
├── package.json                       # Dependencias y scripts del proyecto
├── package-lock.json                  # Lock file de npm
├── postcss.config.js                  # Configuración de PostCSS
├── tailwind.config.js                 # Configuración de Tailwind CSS
└── README.md                          # Este archivo
```

## 🚀 Características

- 🔐 **Autenticación Segura**: Sistema de login robusto para empresas
- 👥 **Gestión de Candidatos**: Base de datos centralizada de candidatos
- 💼 **Ofertas de Empleo**: Crear y administrar vacantes
- 🎯 **Algoritmo de Matching**: Emparejar candidatos con ofertas automáticamente
- 📅 **Gestión de Entrevistas**: Programar y registrar entrevistas
- 📊 **Dashboard Intuitivo**: Panel de control para seguimiento de procesos

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS
- **Build**: PostCSS
- **Data**: JSON (db.json)
- **Control de Versiones**: Git

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd MatchFlow
```

2. Instala las dependencias:
```bash
npm install
```

3. Compila los estilos (si es necesario):
```bash
npm run build
```

## 🎮 Uso

1. Inicia un servidor local (puedes usar Live Server)
2. Abre `src/pages/login/index.html` en tu navegador
3. Inicia sesión con tus credenciales
4. Accede al dashboard y comienza a gestionar candidatos y ofertas

## 🔄 Desarrollo

Para trabajar en el proyecto:

```bash
# Compilar estilos en modo watch
npm run watch

# Compilar estilos una vez
npm run build
```

## 📝 Notas

- Los datos se almacenan localmente en `src/data/db.json`
- La lógica de matching está en `src/utils/match-logic.js`
- Todos los componentes reutilizables están en `src/components/`

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 👤 Autor

Desarrollado como plataforma de gestión de selección de candidatos.

---

**Última actualización**: Febrero 2026

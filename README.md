# 🗓️ Jasetron — Sistema de Calendarios de Contenido

[![Deploy to GitHub Pages](https://github.com/sombrerorojo7/jasetron-calendarios/actions/workflows/deploy.yml/badge.svg)](https://github.com/sombrerorojo7/jasetron-calendarios/actions/workflows/deploy.yml)
[![Validar HTML](https://github.com/sombrerorojo7/jasetron-calendarios/actions/workflows/validate.yml/badge.svg)](https://github.com/sombrerorojo7/jasetron-calendarios/actions/workflows/validate.yml)

Sistema profesional para gestionar, editar y exportar calendarios de publicaciones en redes sociales (Facebook e Instagram). Incluye automatización completa con GitHub Actions y deploy automático a GitHub Pages.

🌐 **Acceso en vivo:** https://sombrerorojo7.github.io/jasetron-calendarios/

---

## 🚀 Inicio Rápido

| Recurso | URL |
|---|---|
| Dashboard principal | [index.html](https://sombrerorojo7.github.io/jasetron-calendarios/) |
| Editor de calendarios | [panel_jasetron_HORIZONTAL.html](https://sombrerorojo7.github.io/jasetron-calendarios/panel_jasetron_HORIZONTAL.html) |
| Workflows de CI/CD | [GitHub Actions](https://github.com/sombrerorojo7/jasetron-calendarios/actions) |
| Releases | [Versiones](https://github.com/sombrerorojo7/jasetron-calendarios/releases) |

---

## 📁 Estructura del Proyecto

```
jasetron-calendarios/
├── .github/
│   └── workflows/
│       ├── deploy.yml          # Deploy automático a GitHub Pages
│       ├── validate.yml        # Validación de archivos HTML
│       └── release.yml         # Creación de releases manuales
│
├── index.html                  # Dashboard principal (mejorado v2.0)
├── panel_jasetron_HORIZONTAL.html  # Editor principal de calendarios
│
├── proyectos/                  # Archivos .json de proyectos guardados
└── calendarios_finales/        # Calendarios exportados para clientes
```

---

## ⚡ Workflows de GitHub Actions

### 1. `deploy.yml` — Deploy automático

**Disparador:** Cada push a `main` (o manualmente desde Actions)

Publica automáticamente todos los archivos del repositorio en **GitHub Pages**.

```
Push a main → Build → Upload artefacto → Deploy en GitHub Pages
```

**Para activar GitHub Pages por primera vez:**
1. Ve a tu repositorio → **Settings** → **Pages**
2. En *Source*, selecciona **GitHub Actions**
3. Guarda — el siguiente push activará el deploy automáticamente

---

### 2. `validate.yml` — Validación HTML

**Disparador:** Push a `main` o `develop`, o en Pull Requests que modifiquen archivos `.html`

Verifica que los archivos HTML sean válidos y genera un reporte de tamaños en el resumen del workflow.

```
Push con .html → Instalar html-validate → Validar archivos → Reporte de tamaños
```

El reporte aparece en la pestaña **Summary** de cada ejecución en Actions.

---

### 3. `release.yml` — Crear Release

**Disparador:** Manual desde Actions

Crea una versión etiquetada del sistema con inventario automático de archivos.

**Cómo usar:**
1. Ve a **Actions** → **📦 Crear Release**
2. Clic en **Run workflow**
3. Ingresa la versión (ej: `v1.2.0`) y notas opcionales
4. Ejecutar — el workflow crea el tag y la release automáticamente

---

## 💡 Cómo Usar el Sistema

### Crear un nuevo calendario

1. Abre el [Editor](https://sombrerorojo7.github.io/jasetron-calendarios/panel_jasetron_HORIZONTAL.html)
2. Completa las publicaciones de la semana (Facebook e Instagram)
3. Arrastra publicaciones entre días con **Drag & Drop**
4. Clic en **💾 Guardar** → descarga un archivo `.json`
5. Sube el `.json` a la carpeta `proyectos/` en el repositorio

### Continuar un proyecto guardado

1. Abre el Editor
2. Clic en **📂 Cargar**
3. Selecciona tu archivo `.json` de la carpeta `proyectos/`
4. Continúa editando

### Exportar calendario para el cliente

1. Cuando el calendario esté listo, clic en **📥 Exportar calendario**
2. Se descarga un archivo `.html` autocontenido
3. Súbelo a la carpeta `calendarios_finales/` del repositorio
4. Comparte el enlace de GitHub Pages con el cliente

---

## ✨ Características

- **Drag & Drop** tipo Kanban entre semanas y días
- **Guardar/Cargar** proyectos en formato JSON estándar
- **Imágenes personalizadas** cargadas desde la computadora
- **Exportación HTML** autocontenida, sin dependencias
- **Sin instalación** — funciona directamente en el navegador
- **Deploy automático** — cualquier cambio en `main` se publica al instante
- **Validación continua** — los HTML se verifican en cada push
- **Releases versionadas** — historial de versiones con inventario automático

---

## 🛠️ Desarrollo

### Hacer cambios y desplegar

```bash
# Clonar el repositorio
git clone https://github.com/sombrerorojo7/jasetron-calendarios.git

# Hacer cambios en los archivos...

# Commit y push → el deploy se activa automáticamente
git add .
git commit -m "feat: descripción del cambio"
git push origin main
```

El workflow `deploy.yml` se ejecuta automáticamente y la nueva versión estará en vivo en ~2 minutos.

### Ver estado de los workflows

Ve a: https://github.com/sombrerorojo7/jasetron-calendarios/actions

---

## 📲 Contacto

**Jasetron Seguridad**
25 años protegiendo Cuenca · 📞 0967793615

---

*Sistema desarrollado con Claude AI · Automatización por GitHub Actions*

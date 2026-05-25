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
2. Importa el CSV desde **📊 Importar CSV** o completa las publicaciones manualmente
3. Carga las imágenes con **🖼️ Cargar imágenes**; quedan guardadas dentro del JSON/HTML como datos del navegador
4. Clic en **💾 Guardar** → descarga un archivo `.json`
5. Publica el archivo en el repo con `node scripts/publicar-calendario.js` cuando ya tengas tambien el HTML exportado

### Continuar un proyecto guardado

1. Abre el Editor
2. Clic en **📂 Cargar**
3. Selecciona tu archivo `.json` descargado desde `proyectos/`
4. Continúa editando

### Exportar calendario para el cliente

1. Cuando el calendario esté listo, clic en **📥 Exportar calendario**
2. Se descarga un archivo `.html` autocontenido
3. Ejecuta `node scripts/publicar-calendario.js` desde el repo para copiar el JSON a `proyectos/`, el HTML a `calendarios_finales/` y actualizar las listas
4. Haz commit/push y comparte el enlace de GitHub Pages con el cliente

> Flujo recomendado: trabaja desde GitHub Pages o desde un servidor local (`http://localhost`), no abriendo el editor con `file://`. El editor usa APIs del navegador para leer CSV/JSON/imágenes y descarga los archivos generados sin depender de un servidor propio.

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

### Publicar lo descargado en las carpetas del repo

Despues de guardar el JSON y exportar el HTML desde el navegador, corre:

```bash
node scripts/publicar-calendario.js
```

El script busca en `~/Downloads` el ultimo par `calendario_*.json` y `calendario_*.html`, valida que no esten vacios, los copia a `proyectos/` y `calendarios_finales/`, y actualiza los `manifest.json` para que aparezcan en los paneles.

Tambien puedes indicar el nombre base:

```bash
node scripts/publicar-calendario.js calendario_jasetron_seguridad_mayo_junio_2026
```

### Probar el editor sin dependencias

```bash
node scripts/smoke-editor.js
```

Este smoke test simula importar CSV, cargar una imagen, guardar JSON, exportar HTML y valida que `file://` muestre aviso en vez de intentar escribir archivos locales.

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

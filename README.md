# Fracking en Colombia: Lo Que el Mapa No Muestra

Sitio web de análisis científico sobre fracking en Colombia.  
**Autor:** David Serrano · Investigador, Texas Tech University

## 🚀 Despliegue en GitHub Pages (5 minutos)

### Paso 1 — Crear repositorio en GitHub
1. Ve a [github.com](https://github.com) → botón verde **New**
2. Nombre del repositorio: `fracking-colombia` (o el que prefieras)
3. Selecciona **Public**
4. **NO** marques "Add README" — ya lo tienes
5. Click **Create repository**

### Paso 2 — Subir los archivos
En la página del repositorio vacío, elige **"uploading an existing file"** y sube toda la carpeta con esta estructura:

```
fracking-colombia/
├── index.html
├── README.md
├── css/
│   └── style.css
├── js/
│   └── main.js
└── img/
    └── mapa-fracking-colombia.png
```

### Paso 3 — Activar GitHub Pages
1. Ve a **Settings** del repositorio
2. En el menú lateral: **Pages**
3. En "Source" → selecciona **Deploy from a branch**
4. Branch: **main** · Folder: **/ (root)**
5. Click **Save**

⏱ En 1–2 minutos tu sitio estará en:  
`https://TU_USUARIO.github.io/fracking-colombia/`

---

## 📁 Estructura del proyecto

| Archivo | Descripción |
|---------|-------------|
| `index.html` | Página principal completa |
| `css/style.css` | Todo el diseño visual |
| `js/main.js` | Animaciones y comportamiento |
| `img/mapa-fracking-colombia.png` | Mapa ANH/ANLA 2016 |

## 🗺 Para agregar más mapas e imágenes

Coloca tus imágenes en la carpeta `img/` y referencialas en el HTML así:
```html
<img src="img/nombre-del-archivo.png" alt="descripción">
```

## ✏️ Para editar el contenido

Abre `index.html` en cualquier editor de texto (Notepad, VS Code, etc.). Cada sección está claramente comentada:
- `<!-- SECTION 1: AGUA -->`
- `<!-- SECTION 2: EL MAPA -->`
- `<!-- SECTION 3: ECOSISTEMAS -->`
- etc.

## 📊 Para agregar datos o visualizaciones futuras

El sitio está preparado para recibir:
- Más imágenes en `img/`
- Mapas interactivos (Leaflet.js) añadiendo el script en `index.html`
- Gráficos de datos con Chart.js

## Fuentes principales

- ANH/ANLA — Mapa de Yacimientos No Convencionales (2016)
- SGC — Red Sísmica Colombia / Sismicidad VMM 2014–2017
- Climate Tracker LATAM — Colombia fracking (Enero 2026)
- Texas Monthly — Permian Basin water (Agosto 2024)
- NRDC — Fracking wastewater disposal methods (2024)
- E&E News — EPA rollbacks 2025

---
*Sitio creado con HTML/CSS/JS puro — sin dependencias, carga rápida, funciona en cualquier hosting.*

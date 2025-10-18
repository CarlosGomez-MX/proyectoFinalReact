# 🧩 proyectoReact

> Aplicación de tareas construida en React con Context + Reducer, Router, persistencia en localStorage, pruebas con Jest + RTL y mejoras de accesibilidad (a11y).

## 1) Descripción
CRUD de tareas con categorías personalizadas y fecha de vencimiento; filtros (todas/pendientes/completadas), búsqueda, Router y persistencia.

## 2) Instalación
    npm install
    npm start

## 3) Scripts
    npm start
    npm test
    npm run build

## 4) Testing
Reducer (AppContext), Header (contador), flujo crear→editar→filtrar→borrar (Jest + React Testing Library).

## 5) Accesibilidad
Skip link, landmarks (<main id="main">), role="status", aria-live, formularios con aria-invalid/aria-describedby, tabs con role="tablist" y navegación por teclado, :focus-visible, prefers-reduced-motion.

## 6) Estructura
    src/components/*, src/context/*, src/pages/*, src/routes/*, src/utils/*, src/__tests__/*

## 7) Rutas
/  •  /new  •  /edit/:id  •  *

## 8) Persistencia
localStorage (clave por defecto: todoapp.v1.state)

## 9) Deploy (Netlify)
Build: npm run build
Publish dir: build
public/_redirects:  /* /index.html 200

## 10) Documentación
Ver docs/Guia-Completa-ProyectoReact.md

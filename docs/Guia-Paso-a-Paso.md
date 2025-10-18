# 📘 Guía Completa del Proyecto React

Proyecto final del seminario de React. Aplicación de tareas con Context + Reducer, React Router, localStorage, pruebas con Jest y accesibilidad (a11y).


---

## 🎯 Objetivo

Desarrollar una aplicación de lista de tareas que permita crear, editar, filtrar y eliminar tareas, con persistencia local y buenas prácticas de arquitectura, estado global y accesibilidad.

---

## 🧩 1. Estructura general del proyecto

La app se construyó con Create React App (CRA).

Estructura de carpetas:

    proyectoReact/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── routes/
    │   ├── utils/
    │   ├── __tests__/
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── index.css
    ├── public/
    │   └── index.html
    ├── package.json
    └── README.md

---

## ⚙️ 2. Flujo de la aplicación

1. Inicio (/) — muestra las tareas existentes.
2. Nueva tarea (/new) — formulario para crear una nueva.
3. Editar (/edit/:id) — formulario para modificar una existente.
4. 404 (*) — página mostrada si la ruta no existe.

---

## 🧠 3. Estado Global: Context + Reducer

Archivo principal: src/context/AppContext.jsx

### 3.1. Estado inicial

    const initialState = {
      tasks: [],
      filter: 'all',
      search: '',
      loaded: false,
      sections: ['General'],
      sectionFilter: 'all'
    };

### 3.2. Reducer

El reducer maneja acciones que modifican el estado:

- LOAD_FROM_STORAGE → carga las tareas guardadas en localStorage.
- ADD_TASK → agrega una nueva tarea.
- UPDATE_TASK → modifica una existente.
- DELETE_TASK → elimina una tarea por id.
- TOGGLE_TASK → alterna entre completada/pendiente.
- SET_FILTER → cambia el filtro activo (all, active, completed).
- SET_SEARCH → aplica un término de búsqueda.
- ADD_SECTION → agrega una categoría personalizada.
- SET_SECTION_FILTER → filtra por sección específica.

### 3.3. Persistencia automática

Dentro de AppProvider:

    useEffect(() => {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: loadTasks() });
    }, []);

    useEffect(() => {
      if (state.loaded) saveTasks(state.tasks);
    }, [state.tasks, state.loaded]);

Cada cambio en las tareas se guarda automáticamente en localStorage.

---

## 📦 4. Utilidad de almacenamiento

Archivo: src/utils/storage.js

    const KEY = 'todoapp.v1.state';

    export function loadTasks() {
      try {
        const data = JSON.parse(localStorage.getItem(KEY) || '[]');
        return Array.isArray(data) ? data : [];
      } catch {
        return [];
      }
    }

    export function saveTasks(tasks) {
      localStorage.setItem(KEY, JSON.stringify(tasks));
    }

---

## 🧭 5. Rutas de la aplicación

Archivo: src/routes/AppRoutes.jsx

Usa BrowserRouter, Routes y Route de React Router.
Rutas definidas:

    / → TaskListPage
    /new → TaskFormPage
    /edit/:id → TaskFormPage (modo edición)
    * → NotFoundPage

---

## 🧱 6. Componentes principales

### 6.1. Header
Muestra el título del proyecto y el contador de tareas pendientes.
Tiene atributos role="status" y aria-live="polite" para accesibilidad.

### 6.2. TaskList
Recorre las tareas visibles (useVisibleTasks) y muestra cada TaskItem.
Incluye: filtros (todas, pendientes, completadas), filtro por categoría y campo de búsqueda.

### 6.3. TaskItem
Renderiza:
- Checkbox para completar.
- Título.
- Sección (badge).
- Fecha de vencimiento (si existe).
- Botones “Editar” y “Borrar”.

Orden de tareas:
1) Con fecha de vencimiento (más próximas primero).
2) Sin fecha, por creación descendente.

### 6.4. TaskFormPage
Formulario controlado con validaciones:
- Título obligatorio.
- Notas opcional.
- Fecha de vencimiento opcional.
- Selector de categoría (elegir existente o crear nueva).

Validación UX:
- Si no se elige categoría, muestra alerta (role="alert").
- Si hay error de validación, los campos usan aria-invalid="true".

### 6.5. NotFoundPage
Página simple con mensaje de error y botón “Volver al inicio”.

---

## 🎨 7. Estilos

Sistema de estilos:
- CSS Modules (Componente.module.css)
- Paleta base (ejemplo): Primario #2563EB, Hover #1E40AF, Éxito #16A34A, Peligro #DC2626, Texto #0F172A, Fondo #F8FAFC.
- Fuente: Inter, system-ui, sans-serif.
- Layout máx 960px, centrado.
- Botones con bordes redondeados y sombras suaves.
- Micro-animaciones bajo prefers-reduced-motion.

---

## ♿ 8. Accesibilidad (a11y)

Implementaciones clave:

| Elemento | Mejora aplicada |
|-----------|-----------------|
| Skip Link | “Saltar al contenido” visible al enfocar. |
| Landmarks | <header> y <main id="main">. |
| Contador | aria-live="polite" para avisos de cambio. |
| Formularios | aria-invalid, aria-describedby, role="alert". |
| Tabs | role="tablist", navegación por teclado ←/→. |
| Foco | :focus-visible global definido en CSS. |
| Animaciones | Condicionadas con prefers-reduced-motion. |

---

## 🧪 9. Pruebas unitarias

Librerías:
- Jest
- React Testing Library
- @testing-library/jest-dom

Archivo de setup: src/setupTests.js
Incluye import de @testing-library/jest-dom y silencios controlados para warnings de React Router.

Pruebas incluidas:
1) Reducer (AppContext.reducer.test.js) — Acciones básicas.
2) Header (Header.test.jsx) — Contador de pendientes.
3) Flujo (flow.create-edit-filter-delete.test.jsx) — Crear → editar → filtrar → borrar.

---

## 🧰 10. Scripts útiles

    npm start      # Ejecuta el servidor de desarrollo
    npm test       # Corre los tests con Jest
    npm run build  # Genera el build de producción

---

## 🌐 11. Despliegue en Netlify

1) Subir el proyecto a GitHub.
2) En Netlify, crear sitio “From Git”.
3) Build command: npm run build
4) Publish directory: build
5) En public/_redirects, incluir:

    /* /index.html 200

Esto permite que las rutas del router funcionen directamente.

---

## 🧩 12. Mejores prácticas aplicadas

- Estado global centralizado.
- Persistencia automática.
- Código desacoplado por componentes.
- Reutilización de hooks.
- Validaciones UX amigables.
- Accesibilidad (a11y).
- Testing con casos reales de flujo.
- Estilos modulares y consistentes.

---

## 📄 13. Créditos y licencia

Desarrollado por Carlos Gómez.
Proyecto educativo para Seminario React (2025).

Licencia: uso académico / educativo.

---


import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadTasks, saveTasks } from '../utils/storage';

const initialState = {
  tasks: [],
  filter: 'all',        // 'all' | 'active' | 'completed'
  search: '',
  loaded: false,
  sections: ['General'], // catálogo inicial; puedes quitar "General" si no la quieres disponible
  sectionFilter: 'all',  // 'all' o nombre de sección
};

// Generador de IDs sin usar globalThis (compatible con CRA + ESLint)
function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

// Agrega una sección al catálogo si viene con nombre no vacío (sin forzar "General")
function ensureSectionList(sections, name) {
  const clean = (name || '').trim();
  if (!clean) return sections;                  // si está vacía, no cambia el catálogo
  return sections.includes(clean) ? sections : [...sections, clean];
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_FROM_STORAGE': {
      // Normaliza tareas antiguas que no tenían sección => usa "General" solo para compatibilidad histórica
      const tasks = action.payload
        .map(t => ({ ...t, section: t.section ?? 'General' }))
        .sort((a, b) => b.createdAt - a.createdAt);

      // Reconstruye catálogo de secciones a partir de las tareas
      const sectionsFromTasks = Array.from(new Set(tasks.map(t => t.section))).filter(Boolean);
      const sections = Array.from(new Set(['General', ...state.sections, ...sectionsFromTasks]));
      return { ...state, tasks, sections, loaded: true };
    }

    case 'ADD_TASK': {
      const now = Date.now();
      const title = (action.payload.title || '').trim();
      const notes = (action.payload.notes || '').trim();
      const dueDate = action.payload.dueDate || undefined;
      const section = (action.payload.section || '').trim();

      // Seguridad: si no hay sección (el form debería evitarlo), no agregamos
      if (!section) {
        console.warn('[ADD_TASK] Se intentó crear una tarea sin sección. Ignorada.');
        return state;
      }

      const newTask = {
        id: uuid(),
        title,
        notes,
        completed: false,
        createdAt: now,
        updatedAt: now,
        dueDate,
        section, // -> no se fuerza "General" aquí
      };

      const sections = ensureSectionList(state.sections, section);
      return { ...state, sections, tasks: [newTask, ...state.tasks] };
    }

    case 'UPDATE_TASK': {
      const { id, title, notes, dueDate, section } = action.payload;
      const cleanSection = (section ?? '').trim(); // en edición, puede llegar vacío = conserva la actual
      const sections = ensureSectionList(state.sections, cleanSection);

      return {
        ...state,
        sections,
        tasks: state.tasks.map(t =>
          t.id === id
            ? {
                ...t,
                title: (title || '').trim(),
                notes: (notes || '').trim(),
                dueDate: dueDate || undefined,
                // en edición: si no viene sección nueva, deja la anterior; si ninguna, cae a "General" por seguridad
                section: cleanSection || t.section || 'General',
                updatedAt: Date.now(),
              }
            : t
        ),
      };
    }

    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload.id) };

    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload.id
            ? { ...t, completed: !t.completed, updatedAt: Date.now() }
            : t
        ),
      };

    case 'SET_FILTER':
      return { ...state, filter: action.payload.filter };

    case 'SET_SEARCH':
      return { ...state, search: action.payload.search };

    case 'ADD_SECTION': {
      const name = (action.payload.name || '').trim();
      if (!name || state.sections.includes(name)) return state;
      return { ...state, sections: [...state.sections, name] };
    }

    case 'SET_SECTION_FILTER':
      return { ...state, sectionFilter: action.payload.section };

    default:
      return state;
  }
}

const AppStateContext = createContext(undefined);
const AppDispatchContext = createContext(undefined);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Carga inicial desde localStorage
  useEffect(() => {
    const tasks = loadTasks();
    dispatch({ type: 'LOAD_FROM_STORAGE', payload: tasks });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persistencia cuando cambian las tareas
  useEffect(() => {
    if (state.loaded) saveTasks(state.tasks);
  }, [state.tasks, state.loaded]);

  const value = useMemo(() => state, [state]);

  return (
    <AppStateContext.Provider value={value}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider');
  return ctx;
}

// Aplica filtros/búsqueda y ordena: primero con dueDate (asc), luego sin dueDate por creación desc
export function useVisibleTasks() {
  const { tasks, filter, search, sectionFilter } = useAppState();
  const term = search.toLowerCase().trim();

  return React.useMemo(() => {
    let filtered = tasks;

    if (filter === 'active') filtered = filtered.filter(t => !t.completed);
    if (filter === 'completed') filtered = filtered.filter(t => t.completed);

    if (sectionFilter !== 'all') filtered = filtered.filter(t => t.section === sectionFilter);

    if (term) {
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(term) || (t.notes || '').toLowerCase().includes(term)
      );
    }

    const withDue = filtered
      .filter(t => t.dueDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const withoutDue = filtered
      .filter(t => !t.dueDate)
      .sort((a, b) => b.createdAt - a.createdAt);

    return [...withDue, ...withoutDue];
  }, [tasks, filter, term, sectionFilter]);
}

export { reducer, initialState };

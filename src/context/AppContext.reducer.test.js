// src/context/AppContext.reducer.test.js
import { reducer, initialState } from './AppContext';

// Helper para construir un estado base válido para pruebas
function makeState(stub = {}) {
  return { ...initialState, loaded: true, ...stub };
}

test('ADD_TASK requiere sección y agrega al catálogo de secciones', () => {
  // Silencia el warning esperado cuando falta la sección (para dejar la consola limpia)
  const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const state0 = makeState();

  // Intento SIN sección => el reducer debe ignorar (no agrega tarea)
  const noSection = reducer(state0, { type: 'ADD_TASK', payload: { title: 'Tarea sin sección' } });
  expect(noSection.tasks).toHaveLength(0);

  // Con sección nueva => agrega tarea y también agrega la sección al catálogo
  const withSection = reducer(state0, {
    type: 'ADD_TASK',
    payload: { title: 'Tarea A', section: 'Trabajo', notes: 'x', dueDate: '2030-01-01' },
  });

  expect(withSection.tasks).toHaveLength(1);
  expect(withSection.sections).toContain('Trabajo');
  expect(withSection.tasks[0]).toMatchObject({
    title: 'Tarea A',
    section: 'Trabajo',
    notes: 'x',
    dueDate: '2030-01-01',
    completed: false,
  });

  warnSpy.mockRestore();
});

test('TOGGLE_TASK alterna el campo completed', () => {
  const state0 = makeState({
    tasks: [
      { id: '1', title: 'X', completed: false, createdAt: 1, updatedAt: 1, section: 'General' },
    ],
  });

  const state1 = reducer(state0, { type: 'TOGGLE_TASK', payload: { id: '1' } });
  expect(state1.tasks[0].completed).toBe(true);

  const state2 = reducer(state1, { type: 'TOGGLE_TASK', payload: { id: '1' } });
  expect(state2.tasks[0].completed).toBe(false);
});

test('UPDATE_TASK actualiza título, notas, fecha y sección, y agrega sección al catálogo si es nueva', () => {
  const state0 = makeState({
    tasks: [
      { id: '1', title: 'Antes', notes: '', completed: false, createdAt: 1, updatedAt: 1, section: 'General' },
    ],
    sections: ['General'],
  });

  const state1 = reducer(state0, {
    type: 'UPDATE_TASK',
    payload: { id: '1', title: 'Después', notes: 'n', dueDate: '2030-01-02', section: 'Personal' },
  });

  expect(state1.tasks[0]).toMatchObject({
    title: 'Después',
    notes: 'n',
    dueDate: '2030-01-02',
    section: 'Personal',
  });
  expect(state1.sections).toContain('Personal');
});

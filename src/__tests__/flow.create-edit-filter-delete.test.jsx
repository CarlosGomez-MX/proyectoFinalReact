import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import App from '../App'; // App ya incluye <BrowserRouter />

// Silenciar warnings ruidosos de React Router v7 flags en este suite
let warnSpy;
beforeAll(() => {
  warnSpy = jest.spyOn(console, 'warn').mockImplementation((msg, ...rest) => {
    const text = String(msg || '');
    if (text.includes('React Router Future Flag Warning')) return; // ignora esos
  });
});
afterAll(() => {
  warnSpy?.mockRestore();
});

beforeEach(() => {
  // Mock simple de localStorage para no depender del navegador real
  const store = {};
  jest.spyOn(window.localStorage.__proto__, 'getItem').mockImplementation(k => store[k] || null);
  jest.spyOn(window.localStorage.__proto__, 'setItem').mockImplementation((k, v) => { store[k] = v; });
  jest.spyOn(window.localStorage.__proto__, 'removeItem').mockImplementation(k => delete store[k]);

  // Evitar diálogo real en borrar
  jest.spyOn(window, 'confirm').mockImplementation(() => true);
});
afterEach(() => {
  jest.restoreAllMocks();
});

test('crear → listar → editar → filtrar → borrar', async () => {
  render(<App />);

  // Ir a crear
  const addBtn = screen.getByRole('link', { name: /\+ nueva tarea/i });
  await user.click(addBtn);

  // Completar formulario
  await user.type(screen.getByLabelText(/título/i), 'Preparar demo');
  await user.type(screen.getByLabelText(/notas/i), 'llevar slides');
  await user.type(screen.getByLabelText(/fecha de vencimiento/i), '2030-01-01');

  // Elegir categoría (select sin label asociado; usamos role 'combobox')
  const categoriaSelect = screen.getByRole('combobox');
  await user.selectOptions(categoriaSelect, 'General');

  // Guardar
  await user.click(screen.getByRole('button', { name: /guardar/i }));

  // Esperar a que se renderice la lista con la tarea creada
  expect(await screen.findByText(/preparar demo/i)).toBeInTheDocument();

  // Editar
  // Editar
const editLink = screen.getByRole('link', { name: /editar/i });
await user.click(editLink);

const notas = screen.getByLabelText(/notas/i);
await user.clear(notas);
await user.type(notas, 'llevar slides y demo en vivo');

// Guardar (vuelve a la lista)
await user.click(screen.getByRole('button', { name: /guardar/i }));

// Las notas no se muestran en la lista; reabrimos edición para verificarlas
const editLink2 = screen.getByRole('link', { name: /editar/i });
await user.click(editLink2);

const notas2 = screen.getByLabelText(/notas/i);
expect(notas2).toHaveValue('llevar slides y demo en vivo');

// Guardar o cancelar para regresar a la lista (opcional)
await user.click(screen.getByRole('button', { name: /guardar/i }));

  // Filtrar Pendientes
  await user.click(screen.getByRole('tab', { name: /pendientes/i }));
  expect(screen.getByText(/preparar demo/i)).toBeInTheDocument();

  // Completar (el aria-label cambia según estado; usamos el checkbox sin nombre)
  const checkbox = screen.getByRole('checkbox');
  await user.click(checkbox);

  // Filtrar Completadas
  await user.click(screen.getByRole('tab', { name: /completadas/i }));
  expect(screen.getByText(/preparar demo/i)).toBeInTheDocument();

  // Borrar
  const deleteBtn = screen.getByRole('button', { name: /borrar/i });
  await user.click(deleteBtn);
  await waitFor(() => {
    expect(screen.queryByText(/preparar demo/i)).not.toBeInTheDocument();
  });
});

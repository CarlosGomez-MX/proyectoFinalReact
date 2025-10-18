import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // ← contexto de Router para Link
import Header from './Header';
import { AppProvider } from '../../context/AppContext';

test('muestra contador de pendientes', () => {
  render(
    <AppProvider>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </AppProvider>
  );

  // Por defecto no hay tareas, debería mostrar "0 pendientes"
  const badge = screen.getByText(/pendientes/i);
  expect(badge.textContent).toMatch(/0/);
});

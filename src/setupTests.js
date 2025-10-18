import '@testing-library/jest-dom';

// (Opcional) silenciar futuros warnings de React Router v7 para mantener limpias las pruebas
const originalWarn = console.warn;
console.warn = (msg, ...rest) => {
  const text = String(msg || '');
  if (text.includes('React Router Future Flag Warning')) return;
  return originalWarn(msg, ...rest);
};

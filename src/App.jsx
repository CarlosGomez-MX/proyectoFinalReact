import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header/Header';
import { AppProvider } from './context/AppContext';
import PageTransition from './components/PageTransition/PageTransition'; // ← nuevo wrapper de transición

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Header />
        {/* Transición suave entre rutas (respeta prefers-reduced-motion) */}
        <PageTransition>
          <AppRoutes />
        </PageTransition>
      </BrowserRouter>
    </AppProvider>
  );
}

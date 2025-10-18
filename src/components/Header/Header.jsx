import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppContext';
import logo from '../../assets/logo.png'; // ← tu logo aquí

export default function Header(){
  const { tasks } = useAppState();
  const pending = tasks.filter(t => !t.completed).length;

  return (
    <header className={styles.header}>
      {/* Skip link para accesibilidad por teclado */}
      <a href="#main" className={styles.skip}>Saltar al contenido</a>

      <div className="container">
        <div className={styles.row}>
          {/* Marca con logo a la izquierda y nombre del proyecto */}
          <Link to="/" className={styles.brand}>
            <img
              src={logo}
              alt="Logo del proyecto"
              className={styles.logo}
              width="28"
              height="28"
              decoding="async"
            />
            <span className={styles.brandText}>proyectoReact</span>
          </Link>

          <span
            className="badge"
            role="status"
            aria-live="polite"
            aria-label={`Tareas pendientes: ${pending}`}
          >
            {pending} pendientes
          </span>
        </div>
      </div>
    </header>
  );
}

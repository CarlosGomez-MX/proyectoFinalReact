import { useEffect, useRef } from 'react';
import styles from './PageTransition.module.css';

/**
 * Envuelve el contenido de cada ruta y aplica una transición de aparición.
 * No usa libs externas. Respeta prefers-reduced-motion en CSS.
 */
export default function PageTransition({ children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Re-dispara la animación cuando cambia el contenido
    el.classList.remove(styles.enter);
    // Forzar reflow para reiniciar animación
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight; 
    el.classList.add(styles.enter);
  }, [children]);

  return (
    <div ref={ref} className={styles.wrapper}>
      {children}
    </div>
  );
}

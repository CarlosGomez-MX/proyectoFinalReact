import styles from './TaskFilters.module.css';
import { useAppDispatch, useAppState } from '../../context/AppContext';

const options = [
  { key: 'all', label: 'Todas' },
  { key: 'active', label: 'Pendientes' },
  { key: 'completed', label: 'Completadas' },
];

export default function TaskFilters() {
  const { filter } = useAppState();
  const dispatch = useAppDispatch();

  const index = options.findIndex(o => o.key === filter);
  function focusTab(idx) {
    const btns = document.querySelectorAll('[role="tab"]');
    if (btns[idx]) btns[idx].focus();
  }

  function onKeyDown(e) {
    if (e.key === 'ArrowRight') {
      const next = (index + 1) % options.length;
      dispatch({ type: 'SET_FILTER', payload: { filter: options[next].key } });
      focusTab(next);
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft') {
      const prev = (index - 1 + options.length) % options.length;
      dispatch({ type: 'SET_FILTER', payload: { filter: options[prev].key } });
      focusTab(prev);
      e.preventDefault();
    }
  }

  return (
    <div className={styles.group} role="tablist" aria-label="Filtros de tareas">
      {options.map((o, i) => (
        <button
          key={o.key}
          role="tab"
          aria-selected={filter === o.key}
          className={filter === o.key ? styles.btnActive : styles.btn}
          onClick={() => dispatch({ type: 'SET_FILTER', payload: { filter: o.key } })}
          onKeyDown={onKeyDown}
          tabIndex={filter === o.key ? 0 : -1}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// Formulario de crear/editar tareas con mejoras de accesibilidad:
// - <main id="main"> como landmark
// - role="alert" para errores y aria-describedby/aria-invalid en campos
// - labels asociadas con htmlFor/id

import styles from './TaskFormPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../../context/AppContext';
import { useEffect, useMemo, useState } from 'react';

export default function TaskFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { tasks, sections } = useAppState();

  const current = useMemo(() => tasks.find(t => t.id === id), [tasks, id]);

  // --- estado local del formulario ---
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  // modo de categoría: 'existing' (seleccionar) | 'new' (crear)
  const [categoryMode, setCategoryMode] = useState('existing');
  const [existingSection, setExistingSection] = useState(''); // vacío obliga a elegir
  const [newSection, setNewSection] = useState('');

  // mensaje de error simple
  const [error, setError] = useState('');
  const errorId = 'formError';

  useEffect(() => {
    if (isEdit) {
      if (!current) {
        navigate('/');
        return;
      }
      setTitle(current.title);
      setNotes(current.notes || '');
      setDueDate(current.dueDate || '');
      // en edición: precargar la sección actual como existente
      setCategoryMode('existing');
      setExistingSection(current.section || '');
      setNewSection('');
    } else {
      // en creación: forzar a elegir (no “General” por defecto)
      setCategoryMode('existing');
      setExistingSection(''); // value vacío => “Debes elegir”
      setNewSection('');
    }
  }, [isEdit, current, navigate]);

  function resolveSection() {
    if (categoryMode === 'new') return (newSection || '').trim();
    return (existingSection || '').trim();
  }

  function onSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('El título es obligatorio.');
      return;
    }

    const section = resolveSection();
    if (!section) {
      setError('Debes elegir o crear una categoría.');
      return;
    }

    const payload = {
      title: trimmedTitle,
      notes,
      dueDate: dueDate || undefined,
      section, // no forzamos “General” aquí
    };

    if (isEdit && current) {
      dispatch({ type: 'UPDATE_TASK', payload: { id: current.id, ...payload } });
    } else {
      dispatch({ type: 'ADD_TASK', payload });
    }
    navigate('/');
  }

  return (
    <main id="main" className={styles.container}>
      <h1>{isEdit ? 'Editar tarea' : 'Nueva tarea'}</h1>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="badge"
          style={{ background: '#fee2e2', color: '#b91c1c', marginBottom: '.75rem' }}
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className={styles.form} noValidate>
        <label htmlFor="title">
          <span>Título *</span>
          <input
            id="title"
            className="input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={100}
            required
            aria-invalid={Boolean(error) && !title.trim()}
            aria-describedby={error ? errorId : undefined}
          />
        </label>

        <label htmlFor="notes">
          <span>Notas</span>
          <textarea
            id="notes"
            className="input"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            maxLength={500}
            rows={5}
          />
        </label>

        <div className={styles.grid2}>
          <label htmlFor="dueDate">
            <span>Fecha de vencimiento</span>
            <input
              id="dueDate"
              type="date"
              className="input"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </label>

          <div>
            <span style={{ display: 'block', marginBottom: '.35rem' }}>Categoría *</span>

            {/* Toggle simple para elegir modo */}
            <div style={{ display: 'flex', gap: '.5rem', marginBottom: '.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <input
                  type="radio"
                  name="categoryMode"
                  value="existing"
                  checked={categoryMode === 'existing'}
                  onChange={() => setCategoryMode('existing')}
                />
                Elegir existente
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '.35rem' }}>
                <input
                  type="radio"
                  name="categoryMode"
                  value="new"
                  checked={categoryMode === 'new'}
                  onChange={() => setCategoryMode('new')}
                />
                Crear nueva
              </label>
            </div>

            {categoryMode === 'existing' ? (
              <select
                aria-label="Categoría"
                className="input"
                value={existingSection}
                onChange={e => setExistingSection(e.target.value)}
                aria-invalid={Boolean(error) && !existingSection && categoryMode === 'existing'}
                aria-describedby={error ? errorId : undefined}
              >
                <option value="">— Elige una categoría —</option>
                {sections.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <input
                aria-label="Nueva categoría"
                className="input"
                value={newSection}
                onChange={e => setNewSection(e.target.value)}
                placeholder="Ej.: Trabajo, Personal…"
                maxLength={40}
                aria-invalid={Boolean(error) && !newSection && categoryMode === 'new'}
                aria-describedby={error ? errorId : undefined}
              />
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button type="submit" className="btn btnPrimary">Guardar</button>
          <button type="button" className="btn" onClick={() => navigate('/')}>Cancelar</button>
        </div>
      </form>
    </main>
  );
}

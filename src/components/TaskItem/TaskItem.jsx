import styles from './TaskItem.module.css';
import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../context/AppContext';
function formatDue(d){ return d ? d : '' }
export default function TaskItem({ task }){
  const dispatch = useAppDispatch();
  return (
    <li className={styles.item}>
      <label className={styles.left}>
        <input type="checkbox" checked={task.completed} onChange={()=>dispatch({type:'TOGGLE_TASK',payload:{id:task.id}})} aria-label={task.completed ? 'Marcar como pendiente' : 'Marcar como completada'} />
        <div className={styles.texts}>
          <span className={task.completed ? styles.done : ''}>{task.title}</span>
          <small className={styles.meta}>
            {task.section && <span className={styles.badge}>{task.section}</span>}
            {task.dueDate && <span className={styles.due}>Vence: {formatDue(task.dueDate)}</span>}
          </small>
        </div>
      </label>
      <div className={styles.right}>
        <Link to={`/edit/${task.id}`} className={styles.link}>Editar</Link>
        <button className={styles.delete} onClick={()=>{ if(window.confirm('¿Eliminar esta tarea?')){ dispatch({type:'DELETE_TASK',payload:{id:task.id}}); } }}>Borrar</button>
      </div>
    </li>
  );
}

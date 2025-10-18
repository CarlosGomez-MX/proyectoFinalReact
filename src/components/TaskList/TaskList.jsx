import styles from './TaskList.module.css';
import { useVisibleTasks } from '../../context/AppContext';
import TaskItem from '../TaskItem/TaskItem';
export default function TaskList(){
  const tasks = useVisibleTasks();
  if(!tasks.length) return (<div className={styles.empty}><p>No hay tareas que coincidan. ¡Crea tu primera tarea!</p></div>);
  return (<ul className={styles.list}>{tasks.map(t=> (<TaskItem key={t.id} task={t} />))}</ul>);
}

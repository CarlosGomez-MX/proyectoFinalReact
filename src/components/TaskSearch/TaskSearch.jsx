import styles from './TaskSearch.module.css';
import { useAppDispatch, useAppState } from '../../context/AppContext';
export default function TaskSearch(){
  const { search } = useAppState();
  const dispatch = useAppDispatch();
  return (<input className={`input ${styles.input}`} placeholder="Buscar por título o nota…" value={search} onChange={e=>dispatch({type:'SET_SEARCH',payload:{search:e.target.value}})} aria-label="Buscar tareas" />);
}

import styles from './TaskListPage.module.css';
import TaskFilters from '../../components/TaskFilters/TaskFilters';
import TaskSearch from '../../components/TaskSearch/TaskSearch';
import TaskList from '../../components/TaskList/TaskList';
import SectionFilter from '../../components/SectionFilter/SectionFilter';
import { Link } from 'react-router-dom';

export default function TaskListPage() {
  return (
    <main id="main" className={styles.container}>
      <div className={styles.topbar}>
        <TaskFilters />
        <TaskSearch />
        <SectionFilter />
        <Link to="/new" className="btn btnPrimary">+ Nueva tarea</Link>
      </div>
      <TaskList />
    </main>
  );
}

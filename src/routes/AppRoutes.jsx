import { Routes, Route } from 'react-router-dom';
import TaskListPage from '../pages/TaskListPage/TaskListPage';
import TaskFormPage from '../pages/TaskFormPage/TaskFormPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';

export default function AppRoutes(){
  return (
    <Routes>
      <Route path="/" element={<TaskListPage/>}/>
      <Route path="/new" element={<TaskFormPage/>}/>
      <Route path="/edit/:id" element={<TaskFormPage/>}/>
      <Route path="*" element={<NotFoundPage/>}/>
    </Routes>
  );
}
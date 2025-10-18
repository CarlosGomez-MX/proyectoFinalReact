const KEY='proyectoreact.v1.state';
export function saveTasks(tasks){ try{ localStorage.setItem(KEY, JSON.stringify({tasks})); }catch{} }
export function loadTasks(){ try{ const raw=localStorage.getItem(KEY); if(!raw) return []; const parsed=JSON.parse(raw); return Array.isArray(parsed?.tasks)?parsed.tasks:[]; }catch{ return []; } }
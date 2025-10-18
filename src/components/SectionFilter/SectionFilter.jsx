import { useAppDispatch, useAppState } from '../../context/AppContext';
export default function SectionFilter(){
  const { sections, sectionFilter } = useAppState();
  const dispatch = useAppDispatch();
  return (
    <select aria-label="Filtrar por sección" value={sectionFilter} onChange={(e)=>dispatch({type:'SET_SECTION_FILTER',payload:{section:e.target.value}})} className="input" style={{maxWidth:220}}>
      <option value="all">Todas las secciones</option>
      {sections.map(s=> (<option key={s} value={s}>{s}</option>))}
    </select>
  );
}

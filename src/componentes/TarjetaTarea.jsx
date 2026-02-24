import '../estilos/tarjeta.css'

function formatearFecha(fecha) {
  if (!fecha) return '—'
  const d = new Date(fecha + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
}

function esVencida(fecha) {
  if (!fecha) return false
  return new Date(fecha + 'T00:00:00') < new Date(new Date().setHours(0, 0, 0, 0))
}

export default function TarjetaTarea({ tarea, onEditar, onEliminar, onToggle, cargandoToggle }) {
  const vencida = !tarea.completada && esVencida(tarea.fecha_limite)
  return (
    <div className={`tarjeta-tarea ${tarea.completada ? 'tarjeta-completada' : ''} ${vencida ? 'tarjeta-vencida' : ''}`}>
      <div className={`tarjeta-indicador tarjeta-indicador-${tarea.prioridad}`} />
      <div className="tarjeta-cuerpo">
        <div className="tarjeta-fila-superior">
          <button
            className={`tarjeta-check ${tarea.completada ? 'tarjeta-check-activo' : ''}`}
            onClick={() => onToggle(tarea.id, !tarea.completada)}
            disabled={cargandoToggle}
            title={tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'}
          >
            {tarea.completada ? '✓' : ''}
          </button>
          <div className="tarjeta-info">
            <h3 className={`tarjeta-titulo ${tarea.completada ? 'tarjeta-titulo-completado' : ''}`}>
              {tarea.titulo}
            </h3>
            {tarea.descripcion && (
              <p className="tarjeta-descripcion">{tarea.descripcion}</p>
            )}
          </div>
        </div>
        <div className="tarjeta-meta">
          <span className={`etiqueta etiqueta-${tarea.prioridad}`}>
            {tarea.prioridad === 'ALTA' ? '↑' : tarea.prioridad === 'BAJA' ? '↓' : '→'} {tarea.prioridad}
          </span>
          <span className={`etiqueta ${tarea.completada ? 'etiqueta-completada' : 'etiqueta-pendiente'}`}>
            {tarea.completada ? 'Completada' : 'Pendiente'}
          </span>
          <span className={`tarjeta-fecha ${vencida ? 'tarjeta-fecha-vencida' : ''}`}>
            {vencida ? '⚠ ' : ''}{formatearFecha(tarea.fecha_limite)}
          </span>
        </div>
      </div>
      <div className="tarjeta-acciones">
        <button className="btn btn-fantasma btn-sm" onClick={() => onEditar(tarea)}>
          Editar
        </button>
        <button className="btn btn-fantasma btn-sm tarjeta-btn-eliminar" onClick={() => onEliminar(tarea)}>
          Eliminar
        </button>
      </div>
    </div>
  )
}
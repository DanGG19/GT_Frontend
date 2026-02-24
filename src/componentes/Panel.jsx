import '../estilos/panel.css'

export default function Panel({ datos, cargando }) {
  if (cargando) {
    return (
      <div className="panel-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="panel-tarjeta panel-tarjeta-skeleton" />
        ))}
      </div>
    )
  }
  if (!datos) return null
  const porcentaje = datos.porcentaje ?? 0
  return (
    <div className="panel-grid">
      <div className="panel-tarjeta panel-tarjeta-total">
        <span className="panel-etiqueta">Total</span>
        <span className="panel-numero">{datos.total ?? 0}</span>
        <span className="panel-desc">tareas registradas</span>
      </div>
      <div className="panel-tarjeta">
        <span className="panel-etiqueta">Pendientes</span>
        <span className="panel-numero panel-numero-pendiente">{datos.pendientes ?? 0}</span>
        <span className="panel-desc">por completar</span>
      </div>
      <div className="panel-tarjeta">
        <span className="panel-etiqueta">Completadas</span>
        <span className="panel-numero panel-numero-completado">{datos.completadas ?? 0}</span>
        <span className="panel-desc">finalizadas</span>
      </div>
      <div className="panel-tarjeta panel-tarjeta-progreso">
        <span className="panel-etiqueta">Progreso</span>
        <span className="panel-numero">
          {porcentaje}<span className="panel-numero-pct">%</span>
        </span>
        <div className="panel-barra-fondo">
          <div className="panel-barra-relleno" style={{ width: `${porcentaje}%` }} />
        </div>
      </div>
    </div>
  )
}
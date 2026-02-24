import '../estilos/filtros.css'

export default function Filtros({ filtros, onChange }) {
  function handleChange(campo, valor) {
    onChange({ ...filtros, [campo]: valor })
  }
  return (
    <div className="filtros-barra">
      <div className="filtros-busqueda">
        <span className="filtros-icono-busqueda">⌕</span>
        <input
          type="text"
          className="input filtros-input-busqueda"
          placeholder="Buscar por título…"
          value={filtros.search}
          onChange={(e) => handleChange('search', e.target.value)}
        />
        {filtros.search && (
          <button
            className="btn btn-fantasma"
            style={{ padding: '4px 8px', fontSize: 16 }}
            onClick={() => handleChange('search', '')}
          >
            ×
          </button>
        )}
      </div>
      <div className="filtros-grupo">
        {[
          { valor: '', etiqueta: 'Todas' },
          { valor: 'false', etiqueta: 'Pendientes' },
          { valor: 'true', etiqueta: 'Completadas' },
        ].map(({ valor, etiqueta }) => (
          <button
            key={valor}
            className={`btn filtros-chip ${filtros.completada === valor ? 'filtros-chip-activo' : ''}`}
            onClick={() => handleChange('completada', valor)}
          >
            {etiqueta}
          </button>
        ))}
      </div>
      <div className="filtros-grupo">
        {[
          { valor: 'TODAS', etiqueta: 'Prioridad' },
          { valor: 'ALTA', etiqueta: '↑ Alta' },
          { valor: 'MEDIA', etiqueta: '→ Media' },
          { valor: 'BAJA', etiqueta: '↓ Baja' },
        ].map(({ valor, etiqueta }) => (
          <button
            key={valor}
            className={`btn filtros-chip ${filtros.prioridad === valor ? 'filtros-chip-activo' : ''}`}
            onClick={() => handleChange('prioridad', valor)}
          >
            {etiqueta}
          </button>
        ))}
      </div>
    </div>
  )
}
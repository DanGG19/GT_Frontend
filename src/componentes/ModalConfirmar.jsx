export default function ModalConfirmar({ titulo, mensaje, onConfirmar, onCancelar, cargando }) {
  return (
    <div className="modal-overlay" onClick={onCancelar}>
      <div className="modal" style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-cabecera">
          <h3>{titulo}</h3>
        </div>
        <div className="modal-cuerpo">
          <p style={{ color: 'var(--gris-texto)', lineHeight: 1.6 }}>{mensaje}</p>
        </div>
        <div className="modal-pie">
          <button className="btn btn-secundario" onClick={onCancelar} disabled={cargando}>
            Cancelar
          </button>
          <button className="btn btn-peligro" onClick={onConfirmar} disabled={cargando}>
            {cargando
              ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />Eliminando…</>
              : 'Eliminar'
            }
          </button>
        </div>
      </div>
    </div>
  )
}
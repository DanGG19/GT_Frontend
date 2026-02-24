import { useState } from 'react'

const VACIO = { titulo: '', descripcion: '', prioridad: 'MEDIA', fecha_limite: '' }

export default function FormularioTarea({ inicial, onGuardar, onCancelar, cargando }) {
  const [form, setForm] = useState(inicial || VACIO)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.titulo.trim()) { setError('El título es obligatorio.'); return }
    try {
      await onGuardar(form)
    } catch (err) {
      if (err.response?.data) {
        setError(Object.values(err.response.data).flat().join(' ') || 'Error al guardar.')
      } else {
        setError('Error de conexión con el servidor.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-cuerpo">
        {error && <div className="error-mensaje">{error}</div>}
        <div className="input-grupo">
          <label htmlFor="titulo">Título *</label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            className="input"
            placeholder="¿Qué hay que hacer?"
            value={form.titulo}
            onChange={handleChange}
            maxLength={200}
          />
        </div>
        <div className="input-grupo">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            className="input"
            placeholder="Detalles opcionales…"
            value={form.descripcion}
            onChange={handleChange}
          />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="input-grupo">
            <label htmlFor="prioridad">Prioridad</label>
            <select
              id="prioridad"
              name="prioridad"
              className="input"
              value={form.prioridad}
              onChange={handleChange}
            >
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
          </div>
          <div className="input-grupo">
            <label htmlFor="fecha_limite">Fecha límite</label>
            <input
              id="fecha_limite"
              name="fecha_limite"
              type="date"
              className="input"
              value={form.fecha_limite || ''}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="modal-pie">
        <button type="button" className="btn btn-secundario" onClick={onCancelar} disabled={cargando}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primario" disabled={cargando}>
          {cargando
            ? <><span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />Guardando…</>
            : 'Guardar tarea →'
          }
        </button>
      </div>
    </form>
  )
}
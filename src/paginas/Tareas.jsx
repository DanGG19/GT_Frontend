import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { sileo } from 'sileo'
import { obtenerTareas, obtenerPanel, crearTarea, actualizarTarea, toggleCompletada, eliminarTarea } from '../api/servicios'
import Panel from '../componentes/Panel'
import Filtros from '../componentes/Filtros'
import TarjetaTarea from '../componentes/TarjetaTarea'
import FormularioTarea from '../componentes/FormularioTarea'
import ModalConfirmar from '../componentes/ModalConfirmar'
import '../estilos/tareas.css'

const FILTROS_INICIAL = { completada: '', prioridad: 'TODAS', search: '' }

export default function Tareas() {
  const navigate = useNavigate()
  const [panel, setPanel] = useState(null)
  const [tareas, setTareas] = useState([])
  const [filtros, setFiltros] = useState(FILTROS_INICIAL)
  const [cargandoPanel, setCargandoPanel] = useState(true)
  const [cargandoTareas, setCargandoTareas] = useState(true)
  const [cargandoAccion, setCargandoAccion] = useState(false)
  const [modalCrear, setModalCrear] = useState(false)
  const [tareaEditar, setTareaEditar] = useState(null)
  const [tareaEliminar, setTareaEliminar] = useState(null)
  const [toggling, setToggling] = useState({})

  const cargarPanel = useCallback(async () => {
    try {
      const datos = await obtenerPanel()
      setPanel(datos)
    } catch { } finally { setCargandoPanel(false) }
  }, [])

  const cargarTareas = useCallback(async () => {
    setCargandoTareas(true)
    try {
      const datos = await obtenerTareas(filtros)
      setTareas(Array.isArray(datos) ? datos : datos.results ?? [])
    } catch (err) {
      if (!err.response) {
        sileo.error({ title: 'Sin conexión', description: '¿Está corriendo el backend?' })
      } else {
        sileo.error({ title: 'Error', description: 'No se pudieron cargar las tareas.' })
      }
    } finally { setCargandoTareas(false) }
  }, [filtros])

  useEffect(() => {
    cargarPanel()
    sileo.success({ title: '¡Bienvenido!', description: 'Sesión iniciada correctamente.' })
  }, [cargarPanel])

  useEffect(() => {
    const timer = setTimeout(() => cargarTareas(), filtros.search ? 400 : 0)
    return () => clearTimeout(timer)
  }, [cargarTareas, filtros])

  function cerrarSesion() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    sileo.success({ title: '¡Hasta pronto!', description: 'Sesión cerrada correctamente.' })
    setTimeout(() => navigate('/login'), 1200)
  }

  async function handleCrear(datos) {
    setCargandoAccion(true)
    try {
      await crearTarea(datos)
      setModalCrear(false)
      sileo.success({ title: '¡Tarea creada!', description: 'La tarea fue agregada exitosamente.' })
      await Promise.all([cargarTareas(), cargarPanel()])
    } catch (err) {
      if (err.response?.data) {
        const msg = Object.values(err.response.data).flat().join(' ')
        sileo.error({ title: 'Error al crear', description: msg || 'Verifica los datos.' })
      } else {
        sileo.error({ title: 'Sin conexión', description: 'No se pudo crear la tarea.' })
      }
    } finally { setCargandoAccion(false) }
  }

  async function handleEditar(datos) {
    setCargandoAccion(true)
    try {
      await actualizarTarea(tareaEditar.id, { ...datos, completada: tareaEditar.completada })
      setTareaEditar(null)
      sileo.success({ title: '¡Tarea actualizada!', description: 'Los cambios fueron guardados.' })
      await Promise.all([cargarTareas(), cargarPanel()])
    } catch (err) {
      if (err.response?.data) {
        const msg = Object.values(err.response.data).flat().join(' ')
        sileo.error({ title: 'Error al actualizar', description: msg || 'Verifica los datos.' })
      } else {
        sileo.error({ title: 'Sin conexión', description: 'No se pudo actualizar la tarea.' })
      }
    } finally { setCargandoAccion(false) }
  }

  async function handleToggle(id, completada) {
    setToggling((prev) => ({ ...prev, [id]: true }))
    try {
      await toggleCompletada(id, completada)
      sileo.success({
        title: completada ? '¡Tarea completada! ✓' : 'Tarea pendiente',
        description: completada ? 'Marcada como completada.' : 'Marcada como pendiente.'
      })
      await Promise.all([cargarTareas(), cargarPanel()])
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo actualizar el estado.' })
    } finally { setToggling((prev) => ({ ...prev, [id]: false })) }
  }

  async function handleEliminar() {
    setCargandoAccion(true)
    try {
      await eliminarTarea(tareaEliminar.id)
      setTareaEliminar(null)
      sileo.success({ title: 'Tarea eliminada', description: 'La tarea fue eliminada correctamente.' })
      await Promise.all([cargarTareas(), cargarPanel()])
    } catch {
      sileo.error({ title: 'Error', description: 'No se pudo eliminar la tarea.' })
    } finally { setCargandoAccion(false) }
  }

  return (
    <div className="tareas-layout">
      <header className="tareas-header">
        <div className="tareas-header-marca">
          <span className="tareas-header-logo">GesTask</span>
          <span className="tareas-header-sep">—</span>
          <span className="tareas-header-sub">Panel de control</span>
        </div>
        <div className="tareas-header-acciones">
          <button className="btn btn-primario" onClick={() => setModalCrear(true)}>+ Nueva tarea</button>
          <button className="btn btn-secundario" onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </header>

      <main className="tareas-main">
        <section className="tareas-seccion">
          <div className="tareas-seccion-titulo">
            <span className="tareas-eyebrow">Resumen</span>
          </div>
          <Panel datos={panel} cargando={cargandoPanel} />
        </section>

        <section className="tareas-seccion">
          <div className="tareas-seccion-titulo">
            <span className="tareas-eyebrow">Mis tareas</span>
            {!cargandoTareas && (
              <span className="tareas-contador">{tareas.length} resultado{tareas.length !== 1 ? 's' : ''}</span>
            )}
          </div>

          <Filtros filtros={filtros} onChange={setFiltros} />

          {cargandoTareas ? (
            <div className="cargando-contenedor">
              <div className="spinner" />
              <span>Cargando tareas…</span>
            </div>
          ) : tareas.length === 0 ? (
            <div className="tareas-vacio">
              <span className="tareas-vacio-icono">◻</span>
              <p>No hay tareas que mostrar.</p>
              <p className="texto-ayuda">
                {Object.values(filtros).some(Boolean)
                  ? 'Prueba cambiando los filtros.'
                  : 'Crea tu primera tarea con el botón de arriba.'}
              </p>
            </div>
          ) : (
            <div className="tareas-lista">
              {tareas.map((tarea) => (
                <TarjetaTarea
                  key={tarea.id}
                  tarea={tarea}
                  onEditar={setTareaEditar}
                  onEliminar={setTareaEliminar}
                  onToggle={handleToggle}
                  cargandoToggle={!!toggling[tarea.id]}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {modalCrear && (
        <div className="modal-overlay" onClick={() => !cargandoAccion && setModalCrear(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-cabecera">
              <h3>Nueva tarea</h3>
              <button className="btn btn-fantasma" onClick={() => setModalCrear(false)} disabled={cargandoAccion}>×</button>
            </div>
            <FormularioTarea onGuardar={handleCrear} onCancelar={() => setModalCrear(false)} cargando={cargandoAccion} />
          </div>
        </div>
      )}

      {tareaEditar && (
        <div className="modal-overlay" onClick={() => !cargandoAccion && setTareaEditar(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-cabecera">
              <h3>Editar tarea</h3>
              <button className="btn btn-fantasma" onClick={() => setTareaEditar(null)} disabled={cargandoAccion}>×</button>
            </div>
            <FormularioTarea
              inicial={{ titulo: tareaEditar.titulo, descripcion: tareaEditar.descripcion || '', prioridad: tareaEditar.prioridad, fecha_limite: tareaEditar.fecha_limite || '' }}
              onGuardar={handleEditar}
              onCancelar={() => setTareaEditar(null)}
              cargando={cargandoAccion}
            />
          </div>
        </div>
      )}

      {tareaEliminar && (
        <ModalConfirmar
          titulo="Eliminar tarea"
          mensaje={`¿Estás seguro de que deseas eliminar "${tareaEliminar.titulo}"? Esta acción no se puede deshacer.`}
          onConfirmar={handleEliminar}
          onCancelar={() => setTareaEliminar(null)}
          cargando={cargandoAccion}
        />
      )}
    </div>
  )
}
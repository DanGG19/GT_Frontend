import axios from 'axios'
import clienteApi from './clienteApi'

const BASE_URL = '/api'

// ── AUTENTICACIÓN ──
export async function registrarUsuario({ username, email, password }) {
  const { data } = await axios.post(`${BASE_URL}/registro/`, { username, email, password })
  return data
}

export async function iniciarSesion({ username, password }) {
  const { data } = await axios.post(`${BASE_URL}/login/`, { username, password })
  return data
}

// ── PANEL ──
export async function obtenerPanel() {
  const { data } = await clienteApi.get('/panel/')
  return data
}

// ── TAREAS ──
export async function obtenerTareas(filtros = {}) {
  const params = {}
  if (filtros.completada !== undefined && filtros.completada !== '')
    params.completada = filtros.completada
  if (filtros.prioridad && filtros.prioridad !== 'TODAS')
    params.prioridad = filtros.prioridad
  if (filtros.search && filtros.search.trim())
    params.search = filtros.search.trim()

  const { data } = await clienteApi.get('/tareas/', { params })
  return data
}

export async function crearTarea(tarea) {
  const { data } = await clienteApi.post('/tareas/', tarea)
  return data
}

export async function actualizarTarea(id, tarea) {
  const { data } = await clienteApi.put(`/tareas/${id}/`, tarea)
  return data
}

export async function toggleCompletada(id, completada) {
  const { data } = await clienteApi.patch(`/tareas/${id}/`, { completada })
  return data
}

export async function eliminarTarea(id) {
  await clienteApi.delete(`/tareas/${id}/`)
}
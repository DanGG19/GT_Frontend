import axios from 'axios'
import { sileo } from 'sileo'

const BASE_URL = 'https://resistance-sheriff-versions-roles.trycloudflare.com/api'

const clienteApi = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// ── Adjuntar access token a cada request ──
clienteApi.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem('access')
    if (access) {
      config.headers['Authorization'] = `Bearer ${access}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Interceptor de respuesta: refresh automático en 401 ──
clienteApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    if (
      error.response?.status === 401 &&
      !config._reintentado &&
      !config.url.includes('/login/') &&
      !config.url.includes('/token/refrescar/')
    ) {
      config._reintentado = true

      const refresh = localStorage.getItem('refresh')
      if (!refresh) {
        cerrarSesion()
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/token/refrescar/`, { refresh })
        localStorage.setItem('access', data.access)
        config.headers['Authorization'] = `Bearer ${data.access}`
        return clienteApi(config)
      } catch (_err) {
        sileo.error('Tu sesión expiró. Inicia sesión de nuevo.')
        cerrarSesion()
        return Promise.reject(_err)
      }
    }

    return Promise.reject(error)
  }
)

function cerrarSesion() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  setTimeout(() => {
    window.location.href = '/login'
  }, 1500)
}

export default clienteApi
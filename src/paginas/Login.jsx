import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sileo } from 'sileo'
import { iniciarSesion } from '../api/servicios'
import '../estilos/auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.username.trim() || !form.password.trim()) {
      sileo.warning({ title: 'Campos vacíos', description: 'Completa todos los campos.' })
      return
    }
    setCargando(true)
    try {
      const { access, refresh } = await iniciarSesion(form)
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      sileo.success({ title: '¡Bienvenido!', description: 'Sesión iniciada correctamente.' })
      setTimeout(() => navigate('/tareas'), 1000)
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 400) {
        sileo.error({ title: 'Credenciales incorrectas', description: 'Verifica tu usuario y contraseña.' })
      } else if (!err.response) {
        sileo.error({ title: 'Sin conexión', description: '¿Está corriendo el backend?' })
      } else {
        sileo.error({ title: 'Error inesperado', description: 'Intenta de nuevo.' })
      }
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="auth-pagina">
      <div className="auth-lado-deco">
        <div className="auth-deco-contenido">
          <span className="auth-deco-numero">v01</span>
          <h1 className="auth-deco-titulo">Ges<br /><em>Task</em></h1>
          <p className="auth-deco-sub">Sistema de gestión<br />de tareas jexual.</p>
        </div>
        <div className="auth-deco-grid" aria-hidden="true" />
      </div>
      <div className="auth-lado-form">
        <div className="auth-form-contenedor">
          <div className="auth-encabezado">
            <p className="auth-eyebrow">Bienvenido de vuelta</p>
            <h2 className="auth-titulo">Iniciar sesión</h2>
          </div>
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="input-grupo">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                className="input"
                placeholder="tu_usuario"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
              />
            </div>
            <div className="input-grupo">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primario auth-btn" disabled={cargando}>
              {cargando
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Entrando…</>
                : 'Entrar →'
              }
            </button>
          </form>
          <p className="auth-pie">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="auth-enlace">Regístrate aquí</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
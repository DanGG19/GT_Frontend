import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { sileo } from 'sileo'
import { registrarUsuario } from '../api/servicios'
import '../estilos/auth.css'

export default function Registro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [cargando, setCargando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validar() {
    if (!form.username.trim()) return 'El nombre de usuario es obligatorio.'
    if (!form.email.trim()) return 'El correo es obligatorio.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'El correo no tiene un formato válido.'
    if (form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const err = validar()
    if (err) {
      sileo.warning({ title: 'Revisa los datos', description: err })
      return
    }
    setCargando(true)
    try {
      await registrarUsuario(form)
      sileo.success({ title: '¡Cuenta creada!', description: 'Ya puedes iniciar sesión.' })
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      if (err.response?.data) {
        const msg = Object.values(err.response.data).flat().join(' ')
        sileo.error({ title: 'Error al registrar', description: msg || 'Verifica los datos.' })
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
          <span className="auth-deco-numero">02</span>
          <h1 className="auth-deco-titulo">Nueva<br /><em>Cuenta</em></h1>
          <p className="auth-deco-sub">Organiza tu vida,<br />una tarea a la vez.</p>
        </div>
        <div className="auth-deco-grid" aria-hidden="true" />
      </div>
      <div className="auth-lado-form">
        <div className="auth-form-contenedor">
          <div className="auth-encabezado">
            <p className="auth-eyebrow">Crea tu cuenta</p>
            <h2 className="auth-titulo">Registro</h2>
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
              />
            </div>
            <div className="input-grupo">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-grupo">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                placeholder="Mín. 6 caracteres"
                value={form.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primario auth-btn" disabled={cargando}>
              {cargando
                ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />Creando cuenta…</>
                : 'Crear cuenta →'
              }
            </button>
          </form>
          <p className="auth-pie">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="auth-enlace">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
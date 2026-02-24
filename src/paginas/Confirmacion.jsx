import { useSearchParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { sileo } from 'sileo'
import '../estilos/auth.css'
import '../estilos/verificar.css'

export default function Confirmacion() {
  const [params] = useSearchParams()
  const estado = params.get('estado')
  const user = params.get('user')

  useEffect(() => {
    if (estado === 'ok') {
      sileo.success({ title: '¡Cuenta activada!', description: `Bienvenido ${user}, ya puedes iniciar sesión.` })
    } else if (estado === 'usado') {
      sileo.warning({ title: 'Enlace ya usado', description: 'Esta cuenta ya fue confirmada anteriormente.' })
    } else {
      sileo.error({ title: 'Enlace inválido', description: 'El enlace de confirmación no es válido.' })
    }
  }, [estado])

  const config = {
    ok: {
      numero: '✓',
      titulo: <>'¡Cuenta<br /><em>Activada!</em>'</>,
      icono: '🎉',
      mensaje: `¡Hola ${user}! Tu cuenta ha sido activada correctamente. Ya puedes iniciar sesión.`,
      color: 'var(--verde)',
    },
    usado: {
      numero: '!',
      titulo: <>Enlace<br /><em>Expirado</em></>,
      icono: '⚠',
      mensaje: 'Este enlace ya fue utilizado. Tu cuenta ya estaba confirmada.',
      color: 'var(--ambar)',
    },
    error: {
      numero: '✗',
      titulo: <>Enlace<br /><em>Inválido</em></>,
      icono: '✗',
      mensaje: 'El enlace de confirmación no es válido o ha expirado.',
      color: 'var(--rojo)',
    },
  }

  const c = config[estado] || config.error

  return (
    <div className="auth-pagina">
      <div className="auth-lado-deco">
        <div className="auth-deco-contenido">
          <span className="auth-deco-numero" style={{ color: c.color }}>
            {c.numero}
          </span>
          <h1 className="auth-deco-titulo">{c.titulo}</h1>
          <p className="auth-deco-sub">GesTask —<br />Gestión de tareas.</p>
        </div>
        <div className="auth-deco-grid" aria-hidden="true" />
      </div>

      <div className="auth-lado-form">
        <div className="auth-form-contenedor">
          <div className="verificar-icono">{c.icono}</div>

          <div className="auth-encabezado">
            <p className="auth-eyebrow" style={{ color: c.color }}>
              {estado === 'ok' ? 'Verificación exitosa' : estado === 'usado' ? 'Ya confirmado' : 'Error de verificación'}
            </p>
            <h2 className="auth-titulo">
              {estado === 'ok' ? '¡Todo listo!' : estado === 'usado' ? 'Enlace usado' : 'Algo salió mal'}
            </h2>
          </div>

          <div className="verificar-card">
            <p className="verificar-texto">{c.mensaje}</p>
          </div>

          <Link to="/login" className="btn btn-primario auth-btn" style={{ justifyContent: 'center' }}>
            {estado === 'ok' ? 'Ir al inicio de sesión →' : 'Volver al login →'}
          </Link>

          {estado !== 'ok' && (
            <p className="auth-pie">
              ¿Necesitas registrarte de nuevo?{' '}
              <Link to="/registro" className="auth-enlace">Regístrate aquí</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
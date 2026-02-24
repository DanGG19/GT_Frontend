import { Link, useLocation } from 'react-router-dom'
import '../estilos/auth.css'
import '../estilos/verificar.css'

export default function Verificar() {
  const location = useLocation()
  const email = location.state?.email || 'tu correo'

  return (
    <div className="auth-pagina">
      <div className="auth-lado-deco">
        <div className="auth-deco-contenido">
          <span className="auth-deco-numero">V.01</span>
          <h1 className="auth-deco-titulo">Revisa<br /><em>tu correo</em></h1>
          <p className="auth-deco-sub">Un paso más<br />y ya estás dentro.</p>
        </div>
        <div className="auth-deco-grid" aria-hidden="true" />
      </div>

      <div className="auth-lado-form">
        <div className="auth-form-contenedor">
          <div className="verificar-icono">✉</div>

          <div className="auth-encabezado">
            <p className="auth-eyebrow">Confirma tu cuenta</p>
            <h2 className="auth-titulo">¡Casi listo!</h2>
          </div>

          <div className="verificar-card">
            <p className="verificar-texto">
              Enviamos un enlace de activación a:
            </p>
            <p className="verificar-email">{email}</p>
            <p className="verificar-texto">
              Abre tu correo y haz clic en el enlace para activar tu cuenta.
              El enlace puede tardar unos minutos en llegar.
            </p>
          </div>

          <div className="verificar-pasos">
            <div className="verificar-paso">
              <span className="verificar-paso-num">1</span>
              <span>Abre tu bandeja de entrada</span>
            </div>
            <div className="verificar-paso">
              <span className="verificar-paso-num">2</span>
              <span>Busca el correo de GesTask</span>
            </div>
            <div className="verificar-paso">
              <span className="verificar-paso-num">3</span>
              <span>Haz clic en "Activar cuenta"</span>
            </div>
          </div>

          <p className="auth-pie">
            ¿Ya confirmaste?{' '}
            <Link to="/login" className="auth-enlace">
              Inicia sesión aquí
            </Link>
          </p>

          <p className="auth-pie" style={{ marginTop: 8 }}>
            ¿Correo incorrecto?{' '}
            <Link to="/registro" className="auth-enlace">
              Volver al registro
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
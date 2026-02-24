import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './paginas/Login'
import Registro from './paginas/Registro'
import Tareas from './paginas/Tareas'
import Verificar from './paginas/Verificar'
import RutaProtegida from './componentes/RutaProtegida'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/verificar" element={<Verificar />} />
        <Route
          path="/tareas"
          element={
            <RutaProtegida>
              <Tareas />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
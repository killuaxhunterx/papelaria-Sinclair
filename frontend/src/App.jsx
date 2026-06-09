import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Produtos from './pages/Produtos'
import Usuarios from './pages/Usuarios'
import Perfil from './pages/Perfil'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/produtos"
            element={<ProtectedRoute><Produtos /></ProtectedRoute>}
          />
          <Route
            path="/usuarios"
            element={<ProtectedRoute adminOnly><Usuarios /></ProtectedRoute>}
          />
          <Route
            path="/perfil"
            element={<ProtectedRoute><Perfil /></ProtectedRoute>}
          />
          <Route path="*" element={<Navigate to="/produtos" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

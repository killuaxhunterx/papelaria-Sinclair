import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    signOut()
    navigate('/login')
  }

  const active = (path) =>
    location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link'

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">📎</span>
        Papelaria Sinclair
      </div>

      <div className="navbar-links">
        <Link className={active('/produtos')} to="/produtos">Produtos</Link>
        {user?.role === 'ADMIN' && (
          <Link className={active('/usuarios')} to="/usuarios">Usuários</Link>
        )}
        <Link className={active('/perfil')} to="/perfil">Perfil</Link>
      </div>

      <div className="navbar-user">
        <span className="user-email">{user?.email}</span>
        <span className={`role-badge ${user?.role === 'ADMIN' ? 'admin' : 'cliente'}`}>
          {user?.role}
        </span>
        <button className="btn btn-outline-sm" onClick={handleLogout}>Sair</button>
      </div>
    </nav>
  )
}

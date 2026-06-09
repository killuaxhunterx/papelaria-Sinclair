import { useState, useEffect } from 'react'
import { getPerfil, atualizarPerfil } from '../api/api'
import Navbar from '../components/Navbar'

export default function Perfil() {
  const [perfil, setPerfil] = useState(null)
  const [form, setForm] = useState({ nome: '', novaSenha: '' })
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    getPerfil()
      .then(({ data }) => {
        setPerfil(data)
        setForm({ nome: data.nome, novaSenha: '' })
      })
      .catch(() => setErro('Erro ao carregar perfil.'))
      .finally(() => setLoading(false))
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSucesso('')
    setErro('')
    setSalvando(true)
    try {
      const { data } = await atualizarPerfil({
        nome: form.nome,
        novaSenha: form.novaSenha || null,
      })
      setPerfil(data)
      setForm({ nome: data.nome, novaSenha: '' })
      setSucesso('Perfil atualizado com sucesso!')
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao atualizar perfil.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container container-sm">
        <div className="page-header">
          <h2>Meu Perfil</h2>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="card">
            <div className="perfil-info">
              <div className="avatar">{perfil?.nome?.charAt(0).toUpperCase()}</div>
              <div>
                <p className="perfil-nome">{perfil?.nome}</p>
                <p className="perfil-email">{perfil?.email}</p>
                <div className="perfil-badges">
                  <span className={`role-badge ${perfil?.role === 'ADMIN' ? 'admin' : 'cliente'}`}>
                    {perfil?.role}
                  </span>
                  <span className={`status-badge ${perfil?.status === 'ATIVO' ? 'ativo' : 'inativo'}`}>
                    {perfil?.status}
                  </span>
                </div>
              </div>
            </div>

            <hr />

            <form onSubmit={handleSubmit}>
              {sucesso && <div className="alert alert-success">{sucesso}</div>}
              {erro && <div className="alert alert-error">{erro}</div>}

              <div className="form-group">
                <label>Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label>Nova Senha <span className="label-hint">(deixe em branco para não alterar)</span></label>
                <input
                  name="novaSenha"
                  type="password"
                  value={form.novaSenha}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

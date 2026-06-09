import { useState, useEffect, useCallback } from 'react'
import {
  getUsuarios,
  pesquisarUsuarios,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario,
} from '../api/api'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'

const FORM_INICIAL = { nome: '', email: '', senha: '', status: 'ATIVO', role: 'CLIENTE' }

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [termo, setTermo] = useState('')
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(null)
  const [selecionado, setSelecionado] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [salvando, setSalvando] = useState(false)
  const [formErro, setFormErro] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const { data } = termo
        ? await pesquisarUsuarios(termo)
        : await getUsuarios()
      setUsuarios(data)
    } catch {
      setErro('Erro ao carregar usuários.')
    } finally {
      setLoading(false)
    }
  }, [termo])

  useEffect(() => {
    const t = setTimeout(carregar, 300)
    return () => clearTimeout(t)
  }, [carregar])

  function abrirCriar() {
    setForm(FORM_INICIAL)
    setFormErro('')
    setModal('criar')
  }

  function abrirEditar(u) {
    setSelecionado(u)
    setForm({ nome: u.nome, email: u.email, senha: '', status: u.status, role: u.role })
    setFormErro('')
    setModal('editar')
  }

  function abrirExcluir(u) {
    setSelecionado(u)
    setModal('excluir')
  }

  function fecharModal() {
    setModal(null)
    setSelecionado(null)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setFormErro('')
    setSalvando(true)
    try {
      if (modal === 'criar') {
        await criarUsuario(form)
      } else {
        const payload = { ...form }
        if (!payload.senha) delete payload.senha
        await atualizarUsuario(selecionado.id, payload)
      }
      fecharModal()
      carregar()
    } catch (err) {
      setFormErro(err.response?.data?.message || 'Erro ao salvar usuário.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir() {
    setSalvando(true)
    try {
      await excluirUsuario(selecionado.id)
      fecharModal()
      carregar()
    } catch {
      setFormErro('Erro ao excluir usuário.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <div className="page-header">
          <h2>Usuários</h2>
          <button className="btn btn-primary" onClick={abrirCriar}>+ Novo Usuário</button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : usuarios.length === 0 ? (
          <div className="empty">Nenhum usuário encontrado.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.nome}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role === 'ADMIN' ? 'admin' : 'cliente'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${u.status === 'ATIVO' ? 'ativo' : 'inativo'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(u)}>Editar</button>
                      <button className="btn btn-sm btn-danger" onClick={() => abrirExcluir(u)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {(modal === 'criar' || modal === 'editar') && (
        <Modal title={modal === 'criar' ? 'Novo Usuário' : 'Editar Usuário'} onClose={fecharModal}>
          <form onSubmit={handleSalvar}>
            {formErro && <div className="alert alert-error">{formErro}</div>}
            <div className="form-group">
              <label>Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>E-mail *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>{modal === 'criar' ? 'Senha *' : 'Nova Senha (deixe em branco para manter)'}</label>
              <input
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                required={modal === 'criar'}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={fecharModal}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={salvando}>
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'excluir' && (
        <Modal title="Excluir Usuário" onClose={fecharModal}>
          <p>Tem certeza que deseja excluir <strong>{selecionado?.nome}</strong>?</p>
          {formErro && <div className="alert alert-error">{formErro}</div>}
          <div className="form-actions">
            <button className="btn btn-secondary" onClick={fecharModal}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleExcluir} disabled={salvando}>
              {salvando ? 'Excluindo...' : 'Excluir'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

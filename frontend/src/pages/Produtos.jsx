import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getProdutos,
  pesquisarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto,
} from '../api/api'
import Navbar from '../components/Navbar'
import Modal from '../components/Modal'

const FORM_INICIAL = { nome: '', descricao: '', preco: '', quantidade: '', categoria: '' }

export default function Produtos() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'

  const [produtos, setProdutos] = useState([])
  const [termo, setTermo] = useState('')
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [modal, setModal] = useState(null) // null | 'criar' | 'editar' | 'excluir'
  const [selecionado, setSelecionado] = useState(null)
  const [form, setForm] = useState(FORM_INICIAL)
  const [salvando, setSalvando] = useState(false)
  const [formErro, setFormErro] = useState('')

  const carregar = useCallback(async () => {
    setLoading(true)
    setErro('')
    try {
      const { data } = termo
        ? await pesquisarProdutos(termo)
        : await getProdutos()
      setProdutos(data)
    } catch {
      setErro('Erro ao carregar produtos.')
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

  function abrirEditar(p) {
    setSelecionado(p)
    setForm({
      nome: p.nome,
      descricao: p.descricao || '',
      preco: String(p.preco),
      quantidade: String(p.quantidade),
      categoria: p.categoria || '',
    })
    setFormErro('')
    setModal('editar')
  }

  function abrirExcluir(p) {
    setSelecionado(p)
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
      const payload = {
        nome: form.nome,
        descricao: form.descricao || null,
        preco: parseFloat(form.preco),
        quantidade: parseInt(form.quantidade),
        categoria: form.categoria || null,
      }
      if (modal === 'criar') {
        await criarProduto(payload)
      } else {
        await atualizarProduto(selecionado.id, payload)
      }
      fecharModal()
      carregar()
    } catch (err) {
      setFormErro(err.response?.data?.message || 'Erro ao salvar produto.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleExcluir() {
    setSalvando(true)
    try {
      await excluirProduto(selecionado.id)
      fecharModal()
      carregar()
    } catch {
      setFormErro('Erro ao excluir produto.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="page">
      <Navbar />
      <main className="container">
        <div className="page-header">
          <h2>Produtos</h2>
          {isAdmin && (
            <button className="btn btn-primary" onClick={abrirCriar}>+ Novo Produto</button>
          )}
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar por nome, categoria..."
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : produtos.length === 0 ? (
          <div className="empty">Nenhum produto encontrado.</div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th>Descrição</th>
                  {isAdmin && <th>Ações</th>}
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => (
                  <tr key={p.id}>
                    <td><strong>{p.nome}</strong></td>
                    <td><span className="tag">{p.categoria || '—'}</span></td>
                    <td>R$ {Number(p.preco).toFixed(2)}</td>
                    <td>
                      <span className={`stock ${p.quantidade === 0 ? 'out' : p.quantidade <= 5 ? 'low' : 'ok'}`}>
                        {p.quantidade}
                      </span>
                    </td>
                    <td className="desc-cell">{p.descricao || '—'}</td>
                    {isAdmin && (
                      <td className="actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(p)}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => abrirExcluir(p)}>Excluir</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {(modal === 'criar' || modal === 'editar') && (
        <Modal title={modal === 'criar' ? 'Novo Produto' : 'Editar Produto'} onClose={fecharModal}>
          <form onSubmit={handleSalvar}>
            {formErro && <div className="alert alert-error">{formErro}</div>}
            <div className="form-group">
              <label>Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Preço (R$) *</label>
                <input name="preco" type="number" step="0.01" min="0.01" value={form.preco} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Quantidade *</label>
                <input name="quantidade" type="number" min="0" value={form.quantidade} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Categoria</label>
              <input name="categoria" value={form.categoria} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea name="descricao" value={form.descricao} onChange={handleChange} rows={3} />
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
        <Modal title="Excluir Produto" onClose={fecharModal}>
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

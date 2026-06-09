import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const login = (email, senha) =>
  api.post('/auth/login', { email, senha })

export const getProdutos = () => api.get('/produtos')
export const getProduto = (id) => api.get(`/produtos/${id}`)
export const pesquisarProdutos = (termo) => api.get('/produtos/pesquisar', { params: { termo } })
export const criarProduto = (data) => api.post('/produtos', data)
export const atualizarProduto = (id, data) => api.put(`/produtos/${id}`, data)
export const excluirProduto = (id) => api.delete(`/produtos/${id}`)

export const getUsuarios = () => api.get('/usuarios')
export const pesquisarUsuarios = (termo) => api.get('/usuarios/pesquisar', { params: { termo } })
export const criarUsuario = (data) => api.post('/usuarios', data)
export const atualizarUsuario = (id, data) => api.put(`/usuarios/${id}`, data)
export const excluirUsuario = (id) => api.delete(`/usuarios/${id}`)

export const getPerfil = () => api.get('/perfil')
export const atualizarPerfil = (data) => api.put('/perfil', data)

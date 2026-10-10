import axios from 'axios'

const rawUrl =
  import.meta.env.VITE_API_URL || 'https://stay-sphere-pe85.onrender.com'

const baseURL = rawUrl.replace(/\/+$/, '').replace(/\/api$/, '') + '/api'

const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export default api
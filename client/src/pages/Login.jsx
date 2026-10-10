import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setMessage('')
    setError('')

    try {
      const response = await axios.post(
        'https://stay-sphere-pe85.onrender.com/api/users/login',
        formData
      )

      localStorage.setItem('token', response.data.token)
      localStorage.setItem(
        'user',
        JSON.stringify(response.data.user)
      )

      setMessage('Login successful!')

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      setError(
        error.response?.data?.message || 'Login failed'
      )
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-purple-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-purple-700">
            Welcome Back
          </h1>

          <p className="mt-2 font-medium text-gray-500">
            Login to your StaySphere account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block font-bold text-gray-700">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-2xl border border-purple-100 px-4 py-3 font-medium outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div>
            <label className="mb-2 block font-bold text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-purple-100 px-4 py-3 font-medium outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-purple-700 px-6 py-3 font-extrabold text-white transition hover:bg-purple-800"
          >
            Login
          </button>

        </form>

        {message && (
          <p className="mt-5 rounded-xl bg-green-50 p-3 text-center font-bold text-green-700">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-5 rounded-xl bg-red-50 p-3 text-center font-bold text-red-600">
            {error}
          </p>
        )}

        <p className="mt-6 text-center font-medium text-gray-600">
          Don't have an account?{' '}

          <Link
            to="/register"
            className="font-extrabold text-purple-700 hover:text-purple-900"
          >
            Create one
          </Link>
        </p>

      </div>
    </main>
  )
}

export default Login
import { useState } from 'react'
import axios from 'axios'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
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
        'http://localhost:5000/api/users/register',
        formData
      )

      setMessage(response.data.message)

      setFormData({
        name: '',
        email: '',
        password: '',
      })
    } catch (error) {
      setError(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-purple-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-purple-700">
            Create Account
          </h1>

          <p className="mt-2 font-medium text-gray-500">
            Join StaySphere and find your perfect stay
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="mb-2 block font-bold text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full rounded-2xl border border-purple-100 px-4 py-3 font-medium outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

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
              placeholder="Create a password"
              className="w-full rounded-2xl border border-purple-100 px-4 py-3 font-medium text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-purple-700 px-6 py-3 font-extrabold text-white transition hover:bg-purple-800"
          >
            Create Account
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
          Already have an account?{' '}
          <a
            href="/login"
            className="font-extrabold text-purple-700 hover:text-purple-900"
          >
            Login
          </a>
        </p>

      </div>
    </main>
  )
}

export default Register
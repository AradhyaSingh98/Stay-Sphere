import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function HostDashboard() {
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMyProperties = async () => {
      try {
        const response = await api.get('/properties/my')
        setProperties(response.data)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Failed to load your properties'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchMyProperties()
  }, [])

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this property?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await api.delete('/properties/' + id)

      setProperties(
        properties.filter((property) => property._id !== id)
      )
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to delete property'
      )
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-purple-50 px-6 py-16 text-center">
        <p className="font-bold text-purple-700">
          Loading dashboard...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-purple-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-purple-800">
              Host Dashboard
            </h1>

            <p className="mt-2 font-medium text-gray-600">
              Manage your StaySphere properties.
            </p>
          </div>

          <Link
            to="/add-property"
            className="rounded-full bg-purple-700 px-6 py-3 font-extrabold text-white hover:bg-purple-800"
          >
            + Add Property
          </Link>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="font-bold text-gray-500">
              My Properties
            </p>

            <p className="mt-2 text-3xl font-extrabold text-purple-700">
              {properties.length}
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 p-5 font-bold text-red-600">
            {error}
          </div>
        )}

        {!error && properties.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow">
            <div className="text-5xl">🏠</div>

            <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
              No properties yet
            </h2>

            <p className="mt-2 text-gray-500">
              Add your first property to start hosting.
            </p>

            <Link
              to="/add-property"
              className="mt-6 inline-block rounded-full bg-purple-700 px-6 py-3 font-extrabold text-white hover:bg-purple-800"
            >
              Add Your Property
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {properties.map((property) => (
            <div
              key={property._id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
            >
              <img
                  src={
                  property.images?.[0] ||
                  property.image ||
                 'https://via.placeholder.com/800x500?text=StaySphere'
           }
             alt={property.title}
             className="h-56 w-full object-cover"
          />

              <div className="p-6">
                <h2 className="text-xl font-extrabold text-gray-900">
                  {property.title}
                </h2>

                <p className="mt-2 font-semibold text-gray-500">
                  📍 {property.location}
                </p>

                <p className="mt-4 text-2xl font-extrabold text-purple-700">
                  ₹{property.price}
                  <span className="ml-1 text-sm font-semibold text-gray-500">
                    / night
                  </span>
                </p>

                <p className="mt-3 font-semibold text-gray-600">
                  👥 {property.guests} guests
                </p>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() =>
                      navigate(
                        '/edit-property/' + property._id
                      )
                    }
                    className="w-1/2 rounded-full bg-purple-700 px-4 py-3 font-bold text-white hover:bg-purple-800"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(property._id)
                    }
                    className="w-1/2 rounded-full bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <Link
                  to={'/properties/' + property._id}
                  className="mt-3 block rounded-full border border-purple-200 px-4 py-3 text-center font-bold text-purple-700 hover:bg-purple-50"
                >
                  View Property
                </Link>
              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  )
}

export default HostDashboard
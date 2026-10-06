import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings/my')
        setBookings(response.data)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Failed to load bookings'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-purple-50 px-6 py-16 text-center">
        <p className="font-bold text-purple-700">
          Loading your bookings...
        </p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-extrabold text-purple-800">
          My Bookings
        </h1>

        <p className="mt-2 font-medium text-gray-600">
          Manage your StaySphere reservations.
        </p>

        {error && (
          <div className="mt-8 rounded-2xl bg-red-50 p-5 font-bold text-red-600">
            {error}
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="mt-10 rounded-3xl bg-white p-12 text-center shadow">
            <div className="text-5xl">🏠</div>

            <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
              No bookings yet
            </h2>

            <p className="mt-2 text-gray-500">
              Find a property and make your first booking.
            </p>

            <Link
              to="/properties"
              className="mt-6 inline-block rounded-full bg-purple-700 px-6 py-3 font-extrabold text-white hover:bg-purple-800"
            >
              Explore Properties
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-6">

          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="overflow-hidden rounded-3xl bg-white shadow-lg"
            >
              <div className="grid md:grid-cols-3">

                {booking.property && (
                  <img
                    src={booking.property.image}
                    alt={booking.property.title}
                    className="h-64 w-full object-cover md:h-full"
                  />
                )}

                <div className="p-6 md:col-span-2">

                  <div className="flex flex-wrap items-start justify-between gap-3">

                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900">
                        {booking.property?.title ||
                          'Property'}
                      </h2>

                      <p className="mt-2 font-semibold text-gray-500">
                        📍 {booking.property?.location}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-extrabold text-green-700">
                      {booking.status}
                    </span>

                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-3">

                    <div className="rounded-2xl bg-purple-50 p-4">
                      <p className="text-sm font-bold text-gray-500">
                        Check-in
                      </p>

                      <p className="mt-1 font-extrabold text-gray-900">
                        {new Date(
                          booking.checkIn
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-purple-50 p-4">
                      <p className="text-sm font-bold text-gray-500">
                        Check-out
                      </p>

                      <p className="mt-1 font-extrabold text-gray-900">
                        {new Date(
                          booking.checkOut
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-purple-50 p-4">
                      <p className="text-sm font-bold text-gray-500">
                        Guests
                      </p>

                      <p className="mt-1 font-extrabold text-gray-900">
                        👥 {booking.guests}
                      </p>
                    </div>

                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">

                    <div>
                      <p className="text-sm font-bold text-gray-500">
                        Total Price
                      </p>

                      <p className="text-2xl font-extrabold text-purple-700">
                        ₹{booking.totalPrice}
                      </p>
                    </div>

                    {booking.property && (
                      <Link
                        to={`/properties/${booking.property._id}`}
                        className="rounded-full border border-purple-200 px-5 py-2 font-bold text-purple-700 hover:bg-purple-50"
                      >
                        View Property
                      </Link>
                    )}

                  </div>

                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </main>
  )
}

export default MyBookings
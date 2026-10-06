import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedImage, setSelectedImage] = useState(0)

  const [showBooking, setShowBooking] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingMessage, setBookingMessage] = useState('')

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(
          '/properties/' + id
        )

        setProperty(response.data)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Failed to load property'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [id])

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this property?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      await api.delete('/properties/' + id)

      alert('Property deleted successfully')
      navigate('/properties')
    } catch (error) {
      alert(
        error.response?.data?.message ||
          'Failed to delete property'
      )
    }
  }

  const handleBooking = async () => {
    if (!checkIn || !checkOut || !guests) {
      setBookingMessage(
        '❌ Please fill all booking details'
      )
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      setBookingMessage(
        '❌ Please login before booking this property'
      )
      return
    }

    try {
      setBookingLoading(true)
      setBookingMessage('')

      const response = await api.post(
        '/bookings',
        {
          propertyId: property._id,
          checkIn,
          checkOut,
          guests: Number(guests),
        }
      )

      setBookingMessage(
        '✅ ' + response.data.message
      )

      setCheckIn('')
      setCheckOut('')
      setGuests(1)
    } catch (error) {
      setBookingMessage(
        '❌ ' +
          (
            error.response?.data?.message ||
            'Booking failed'
          )
      )
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-purple-50 px-6 py-16 text-center">
        <p className="font-bold text-purple-700">
          Loading property...
        </p>
      </main>
    )
  }

  if (error || !property) {
    return (
      <main className="min-h-screen bg-purple-50 px-6 py-16 text-center">
        <p className="font-bold text-red-600">
          {error || 'Property not found'}
        </p>
      </main>
    )
  }

  const currentUser = JSON.parse(
    localStorage.getItem('user')
  )

  const isOwner =
    currentUser &&
    property.owner &&
    currentUser.id === property.owner._id

  const propertyImages =
    property.images?.length > 0
      ? property.images
      : property.image
        ? [property.image]
        : []

  return (
    <main className="min-h-screen bg-purple-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          to="/properties"
          className="font-bold text-purple-700 hover:text-purple-900"
        >
          ← Back to properties
        </Link>

        <div className="mt-6">

          {/* ================= IMAGE GALLERY ================= */}

          {propertyImages.length > 0 ? (
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl">

              {/* Main Image */}
              <div className="relative">

                <img
                  src={propertyImages[selectedImage]}
                  alt={`${property.title} ${
                    selectedImage + 1
                  }`}
                  className="h-[450px] w-full object-cover"
                />

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-sm font-bold text-white">
                  {selectedImage + 1} / {propertyImages.length}
                </div>

                {/* Previous */}
                {propertyImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage === 0
                          ? propertyImages.length - 1
                          : selectedImage - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-xl font-extrabold text-gray-800 shadow hover:bg-white"
                  >
                    ←
                  </button>
                )}

                {/* Next */}
                {propertyImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        selectedImage ===
                          propertyImages.length - 1
                          ? 0
                          : selectedImage + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-4 py-3 text-xl font-extrabold text-gray-800 shadow hover:bg-white"
                  >
                    →
                  </button>
                )}

              </div>

              {/* Thumbnails */}
              {propertyImages.length > 1 && (
                <div className="grid grid-cols-4 gap-3 p-4 md:grid-cols-6">

                  {propertyImages.map(
                    (image, index) => (
                      <button
                        type="button"
                        key={index}
                        onClick={() =>
                          setSelectedImage(index)
                        }
                        className={`overflow-hidden rounded-2xl border-4 ${
                          selectedImage === index
                            ? 'border-purple-600'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${
                            index + 1
                          }`}
                          className="h-20 w-full object-cover"
                        />
                      </button>
                    )
                  )}

                </div>
              )}

            </div>
          ) : (
            <div className="flex h-[450px] items-center justify-center rounded-3xl bg-white shadow-xl">
              <p className="font-bold text-gray-500">
                No images available
              </p>
            </div>
          )}

          {/* ================= PROPERTY INFO ================= */}

          <div className="mt-6 rounded-3xl bg-white p-8 shadow-xl">

            <h1 className="text-4xl font-extrabold text-gray-900">
              {property.title}
            </h1>

            <p className="mt-3 text-lg font-semibold text-gray-500">
              📍 {property.location}
            </p>

            <div className="mt-6">
              <span className="text-3xl font-extrabold text-purple-700">
                ₹{property.price}
              </span>

              <span className="ml-2 font-medium text-gray-500">
                / night
              </span>
            </div>

            <div className="mt-5 rounded-2xl bg-purple-50 p-5">
              <p className="font-bold text-gray-700">
                👥 Up to {property.guests} guests
              </p>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-extrabold text-gray-900">
                About this stay
              </h2>

              <p className="mt-3 leading-8 text-gray-600">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Amenities
                </h2>

                <div className="mt-4 flex flex-wrap gap-3">
                  {property.amenities.map(
                    (amenity, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-purple-100 px-4 py-2 font-bold text-purple-700"
                      >
                        {amenity}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Host */}
            {property.owner && (
              <div className="mt-8 border-t border-gray-100 pt-8">
                <h2 className="text-2xl font-extrabold text-gray-900">
                  Hosted by
                </h2>

                <p className="mt-3 font-bold text-gray-700">
                  {property.owner.name}
                </p>

                <p className="text-gray-500">
                  {property.owner.email}
                </p>
              </div>
            )}

            {/* Owner Controls */}
            {isOwner && (
              <div className="mt-8 flex flex-wrap gap-3">

                <button
                  onClick={() =>
                    navigate(
                      '/edit-property/' + id
                    )
                  }
                  className="rounded-full bg-purple-700 px-6 py-3 font-bold text-white hover:bg-purple-800"
                >
                  ✏️ Edit Property
                </button>

                <button
                  onClick={handleDelete}
                  className="rounded-full bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-600"
                >
                  🗑️ Delete Property
                </button>

              </div>
            )}

            {/* Booking Button */}
            <button
              onClick={() => {
                setShowBooking(true)
                setBookingMessage('')
              }}
              className="mt-10 w-full rounded-2xl bg-purple-700 px-6 py-4 text-lg font-extrabold text-white transition hover:bg-purple-800"
            >
              Book Now
            </button>

            {/* ================= BOOKING ================= */}

            {showBooking && (
              <div className="mt-6 rounded-3xl border border-purple-100 bg-purple-50 p-6">

                <h2 className="text-2xl font-extrabold text-gray-900">
                  Book this stay
                </h2>

                <p className="mt-2 font-medium text-gray-500">
                  Select your dates and number of guests.
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-3">

                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Check-in
                    </label>

                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) =>
                        setCheckIn(e.target.value)
                      }
                      className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Check-out
                    </label>

                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) =>
                        setCheckOut(e.target.value)
                      }
                      className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 font-semibold outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-bold text-gray-700">
                      Guests
                    </label>

                    <input
                      type="number"
                      min="1"
                      max={property.guests}
                      value={guests}
                      onChange={(e) =>
                        setGuests(e.target.value)
                      }
                      className="w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 font-semibold outline-none"
                    />
                  </div>

                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="mt-6 w-full rounded-2xl bg-purple-700 px-6 py-4 font-extrabold text-white transition hover:bg-purple-800 disabled:opacity-50"
                >
                  {bookingLoading
                    ? 'Booking...'
                    : 'Confirm Booking'}
                </button>

                {bookingMessage && (
                  <div className="mt-4 rounded-2xl bg-white p-4 text-center font-bold">
                    {bookingMessage}
                  </div>
                )}

              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}

export default PropertyDetails


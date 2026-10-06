import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'

function Properties() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [location, setLocation] = useState(
    searchParams.get('location') || ''
  )

  const [minPrice, setMinPrice] = useState(
    searchParams.get('minPrice') || ''
  )

  const [maxPrice, setMaxPrice] = useState(
    searchParams.get('maxPrice') || ''
  )

  const [guests, setGuests] = useState(
    searchParams.get('guests') || ''
  )

  const [amenities, setAmenities] = useState(
    searchParams.get('amenities') || ''
  )

  const [sort, setSort] = useState(
    searchParams.get('sort') || 'newest'
  )

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError('')

        const query = searchParams.toString()

        const response = await api.get(
          query ? `/properties?${query}` : '/properties'
        )

        setProperties(response.data)
      } catch (error) {
        setError(
          error.response?.data?.message ||
            'Failed to load properties'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [searchParams])

  const handleFilter = (e) => {
    e.preventDefault()

    const params = {}

    if (location.trim()) {
      params.location = location.trim()
    }

    if (minPrice) {
      params.minPrice = minPrice
    }

    if (maxPrice) {
      params.maxPrice = maxPrice
    }

    if (guests) {
      params.guests = guests
    }

    if (amenities.trim()) {
      params.amenities = amenities.trim()
    }

    if (sort) {
      params.sort = sort
    }

    setSearchParams(params)
  }

  const clearFilters = () => {
    setLocation('')
    setMinPrice('')
    setMaxPrice('')
    setGuests('')
    setAmenities('')
    setSort('newest')
    setSearchParams({})
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6">

      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}
        <div className="mb-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-purple-600">
                StaySphere
              </p>

              <h1 className="mt-2 text-4xl font-black tracking-tight text-gray-900">
                Explore stays
              </h1>

              <p className="mt-2 font-medium text-gray-500">
                Find a place that feels like home.
              </p>
            </div>

            <div className="rounded-full bg-white px-5 py-3 text-sm font-bold text-gray-600 shadow-sm">
              🏠 {properties.length} stays
            </div>

          </div>

        </div>

        {/* ================= FILTER BAR ================= */}
        <form
          onSubmit={handleFilter}
          className="mb-10 rounded-[2rem] border border-gray-100 bg-white p-4 shadow-lg"
        >

          <div className="grid gap-3 lg:grid-cols-6">

            {/* Location */}
            <div className="rounded-2xl border border-gray-200 px-4 py-3 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
              <label className="block text-xs font-black uppercase tracking-wide text-gray-400">
                Location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Goa, Manali..."
                className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Min price */}
            <div className="rounded-2xl border border-gray-200 px-4 py-3 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
              <label className="block text-xs font-black uppercase tracking-wide text-gray-400">
                Min price
              </label>

              <div className="mt-1 flex items-center gap-1">
                <span className="text-sm font-bold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Any"
                  className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Max price */}
            <div className="rounded-2xl border border-gray-200 px-4 py-3 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
              <label className="block text-xs font-black uppercase tracking-wide text-gray-400">
                Max price
              </label>

              <div className="mt-1 flex items-center gap-1">
                <span className="text-sm font-bold text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="rounded-2xl border border-gray-200 px-4 py-3 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
              <label className="block text-xs font-black uppercase tracking-wide text-gray-400">
                Guests
              </label>

              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                placeholder="Any"
                className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Amenities */}
            <div className="rounded-2xl border border-gray-200 px-4 py-3 transition focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100">
              <label className="block text-xs font-black uppercase tracking-wide text-gray-400">
                Amenities
              </label>

              <input
                type="text"
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
                placeholder="WiFi, AC"
                className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            {/* Sort */}
            <div className="rounded-2xl border border-gray-200 px-4 py-3">
              <label className="block text-xs font-black uppercase tracking-wide text-gray-400">
                Sort
              </label>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
              >
                <option value="newest">
                  Newest
                </option>

                <option value="priceLow">
                  Price: Low → High
                </option>

                <option value="priceHigh">
                  Price: High → Low
                </option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-3">

            <button
              type="submit"
              className="rounded-2xl bg-purple-700 px-7 py-3 font-black text-white shadow-md transition hover:bg-purple-800 hover:shadow-lg"
            >
              🔍 Search stays
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-2xl border border-gray-200 bg-gray-50 px-7 py-3 font-black text-gray-700 transition hover:bg-gray-100"
            >
              ✕ Clear filters
            </button>

          </div>

        </form>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl bg-white shadow-sm"
              >
                <div className="h-64 animate-pulse bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-5 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================= ERROR ================= */}
        {!loading && error && (
          <div className="rounded-3xl border border-red-100 bg-white p-12 text-center shadow-sm">

            <div className="text-5xl">
              ⚠️
            </div>

            <h2 className="mt-4 text-2xl font-black text-gray-900">
              Something went wrong
            </h2>

            <p className="mt-2 font-medium text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-2xl bg-purple-700 px-6 py-3 font-black text-white hover:bg-purple-800"
            >
              Try again
            </button>

          </div>
        )}

        {/* ================= RESULTS ================= */}
        {!loading && !error && (
          <>

            {/* Result heading */}
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  {properties.length}{' '}
                  {properties.length === 1 ? 'stay' : 'stays'} found
                </h2>

                {location && (
                  <p className="mt-1 font-medium text-gray-500">
                    Showing stays in{' '}
                    <span className="font-black text-purple-700">
                      {location}
                    </span>
                  </p>
                )}
              </div>

              <div className="text-sm font-bold text-gray-400">
                {sort === 'priceLow' && 'Sorted by lowest price'}
                {sort === 'priceHigh' && 'Sorted by highest price'}
                {sort === 'newest' && 'Latest properties'}
              </div>

            </div>

            {/* No results */}
            {properties.length === 0 ? (
              <div className="rounded-[2rem] bg-white px-6 py-16 text-center shadow-sm">

                <div className="text-6xl">
                  🏡
                </div>

                <h2 className="mt-5 text-2xl font-black text-gray-900">
                  No stays found
                </h2>

                <p className="mx-auto mt-2 max-w-md font-medium leading-7 text-gray-500">
                  We couldn't find properties matching your current
                  filters. Try another destination or clear your filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-2xl bg-purple-700 px-7 py-3 font-black text-white hover:bg-purple-800"
                >
                  Explore all stays
                </button>

              </div>
            ) : (

              /* ================= PROPERTY GRID ================= */
              <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {properties.map((property) => {

                  const images =
                    property.images?.length > 0
                      ? property.images
                      : property.image
                        ? [property.image]
                        : []

                  const image =
                    images[0] ||
                    'https://via.placeholder.com/800x600?text=StaySphere'

                  return (
                    <Link
                      key={property._id}
                      to={`/properties/${property._id}`}
                      className="group block"
                    >

                      {/* Image */}
                      <div className="relative overflow-hidden rounded-3xl bg-gray-200">

                        <img
                          src={image}
                          alt={property.title}
                          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />

                        {/* Wishlist */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-xl shadow-md backdrop-blur transition hover:scale-110"
                          aria-label="Add to wishlist"
                        >
                          ♡
                        </button>

                        {/* Multiple image badge */}
                        {images.length > 1 && (
                          <div className="absolute bottom-3 left-3 rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                            📷 {images.length} photos
                          </div>
                        )}

                      </div>

                      {/* Content */}
                      <div className="pt-4">

                        <div className="flex items-start justify-between gap-3">

                          <h3 className="line-clamp-1 text-base font-black text-gray-900">
                            {property.title}
                          </h3>

                          <span className="flex shrink-0 items-center gap-1 text-sm font-bold text-gray-700">
                            ⭐ 4.8
                          </span>

                        </div>

                        <p className="mt-1 line-clamp-1 text-sm font-semibold text-gray-500">
                          📍 {property.location}
                        </p>

                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                          {property.description}
                        </p>

                        {/* Amenities */}
                        {property.amenities?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">

                            {property.amenities
                              .slice(0, 3)
                              .map((amenity, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-700"
                                >
                                  {amenity}
                                </span>
                              ))}

                          </div>
                        )}

                        {/* Price */}
                        <div className="mt-4 flex items-end justify-between">

                          <p className="text-lg font-black text-gray-900">
                            ₹{property.price}
                            <span className="text-sm font-medium text-gray-500">
                              {' '}
                              night
                            </span>
                          </p>

                          <p className="text-sm font-bold text-gray-500">
                            👥 {property.guests}
                          </p>

                        </div>

                      </div>

                    </Link>
                  )
                })}

              </div>
            )}

          </>
        )}

      </div>
    </main>
  )
}

export default Properties


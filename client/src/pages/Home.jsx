import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  const [location, setLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [guests, setGuests] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()

    const params = new URLSearchParams()

    if (location.trim()) {
      params.append('location', location.trim())
    }

    if (maxPrice) {
      params.append('maxPrice', maxPrice)
    }

    if (guests) {
      params.append('guests', guests)
    }

    if (checkIn) {
      params.append('checkIn', checkIn)
    }

    if (checkOut) {
      params.append('checkOut', checkOut)
    }

    navigate(`/properties?${params.toString()}`)
  }

  const handleDestination = (destination) => {
    setLocation(destination)

    navigate(
      `/properties?${new URLSearchParams({
        location: destination,
      }).toString()}`
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-800 via-violet-700 to-indigo-900 px-6 pb-24 pt-20 text-white">

        {/* Background decorations */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">

          {/* Hero text */}
          <div className="text-center">

            <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur">
              ✨ Find your next unforgettable stay
            </div>

            <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Your world.
              <span className="block text-purple-200">
                Your stay.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-8 text-purple-100 sm:text-xl">
              Discover beautiful homes, apartments and unique stays
              across amazing destinations.
            </p>

          </div>

          {/* ================= SEARCH BOX ================= */}
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-12 max-w-6xl rounded-[2rem] bg-white p-3 shadow-2xl"
          >
            <div className="grid gap-2 lg:grid-cols-5">

              {/* Destination */}
              <div className="rounded-2xl px-5 py-3 transition hover:bg-gray-50">
                <label className="block text-xs font-black uppercase tracking-wide text-gray-500">
                  Where
                </label>

                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Search destinations"
                  className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Check in */}
              <div className="rounded-2xl px-5 py-3 transition hover:bg-gray-50">
                <label className="block text-xs font-black uppercase tracking-wide text-gray-500">
                  Check-in
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                />
              </div>

              {/* Check out */}
              <div className="rounded-2xl px-5 py-3 transition hover:bg-gray-50">
                <label className="block text-xs font-black uppercase tracking-wide text-gray-500">
                  Check-out
                </label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none"
                />
              </div>

              {/* Guests */}
              <div className="rounded-2xl px-5 py-3 transition hover:bg-gray-50">
                <label className="block text-xs font-black uppercase tracking-wide text-gray-500">
                  Guests
                </label>

                <input
                  type="number"
                  min="1"
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  placeholder="Add guests"
                  className="mt-1 w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              {/* Search */}
              <div className="flex items-center">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-700 px-6 py-5 font-black text-white transition hover:bg-purple-800 hover:shadow-lg"
                >
                  <span className="text-lg">🔍</span>
                  Search
                </button>
              </div>

            </div>

            {/* Budget */}
            <div className="mt-2 border-t border-gray-100 px-5 pt-3">
              <label className="block text-xs font-black uppercase tracking-wide text-gray-500">
                Maximum budget per night
              </label>

              <div className="mt-1 flex items-center gap-2">
                <span className="font-bold text-gray-700">₹</span>

                <input
                  type="number"
                  min="1"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any budget"
                  className="w-full max-w-xs bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

          </form>

        </div>
      </section>

      {/* ================= DESTINATIONS ================= */}
      <section className="px-6 py-14">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-purple-600">
                Explore India
              </p>

              <h2 className="mt-2 text-3xl font-black text-gray-900">
                Popular destinations
              </h2>

              <p className="mt-2 font-medium text-gray-500">
                Start exploring some of our most popular places.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">

            {[
              ['Goa', '🏝️'],
              ['Manali', '🏔️'],
              ['Jaipur', '🏰'],
              ['Udaipur', '🌊'],
              ['Kashmir', '❄️'],
              ['Kerala', '🌴'],
            ].map(([destination, icon]) => (
              <button
                key={destination}
                type="button"
                onClick={() => handleDestination(destination)}
                className="group rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
              >
                <div className="text-4xl transition group-hover:scale-110">
                  {icon}
                </div>

                <p className="mt-4 font-black text-gray-900">
                  {destination}
                </p>

                <p className="mt-1 text-sm font-medium text-gray-500">
                  Explore stays
                </p>
              </button>
            ))}

          </div>
        </div>
      </section>

      {/* ================= WHY STAYSPHERE ================= */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-7xl">

          <div className="text-center">
            <p className="text-sm font-black uppercase tracking-widest text-purple-600">
              Why StaySphere?
            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
              Everything you need for a better stay
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-medium leading-7 text-gray-500">
              From discovering the right property to making a booking,
              StaySphere makes the entire experience simple.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Card 1 */}
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl">
                🏠
              </div>

              <h3 className="mt-6 text-xl font-black text-gray-900">
                Quality Stays
              </h3>

              <p className="mt-3 font-medium leading-7 text-gray-600">
                Explore comfortable homes, apartments and unique
                properties for short and long stays.
              </p>

            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
                🔍
              </div>

              <h3 className="mt-6 text-xl font-black text-gray-900">
                Smart Search
              </h3>

              <p className="mt-3 font-medium leading-7 text-gray-600">
                Search by destination, budget and number of guests
                to quickly find the right property.
              </p>

            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 transition hover:-translate-y-1 hover:shadow-xl">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-3xl">
                🤖
              </div>

              <h3 className="mt-6 text-xl font-black text-gray-900">
                AI Recommendations
              </h3>

              <p className="mt-3 font-medium leading-7 text-gray-600">
                Future-ready personalized recommendations powered
                by machine learning.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-purple-700 to-indigo-800 px-8 py-14 text-center text-white shadow-xl">

          <h2 className="text-3xl font-black sm:text-4xl">
            Ready to find your next stay?
          </h2>

          <p className="mx-auto mt-4 max-w-xl font-medium leading-7 text-purple-100">
            Browse our collection of properties and discover
            a place that feels like home.
          </p>

          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="mt-8 rounded-2xl bg-white px-8 py-4 font-black text-purple-700 transition hover:bg-purple-50 hover:shadow-lg"
          >
            Explore Properties →
          </button>

        </div>
      </section>

    </main>
  )
}

export default Home


import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user'))
  )

  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    setUser(null)
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-purple-100 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold tracking-tight text-purple-700 sm:text-3xl"
        >
          Stay<span className="text-gray-900">Sphere</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">

          <Link
            to="/"
            className={`rounded-full px-4 py-2 font-semibold transition ${
              isActive('/')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            Home
          </Link>

          <Link
            to="/properties"
            className={`rounded-full px-4 py-2 font-semibold transition ${
              isActive('/properties')
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            Explore
          </Link>

          {user && (
            <>
              <Link
                to="/host-dashboard"
                className={`rounded-full px-4 py-2 font-semibold transition ${
                  isActive('/host-dashboard')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                Host Dashboard
              </Link>

              <Link
                to="/my-bookings"
                className={`rounded-full px-4 py-2 font-semibold transition ${
                  isActive('/my-bookings')
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                My Bookings
              </Link>

              <Link
                to="/add-property"
                className="rounded-full bg-purple-700 px-5 py-2 font-bold text-white shadow-sm transition hover:bg-purple-800"
              >
                + Become a Host
              </Link>

              {/* User */}
              <div className="ml-2 flex items-center gap-2 rounded-full bg-purple-50 px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-700 font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>

                <span className="max-w-28 truncate font-semibold text-purple-700">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full bg-red-500 px-5 py-2 font-bold text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="rounded-full border border-purple-200 px-5 py-2 font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-purple-700 px-6 py-2 font-bold text-white shadow-sm transition hover:bg-purple-800"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-purple-200 px-3 py-2 text-xl text-purple-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-purple-100 bg-white px-4 pb-5 pt-3 shadow-lg lg:hidden">

          <div className="flex flex-col gap-2">

            <Link
              to="/"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 font-semibold ${
                isActive('/')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-purple-50'
              }`}
            >
              🏠 Home
            </Link>

            <Link
              to="/properties"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 font-semibold ${
                isActive('/properties')
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-700 hover:bg-purple-50'
              }`}
            >
              🔎 Explore Properties
            </Link>

            {user ? (
              <>
                <Link
                  to="/host-dashboard"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-purple-50"
                >
                  🏠 Host Dashboard
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-semibold text-gray-700 hover:bg-purple-50"
                >
                  📅 My Bookings
                </Link>

                <Link
                  to="/add-property"
                  onClick={closeMenu}
                  className="rounded-xl bg-purple-700 px-4 py-3 text-center font-bold text-white hover:bg-purple-800"
                >
                  + Become a Host
                </Link>

                <div className="mt-2 flex items-center gap-3 rounded-xl bg-purple-50 p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-700 font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Logged in as</p>
                    <p className="font-bold text-purple-700">
                      {user.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-1 rounded-xl bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-purple-200 px-4 py-3 text-center font-bold text-purple-700 hover:bg-purple-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-purple-700 px-4 py-3 text-center font-bold text-white hover:bg-purple-800"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar


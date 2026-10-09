
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

  const closeMenu = () => setMenuOpen(false)

  const isActive = (path) => location.pathname === path

  const navClass = (path) =>
    `rounded-full px-4 py-2 font-semibold transition ${
      isActive(path)
        ? 'bg-[#E8DCCB] text-[#302B26]'
        : 'text-[#766D63] hover:bg-[#F0E7DA] hover:text-[#302B26]'
    }`

  return (
    <nav className="sticky top-0 z-50 border-b border-[#E7DED2] bg-[#FFFCF7]/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="text-2xl font-extrabold tracking-tight text-[#967854] sm:text-3xl"
        >
          Stay<span className="text-[#302B26]">Sphere</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/" className={navClass('/')}>
            Home
          </Link>

          <Link to="/properties" className={navClass('/properties')}>
            Explore
          </Link>

          {user && (
            <>
              <Link to="/host-dashboard" className={navClass('/host-dashboard')}>
                Host Dashboard
              </Link>

              <Link to="/my-bookings" className={navClass('/my-bookings')}>
                My Bookings
              </Link>

              <Link
                to="/add-property"
                className="rounded-full bg-[#B69A78] px-5 py-2 font-bold text-white shadow-sm transition hover:bg-[#967854]"
              >
                + Become a Host
              </Link>

              <div className="ml-2 flex items-center gap-2 rounded-full bg-[#F0E7DA] px-4 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#B69A78] font-bold text-white">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="max-w-28 truncate font-semibold text-[#302B26]">
                  {user.name}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-full bg-[#B94A48] px-5 py-2 font-bold text-white transition hover:bg-[#963B39]"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[#D8C5AE] px-5 py-2 font-semibold text-[#967854] transition hover:bg-[#F0E7DA]"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-full bg-[#B69A78] px-6 py-2 font-bold text-white shadow-sm transition hover:bg-[#967854]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-[#D8C5AE] px-3 py-2 text-xl text-[#967854] transition hover:bg-[#F0E7DA] lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#E7DED2] bg-[#FFFCF7] px-4 pb-5 pt-3 shadow-lg lg:hidden">
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 font-semibold ${
                isActive('/')
                  ? 'bg-[#E8DCCB] text-[#302B26]'
                  : 'text-[#766D63] hover:bg-[#F0E7DA]'
              }`}
            >
              🏠 Home
            </Link>

            <Link
              to="/properties"
              onClick={closeMenu}
              className={`rounded-xl px-4 py-3 font-semibold ${
                isActive('/properties')
                  ? 'bg-[#E8DCCB] text-[#302B26]'
                  : 'text-[#766D63] hover:bg-[#F0E7DA]'
              }`}
            >
              🔎 Explore Properties
            </Link>

            {user ? (
              <>
                <Link
                  to="/host-dashboard"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-semibold text-[#766D63] hover:bg-[#F0E7DA]"
                >
                  🏠 Host Dashboard
                </Link>

                <Link
                  to="/my-bookings"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-semibold text-[#766D63] hover:bg-[#F0E7DA]"
                >
                  📅 My Bookings
                </Link>

                <Link
                  to="/add-property"
                  onClick={closeMenu}
                  className="rounded-xl bg-[#B69A78] px-4 py-3 text-center font-bold text-white hover:bg-[#967854]"
                >
                  + Become a Host
                </Link>

                <div className="mt-2 flex items-center gap-3 rounded-xl bg-[#F0E7DA] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B69A78] font-bold text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-[#766D63]">Logged in as</p>
                    <p className="font-bold text-[#302B26]">{user.name}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-1 rounded-xl bg-[#B94A48] px-4 py-3 font-bold text-white hover:bg-[#963B39]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-[#D8C5AE] px-4 py-3 text-center font-bold text-[#967854] hover:bg-[#F0E7DA]"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="rounded-xl bg-[#B69A78] px-4 py-3 text-center font-bold text-white hover:bg-[#967854]"
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
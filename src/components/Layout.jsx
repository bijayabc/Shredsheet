import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { RiUser3Line, RiLogoutBoxRLine, RiCloseLine, RiMenu3Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import api from '../api/axios';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/workouts', label: 'My Workouts' },
  { to: '/routines', label: 'My Routines' },
  { to: '/weight', label: 'Weight Logs' },
];

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [userData, setUserData] = useState(null)
  const toastShown = useRef(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      const auth_token = localStorage.getItem('auth_token')

      if (!auth_token) {
        if (!toastShown.current) {
          toast.error('You are not logged in!')
          toastShown.current = true
        }
        return navigate('/login')
      }

      try {
        const res = await api.get('/userinfo')
        if (res.data.error) {
          console.log(res.data.error)
          return navigate('/login')
        }
        if (res.data.success) {
          setUserData(res.data.user)
        }
      } catch (error) {
        console.error('Error fetching user data: ', error)
        toast.error('Error loading user data')
        navigate('/login')
      }
    }
    fetchUserData()
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem('workout_log_draft')
    localStorage.removeItem('workout_timer_start')
    toast.success('Logout successful!')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Left: logo + links */}
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-xl font-extrabold tracking-tight text-indigo-600">
                ShredSheet
              </Link>
              <div className="hidden sm:flex items-center gap-1">
                {navLinks.map(({ to, label }) => {
                  const active = location.pathname === to
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
                        active
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right: greeting + icons */}
            <div className="flex items-center gap-2">
              {userData && (
                <span className="hidden sm:block text-sm text-gray-400 font-medium mr-1">
                  {userData.name.split(' ')[0]}
                </span>
              )}
              <Link
                to="/profile"
                title="Profile"
                className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
              >
                <RiUser3Line className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                title="Logout"
                className="hidden sm:flex p-2 rounded-full text-gray-400 hover:text-rose-500 hover:bg-rose-50 transition-colors duration-150"
              >
                <RiLogoutBoxRLine className="h-5 w-5" />
              </button>
              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150"
              >
                {isMenuOpen ? <RiCloseLine className="h-5 w-5" /> : <RiMenu3Line className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden border-t border-gray-100 bg-white px-3 py-2 space-y-1">
            {navLinks.map(({ to, label }) => {
              const active = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-rose-50 hover:text-rose-500 transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      <main>
        <Outlet context={{ userData }} />
      </main>
    </div>
  );
};

export default Layout;
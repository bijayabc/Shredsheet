import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { RiUser3Line, RiLogoutBoxRLine, RiCloseLine, RiMenu3Line } from 'react-icons/ri';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Layout = () => {
  const navigate = useNavigate()
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
        const res = await  api.get('/userinfo')
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
      toast.success('Logout successful!')
      navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/dashboard" className="text-xl md:text-2xl font-bold text-indigo-600">
                  ShredSheet
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/dashboard'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/workouts"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/workouts'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  My Workouts
                </Link>
                <Link
                  to="/routines"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location.pathname === '/routines'
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  My Routines
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 px-4 py-1 text-indigo-700 font-semibold rounded-full">
                Welcome, {userData && userData.name.split(" ")[0]}
              </span>
              <Link
                to="/profile"
                className="text-gray-500 hover:text-gray-700"
                title='profile'
              >
                <RiUser3Line className="h-6 w-6" />
              </Link>
              <button
                className="hidden sm:block ml-4 text-gray-500 hover:text-gray-700"
                onClick={handleLogout}
                title='logout'
              >
                <RiLogoutBoxRLine className="h-6 w-6" />
              </button>
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                {isMenuOpen ? (
                  <RiCloseLine className="h-6 w-6" />
                ) : (
                  <RiMenu3Line className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/dashboard'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/workouts"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/workouts'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Workouts
            </Link>
            <Link
              to="/routines"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                location.pathname === '/routines'
                  ? 'border-indigo-500 text-indigo-700 bg-indigo-50'
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              My Routines
            </Link>
            <div 
            onClick={handleLogout}
              className='border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'>
              Logout
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Outlet context={{userData}}/>
      </main>
    </div>
  );
};

export default Layout;
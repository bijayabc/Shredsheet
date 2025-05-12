import React, { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { RiUser3Line, RiLogoutBoxRLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import axios from 'axios';
import api from '../api/axios';

const Layout = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const toastShown = useRef(false)

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
                <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
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
                className="ml-4 text-gray-500 hover:text-gray-700"
                onClick={handleLogout}
                title='logout'
              >
                <RiLogoutBoxRLine className="h-6 w-6" />
              </button>
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
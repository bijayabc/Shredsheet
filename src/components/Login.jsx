import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate()
  const [savedEmails, setSavedEmails] = useState(() => {
    const stored = localStorage.getItem('autocomplete_emails');
    return stored ? JSON.parse(stored) : { emails: [] };
  });

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const res = await api.post(`/login`, formData)
      
      if (res.data.success) {
        toast.success("Login Successful!")
        const auth_token = res.data.auth_token
        localStorage.setItem('auth_token', auth_token)

        // Save emails to local storage for autocomplete feature
        if (!savedEmails.emails.includes(formData.email)) {
          const updatedEmails = { emails: [...savedEmails.emails, formData.email] };
          setSavedEmails(updatedEmails);
          localStorage.setItem('autocomplete_emails', JSON.stringify(updatedEmails));
        }

        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 422) {
        // Handle validation errors
        toast.error("Please check your email and password.");
      } else if (error.code === 'ERR_NETWORK') {
        // Handle network errors
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error("Login error:", error);
    } finally {
      setIsLoading(false)
    }
  };

  return (
    // Headers
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          ShredSheet
        </h2>
        <h3 className="mt-2 text-center text-xl text-gray-600">
          Sign in to your account
        </h3>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} name='login'>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@example.com"
                  autoComplete="username"
                  value={formData.email}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  list='autocomplete-emails'
                />
                <datalist id='autocomplete-emails'>
                  {
                    savedEmails.emails.map((email, index) => (
                      <option key={index}>{email}</option>
                    ))
                  }
                </datalist>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={formData.password}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Register
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
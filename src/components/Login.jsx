import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Login = () => {
  const navigate = useNavigate()
  const [savedEmails, setSavedEmails] = useState(() => {
    const stored = localStorage.getItem('autocomplete_emails');
    return stored ? JSON.parse(stored) : { emails: [] };
  });

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true)
      const res = await api.post(`/login`, formData)

      if (res.data.success) {
        toast.success("Login Successful!")
        const auth_token = res.data.auth_token
        localStorage.setItem('auth_token', auth_token)

        if (!savedEmails.emails.includes(formData.email)) {
          const updatedEmails = { emails: [...savedEmails.emails, formData.email] };
          setSavedEmails(updatedEmails);
          localStorage.setItem('autocomplete_emails', JSON.stringify(updatedEmails));
        }

        setTimeout(() => navigate('/dashboard'), 1000)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 422) {
        toast.error("Please check your email and password.");
      } else if (error.code === 'ERR_NETWORK') {
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-indigo-600">
          ShredSheet
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit} name="login">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                autoComplete="username"
                value={formData.email}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                list="autocomplete-emails"
              />
              <datalist id="autocomplete-emails">
                {savedEmails.emails.map((email, index) => (
                  <option key={index}>{email}</option>
                ))}
              </datalist>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-indigo-600 transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

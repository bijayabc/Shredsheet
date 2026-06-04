import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', weight: '', dob: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await api.post(`/register`, formData)
      if (res.data.success) {
        toast.success("Registered successfully! 🎉");
        setTimeout(() => navigate('/login'), 1000)
      } else if (res.data.error) {
        toast.error(res.data.error);
      }
    } catch (error) {
      if (error.response?.data?.code === 11000 ||
        (error.response?.data?.error && error.response?.data?.error.includes('duplicate'))) {
        toast.error("This email is already registered. Please use a different email or login.");
      } else if (error.response?.data?.error?.includes('email') &&
        error.response?.data?.error?.includes('invalid')) {
        toast.error("Please enter a valid email address.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.error);
      } else if (error.response?.status === 422) {
        toast.error("Please check your registration details.");
      } else if (error.code === 'ERR_NETWORK') {
        toast.error("Network error. Please check your internet connection.");
      } else {
        toast.error("An unexpected error occurred. Please try again later.");
      }
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const field = (id, label, type, placeholder, autoComplete) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base"
        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
      />
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold tracking-tight text-indigo-600">
          ShredSheet
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Create your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-gray-100 rounded-xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {field('name', 'Full Name', 'text', 'John Smith', 'name')}
            {field('email', 'Email address', 'email', 'email@example.com', 'email')}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                <input
                  id="weight"
                  name="weight"
                  type="number"
                  min="1"
                  placeholder="e.g. 185"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base"
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-base"
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                />
              </div>
            </div>

            {field('password', 'Password', 'password', '••••••••', 'new-password')}
            {field('confirmPassword', 'Confirm Password', 'password', '••••••••', 'new-password')}

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
                  Registering...
                </span>
              ) : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

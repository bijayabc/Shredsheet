import React, { useEffect, useState } from 'react';
import { RiUserSettingsLine, RiLockPasswordLine } from 'react-icons/ri';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Profile = () => {
  // Get userData from context (from Layout)
  const { userData: contextData } = useOutletContext();
  const navigate = useNavigate()

  // Initialize state with an empty object or placeholders
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    joinDate: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Check if contextData is available and update the state accordingly
  useEffect(() => {
    if (contextData) {
      setUserData({
        name: contextData.name || '',
        email: contextData.email || '',
        joinDate: contextData.createdAt || '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [contextData]); // Only run when contextData changes

  if (!contextData) {
    return <div>Loading...</div>; // Show loading until userData is available
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    // Validate required fields first
    if (!userData.name || !userData.email) {
      toast.error("Fields cannot be empty");
      return;
    }

    // Validate passwords if either field is filled
    if (userData.newPassword || userData.confirmPassword) {
      if (userData.newPassword !== userData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      const response = await api.put('/userinfo', userData);
      if (response.data.success) {
        if (userData.email !== contextData.email) {
          toast.success("Profile updated! Please login with your new email", { toastId: "profile-update" });
          localStorage.removeItem('auth_token');
          // Give user time to read the message before navigation
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          toast.success("Profile updated successfully!", { toastId: "profile-update" });
          // Give user time to read the success message
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile", { toastId: "profile-error" });
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl font-semibold text-indigo-600">
                  {userData.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{userData.name}</h3>
                <p className="text-sm text-gray-500">Joined {new Date(userData.joinDate).toLocaleDateString()}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <RiUserSettingsLine className="h-5 w-5 text-gray-400" />
                  <h4 className="text-lg font-medium text-gray-900">Account Information</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                      value={userData.name}
                      required
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                      value={userData.email}
                      required
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-3 mb-4">
                  <RiLockPasswordLine className="h-5 w-5 text-gray-400" />
                  <h4 className="text-lg font-medium text-gray-900">Change Password</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                      value={userData.newPassword}
                      onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                      autoComplete="new-password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                    <input
                      type="password"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                      value={userData.confirmPassword}
                      onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
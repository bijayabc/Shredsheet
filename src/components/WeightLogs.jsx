import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiScalesLine, RiDeleteBin6Line } from 'react-icons/ri';
import api from '../api/axios';

const WeightLogs = () => {
  const navigate = useNavigate()
  const { userData } = useOutletContext();
  const [weightData, setWeightData] = useState({
    date: '',
    weight: ''
  });

  if (!userData) {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/weight', weightData);
      if (res.data.success) {
        toast.success("Weight logged successfully!");
        setTimeout(() => {
          navigate(0)
        }, 1000);
        setWeightData({ date: '', weight: '' }); // Reset form
      }
    } catch (error) {
      toast.error("Failed to log weight. Please try again.");
      console.error("Error logging weight:", error);
    }
  };

  const handleDelete = async (weightId) => {
    try {
      const res = await api.delete(`/weight/${weightId}`);
      if (res.data.success) {
        toast.success("Weight log deleted successfully!");
        setTimeout(() => {
          navigate(0);
        }, 1000);
      }
    } catch (error) {
      toast.error("Failed to delete weight log. Please try again.");
      console.error("Error deleting weight:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Weight History</h2>
        </div>

        {/* Weight History List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            {userData.weights && userData.weights.length > 0 ? (
              <div className="space-y-4">
                {userData.weights.map((weight, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <RiScalesLine className="h-5 w-5 text-indigo-500" />
                      <span className="text-sm sm:text-lg text-gray-500">
                      {new Date(weight.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="sm:text-lg font-medium text-gray-900">
                        {weight.weight}lbs / {(weight.weight * 0.453592).toFixed(1)}kg
                      </span>
                      <button
                        onClick={() => handleDelete(weight._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Delete weight log"
                      >
                        <RiDeleteBin6Line className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No weight logs found. Start tracking below!</p>
              </div>
            )}
          </div>
        </div>

        {/* Weight Log Form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Log New Weight</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    value={weightData.date}
                    onChange={(e) => setWeightData({ ...weightData, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (lbs)</label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
                    value={weightData.weight}
                    onChange={(e) => setWeightData({ ...weightData, weight: e.target.value })}
                    placeholder="Enter weight in lbs"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Log Weight
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightLogs;
import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiScalesLine, RiDeleteBin6Line, RiArrowUpLine, RiArrowDownLine } from 'react-icons/ri';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../api/axios';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-teal-200 rounded-lg shadow-md px-3 py-2 text-sm">
        <p className="text-gray-500">{payload[0].payload.fullDate}</p>
        <p className="font-semibold text-teal-700">{payload[0].value} lbs</p>
      </div>
    )
  }
  return null
}

const WeightLogs = () => {
  const navigate = useNavigate()
  const { userData } = useOutletContext();
  const [weightData, setWeightData] = useState({ date: '', weight: '' });

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-pulse">
        <div className="px-4 py-6 sm:px-0">
          <div className="h-7 bg-gray-200 rounded w-40 mb-6" />
          <div className="bg-white rounded-xl p-6 mb-6 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-14" />
            ))}
          </div>
          <div className="bg-white rounded-xl p-6">
            <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="flex justify-end">
              <div className="h-9 bg-gray-200 rounded-lg w-24" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/weight', weightData);
      if (res.data.success) {
        toast.success("Weight logged successfully!");
        setTimeout(() => navigate(0), 1000);
        setWeightData({ date: '', weight: '' });
      }
    } catch (error) {
      toast.error("Failed to log weight. Please try again.");
      console.error("Error logging weight:", error);
    }
  };

  const handleDelete = async (weightId) => {
    if (!window.confirm('Are you sure you want to delete this weight log?')) return
    try {
      const res = await api.delete(`/weight/${weightId}`);
      if (res.data.success) {
        toast.success("Weight log deleted successfully!");
        setTimeout(() => navigate(0), 1000);
      }
    } catch (error) {
      toast.error("Failed to delete weight log. Please try again.");
      console.error("Error deleting weight:", error);
    }
  };

  const weights = userData.weights ?? []

  // Sort chronologically for the chart
  const sorted = [...weights].sort((a, b) => new Date(a.date) - new Date(b.date))

  const chartData = sorted.map((w) => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    fullDate: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }),
    weight: w.weight,
  }))

  const first = sorted[0]?.weight
  const latest = sorted[sorted.length - 1]?.weight
  const lowest = Math.min(...sorted.map(w => w.weight))
  const change = first != null && latest != null ? +(latest - first).toFixed(1) : null
  const gained = change > 0

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Weight History</h2>

        {weights.length >= 2 && (
          <>
            {/* Stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 mb-1">Start</p>
                <p className="text-xl font-bold text-gray-900">{first} <span className="text-sm font-normal text-gray-400">lbs</span></p>
              </div>
              <div className="bg-teal-50 rounded-xl border border-teal-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 mb-1">Current</p>
                <p className="text-xl font-bold text-teal-700">{latest} <span className="text-sm font-normal text-teal-400">lbs</span></p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <p className="text-xs text-gray-400 mb-1">Lowest</p>
                <p className="text-xl font-bold text-gray-900">{lowest} <span className="text-sm font-normal text-gray-400">lbs</span></p>
              </div>
              <div className={`rounded-xl border shadow-sm p-4 ${gained ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                <p className="text-xs text-gray-400 mb-1">Total Change</p>
                <p className={`text-xl font-bold flex items-center gap-1 ${gained ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {gained ? <RiArrowUpLine className="h-5 w-5" /> : <RiArrowDownLine className="h-5 w-5" />}
                  {Math.abs(change)} <span className="text-sm font-normal ml-1">lbs</span>
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                  <YAxis
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#0d9488"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: '#0d9488', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#0d9488' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* Weight History List */}
        <div className="bg-white shadow-sm border border-gray-100 overflow-hidden sm:rounded-xl mb-6">
          <div className="px-4 py-5 sm:p-6">
            {weights.length > 0 ? (
              <div className="space-y-3">
                {weights.map((weight) => (
                  <div key={weight._id} className="flex items-center justify-between p-4 border-l-4 border-teal-400 bg-teal-50 rounded-r-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <RiScalesLine className="h-4 w-4 text-teal-600" />
                      </div>
                      <span className="text-sm sm:text-base text-gray-600 font-medium">
                        {new Date(weight.date).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-base font-semibold text-teal-700">
                        {weight.weight} lbs <span className="text-sm font-normal text-gray-400">/ {(weight.weight * 0.453592).toFixed(1)} kg</span>
                      </span>
                      <button
                        onClick={() => handleDelete(weight._id)}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                        title="Delete weight log"
                      >
                        <RiDeleteBin6Line className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="h-14 w-14 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-3">
                  <RiScalesLine className="h-7 w-7 text-teal-400" />
                </div>
                <p className="text-gray-500 text-sm">No weight logs yet. Start tracking below!</p>
              </div>
            )}
          </div>
        </div>

        {/* Log Form */}
        <div className="bg-white shadow-sm border border-gray-100 sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Log New Weight</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 h-10 px-2"
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
                    className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2"
                    value={weightData.weight}
                    onChange={(e) => setWeightData({ ...weightData, weight: parseFloat(e.target.value) })}
                    placeholder="Enter weight in lbs"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 rounded-lg text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 transition-colors"
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

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiDeleteBin6Line, RiMore2Line, RiArrowLeftSLine } from 'react-icons/ri';
import api from '../api/axios';

const WorkoutInfo = () => {
  const location = useLocation()
  const workout = location.state?.workout
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  const handleDelete = async (e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (!window.confirm('Are you sure you want to delete this workout?')) return
    try {
      const res = await api.delete('/workout', {
        data: workout
      })
      if (res.data.success) {
        toast.success("Workout deleted successfully!")
        setTimeout(() => {
          navigate('/workouts')
        }, 1000);
      } else {
        if ((res.data.error)) {
          toast.error(res.data.error)
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("Error Deleting Workout: ", error)
    }
  }

  if (!workout) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Workout Logs</h2>
            <p className="text-gray-600 mb-4">You haven't logged any workouts yet.</p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Log a workout
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/workouts"
              className="p-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shrink-0"
              aria-label="Back"
            >
              <RiArrowLeftSLine className="h-5 w-5" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 truncate">{workout.title}</h2>
          </div>

          <div className="relative shrink-0 ml-3" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="p-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              aria-label="Actions"
            >
              <RiMore2Line className="h-5 w-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <RiDeleteBin6Line className="h-4 w-4" />
                  Delete Workout
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-50 shadow-sm border border-indigo-100 overflow-hidden sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6 flex flex-wrap gap-3">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 text-sm text-indigo-700 font-medium">
                {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-700 font-medium">
                {workout.duration} min
              </span>
              {workout.body_parts && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-sm text-slate-700 font-medium">
                  {workout.body_parts}
                </span>
              )}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-base font-semibold text-gray-900 mb-3">Exercises</h3>
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="mb-3 p-4 border border-indigo-100 rounded-lg bg-white">
                  <h4 className="text-sm font-semibold text-gray-900">{exercise.name}</h4>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="text-sm text-gray-500">Set 1: {exercise.set_1}</div>
                    <div className="text-sm text-gray-500">Set 2: {exercise.set_2}</div>
                    <div className="text-sm text-gray-500">Set 3: {exercise.set_3}</div>
                  </div>
                  {exercise.notes && (
                    <div className="mt-3 px-3 py-2 bg-amber-100 border-l-4 border-amber-500 rounded-r text-sm text-gray-700 italic">
                      {exercise.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutInfo;

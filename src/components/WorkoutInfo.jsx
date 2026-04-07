import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiDeleteBin6Line } from 'react-icons/ri';
import api from '../api/axios';

const WorkoutInfo = () => {
  const location = useLocation()
  const workout = location.state?.workout
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this workout?')) return
    try {
      const res = await api.delete('/workout', {
        data: workout // different syntax for delete route
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
          <div className="flex items-center gap-3">
            <Link
              to="/workouts"
              className="text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors duration-150"
            >
              ← Back
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">{workout.title}</h2>
          </div>
          <button
            onClick={handleDelete}
            title="Delete workout"
            className="p-2 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors duration-200"
          >
            <RiDeleteBin6Line className="h-5 w-5" />
          </button>
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';

const WorkoutInfo = () => {
  const location = useLocation()
  const workout = location.state?.workout
  const navigate = useNavigate()

  const handleDelete = async (e) => {
    e.preventDefault()
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
        <div className="flex flex-col gap-2 sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{workout.title}</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200"
            >
              Delete
            </button>
            <Link
              to="/workouts"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Date</span>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Duration</span>
                  <p className="mt-1 text-sm text-gray-900">{workout.duration} minutes</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Body Parts</span>
                  <p className="mt-1 text-sm text-gray-900">{workout.body_parts}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Exercises</h3>
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                  <h4 className="text-md font-medium text-gray-900">{exercise.name}</h4>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-sm text-gray-500">Set 1: {exercise.set_1}</div>
                    <div className="text-sm text-gray-500">Set 2: {exercise.set_2}</div>
                    <div className="text-sm text-gray-500">Set 3: {exercise.set_3}</div>
                  </div>
                  {exercise.notes && (
                    <div className="mt-2 text-sm text-gray-500">
                      Notes: {exercise.notes}
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
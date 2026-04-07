import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiDeleteBin6Line } from 'react-icons/ri';
import api from '../api/axios';

const RoutineInfo = () => {
  const location = useLocation()
  const routine = location.state?.routine
  const navigate = useNavigate()

  const handleDelete = async(e) => {
    e.preventDefault()
    if (!window.confirm('Are you sure you want to delete this routine?')) return
    try {
      const res = await api.delete('/routine', {
        data: routine // different syntax for delete route
      })
      if (res.data.success) {
        toast.success("Routine deleted successfully!")
        setTimeout(() => {
          navigate('/routines')
        }, 1000);
      } else {
        if ((res.data.error)) {
          toast.error(res.data.error)
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("Error Deleting Routine: ", error)
    }
  }

  if (!routine) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Routines</h2>
            <p className="text-gray-600 mb-4">You don't have any saved routines.</p>
            <Link
              to="/routines/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create a Routine
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <Link
              to="/routines"
              className="text-sm font-medium text-gray-400 hover:text-rose-500 transition-colors duration-150"
            >
              ← Back
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">{routine.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/workouts/new"
              state={{ routineExercises: routine.exercises }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-500 hover:bg-indigo-600 transition-colors duration-200"
            >
              Log
            </Link>
            <Link
              to={`/routines/edit/${routine._id}`}
              state={{ routine }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors duration-200"
            >
              Update
            </Link>
            <button
              onClick={handleDelete}
              title="Delete routine"
              className="p-2 rounded-lg text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors duration-200"
            >
              <RiDeleteBin6Line className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="bg-rose-50 shadow-sm border border-rose-100 overflow-hidden sm:rounded-xl">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-3">
              {routine.exercises.map((exercise) => (
                <div key={exercise._id} className="p-4 border border-rose-100 rounded-lg bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-medium text-gray-900">{exercise.name}</h4>
                    <span className="text-sm text-gray-500">1RM: {exercise.one_rep_max}lbs</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

export default RoutineInfo;
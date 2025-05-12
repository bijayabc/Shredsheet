import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';

const RoutineInfo = () => {
  const location = useLocation()
  const routine = location.state?.routine
  const navigate = useNavigate()

  const handleDelete = async(e) => {
    e.preventDefault()
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
        <div className="flex flex-col gap-2 sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{routine.title}</h2>
          <div className="flex gap-4 items-center">
            <Link
              to={`/routines/edit/${routine._id}`}
              state={{ routine }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-500 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Update
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-500 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors duration-200"
            >
              Delete
            </button>
            <Link
              to="/routines"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Back
            </Link>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {routine.exercises.map((exercise) => (
                <div key={exercise._id} className="p-4 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-md font-medium text-gray-900">{exercise.name}</h4>
                    <span className="text-sm text-gray-500">1RM: {exercise.one_rep_max}lbs</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
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

export default RoutineInfo;
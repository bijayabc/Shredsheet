import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RiDeleteBin6Line, RiMore2Line, RiEditLine, RiAddLine, RiArrowLeftSLine } from 'react-icons/ri';
import api from '../api/axios';

const RoutineInfo = () => {
  const location = useLocation()
  const routine = location.state?.routine
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

  const handleDelete = async(e) => {
    e.preventDefault()
    setMenuOpen(false)
    if (!window.confirm('Are you sure you want to delete this routine?')) return
    try {
      const res = await api.delete('/routine', {
        data: routine
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/routines"
              className="p-2 rounded-lg text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 shrink-0"
              aria-label="Back"
            >
              <RiArrowLeftSLine className="h-5 w-5" />
            </Link>
            <h2 className="text-2xl font-bold text-gray-900 truncate">{routine.title}</h2>
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
                <Link
                  to="/workouts/new"
                  state={{ routineExercises: routine.exercises }}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <RiAddLine className="h-4 w-4" />
                  Log Workout
                </Link>
                <Link
                  to={`/routines/edit/${routine._id}`}
                  state={{ routine }}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                >
                  <RiEditLine className="h-4 w-4" />
                  Edit Routine
                </Link>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-rose-600 hover:bg-rose-50 transition-colors border-t border-gray-100"
                >
                  <RiDeleteBin6Line className="h-4 w-4" />
                  Delete Routine
                </button>
              </div>
            )}
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

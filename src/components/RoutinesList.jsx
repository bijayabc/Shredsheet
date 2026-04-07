import React from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import RoutineCard from './RoutineCard';
import { RiFlashlightLine } from 'react-icons/ri';

const Routines = () => {
  const navigate = useNavigate()
  const { userData } = useOutletContext()

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-pulse">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="h-7 bg-gray-200 rounded w-32" />
            <div className="h-9 bg-gray-200 rounded w-36" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-16" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const routines = userData.routines

  const handleClick = (routine) => {
    navigate(`/routines/${routine._id}`, { state: { routine } })
  }

  if (!routines || routines.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
              <RiFlashlightLine className="h-8 w-8 text-rose-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">No routines yet</h2>
            <p className="text-gray-500 mb-6 max-w-xs">Build a reusable plan and it'll appear here, ready to log from.</p>
            <Link
              to="/routines/new"
              className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-rose-500 hover:bg-rose-600 transition-colors"
            >
              Create your first routine
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
          <h2 className="text-2xl font-bold text-gray-900">My Routines</h2>
          <Link
            to="/routines/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-500 hover:bg-rose-600"
          >
            Create New Routine
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routines.map((routine) => (
            <RoutineCard
              key={routine._id}
              title={routine.title}
              exerciseCount={routine.exercises.length}
              clickfn={() => handleClick(routine)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Routines;

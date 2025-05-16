import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import RoutineCard from './RoutineCard';

const Routines = () => {
  const navigate = useNavigate()
  const { userData } = useOutletContext()
  if (!userData) {
    return <div>Loading...</div>;
  }
  const routines = userData.routines

  const handleClick = (routine) =>{
    navigate(`/routines/${routine._id}`, {
      state: {
        routine
      }
    })
  }

  // Show empty state if no routines exist
  if (!routines || routines.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Routines Found</h2>
            <p className="text-gray-600 mb-4">You haven't created any routines yet.</p>
            <Link
              to="/routines/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Your First Routine
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
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
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
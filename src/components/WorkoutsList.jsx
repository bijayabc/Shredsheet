import { Link, useOutletContext } from 'react-router-dom';
import WorkoutCard from './WorkoutCard';
import { useNavigate } from 'react-router-dom';


const WorkoutsList = () => {
  const navigate = useNavigate()
  const { userData } = useOutletContext()
  if (!userData) {
    return <div>Loading...</div>;
  }
  const workouts = userData.workouts

  const handleClick = (workout) => {
    navigate(`/workouts/${workout._id}`, {
      state: {
        workout
      }
    })
  }

  // Show empty state if no routines exist
    if (!workouts || workouts.length === 0) {
      return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Workout Logs Found</h2>
              <p className="text-gray-600 mb-4">You haven't logged any workouts yet.</p>
              <Link
                to="/workouts/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Log Your First Workout
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
          <h2 className="text-2xl font-bold text-gray-900">My Workouts</h2>
          <Link
            to="/workouts/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add New Workout
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              title={workout.title}
              date={new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
              duration={workout.duration}
              exercises={workout.exercises.length}
              clickfn={() => handleClick(workout)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutsList;
import { Link, useOutletContext } from 'react-router-dom';
import WorkoutCard from './WorkoutCard';
import { useNavigate } from 'react-router-dom';
import { RiFileListLine } from 'react-icons/ri';

const WorkoutsList = () => {
  const navigate = useNavigate()
  const { userData } = useOutletContext()

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 animate-pulse">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <div className="h-7 bg-gray-200 rounded w-36" />
            <div className="h-9 bg-gray-200 rounded w-36" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-20" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const workouts = userData.workouts

  const handleClick = (workout) => {
    navigate(`/workouts/${workout._id}`, { state: { workout } })
  }

  if (!workouts || workouts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
              <RiFileListLine className="h-8 w-8 text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">No workouts yet</h2>
            <p className="text-gray-500 mb-6 max-w-xs">Start logging your sessions and they'll show up here.</p>
            <Link
              to="/workouts/new"
              className="inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Log your first workout
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
          {workouts.map((workout) => {
            const dateOnly = workout.date.split('T')[0];
            const [year, month, day] = dateOnly.split('-');
            const localDate = new Date(year, month - 1, day);
            const formattedDate = localDate.toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });
            return (
              <WorkoutCard
                key={workout._id}
                title={workout.title}
                date={formattedDate}
                duration={workout.duration}
                exercises={workout.exercises.length}
                clickfn={() => handleClick(workout)}
              />
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default WorkoutsList;

import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { RiFileListLine, RiScalesLine, RiFlashlightLine, RiAddLine, RiListCheck2, RiTimeLine } from 'react-icons/ri';

const Dashboard = () => {
  const { userData } = useOutletContext()
  const navigate = useNavigate()
  if (!userData) {
    return <div>Loading...</div>;
  }
  const workouts = userData.workouts

  const dashboard_workouts = workouts.length > 5 ? workouts.slice(0, 5) : workouts;

  const handleClick = (workout) => {
    navigate(`/workouts/${workout._id}`, {
      state: {
        workout
      }
    })
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <Link to="/workouts" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RiFileListLine className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-3 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Workout Logs</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{userData.workouts.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/profile" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RiScalesLine className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Weight</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{userData.weight} lbs</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/routines" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RiFlashlightLine className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate"> All Routines</dt>
                  <dd className="text-2xl font-semibold text-gray-900">{userData.routines.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
        
        <Link to="/timer" className="bg-white overflow-hidden shadow rounded-lg hover:bg-gray-50">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <RiTimeLine className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Timer</dt>
                  <dd className="text-2xl font-semibold text-gray-900">Start</dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h2>
          <Link to="/workouts" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        <div className="mt-4 space-y-4">
          {dashboard_workouts.map((workout) => (
            <div 
              key={workout._id} 
              className="px-4 py-5 sm:px-6 bg-white shadow  sm:rounded-lg hover:bg-gray-50 transition-colors duration-200"
              onClick={() => handleClick(workout)}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-indigo-600">{workout.title}</div>
                <div className="text-sm text-gray-500">
                  {new Date(workout.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
              </div>
              <div className="mt-1 flex justify-between">
                <div className="sm:flex mt-1">
                  <p className="text-sm text-gray-500">{workout.duration} minutes</p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>Completed {workout.exercises.length} exercises</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/workouts/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-shrink-0">
              <RiAddLine className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Add New Workout</p>
              <p className="text-sm text-gray-500">Log your latest workout session</p>
            </div>
          </Link>

          <Link
            to="/routines/new"
            className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
          >
            <div className="flex-shrink-0">
              <RiListCheck2 className="h-6 w-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-sm font-medium text-gray-900">Create New Routine</p>
              <p className="text-sm text-gray-500">Design your workout routine</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
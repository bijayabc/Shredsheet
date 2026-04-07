import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { RiFileListLine, RiScalesLine, RiFlashlightLine, RiAddLine, RiListCheck2, RiTimeLine } from 'react-icons/ri';

const Dashboard = () => {
  const { userData } = useOutletContext()
  const navigate = useNavigate()

  const TIMER_KEY = 'workout_timer_start'
  const MAX_DURATION = 30 * 60 * 1000

  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const startTimeRef = useRef(null)
  const [hasDraft] = useState(() => !!localStorage.getItem('workout_log_draft'))

  useEffect(() => {
    const saved = localStorage.getItem(TIMER_KEY)
    if (saved) {
      const startTime = parseInt(saved, 10)
      const alreadyElapsed = Date.now() - startTime
      if (alreadyElapsed < MAX_DURATION) {
        startTimeRef.current = startTime
        setElapsed(alreadyElapsed)
        setIsRunning(true)
      } else {
        localStorage.removeItem(TIMER_KEY)
      }
    }
  }, [])

  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        const newElapsed = Date.now() - startTimeRef.current
        if (newElapsed >= MAX_DURATION) {
          setElapsed(MAX_DURATION)
          setIsRunning(false)
          localStorage.removeItem(TIMER_KEY)
        } else {
          setElapsed(newElapsed)
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleTimerClick = () => {
    if (isRunning) {
      setIsRunning(false)
      setElapsed(0)
      startTimeRef.current = null
      localStorage.removeItem(TIMER_KEY)
    } else {
      const now = Date.now()
      startTimeRef.current = now
      localStorage.setItem(TIMER_KEY, now.toString())
      setIsRunning(true)
    }
  }

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 animate-pulse">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-xl p-5 h-24" />
          ))}
        </div>
        <div className="mt-8">
          <div className="h-5 bg-gray-200 rounded w-36 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-16" />
            ))}
          </div>
        </div>
        <div className="mt-8">
          <div className="h-5 bg-gray-200 rounded w-28 mb-4" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-gray-100 rounded-xl h-20" />
            <div className="bg-gray-100 rounded-xl h-20" />
          </div>
        </div>
      </div>
    )
  }
  const workouts = userData.workouts
  const dashboard_workouts = workouts.length > 3 ? workouts.slice(0, 3) : workouts;

  const handleClick = (workout) => {
    navigate(`/workouts/${workout._id}`, { state: { workout } })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">

      {/* Draft banner */}
      {hasDraft && (
        <Link
          to="/workouts/new"
          className="flex items-center justify-between mb-5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm"
        >
          <span className="text-amber-800 font-medium">You have an unsaved workout draft</span>
          <span className="text-amber-600 font-semibold">Continue →</span>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Link to="/workouts" className="bg-indigo-50 rounded-xl shadow-sm border border-indigo-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <RiFileListLine className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Workout Logs</p>
              <p className="text-2xl font-bold text-gray-900">{userData.workouts.length}</p>
            </div>
          </div>
        </Link>

        <Link to="/profile" className="bg-teal-50 rounded-xl shadow-sm border border-teal-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
              <RiScalesLine className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="text-2xl font-bold text-gray-900">{userData.weight} <span className="text-sm font-normal text-gray-400">lbs</span></p>
            </div>
          </div>
        </Link>

        <Link to="/routines" className="bg-rose-50 rounded-xl shadow-sm border border-rose-100 p-5 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
              <RiFlashlightLine className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Routines</p>
              <p className="text-2xl font-bold text-gray-900">{userData.routines.length}</p>
            </div>
          </div>
        </Link>

        <button
          onClick={handleTimerClick}
          className={`rounded-xl shadow-sm border p-5 hover:shadow-md transition-all duration-200 text-left w-full ${
            isRunning ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
              isRunning ? 'bg-emerald-100' : 'bg-gray-100'
            }`}>
              <RiTimeLine className={`h-6 w-6 ${isRunning ? 'text-emerald-600' : 'text-gray-500'}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{isRunning ? 'Tap to Stop' : 'Start Timer'}</p>
              <p className={`text-2xl font-bold ${isRunning ? 'text-emerald-600' : 'text-gray-900'}`}>
                {isRunning ? formatTime(elapsed) : '00:00'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link to="/workouts" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {dashboard_workouts.map((workout) => {
            const dateOnly = workout.date.split('T')[0];
            const [year, month, day] = dateOnly.split('-');
            const localDate = new Date(year, month - 1, day);
            const formattedDate = localDate.toLocaleDateString('en-US', {
              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
            });
            return (
              <div
                key={workout._id}
                className="bg-indigo-50 border-l-4 border-indigo-400 rounded-lg shadow-sm px-4 py-4 hover:shadow-md hover:border-indigo-500 transition-all duration-200 cursor-pointer"
                onClick={() => handleClick(workout)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{workout.title}</span>
                  <span className="text-xs text-gray-400">{formattedDate}</span>
                </div>
                <div className="mt-1 flex gap-4">
                  <span className="text-sm text-gray-500">{workout.duration} min</span>
                  <span className="text-sm text-gray-500">{workout.exercises.length} exercises</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            to="/workouts/new"
            className="bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-indigo-300 transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <RiAddLine className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Add New Workout</p>
              <p className="text-sm text-gray-500">Log your latest session</p>
            </div>
          </Link>

          <Link
            to="/routines/new"
            className="bg-rose-50 rounded-xl border border-rose-100 shadow-sm px-5 py-4 flex items-center gap-4 hover:shadow-md hover:border-rose-300 transition-all duration-200"
          >
            <div className="h-10 w-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
              <RiListCheck2 className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Create New Routine</p>
              <p className="text-sm text-gray-500">Design your workout plan</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
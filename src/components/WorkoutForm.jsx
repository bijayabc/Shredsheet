import { useEffect, useRef, useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

let pendingRoutineConflict = false;

const WorkoutForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const routineExercises = location.state?.routineExercises ?? null
  const toastShown = useRef(false);
  const conflictHandled = useRef(false);

  const [workoutData, setWorkoutData] = useState(() => {
    const defaultData = {
      title: '',
      duration: '',
      body_parts: '',
      date: '',
      exercises: [{ id: Date.now(), name: '', set_1: '', set_2: '', set_3: '' }]
    }

    if (routineExercises && routineExercises.length > 0) {
      const draftString = localStorage.getItem('workout_log_draft')
      if (draftString) {
        // Draft exists — load it for now; useEffect will ask the user
        pendingRoutineConflict = true
        try {
          const parsed = JSON.parse(draftString)
          if (parsed.draftData) return parsed.draftData
        } catch { /* fall through to defaultData */ }
      }
      return {
        ...defaultData,
        exercises: routineExercises.map(ex => ({
          id: Date.now() + Math.random(),
          name: ex.name,
          set_1: ex.set_1,
          set_2: ex.set_2,
          set_3: ex.set_3,
        }))
      }
    }

    try {
      const draftString = localStorage.getItem('workout_log_draft')
      if (draftString) {
        const parsedDraft = JSON.parse(draftString)
        if (parsedDraft.draftData) return parsedDraft.draftData
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
    return defaultData
  });

  useEffect(() => {
    if (pendingRoutineConflict && !conflictHandled.current) {
      conflictHandled.current = true
      pendingRoutineConflict = false
      const confirmed = window.confirm(
        "You have a saved draft. Discard it and load routine exercises instead?"
      )
      if (confirmed) {
        localStorage.removeItem('workout_log_draft')
        setWorkoutData({
          title: '', duration: '', body_parts: '', date: '',
          exercises: routineExercises.map(ex => ({
            id: Date.now() + Math.random(),
            name: ex.name,
            set_1: ex.set_1,
            set_2: ex.set_2,
            set_3: ex.set_3,
          }))
        })
        toast.info("Draft discarded — routine exercises loaded.")
      } else {
        toast.success("Loading your saved workout draft!")
      }
    } else if (!toastShown.current) {
      toastShown.current = true
      const draftString = localStorage.getItem('workout_log_draft')
      if (draftString) {
        toast.success("Loading your saved workout draft!")
      }
    }
  }, []);

  const addExercise = () => {
    setWorkoutData({
      ...workoutData,
      exercises: [...workoutData.exercises, { id: Date.now(), name: '', set_1: '', set_2: '', set_3: '' }],
    });
  };

  const handleClearForm = () => {
    setWorkoutData({
      title: '', duration: '', body_parts: '', date: '',
      exercises: [{ id: Date.now(), name: '', set_1: '', set_2: '', set_3: '' }]
    });
    localStorage.removeItem('workout_log_draft');
    toast.info('Form cleared successfully!');
  };

  const handleSaveDraft = () => {
    localStorage.setItem("workout_log_draft", JSON.stringify({
      draftData: workoutData,
      lastModified: new Date().toISOString()
    }))
    toast.success("Draft saved successfully!")
    setTimeout(() => navigate('/dashboard'), 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/workout', workoutData);
      if (res.data.success) {
        toast.success("Logged workout successfully! 🎉");
        localStorage.removeItem('workout_log_draft')
        setTimeout(() => navigate('/dashboard'), 1000)
      } else {
        if (res.data.error) toast.error(res.data.error)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("Error Logging Workout: ", error)
    }
  };

  const deleteExercise = (idToDelete) => {
    setWorkoutData({
      ...workoutData,
      exercises: workoutData.exercises.filter(exercise => exercise.id !== idToDelete)
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Workout</h2>

        <form onSubmit={handleSubmit} className="space-y-6 bg-indigo-50 border border-indigo-100 px-4 py-5 sm:rounded-xl sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Workout Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-9 pl-2"
                value={workoutData.title}
                onChange={(e) => setWorkoutData({ ...workoutData, title: e.target.value })}
                placeholder="e.g., YMCA back day"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-9 pl-2"
                value={workoutData.duration}
                onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                placeholder="e.g., 86"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Body Parts</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-9 pl-2"
                placeholder="e.g., Chest, Back, Legs"
                value={workoutData.body_parts}
                onChange={(e) => setWorkoutData({ ...workoutData, body_parts: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-9 px-2 text-base"
                value={workoutData.date}
                onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">Exercises</label>
            {workoutData.exercises.map((exercise) => (
              <div key={exercise.id} className="mb-3 p-4 border border-indigo-100 rounded-lg bg-white">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    required
                    className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 h-9 text-base"
                    value={exercise.name}
                    onChange={(e) => {
                      const newExercises = [...workoutData.exercises];
                      newExercises.find(ex => ex.id === exercise.id).name = e.target.value;
                      setWorkoutData({ ...workoutData, exercises: newExercises });
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => deleteExercise(exercise.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 transition-colors duration-200 group flex-shrink-0"
                    title="Delete exercise"
                  >
                    <RiDeleteBinLine className="h-4 w-4 text-gray-400 group-hover:text-rose-500 transition-colors duration-200" />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {['set_1', 'set_2', 'set_3'].map((set) => (
                    <div key={set}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Set {set.split('_')[1]}</label>
                      <input
                        type="text"
                        placeholder="Lb × Reps"
                        required
                        className="w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 h-9 pl-2 text-base"
                        value={exercise[set]}
                        onChange={(e) => {
                          const newExercises = [...workoutData.exercises];
                          newExercises.find(ex => ex.id === exercise.id)[set] = e.target.value;
                          setWorkoutData({ ...workoutData, exercises: newExercises });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addExercise}
              className="mt-2 inline-flex items-center px-4 py-2 border border-indigo-300 rounded-lg text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 transition-colors"
            >
              + Add Exercise
            </button>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-rose-600 bg-white border border-rose-200 hover:bg-rose-50 transition-colors"
              onClick={handleClearForm}
            >
              Clear
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Save Workout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;

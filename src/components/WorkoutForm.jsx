import React, { useEffect, useRef, useState } from 'react';
import {RiDeleteBinLine} from 'react-icons/ri'
import api from '../api/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const WorkoutForm = () => {
  const navigate = useNavigate()
  const toastShown = useRef(false);

  const [workoutData, setWorkoutData] = useState(() => {
    const defaultData = {
      title: '',
      duration: '',
      body_parts: '',
      date: '',
      exercises: [{ id: Date.now(), name: '', set_1: '', set_2: '', set_3: '' }]
    }
    try {
      // Get the draft from local storage if on exists
      const draftString = localStorage.getItem('workout_log_draft')
      if (draftString) {
        const parsedDraft = JSON.parse(draftString)
        if (parsedDraft.draftData) {
          return parsedDraft.draftData
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error)
    }
    return defaultData
  });

  // To make sure theat the toast message is only shown once. Otherwise multiple messages are shown.
  // Because a component mounts and unmounts multiple times
  useEffect(() => {
    if (!toastShown.current) {
      const draftString = localStorage.getItem('workout_log_draft')
      if (draftString) {
        toast.success("Loading your saved workout draft!")
        toastShown.current = true
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
    const defaultData = {
      title: '',
      duration: '',
      body_parts: '',
      date: '',
      exercises: [{ id: Date.now(), name: '', set_1: '', set_2: '', set_3: '' }]
    };
    setWorkoutData(defaultData);
    localStorage.removeItem('workout_log_draft');
    toast.info('Form cleared successfully!');
  };

  const handleSaveDraft = () => {
    const draft = {
      draftData: workoutData,
      lastModified: new Date().toISOString()
    }

    localStorage.setItem("workout_log_draft", JSON.stringify(draft))
    toast.success("Draft saved successfully!")
    setTimeout(() => {
      navigate('/dashboard')
    }, 1000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/workout', workoutData);
      if (res.data.success) {
        toast.success("Logged workout successfully! 🎉");
        localStorage.removeItem('workout_log_draft')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
      else{
        if ((res.data.error)) {
          toast.error(res.data.error)
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Workout</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Workout Title</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                value={workoutData.title}
                onChange={(e) => setWorkoutData({ ...workoutData, title: e.target.value })}
                placeholder='e.g., YMCA back day'
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                value={workoutData.duration}
                onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                placeholder='e.g., 86'
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Body Parts</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
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
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-10 px-2 text-sm"
                value={workoutData.date}
                onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-4">Exercises</label>
            {workoutData.exercises.map((exercise) => (
              <div key={exercise.id} className="mb-4 p-4 border rounded-lg bg-gray-50 relative">
                <button 
                  type="button" 
                  onClick={() => deleteExercise(exercise.id)} 
                  className="absolute top-0 right-0 p-1 rounded-full hover:bg-red-100 transition-colors duration-200 group"
                  title="Delete exercise"
                > 
                  <RiDeleteBinLine className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                </button>
                <input
                  type="text"
                  placeholder="Exercise name"
                  required
                  className="w-full px-4 py-2 mt-2 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-8 pl-2"
                  value={exercise.name}
                  onChange={(e) => {
                    const newExercises = [...workoutData.exercises];
                    const changedExercise = newExercises.find(ex => ex.id === exercise.id); // reference is returned, not copy
                    changedExercise.name = e.target.value;
                    setWorkoutData({ ...workoutData, exercises: newExercises });
                  }}
                />
                <div className="grid grid-cols-3 gap-4">
                  {['set_1', 'set_2', 'set_3'].map((set) => (
                    <div key={set}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Set {set.split('_')[1]}
                      </label>
                      <input
                        type="text"
                        placeholder="Lb x Reps"
                        required
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-8 pl-2"
                        value={exercise[set]}
                        onChange={(e) => {
                          const newExercises = [...workoutData.exercises];
                          const changedExercise = newExercises.find(ex => ex.id === exercise.id); // reference is returned, not copy
                          changedExercise[set] = e.target.value;
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
              className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Add Exercise
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              onClick={handleClearForm}
            >
              Clear Form
            </button>
            <button
              type="button"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleSaveDraft}
            >
              Save Draft
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
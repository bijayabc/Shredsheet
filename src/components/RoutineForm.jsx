import { useState } from 'react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const RoutineForm = () => {
  const navigate = useNavigate()

  const [routineData, setRoutineData] = useState({
    title: '',
    exercises: [{
      id: Date.now(), 
      name: '',
      set_1: '',
      set_2: '',
      set_3: '',
      one_rep_max: '',
      notes: ''
    }]
  });

  const addExercise = () => {
    setRoutineData({
      ...routineData,
      exercises: [...routineData.exercises, {
        id: Date.now(), 
        name: '',
        set_1: '',
        set_2: '',
        set_3: '',
        one_rep_max: '',
        notes: ''
      }]
    });
  };

  const deleteExercise = (idToDelete) => {
    setRoutineData({
      ...routineData,
      exercises: routineData.exercises.filter(exercise => exercise.id !== idToDelete)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/routine', routineData);
      if (res.data.success) {
        toast.success("Saved routine successfully! 🎉");
        setTimeout(() => {
          navigate('/routines')
        }, 1000)
      }
      else{
        if ((res.data.error)) {
          toast.error(res.data.error)
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("Error Saving Routine: ", error)
    }
    
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Routine</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Routine Name</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
              placeholder="e.g., Chest and Shoulders I"
              onChange={(e) => setRoutineData({ ...routineData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-4">Exercises</label>
            {routineData.exercises.map((exercise) => (
              <div key={exercise.id} className="mb-4 p-4 border rounded-lg bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => deleteExercise(exercise.id)}
                  className="absolute top-1 right-1 rounded-full hover:bg-red-100 transition-colors duration-200 group"
                  title="Delete exercise"
                >
                  <RiDeleteBinLine className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                </button>

                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="text"
                    placeholder="Exercise name"
                    className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2 mt-2"
                    onChange={(e) => {
                      const newExercises = [...routineData.exercises];
                      const changedExercise = newExercises.find(ex => ex.id === exercise.id); // reference is returned, not copy
                      changedExercise.name = e.target.value;
                      setRoutineData({ ...routineData, exercises: newExercises });
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
                          className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                          onChange={(e) => {
                            const newExercises = [...routineData.exercises];
                            const changedExercise = newExercises.find(ex => ex.id === exercise.id); // reference is returned, not copy
                            changedExercise[set] = e.target.value;
                            setRoutineData({ ...routineData, exercises: newExercises });
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">One Rep Max (lbs)</label>
                      <input
                        type="number"
                        placeholder="Enter weight"
                        className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                        onChange={(e) => {
                          const newExercises = [...routineData.exercises];
                          const changedExercise = newExercises.find(ex => ex.id === exercise.id); // reference is returned, not copy
                          changedExercise.one_rep_max = e.target.value;
                          setRoutineData({ ...routineData, exercises: newExercises });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <input
                        type="text"
                        placeholder="Additional information"
                        className="w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 h-8 pl-2"
                        onChange={(e) => {
                          const newExercises = [...routineData.exercises];
                          const changedExercise = newExercises.find(ex => ex.id === exercise.id); // reference is returned, not copy
                          changedExercise.notes = e.target.value;
                          setRoutineData({ ...routineData, exercises: newExercises });
                        }}
                      />
                    </div>
                  </div>
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
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Routine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoutineForm;
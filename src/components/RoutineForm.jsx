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
      name: '', set_1: '', set_2: '', set_3: '', one_rep_max: '', notes: ''
    }]
  });

  const addExercise = () => {
    setRoutineData({
      ...routineData,
      exercises: [...routineData.exercises, {
        id: Date.now(),
        name: '', set_1: '', set_2: '', set_3: '', one_rep_max: '', notes: ''
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
        setTimeout(() => navigate('/routines'), 1000)
      } else {
        if (res.data.error) toast.error(res.data.error)
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log("Error Saving Routine: ", error)
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Routine</h2>

        <form onSubmit={handleSubmit} className="space-y-6 bg-rose-50 border border-rose-100 px-4 py-5 sm:rounded-xl sm:p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Routine Name</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-400 focus:ring-rose-400 h-9 pl-2"
              placeholder="e.g., Chest and Shoulders I"
              onChange={(e) => setRoutineData({ ...routineData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-gray-900 mb-3">Exercises</label>
            {routineData.exercises.map((exercise) => (
              <div key={exercise.id} className="mb-3 p-4 border border-rose-100 rounded-lg bg-white">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Exercise name"
                      required
                      className="flex-1 rounded-md border border-gray-300 focus:border-rose-400 focus:ring-rose-400 h-9 pl-2 text-base"
                      onChange={(e) => {
                        const newExercises = [...routineData.exercises];
                        newExercises.find(ex => ex.id === exercise.id).name = e.target.value;
                        setRoutineData({ ...routineData, exercises: newExercises });
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
                          className="w-full rounded-md border border-gray-300 focus:border-rose-400 focus:ring-rose-400 h-9 pl-2 text-base"
                          onChange={(e) => {
                            const newExercises = [...routineData.exercises];
                            newExercises.find(ex => ex.id === exercise.id)[set] = e.target.value;
                            setRoutineData({ ...routineData, exercises: newExercises });
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">One Rep Max (lbs)</label>
                      <input
                        type="number"
                        placeholder="Enter weight"
                        className="w-full rounded-md border border-gray-300 focus:border-rose-400 focus:ring-rose-400 h-9 pl-2 text-base"
                        onChange={(e) => {
                          const newExercises = [...routineData.exercises];
                          newExercises.find(ex => ex.id === exercise.id).one_rep_max = e.target.value;
                          setRoutineData({ ...routineData, exercises: newExercises });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
                      <input
                        type="text"
                        placeholder="Additional information"
                        className="w-full rounded-md border border-gray-300 focus:border-rose-400 focus:ring-rose-400 h-9 pl-2 text-base"
                        onChange={(e) => {
                          const newExercises = [...routineData.exercises];
                          newExercises.find(ex => ex.id === exercise.id).notes = e.target.value;
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
              className="mt-2 inline-flex items-center px-4 py-2 border border-rose-300 rounded-lg text-sm font-medium text-rose-700 bg-white hover:bg-rose-50 transition-colors"
            >
              + Add Exercise
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors"
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

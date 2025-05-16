import { useState, useEffect } from 'react';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId;
    if (isRunning && time < 3600) { // Stop at 59:59
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6 max-w-sm mx-8 sm:mx-auto rounded-2xl mt-60">
      <div className="text-center">
        <h2 className="text-6xl font-semibold text-gray-900 mb-6">
          {formatTime(time)}
        </h2>
        <div className="space-x-4">
          <button
            onClick={handleStartStop}
            className={`px-4 py-2 rounded-md text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isRunning
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {isRunning ? 'Stop' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-md text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
import { useState, useEffect } from 'react';

const Timer = () => {
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval
    if (isRunning) {
      // Update the elapsed time every second
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime)
      }, 1000)
    }

    return () => clearInterval(interval) // Clean up on unmount
  }, [startTime, isRunning]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false)
    } else {
      setStartTime(Date.now() - elapsed);
      setIsRunning(true)
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(Date.now())
    setElapsed(0);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg p-6 max-w-sm mx-8 sm:mx-auto rounded-2xl mt-60">
      <div className="text-center">
        <h2 className="text-6xl font-semibold text-gray-900 mb-6">
          {formatTime(elapsed)}
        </h2>
        <div className="space-x-4">
          <button
            onClick={handleStartStop}
            className={`px-4 py-2 rounded-md text-lg font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isRunning
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
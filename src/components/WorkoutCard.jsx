import React from 'react';
import { RiCalendarEventLine } from 'react-icons/ri';

const WorkoutCard = ({ title, date, duration, exercises, clickfn }) => (
  <div 
    onClick={clickfn}
    className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 hover:shadow-md transition-shadow duration-200">
    <div className="px-4 py-5 sm:p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <RiCalendarEventLine className="h-5 w-5 text-indigo-500" />
          <h3 className="sm:text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <span className="text-sm text-gray-500 ml-2">{date}</span>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">{duration} minutes</span>
        </div>
        <div className="flex items-center justify-end">
          <span className="text-sm text-gray-500">{exercises} exercises</span>
        </div>
      </div>
    </div>
  </div>
);

export default WorkoutCard
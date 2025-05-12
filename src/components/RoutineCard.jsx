import React from 'react';
import { RiFileList3Line } from 'react-icons/ri';

const RoutineCard = ({ title, exerciseCount, clickfn }) => (
    <div 
      onClick={clickfn}
      className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 hover:shadow-md transition-shadow duration-200">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <RiFileList3Line className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          </div>
          <span className="text-sm text-gray-500">{exerciseCount} exercises</span>
        </div>
      </div>
    </div>
  );

  export default RoutineCard
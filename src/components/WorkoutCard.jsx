import { RiCalendarEventLine, RiTimeLine, RiBarChartLine } from 'react-icons/ri';

const WorkoutCard = ({ title, date, duration, exercises, clickfn }) => (
  <div
    onClick={clickfn}
    className="bg-indigo-50 border-l-4 border-indigo-400 shadow-sm rounded-lg mb-4 hover:shadow-md hover:border-indigo-500 transition-all duration-200 cursor-pointer"
  >
    <div className="px-4 py-5 sm:p-5">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <RiCalendarEventLine className="h-5 w-5 text-indigo-600" />
          </div>
          <h3 className="sm:text-lg font-semibold text-gray-900 leading-snug">{title}</h3>
        </div>
        <span className="text-xs text-gray-400 ml-2 mt-1 whitespace-nowrap">{date}</span>
      </div>
      <div className="mt-3 flex items-center gap-4 pl-12">
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <RiTimeLine className="h-4 w-4 text-indigo-400" />
          {duration} min
        </span>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <RiBarChartLine className="h-4 w-4 text-indigo-400" />
          {exercises} exercises
        </span>
      </div>
    </div>
  </div>
);

export default WorkoutCard;
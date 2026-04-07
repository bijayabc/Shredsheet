import { RiFileList3Line, RiListCheck2 } from 'react-icons/ri';

const RoutineCard = ({ title, exerciseCount, clickfn }) => (
  <div
    onClick={clickfn}
    className="bg-rose-50 border-l-4 border-rose-400 shadow-sm rounded-lg mb-4 hover:shadow-md hover:border-rose-500 transition-all duration-200 cursor-pointer"
  >
    <div className="px-4 py-5 sm:p-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
            <RiFileList3Line className="h-5 w-5 text-rose-600" />
          </div>
          <h3 className="sm:text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <span className="flex items-center gap-1 text-sm text-gray-500">
          <RiListCheck2 className="h-4 w-4 text-rose-400" />
          {exerciseCount} exercises
        </span>
      </div>
    </div>
  </div>
);

export default RoutineCard;
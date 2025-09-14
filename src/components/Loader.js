import { FaSpinner } from 'react-icons/fa';

const Loader = ({ text = 'Loading...' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div className="flex flex-col items-center">
      <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-2" />
      <span className="text-lg text-white font-semibold drop-shadow">{text}</span>
    </div>
  </div>
);

export default Loader;


import { FaChartBar, FaStickyNote, FaCalendarAlt, FaBullhorn, FaSignOutAlt } from 'react-icons/fa';
import { useMemo, useState } from 'react';

const Sidebar = ({ activeSection, setActiveSection, onLogout, isAdmin }) => {
  const menuItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: <FaChartBar /> },
    { id: 'notes', label: 'Inventory', icon: <FaStickyNote /> },
    { id: 'timetable', label: 'Timetable', icon: <FaCalendarAlt /> },
    { id: 'announcements', label: 'Announcements', icon: <FaBullhorn /> }
  ], []);

  // Icon scale animation state
  const [animatingIdx, setAnimatingIdx] = useState(null);

  const handleSectionClick = (id, idx) => {
    setActiveSection(id);
    setAnimatingIdx(idx);
    setTimeout(() => setAnimatingIdx(null), 200); // 200ms for quick scale down
  };

  // Mobile: bottom nav, Desktop: sidebar
  return (
    <>
  {/* Desktop sidebar with frosted glass effect */}
  <div className="hidden md:flex flex-col w-64 min-h-screen p-4 relative bg-white border-r border-gray-200 text-gray-800">
        <div className="mb-8 flex items-center gap-2">
          <span className="text-2xl" title="Pikachu">⚡️</span>
          <h1 className="text-xl font-bold">Class Management</h1>
        </div>
        <p className="text-gray-400 text-sm mb-2">Admin Panel</p>
        <nav className="relative">
          <ul className="space-y-2 relative">
            {menuItems.map((item, idx) => (
              <li key={item.id} className="relative z-10">
                <button
                  onClick={() => handleSectionClick(item.id, idx)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex items-center space-x-3 transition-all duration-200 active:scale-95 focus:scale-95 bg-transparent ${
                    activeSection === item.id
                      ? 'text-indigo-600 font-semibold bg-indigo-50'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
                  }`}
                  style={{ WebkitTapHighlightColor: 'transparent', border: 'none', outline: 'none' }}
                >
                  <span className={`text-xl transition-transform duration-200 ${animatingIdx === idx ? 'scale-125' : 'scale-100'}`}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="absolute bottom-4 w-full flex flex-col items-center gap-2">
          {isAdmin && (
            <button
              onClick={onLogout}
              className="w-full px-4 py-2 text-left text-gray-300 hover:bg-red-600/80 hover:text-white rounded-lg transition-all duration-200 active:scale-95 focus:scale-95 flex items-center space-x-3 shadow-sm backdrop-blur-xl"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="text-xl"><FaSignOutAlt /></span>
              <span>Logout</span>
            </button>
          )}
          <div className="text-xs text-gray-400 mt-2">&copy; meer</div>
        </div>
      </div>

  {/* Mobile bottom nav with frosted glass effect */}
  <div className="fixed md:hidden bottom-0 left-0 right-0 flex flex-col items-center z-50 bg-white border-t border-gray-200 text-gray-800">
  <div className="relative flex-1 flex justify-around items-center w-full h-full">
          {menuItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id, idx)}
              className={`flex flex-col items-center justify-center px-2 py-1 focus:outline-none transition-all duration-200 active:scale-90 focus:scale-90 bg-transparent ${
                activeSection === item.id ? 'text-indigo-600 font-semibold bg-indigo-50' : 'text-gray-500 hover:bg-gray-100 hover:text-indigo-600'
              }`}
              style={{ WebkitTapHighlightColor: 'transparent', border: 'none', outline: 'none', background: 'transparent' }}
            >
              <span className={`text-xl transition-transform duration-200 ${animatingIdx === idx ? 'scale-125' : 'scale-100'}`}>{item.icon}</span>
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
  </div>
  <div className="text-xs text-gray-400 pb-1">&copy; meer</div>
        {isAdmin && (
          <button
            onClick={onLogout}
            className="flex flex-col items-center justify-center px-2 py-1 text-gray-300 hover:text-red-400 transition-all duration-200 active:scale-90 focus:scale-90 shadow-sm backdrop-blur-xl"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <span className="text-xl"><FaSignOutAlt /></span>
            <span className="text-xs">Logout</span>
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { getToken } from './utils/auth';


function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar with Admin Login/Logout */}
      <div className="w-full flex justify-end items-center p-4 bg-white shadow">
        {isAdmin ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Admin Login
          </button>
        )}
      </div>

      {/* Main content: always show Dashboard, pass isAdmin */}
      <Dashboard isAdmin={isAdmin} />

      {/* Login modal */}
      {showLogin && !isAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close"
            >
              &times;
            </button>
            <Login onLogin={handleLogin} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Notes from './Notes';
import Timetable from './Timetable';
import Announcements from './Announcements';
import { FaRocket, FaFilePdf } from 'react-icons/fa';
import { getNotesRoot, getAnnouncements } from '../services/api';

const Dashboard = ({ onLogout, isAdmin }) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState({
    notes: 0,
    announcements: 0
  });
  const [syllabusUrl, setSyllabusUrl] = useState(null);

  useEffect(() => {
    loadStats();
    fetchSyllabus();
    // eslint-disable-next-line
  }, [activeSection]);

  const loadStats = async () => {
    try {
      const [notes, announcements] = await Promise.all([
        getNotesRoot(),
        getAnnouncements()
      ]);
      setStats({
        notes: notes.length,
        announcements: announcements.length
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Fetch syllabus PDF from backend uploads/general/Syllabus.pdf or uploads/Syllabus.pdf
  const fetchSyllabus = async () => {
    const tryUrl = async (url) => {
      try {
        const res = await fetch(url, { method: 'HEAD' });
        if (res.ok) return url;
      } catch (e) {}
      return null;
    };
    // Try uploads/general/Syllabus.pdf first
    let url = await tryUrl('http://192.168.1.10:5000/uploads/general/Syllabus.pdf');
    if (!url) {
      // Fallback to uploads/Syllabus.pdf
      url = await tryUrl('http://192.168.1.10:5000/uploads/Syllabus.pdf');
    }
    setSyllabusUrl(url);
  };

  // Motivational quotes
  const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "The only way to do great work is to love what you do.",
    "Don't watch the clock; do what it does. Keep going.",
    "Believe you can and you're halfway there.",
    "Opportunities don't happen, you create them.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Stay positive, work hard, make it happen.",
    "Your limitation—it's only your imagination."
  ];
  const [quoteIdx, setQuoteIdx] = useState(() => Math.floor(Math.random() * quotes.length));
  const quoteInterval = useRef();

  useEffect(() => {
    quoteInterval.current = setInterval(() => {
      setQuoteIdx(idx => (idx + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(quoteInterval.current);
  }, [quotes.length]);

  const renderContent = () => {
    switch (activeSection) {
      case 'notes':
        return <Notes isAdmin={isAdmin} />;
      case 'timetable':
        return <Timetable isAdmin={isAdmin} />;
      case 'announcements':
        return <Announcements isAdmin={isAdmin} />;
      default:
        return (
          <div className="p-6">
            {/* Motivational Quote */}
            <div className="mb-6 flex justify-center">
              <div className="bg-white/80 border border-blue-200 rounded-lg shadow px-4 py-3 max-w-xl text-center text-blue-700 text-base font-medium animate-fadein transition-all duration-500">
                <span className="italic">{quotes[quoteIdx]}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
              <FaRocket className="text-2xl text-indigo-500" />
              <h2 className="text-2xl font-bold">CSE 5th SEM</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Notes</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.notes}</p>
              </div>
              <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700">Announcements</h3>
                <p className="text-3xl font-bold text-indigo-600">{stats.announcements}</p>
              </div>
            </div>
            {/* Syllabus Bar */}
            <div className="mt-8 flex items-center gap-3 bg-white border border-gray-200 p-4 rounded-lg">
              <FaFilePdf className="text-2xl text-red-600" />
              <span className="font-semibold">Syllabus:</span>
              {syllabusUrl ? (
                <a href={syllabusUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline">View PDF</a>
              ) : (
                <span className="text-gray-400">No syllabus PDF found</span>
              )}
            </div>
            {isAdmin && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveSection('notes')}
                    className="p-4 bg-blue-100 hover:bg-blue-200 rounded-lg text-left transition-colors"
                  >
                    <h4 className="font-semibold">Create Note</h4>
                    <p className="text-gray-600 text-sm">Add a new study note</p>
                  </button>
                  <button
                    onClick={() => setActiveSection('announcements')}
                    className="p-4 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-left transition-colors"
                  >
                    <h4 className="font-semibold">Make Announcement</h4>
                    <p className="text-gray-600 text-sm">Post an announcement</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection}
        onLogout={onLogout}
        isAdmin={isAdmin}
      />
      <div className="flex-1 min-h-screen relative overflow-hidden">
        {/* Animated gradient background - more visible, vibrant, and with opacity */}
  <div className="pointer-events-none absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-blue-400 via-teal-300 to-purple-400" style={{backgroundSize:'200% 200%'}} />
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../services/api';

// Utility: Show browser push notification
function showPushNotification(title, body) {
  if (window.Notification && Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// Request notification permission on mount (once)
if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'default') {
  Notification.requestPermission();
}

const Announcements = ({ isAdmin }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Normal',
    date: '',
    deadline: ''
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await getAnnouncements();
      // Sort by creation date, newest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAnnouncements(sortedData);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let created;
      if (editingAnnouncement) {
        await updateAnnouncement(editingAnnouncement._id, formData);
      } else {
        created = await createAnnouncement(formData);
      }
      loadAnnouncements();
      setIsModalOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', priority: 'Normal', date: '', deadline: '' });
      // Show push notification for new announcement
      if (created && created.title) {
        showPushNotification('New Announcement', created.title);
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      date: announcement.date || '',
      deadline: announcement.deadline || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
        loadAnnouncements();
      } catch (error) {
        console.error('Error deleting announcement:', error);
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-white border border-red-200 text-red-600';
      case 'Medium':
        return 'bg-white border border-yellow-200 text-yellow-600';
      default:
        return 'bg-white border border-blue-200 text-indigo-600';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High':
        return '🚨';
      case 'Medium':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Announcements</h2>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Announcement
          </button>
        )}
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No announcements found. Create your first announcement!
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className={`p-6 rounded-lg shadow-md border-l-4 ${getPriorityColor(announcement.priority)}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getPriorityIcon(announcement.priority)}</span>
                  <h3 className="text-xl font-semibold">{announcement.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    announcement.priority === 'High' ? 'bg-red-500 text-white' :
                    announcement.priority === 'Medium' ? 'bg-yellow-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {announcement.priority} Priority
                  </span>
                </div>
                {isAdmin && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 mb-4 whitespace-pre-wrap">{announcement.content}</p>
              
              <div className="text-sm text-gray-500">
                {announcement.date && (
                  <div>
                    <span>Given on: {new Date(announcement.date).toLocaleDateString()}</span>
                    {announcement.deadline && (
                      <div><span>Deadline: {new Date(announcement.deadline).toLocaleDateString()}</span></div>
                    )}
                  </div>
                )}
                {!announcement.date && (
                  <span>Posted on {new Date(announcement.createdAt).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
  {isAdmin && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option value="Normal">Normal</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Content</label>
                <textarea
                  required
                  rows="6"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your announcement content here..."
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Date Given</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Deadline (optional)</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAnnouncement(null);
                    setFormData({ title: '', content: '', priority: 'Normal' });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAnnouncement ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;
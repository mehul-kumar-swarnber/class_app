import React, { useState, useEffect } from 'react';
import { getNotifications, createNotification, deleteNotification } from '../services/api';

const Notifications = ({ isAdmin }) => {
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'Info'
  });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      // Sort by creation date, newest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sortedData);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNotification(formData);
      loadNotifications();
      setIsModalOpen(false);
      setFormData({ title: '', message: '', type: 'Info' });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        await deleteNotification(id);
        loadNotifications();
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'Success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: '✅',
          textColor: 'text-green-800',
          badgeColor: 'bg-green-500'
        };
      case 'Warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: '⚠️',
          textColor: 'text-yellow-800',
          badgeColor: 'bg-yellow-500'
        };
      case 'Error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: '❌',
          textColor: 'text-red-800',
          badgeColor: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'ℹ️',
          textColor: 'text-blue-800',
          badgeColor: 'bg-blue-500'
        };
    }
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notifications</h2>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Notification
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No notifications found. Create your first notification!
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => {
            const styles = getTypeStyles(notification.type);
            return (
              <div key={notification.id} className={`p-4 rounded-lg border ${styles.bg} ${styles.border}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl mt-1">{styles.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className={`font-semibold ${styles.textColor}`}>{notification.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${styles.badgeColor}`}>
                          {notification.type}
                        </span>
                      </div>
                      <p className={`${styles.textColor} mb-2`}>{notification.message}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-gray-400 hover:text-red-600 ml-4"
                      title="Delete notification"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isAdmin && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Notification</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter notification title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                >
                  <option value="Info">Info</option>
                  <option value="Success">Success</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="Enter notification message"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setFormData({ title: '', message: '', type: 'Info' });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notifications;
// File removed: Assignments section deleted from app.
import React, { useState, useEffect } from 'react';
import { getAssignments, createAssignment, updateAssignment, deleteAssignment } from '../services/api';

const Assignments = ({ isAdmin }) => {
  const [assignments, setAssignments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    dueDate: '',
    type: 'Assignment',
    completed: false
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, formData);
      } else {
        await createAssignment(formData);
      }
      loadAssignments();
      setIsModalOpen(false);
      setEditingAssignment(null);
      setFormData({ title: '', subject: '', description: '', dueDate: '', type: 'Assignment', completed: false });
    } catch (error) {
      console.error('Error saving assignment:', error);
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      subject: assignment.subject,
      description: assignment.description,
      dueDate: assignment.dueDate,
      type: assignment.type,
      completed: assignment.completed
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(id);
        loadAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const toggleCompletion = async (assignment) => {
    try {
      await updateAssignment(assignment.id, { ...assignment, completed: !assignment.completed });
      loadAssignments();
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const getStatusColor = (assignment) => {
    if (assignment.completed) return 'bg-green-100 text-green-800';
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    if (dueDate < now) return 'bg-red-100 text-red-800';
    if (dueDate - now < 24 * 60 * 60 * 1000) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (assignment) => {
    if (assignment.completed) return 'Completed';
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    if (dueDate < now) return 'Overdue';
    if (dueDate - now < 24 * 60 * 60 * 1000) return 'Due Soon';
    return 'Pending';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assignments & Lab Work</h2>
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Assignment
          </button>
        )}
      </div>

      {assignments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No assignments found. Create your first assignment!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="bg-white p-6 rounded-lg shadow-md border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{assignment.title}</h3>
                  <p className="text-indigo-600 text-sm">{assignment.subject}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment)}`}>
                  {getStatusText(assignment)}
                </span>
              </div>

              <div className="mb-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  assignment.type === 'Lab Work' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {assignment.type}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{assignment.description}</p>

              <div className="text-sm text-gray-500 mb-4">
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </div>

              {isAdmin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={assignment.completed}
                      onChange={() => toggleCompletion(assignment)}
                      className="mr-2"
                    />
                    <span className="text-sm">Mark as completed</span>
                  </label>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(assignment)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(assignment.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
  {isAdmin && isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingAssignment ? 'Edit Assignment' : 'Add New Assignment'}
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
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
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
                  <option value="Assignment">Assignment</option>
                  <option value="Lab Work">Lab Work</option>
                  <option value="Project">Project</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  required
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Due Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.completed}
                    onChange={(e) => setFormData({...formData, completed: e.target.checked})}
                  />
                  <span className="text-sm">Mark as completed</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAssignment(null);
                    setFormData({ title: '', subject: '', description: '', dueDate: '', type: 'Assignment', completed: false });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingAssignment ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
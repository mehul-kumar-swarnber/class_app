import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';

const API_BASE_URL = 'http://192.168.1.10:5000';

// Auth API
export const loginApi = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
};

// Notes API
// Get all root-level notes/folders (for dashboard stats)
export const getNotesRoot = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/notes/list`, {
    params: { parent: '' }
  });
  return response.data;
};

export const createNote = async (note) => {
  const response = await axios.post(`${API_BASE_URL}/api/notes`, note, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateNote = async (id, note) => {
  const response = await axios.put(`${API_BASE_URL}/api/notes/${id}`, note, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/notes/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Timetable API
export const getTimetable = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/timetable`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createTimetableEntry = async (entry) => {
  const response = await axios.post(`${API_BASE_URL}/api/timetable`, entry, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateTimetableEntry = async (id, entry) => {
  const response = await axios.put(`${API_BASE_URL}/api/timetable/${id}`, entry, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteTimetableEntry = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/timetable/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};


// Announcements API
export const getAnnouncements = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/announcements`);
  return response.data;
};

export const createAnnouncement = async (announcement) => {
  const response = await axios.post(`${API_BASE_URL}/api/announcements`, announcement, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateAnnouncement = async (id, announcement) => {
  const response = await axios.put(`${API_BASE_URL}/api/announcements/${id}`, announcement, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/announcements/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

// Notifications API
export const getNotifications = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/notifications`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createNotification = async (notification) => {
  const response = await axios.post(`${API_BASE_URL}/api/notifications`, notification, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/api/notifications/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
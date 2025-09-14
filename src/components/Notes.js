
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFolder, FaFilePdf, FaEye, FaDownload } from 'react-icons/fa';
import Loader from './Loader';

const Notes = ({ isAdmin }) => {
  const [currentFolder, setCurrentFolder] = useState(null); // null = root
  const [items, setItems] = useState([]); // folders and pdfs in current folder
  const [showUpload, setShowUpload] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pathStack, setPathStack] = useState([]); // for breadcrumbs
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    fetchItems(currentFolder).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [currentFolder]);

  const fetchItems = async (parent) => {
    const res = await axios.get('/api/notes/list', { params: { parent: parent || '' } });
    setItems(res.data);
  };

  const handleOpenFolder = (folder) => {
    setLoading(true);
    setPathStack([...pathStack, { id: currentFolder, name: folder.name }]);
    setCurrentFolder(folder._id);
  };

  const handleBack = () => {
    if (pathStack.length === 0) return;
    setLoading(true);
    const prev = pathStack[pathStack.length - 1];
    setPathStack(pathStack.slice(0, -1));
    setCurrentFolder(prev.id);
  };

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setLoading(true);
    await axios.post('/api/notes/folder', { name: newFolderName.trim(), parent: currentFolder }, {
      headers: localStorage.token ? { Authorization: `Bearer ${localStorage.token}` } : {}
    });
    setShowNewFolder(false);
    setNewFolderName('');
    await fetchItems(currentFolder);
    setLoading(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setUploading(true);
    setLoading(true);
    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('parent', currentFolder);
    try {
      await axios.post('/api/notes/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', ...(localStorage.token ? { Authorization: `Bearer ${localStorage.token}` } : {}) }
      });
      setShowUpload(false);
      setUploadFile(null);
      await fetchItems(currentFolder);
    } catch (err) {
      alert('Upload failed');
    }
    setUploading(false);
    setLoading(false);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Delete this ${type === 'folder' ? 'folder and all its contents' : 'PDF'}?`)) return;
    setLoading(true);
    await axios.delete(`/api/notes/${id}`, {
      headers: localStorage.token ? { Authorization: `Bearer ${localStorage.token}` } : {}
    });
    await fetchItems(currentFolder);
    setLoading(false);
  };

  // Breadcrumbs
  const renderBreadcrumbs = () => (
    <div className="mb-4 flex items-center gap-2 flex-wrap">
      <span className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 font-medium shadow-sm select-none">Root</span>
      {pathStack.map((p, idx) => (
        <span key={p.id || 'root'} className="flex items-center gap-2">
          <span className="text-gray-400">&#8250;</span>
          <span className="px-3 py-1 rounded bg-white border border-gray-300 text-gray-700 font-medium shadow-sm select-none">{p.name}</span>
        </span>
      ))}
    </div>
  );

  return (
  <div className="p-6 pb-24 relative bg-gray-50 min-h-screen">
      {loading && <Loader />}
  <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Notes Drive</h2>
        <div className="flex gap-2">
          {isAdmin && (
            <>
              <button
                onClick={() => setShowNewFolder(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                New Folder
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Upload PDF
              </button>
            </>
          )}
        </div>
      </div>

      {renderBreadcrumbs()}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && (
          <div className="col-span-full text-gray-500">No folders or PDFs here.</div>
        )}
        {items.map(item => (
          item.type === 'folder' ? (
            <div key={item._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col items-center">
              <button onClick={() => handleOpenFolder(item)} className="flex flex-col items-center">
                <FaFolder className="text-5xl text-yellow-500" />
                <span className="mt-2 font-semibold">{item.name}</span>
              </button>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(item._id, 'folder')}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ) : (
            <div key={item._id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex flex-col items-start">
              <div className="flex-1 flex items-center gap-2">
                <FaFilePdf className="text-2xl text-red-600" />
                <div className="font-semibold mb-2">{item.name}</div>
              </div>
              <div className="flex gap-4 mt-1">
                <a
                  href={`http://localhost:5000/uploads/${item.filename}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  title="View PDF"
                >
                  <FaEye className="text-lg" />
                </a>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    const response = await fetch(`http://localhost:5000/uploads/${item.filename}`);
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = item.name || item.filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                  title="Download PDF"
                >
                  <FaDownload className="text-lg" />
                </button>
              </div>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(item._id, 'pdf')}
                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          )
        ))}
      </div>

      {/* New Folder Modal */}
      {isAdmin && showNewFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <form onSubmit={handleCreateFolder}>
              <input
                type="text"
                value={newFolderName}
                onChange={e => setNewFolderName(e.target.value)}
                placeholder="Folder name"
                className="mb-4 w-full px-3 py-2 bg-gray-100 rounded shadow-sm"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setShowNewFolder(false); setNewFolderName(''); }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isAdmin && showUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload PDF to {pathStack.length === 0 ? 'Root' : pathStack[pathStack.length-1].name}</h3>
            <form onSubmit={handleUpload}>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setUploadFile(e.target.files[0])}
                className="mb-4"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => { setShowUpload(false); setUploadFile(null); }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back button */}
      {pathStack.length > 0 && (
        <button onClick={handleBack} className="mt-6 px-4 py-2 bg-gray-300 rounded">Back</button>
      )}
    </div>
  );
};
export default Notes;
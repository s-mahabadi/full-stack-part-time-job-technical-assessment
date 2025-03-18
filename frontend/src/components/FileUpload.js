import React, { useState, useRef } from 'react';

const FileUpload = ({ onUpload, loading }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's a docx file
      if (file.name.toLowerCase().endsWith('.docx')) {
        setSelectedFile(file);
      } else {
        alert('Please select a Word document (.docx) file.');
        fileInputRef.current.value = null;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
      // Reset form after upload
      setSelectedFile(null);
      fileInputRef.current.value = null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Upload Word Document</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label 
            htmlFor="file-upload" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select a .docx file
          </label>
          
          <input
            id="file-upload"
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-medium
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
            disabled={loading}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className={`px-4 py-2 rounded-md shadow-sm text-white
                      ${!selectedFile || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 transition duration-200'
                      }`}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload; 
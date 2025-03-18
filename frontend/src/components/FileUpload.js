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
    <div className="card">
      <h2 className="card-title">Upload Word Document</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label 
            htmlFor="file-upload" 
            className="mb-2"
          >
            Select a .docx file
          </label>
          
          <input
            id="file-upload"
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="input-file"
            disabled={loading}
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className={!selectedFile || loading ? 'button button-disabled' : 'button button-primary'}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload; 
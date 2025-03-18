import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import JsonViewer from './components/JsonViewer';
import axios from 'axios';

// API URL - use relative path when deployed with Nginx reverse proxy
const API_URL = '/api';

function App() {
  const [files, setFiles] = useState([]);
  const [jsonData, setJsonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/getFiles`);
      setFiles(response.data.files);
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to fetch files. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      
      await axios.post(`${API_URL}/uploadFile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh the file list
      fetchFiles();
      
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(`${API_URL}/deleteFile/${fileId}`);
      
      // Clear JSON data if it was from the deleted file
      setJsonData(null);
      
      // Refresh the file list
      fetchFiles();
      
    } catch (err) {
      console.error('Error deleting file:', err);
      setError('Failed to delete file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToJson = async (fileId) => {
    try {
      setLoading(true);
      setError(null);
      setJsonData(null);
      
      const response = await axios.get(`${API_URL}/WordToJson/${fileId}`);
      setJsonData(response.data);
      
    } catch (err) {
      console.error('Error converting file to JSON:', err);
      setError('Failed to convert file to JSON. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadJson = () => {
    if (!jsonData) return;
    
    // Create a JSON blob
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <header className="header">
        <div className="container">
          <h1 className="title">Word to JSON Converter</h1>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {/* Error message */}
          {error && (
            <div className="alert alert-error" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          {/* File upload section */}
          <section className="mb-8">
            <FileUpload onUpload={handleFileUpload} loading={loading} />
          </section>
          
          {/* File list section */}
          <section className="mb-8">
            <h2 className="card-title">Uploaded Files</h2>
            <FileList 
              files={files} 
              onDelete={handleDeleteFile} 
              onConvert={handleConvertToJson}
              loading={loading}
            />
          </section>
          
          {/* JSON viewer section */}
          {jsonData && (
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title">JSON Output</h2>
                <button
                  onClick={handleDownloadJson}
                  className="button button-success"
                >
                  Download JSON
                </button>
              </div>
              <JsonViewer data={jsonData} />
            </section>
          )}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>Word to JSON Converter &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 
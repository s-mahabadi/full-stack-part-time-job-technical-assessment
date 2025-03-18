import React from 'react';

const FileList = ({ files, onDelete, onConvert, loading }) => {
  if (files.length === 0) {
    return (
      <div className="card">
        <p>No files uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div>
        <table className="table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Upload Date</th>
              <th>File Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.file_id}>
                <td>{file.filename}</td>
                <td>{new Date(file.upload_date).toLocaleString()}</td>
                <td>{file.file_type}</td>
                <td>
                  <button
                    onClick={() => onConvert(file.file_id)}
                    disabled={loading}
                    className={loading ? 'button button-disabled' : 'button button-primary'}
                    style={{ marginRight: '0.5rem' }}
                  >
                    To JSON
                  </button>
                  <button
                    onClick={() => onDelete(file.file_id)}
                    disabled={loading}
                    className={loading ? 'button button-disabled' : 'button button-danger'}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FileList; 
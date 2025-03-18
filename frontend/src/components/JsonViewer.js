import React from 'react';
import ReactJson from 'react-json-view';

const JsonViewer = ({ data }) => {
  return (
    <div className="card">
      <div style={{ overflow: 'auto', maxHeight: '400px', border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '1rem', backgroundColor: '#f9fafb' }}>
        <ReactJson 
          src={data} 
          theme="rjv-default"
          displayDataTypes={false}
          name={false}
          collapsed={1}
          enableClipboard={true}
          style={{ fontFamily: 'monospace' }}
        />
      </div>
    </div>
  );
};

export default JsonViewer; 
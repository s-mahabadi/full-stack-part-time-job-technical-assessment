import React from 'react';
import ReactJson from 'react-json-view';

const JsonViewer = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="overflow-auto max-h-96 border border-gray-200 rounded-md p-4 bg-gray-50">
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
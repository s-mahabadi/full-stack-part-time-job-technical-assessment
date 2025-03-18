import React from 'react';
import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

const JsonViewer = ({ data }) => {
  return (
    <div className="card">
      <div style={{ overflow: 'auto', maxHeight: '400px', border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '1rem', backgroundColor: '#f9fafb' }}>
        <JSONPretty 
          id="json-pretty"
          data={data}
          theme={{
            main: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
            error: 'line-height:1.3;color:#66d9ef;background:#272822;overflow:auto;',
            key: 'color:#f92672;',
            string: 'color:#a6e22e;',
            value: 'color:#fd971f;',
            boolean: 'color:#ac81fe;',
          }}
        />
      </div>
    </div>
  );
};

export default JsonViewer; 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BackendStatus = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const res = await axios.get('/api/health', { timeout: 3000 });
      setStatus('connected');
      setMessage('Backend is running');
    } catch (err) {
      setStatus('disconnected');
      setMessage('Backend is not running');
    }
  };

  if (status === 'checking') {
    return null;
  }

  if (status === 'disconnected') {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Backend Server Not Running
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Please start the backend server:</p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>Open a terminal</li>
                <li>Run: <code className="bg-red-100 px-2 py-1 rounded">cd backend && npm run dev</code></li>
                <li>Wait for: "Server is running on port 5000"</li>
                <li>Refresh this page</li>
              </ol>
              <button
                onClick={checkBackend}
                className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                Check Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default BackendStatus;


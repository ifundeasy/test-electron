import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (host: string, clientId: string) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [host, setHost] = useState('');
  const [clientId, setClientId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(host, clientId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md">
        <button className="float-right" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="host">Host:</label>
            <input
              type="text"
              id="host"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              className="border"
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <label htmlFor="client_id">Client ID:</label>
            <input
              type="text"
              id="client_id"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="border"
            />
          </div>
          <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;

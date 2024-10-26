// (components)/PositionModal.js
import React, { useState } from 'react';
import Modal from './Modal';

const PositionModal = ({ isOpen, onClose, onSubmit }) => {
  const [positionName, setPositionName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!positionName) {
      setMessage('Name is required');
      return;
    }
    onSubmit(positionName);
    setPositionName('');
    setMessage('');
  };

  return (
    <Modal isOpen={isOpen} title="Add Position" onClose={onClose}>
      <input
        type="text"
        value={positionName}
        onChange={(e) => setPositionName(e.target.value)}
        placeholder="Name"
        className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
      />
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Submit
      </button>
    </Modal>
  );
};

export default PositionModal;
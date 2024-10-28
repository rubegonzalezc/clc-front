// (components)/TeamModal.js
import React, { useState } from 'react';
import Modal from './Modal';
import Swal from 'sweetalert2';

const TeamModal = ({ isOpen, onClose, onSubmit }) => {
  const [teamName, setTeamName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!teamName) {
      setMessage('Name is required');
      Swal.fire({
        title: 'Error!',
        text: 'Name is required',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }
    onSubmit(teamName);
    setTeamName('');
    setMessage('');
    Swal.fire({
      title: 'Success!',
      text: 'Team added successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };

  return (
    <Modal isOpen={isOpen} title="Add Team" onClose={onClose}>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Name"
        className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-500 dark:placeholder-gray-400"
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

export default TeamModal;
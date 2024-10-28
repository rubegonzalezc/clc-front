import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditPositionModal = ({ isOpen, onClose, onSubmit, position }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  useEffect(() => {
    if (position) {
      setFormData({
        name: position.name
      });
    }
  }, [position]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Position updated successfully',
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Position</h2>
          <div className="relative mb-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default EditPositionModal;
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const TeamModal = ({ isOpen, onClose, onSubmit, editData }) => {
  const [formData, setFormData] = useState({
    name: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name
      });
    } else {
      setFormData({
        name: ''
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form',
      });
      return;
    }

    const teamData = {
      name: formData.name, // Asegúrate de que el campo name se envíe correctamente
      id: editData ? editData.id : undefined // Incluir el id si es una edición
    };
    onSubmit(teamData);
    setFormData({
      name: ''
    });
    setErrors({});
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Team ${editData ? 'updated' : 'added'} successfully`,
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn">
          <h2 className="text-xl font-bold mb-4 dark:text-white">{editData ? 'Edit Team' : 'Add Team'}</h2>
          <div className="relative mb-6">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
          >
            {editData ? 'Update' : 'Submit'}
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

export default TeamModal;
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const EditPersonModal = ({ isOpen, onClose, onSubmit, person, teams, positions }) => {
  const [formData, setFormData] = useState({
    rut: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    teamId: '',
    positionId: ''
  });

  useEffect(() => {
    if (person) {
      setFormData({
        rut: person.rut,
        name: person.name,
        lastName: person.lastName,
        email: person.email,
        phone: person.phone,
        teamId: person.teamId,
        positionId: person.positionId
      });
    }
  }, [person]);

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
      text: 'Person updated successfully',
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 animate__animated animate__fadeIn">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Person</h2>
          <div className="relative mb-6">
            <input
              type="text"
              name="rut"
              value={formData.rut}
              onChange={handleChange}
              placeholder="Rut"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
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
          <div className="relative mb-6">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative mb-6">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative mb-6">
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="relative mb-6">
            <select
              name="teamId"
              value={formData.teamId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
          <div className="relative mb-6">
            <select
              name="positionId"
              value={formData.positionId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select Position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
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

export default EditPersonModal;
// (components)/PersonModal.js
import React, { useState } from 'react';

const PersonModal = ({ isOpen, onClose, onSubmit, teams, positions }) => {
  const [formData, setFormData] = useState({
    rut: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    teamId: '',
    positionId: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const team = teams.find(team => team.id === parseInt(formData.teamId));
    const position = positions.find(position => position.id === parseInt(formData.positionId));
    const personData = {
      ...formData,
      team,
      position
    };
    onSubmit(personData);
    setFormData({
      rut: '',
      name: '',
      lastName: '',
      email: '',
      phone: '',
      teamId: '',
      positionId: ''
    });
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Add Person</h2>
          <input
            type="text"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            placeholder="Rut"
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
          <select
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <select
            name="positionId"
            value={formData.positionId}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Select Position</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
};

export default PersonModal;
// (components)/Table.js
import React from 'react';

const Table = ({ people, handleEdit, handleDelete, deletingId }) => {
  return (
    <table className="min-w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-lg overflow-hidden">
      <thead className="bg-gray-300 border dark:bg-gray-700">
        <tr>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">RUT</th>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">Name</th>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">Last Name</th>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">Email</th>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">Phone</th>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">Team ID</th>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">Position ID</th>
          <th className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">Actions</th>
        </tr>
      </thead>
      <tbody>
        {people.map(person => (
          <tr
            key={person.id}
            className={`hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity duration-500 ${deletingId === person.id ? 'opacity-0' : 'opacity-100'}`}
          >
            <td className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">{person.rut}</td>
            <td className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">{person.name}</td>
            <td className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">{person.lastName}</td>
            <td className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">{person.email}</td>
            <td className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">{person.phone}</td>
            <td className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">{person.teamId}</td>
            <td className="py-2 px-4 border-b dark:border-gray-600 dark:text-white">{person.positionId}</td>
            <td className="py-2 px-4 border-b dark:border-gray-600 flex space-x-2">
              <button
                onClick={() => handleEdit(person.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM4 12v4h4v-1H5v-3H4z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => handleDelete(person.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 inline-block"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H3a1 1 0 100 2h1v10a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm3 3a1 1 0 112 0v1h2a1 1 0 110 2H7a1 1 0 110-2h2V5z"
                    clipRule="evenodd"
                  />
                </svg>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
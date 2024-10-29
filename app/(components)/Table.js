import React from 'react';

const Table = ({ data, handleEdit, handleDelete, deletingId, columns }) => {
  const columnKeyMap = {
    "RUT": "rut",
    "Name": "name",
    "Last Name": "lastName",
    "Email": "email",
    "Phone": "phone",
    "Team": "team",        // Usar "team" para mostrar nombre
    "Position": "position" // Usar "position" para mostrar nombre
  };

  const normalizeColumnName = (column) => {
    return columnKeyMap[column] || column.toLowerCase().replace(' ', '');
  };

  return (
    <table className="min-w-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 shadow-lg rounded-lg overflow-hidden">
      <thead className="bg-gray-300 border dark:bg-gray-700">
        <tr>
          {columns.map((column) => (
            <th key={column} className="py-2 px-4 border-b dark:border-gray-600 text-black dark:text-white">
              {column}
            </th>
          ))}
          <th className="py-2 px-4 border-b dark:border-gray-600 text-black dark:text-white">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length + 1} className="py-2 px-4 border-b dark:border-gray-600 text-black dark:text-white text-center">
              No data available
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-200 dark:hover:bg-gray-600 transition-opacity duration-500 ${deletingId === item.id ? 'opacity-0' : 'opacity-100'}`}
            >
              {columns.map((column) => (
                <td key={column} className="py-2 px-4 border-b dark:border-gray-600 text-black dark:text-white">
                  {item[normalizeColumnName(column)]}
                </td>
              ))}
              <td className="py-2 px-4 border-b dark:border-gray-600 flex space-x-2">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default Table;
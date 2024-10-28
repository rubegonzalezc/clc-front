// components/SearchBar.js
import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, searchFilter, setSearchFilter, currentView }) => {
  return (
    <div className="flex justify-between mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
      />
      {currentView === 'People' && (
        <select
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          className="ml-4 px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="rut">RUT</option>
          <option value="name">Name</option>
          <option value="lastName">Last Name</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="team">Team</option>
          <option value="position">Position</option>
        </select>
      )}
    </div>
  );
};

export default SearchBar;

import { useState } from 'react';

export default function Navbar({ openModal, toggleDarkMode }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-gray-100 dark:bg-gray-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <img src="https://www.clinicalascondes.cl/Dev_CLC/media/Imagenes/banner_home/logo-clc-lazo.svg" alt="Logo" className="h-12 w-63 mr-2" />
          <div className="text-gray-800 dark:text-white text-xl font-bold">People Management</div>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none"
            >
              Lists
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-2 w-48 bg-white dark:bg-gray-700 rounded shadow-lg">
                <ul>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white">
                      Person
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white">
                      Team
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 dark:text-white">
                      Position
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={() => openModal('add')}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            Add
          </button>
          <button
            onClick={() => openModal('remove')}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            Remove
          </button>
          <button
            onClick={toggleDarkMode}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
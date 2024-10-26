"use client";

import { useEffect, useState } from 'react';
import Navbar from './(components)/Navbar';
import PositionModal from './(components)/PositionModal';
import TeamModal from './(components)/TeamModal';
import Table from './(components)/Table';

export default function PeopleTable() {
  const [people, setPeople] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add' or 'remove'
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://localhost:44352/api/People')
      .then(response => response.json())
      .then(data => setPeople(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit person with id: ${id}`);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    fetch(`https://localhost:44352/api/People/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          setTimeout(() => {
            setPeople(people.filter(person => person.id !== id));
            setDeletingId(null);
          }, 500);
        } else {
          console.error('Error deleting data:', response.statusText);
          setDeletingId(null);
        }
      })
      .catch(error => {
        console.error('Error deleting data:', error);
        setDeletingId(null);
      });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('dark');
      document.body.classList.add('light-mode');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-mode');
    }
  }, [darkMode]);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openPositionModal = () => {
    setIsPositionModalOpen(true);
  };

  const closePositionModal = () => {
    setIsPositionModalOpen(false);
    setMessage('');
  };

  const openTeamModal = () => {
    setIsTeamModalOpen(true);
  };

  const closeTeamModal = () => {
    setIsTeamModalOpen(false);
    setMessage('');
  };

  const handlePositionSubmit = (positionName) => {
    fetch('https://localhost:44352/api/Positions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: positionName }),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Position added successfully');
          setTimeout(() => {
            closePositionModal();
          }, 2000);
        } else {
          setMessage('Error adding position');
        }
      })
      .catch(error => {
        setMessage('Error adding position');
        console.error('Error:', error);
      });
  };

  const handleTeamSubmit = (teamName) => {
    fetch('https://localhost:44352/api/Teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: teamName }),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Team added successfully');
          setTimeout(() => {
            closeTeamModal();
          }, 2000);
        } else {
          setMessage('Error adding team');
        }
      })
      .catch(error => {
        setMessage('Error adding team');
        console.error('Error:', error);
      });
  };

  return (
    <div className={`container mx-auto p-4 bg-gray-200 dark:bg-gray-900 min-h-screen transition-colors duration-300`}>
      <Navbar openModal={openModal} toggleDarkMode={toggleDarkMode} />
      <br></br>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-out">
          <div className={`bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center transform transition-transform duration-300 ease-out ${isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <h2 className="text-xl font-bold mb-4 dark:text-white">{modalType === 'add' ? 'Add New' : 'Remove'}</h2>
            <ul>
              <li className="mb-2">
                <button className="w-full text-left px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-white">
                  Person
                </button>
              </li>
              <li className="mb-2">
                <button
                  onClick={openTeamModal}
                  className="w-full text-left px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-white"
                >
                  Team
                </button>
              </li>
              <li>
                <button
                  onClick={openPositionModal}
                  className="w-full text-left px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-white"
                >
                  Position
                </button>
              </li>
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <PositionModal
        isOpen={isPositionModalOpen}
        onClose={closePositionModal}
        onSubmit={handlePositionSubmit}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={closeTeamModal}
        onSubmit={handleTeamSubmit}
      />

      <Table
        people={people}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        deletingId={deletingId}
      />
    </div>
  );
}
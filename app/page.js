// page.js
"use client";

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from './(components)/Navbar';
import PositionModal from './(components)/PositionModal';
import TeamModal from './(components)/TeamModal';
import PersonModal from './(components)/PersonModal';
import Modal from './(components)/Modal';
import Table from './(components)/Table';
import useData from './(hooks)/useData';
import useModal from './(hooks)/useModal';

export default function PeopleTable() {
  const { data: people, loadData: loadPeople } = useData('https://localhost:44352/api/People');
  const { data: teams, loadData: loadTeams } = useData('https://localhost:44352/api/Teams');
  const { data: positions, loadData: loadPositions } = useData('https://localhost:44352/api/Positions');
  const [deletingId, setDeletingId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { isOpen: isPositionModalOpen, openModal: openPositionModal, closeModal: closePositionModal } = useModal();
  const { isOpen: isTeamModalOpen, openModal: openTeamModal, closeModal: closeTeamModal } = useModal();
  const { isOpen: isPersonModalOpen, openModal: openPersonModal, closeModal: closePersonModal } = useModal();
  const [modalType, setModalType] = useState(''); // 'add' or 'remove'
  const [message, setMessage] = useState('');
  const [currentView, setCurrentView] = useState('People'); // Estado para la vista actual

  const teamMap = teams ? Object.fromEntries(teams.map(team => [team.id, team.name])) : {};
  const positionMap = positions ? Object.fromEntries(positions.map(position => [position.id, position.name])) : {};

  const transformedPeople = people && teams && positions
    ? people.map(person => ({
        ...person,
        team: teamMap[person.teamId] || 'Unknown',
        position: positionMap[person.positionId] || 'Unknown'
      }))
    : [];
      useEffect(() => {
    console.log('People data with team and position names:', transformedPeople);
  }, [transformedPeople]);
  const handleEdit = (id) => {
    console.log(`Edit ${currentView.toLowerCase()} with id: ${id}`);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You won't be able to revert this!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(`Attempting to delete ${currentView.toLowerCase()} with id: ${id}`);
        setDeletingId(id);
        fetch(`https://localhost:44352/api/${currentView}/${id}`, {
          method: 'DELETE',
        })
          .then(response => {
            console.log(`Response status: ${response.status}`);
            if (response.ok) {
              setTimeout(() => {
                if (currentView === 'People') {
                  loadPeople();
                } else if (currentView === 'Teams') {
                  loadTeams();
                } else if (currentView === 'Positions') {
                  loadPositions();
                }
                setDeletingId(null);
                Swal.fire(
                  'Deleted!',
                  'Your file has been deleted.',
                  'success'
                );
              }, 500);
            } else {
              return response.text().then(text => {
                console.error(`Error response text: ${text}`);
                throw new Error(text || response.statusText);
              });
            }
          })
          .catch(error => {
            console.error('Error deleting data:', error.message);
            setDeletingId(null);
            Swal.fire(
              'Error!',
              'There was an error deleting the data.',
              'error'
            );
          });
      }
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

  const handlePersonSubmit = (personData) => {
    console.log('Submitting person data:', personData); // Añadir este console.log para verificar los datos
    fetch('https://localhost:44352/api/People', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personData),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Person added successfully');
          setTimeout(() => {
            closePersonModal();
            loadPeople(); // Recargar datos después de añadir una persona
          }, 2000);
        } else {
          return response.text().then(text => {
            throw new Error(text || response.statusText);
          });
        }
      })
      .catch(error => {
        setMessage('Error adding person');
        console.error('Error:', error.message);
      });
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
            loadPositions(); // Recargar datos después de añadir una posición
          }, 2000);
        } else {
          return response.text().then(text => {
            throw new Error(text || response.statusText);
          });
        }
      })
      .catch(error => {
        setMessage('Error adding position');
        console.error('Error:', error.message);
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
            loadTeams(); // Recargar datos después de añadir un equipo
          }, 2000);
        } else {
          return response.text().then(text => {
            throw new Error(text || response.statusText);
          });
        }
      })
      .catch(error => {
        setMessage('Error adding team');
        console.error('Error:', error.message);
      });
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    console.log('People data:', people);
  }, [people]);

  // Mapea los datos de people para incluir los nombres de team y position
  const mappedPeople = people.map(person => {
    const team = teams.find(team => team.id === person.teamId);
    const position = positions.find(position => position.id === person.positionId);
    return {
      ...person,
      team: team ? team.name : 'N/A',
      position: position ? position.name : 'N/A'
    };
  });

  return (
    <div className={`container mx-auto p-4 bg-gray-200 dark:bg-gray-900 min-h-screen transition-colors duration-300`}>
      <Navbar openModal={openModal} toggleDarkMode={toggleDarkMode} handleViewChange={handleViewChange} />
      <br></br>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} title={modalType === 'add' ? 'Add New' : 'Remove'} onClose={closeModal}>
          <ul>
            <li className="mb-2">
              <button
                onClick={openPersonModal}
                className="w-full text-left px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-white"
              >
                Persons
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
                Positions
              </button>
            </li>
          </ul>
        </Modal>
      )}

      <PersonModal
        isOpen={isPersonModalOpen}
        onClose={closePersonModal}
        onSubmit={handlePersonSubmit}
        teams={teams}
        positions={positions}
      />

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

      {currentView === 'People' && (
        <Table
          data={transformedPeople}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          deletingId={deletingId}
          columns={['RUT', 'Name', 'Last Name', 'Email', 'Phone', 'Team', 'Position']}
        />
      )}
      {currentView === 'Teams' && (
        <Table
          data={teams}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          deletingId={deletingId}
          columns={['Name']}
        />
      )}
      {currentView === 'Positions' && (
        <Table
          data={positions}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          deletingId={deletingId}
          columns={['Name']}
        />
      )}
    </div>
  );
}
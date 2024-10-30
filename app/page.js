"use client";
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Navbar from './(components)/Navbar';
import PositionModal from './(components)/PositionModal';
import TeamModal from './(components)/TeamModal';
import PersonModal from './(components)/PersonModal';
import Modal from './(components)/Modal';
import Table from './(components)/Table';
import SearchBar from './(components)/Searchbar'; // Importar el componente SearchBar
import useData from './(hooks)/useData';
import useModal from './(hooks)/useModal';
import * as XLSX from 'xlsx';
export default function PeopleTable() {
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setDarkMode(e.matches);
    };
  
    // Set initial mode based on system preference
    setDarkMode(darkModeMediaQuery.matches);
  
    // Add event listener for changes in system preference
    darkModeMediaQuery.addEventListener('change', handleChange);
  
    return () => {
      darkModeMediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  const { data: people, loadData: loadPeople } = useData('https://localhost:44352/api/People');
  const { data: teams, loadData: loadTeams } = useData('https://localhost:44352/api/Teams');
  const { data: positions, loadData: loadPositions } = useData('https://localhost:44352/api/Positions');
  const [deletingId, setDeletingId] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const { isOpen: isModalOpen, openModal, closeModal } = useModal();
  const { isOpen: isPositionModalOpen, openModal: openPositionModal, closeModal: closePositionModal } = useModal();
  const { isOpen: isTeamModalOpen, openModal: openTeamModal, closeModal: closeTeamModal } = useModal();
  const { isOpen: isPersonModalOpen, openModal: openPersonModal, closeModal: closePersonModal } = useModal();
  const [modalType, setModalType] = useState(''); // 'add' or 'remove'
  const [message, setMessage] = useState('');
  const [currentView, setCurrentView] = useState('People'); // Estado para la vista actual
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('rut');
  const [editData, setEditData] = useState(null);
  const [personFormData, setPersonFormData] = useState({
  
    RUT: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    teamId: '',
    positionId: ''
  });

  const exportToExcel = () => {
    let dataToExport = [];
    let sheetName = '';
  
    if (currentView === 'People') {
      dataToExport = filteredData.map(person => ({
        RUT: person.rut,
        Name: person.name,
        'Last Name': person.lastName,
        Email: person.email,
        Phone: person.phone,
        Team: person.team,
        Position: person.position
      }));
      sheetName = 'People';
    } else if (currentView === 'Teams') {
      dataToExport = filteredData.map(team => ({
        Name: team.name
      }));
      sheetName = 'Teams';
    } else if (currentView === 'Positions') {
      dataToExport = filteredData.map(position => ({
        Name: position.name
      }));
      sheetName = 'Positions';
    }
  
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${sheetName}.xlsx`);
  };
  const [loading, setLoading] = useState(true); // Añadir estado de carga

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

  useEffect(() => {
    if (people && teams && positions) {
      setLoading(false); // Cambiar a false una vez que los datos se hayan cargado
    }
  }, [people, teams, positions]);

  const handleEdit = (id) => {
    const dataToEdit = currentView === 'People'
      ? people.find(person => person.id === id)
      : currentView === 'Teams'
      ? teams.find(team => team.id === id)
      : positions.find(position => position.id === id);

    setEditData(dataToEdit);
    if (currentView === 'People') {
      openPersonModal();
    } else if (currentView === 'Teams') {
      openTeamModal();
    } else if (currentView === 'Positions') {
      openPositionModal();
    }
  };

  const handleAddPerson = () => {
    setEditData(null); // Limpiar el estado de editData
    setPersonFormData({
      RUT: '',
      name: '',
      lastName: '',
      email: '',
      phone: '',
      teamId: '',
      positionId: ''
    }); // Limpiar el estado del formulario
    openPersonModal(); // Abrir el modal de persona
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
          setTimeout(() => {
            closePersonModal();
            loadPeople(); // Recargar datos después de añadir una persona
          }, 2000);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Person added successfully',
          });
        } else {
          return response.text().then(text => {
            throw new Error(text || response.statusText);
          });
        }
      })
      .catch(error => {
        if (error.message.includes('There is already a person with the same RUT')) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate RUT',
            text: 'There is already a person with the same RUT. Please use a different RUT.',
          });
        } else {
          setMessage('Error adding person');
          console.error('Error:', error.message);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'There was an error adding the person. Please try again.',
          });
        }
      });
  };
  const handleAddPosition = () => {
    setEditData(null); // Limpiar el estado de editData
    openPositionModal(); // Abrir el modal de posición
  };
  const handleAddTeam = () => {
    setEditData(null); // Limpiar el estado de editData
    openTeamModal(); // Abrir el modal de equipo
  };
  const handlePositionSubmit = (positionData) => {
    return fetch('https://localhost:44352/api/Positions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(positionData),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Position added successfully');
          setTimeout(() => {
            closePositionModal();
            loadPositions(); // Recargar datos después de añadir una posición
          }, 2000);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Position added successfully',
          });
        } else {
          return response.text().then(text => {
            try {
              const errorData = JSON.parse(text);
              throw new Error(JSON.stringify(errorData));
            } catch (e) {
              throw new Error(text);
            }
          });
        }
      })
      .catch(error => {
        let errorText = 'There was an error adding the position. Please try again.';
        try {
          const errorMessage = JSON.parse(error.message);
          if (errorMessage.errors) {
            errorText = Object.values(errorMessage.errors).flat().join(' ');
          } else {
            errorText = errorMessage.title || errorText;
          }
        } catch (e) {
          errorText = error.message;
        }
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorText,
        });
      });
  };

const handleTeamSubmit = (teamData) => {
  fetch('https://localhost:44352/api/Teams', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(teamData), // Asegúrate de que el objeto teamData se envíe correctamente
  })
    .then(response => {
      if (response.ok) {
        setMessage('Team added successfully');  
        setTimeout(() => {
          closeTeamModal();
          loadTeams(); // Recargar datos después de añadir un equipo
        }, 2000);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Team added successfully',
        });
      } else {
        return response.text().then(text => {
          try {
            const errorData = JSON.parse(text);
            throw new Error(JSON.stringify(errorData));
          } catch (e) {
            throw new Error(text);
          }
        });
      }
    })
    .catch(error => {
      let errorText = 'There was an error adding the team. Please try again.';
      try {
        const errorMessage = JSON.parse(error.message);
        if (errorMessage.errors) {
          errorText = Object.values(errorMessage.errors).flat().join(' ');
        } else {
          errorText = errorMessage.title || errorText;
        }
      } catch (e) {
        errorText = error.message;
      }
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorText,
      });
    });
};

  const handleEditPersonSubmit = (personData) => {
    console.log('Updating person data:', personData); // Añadir este console.log para verificar los datos
    fetch(`https://localhost:44352/api/People/${personData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(personData),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Person updated successfully');
          setTimeout(() => {
            closePersonModal();
            loadPeople(); // Recargar datos después de actualizar una persona
          }, 2000);
        } else {
          return response.text().then(text => {
            throw new Error(text || response.statusText);
          });
        }
      })
      .catch(error => {
        setMessage('Error updating person');
        console.error('Error:', error.message);
      });
  };

  const handleEditPositionSubmit = (positionData) => {
    return fetch(`https://localhost:44352/api/Positions/${positionData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(positionData),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Position updated successfully');
          setTimeout(() => {
            closePositionModal();
            loadPositions(); // Recargar datos después de actualizar una posición
          }, 2000);
        } else {
          return response.json().then(errorData => {
            throw new Error(JSON.stringify(errorData));
          });
        }
      })
      .catch(error => {
        console.error('Error:', error.message);
        throw error;
      });
  };

  const handleEditTeamSubmit = (teamData) => {
    console.log('Updating team data:', teamData); // Añadir este console.log para verificar los datos
    fetch(`https://localhost:44352/api/Teams/${teamData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    })
      .then(response => {
        if (response.ok) {
          setMessage('Team updated successfully');
          setTimeout(() => {
            closeTeamModal();
            loadTeams(); // Recargar datos después de actualizar un equipo
          }, 2000);
        } else {
          return response.text().then(text => {
            throw new Error(text || response.statusText);
          });
        }
      })
      .catch(error => {
        setMessage('Error updating team');
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

  useEffect(() => {
    console.log('Mapped people data:', mappedPeople);
  }, [mappedPeople]);

  // Filtrar los datos según el término de búsqueda y el filtro seleccionado
// Filtrar los datos según el término de búsqueda y el filtro seleccionado
const filteredData = currentView === 'People' ? mappedPeople.filter(person => {
  const value = person[searchFilter];
  return value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : true;
}) : currentView === 'Teams' ? teams.filter(team => {
  return team.name.toLowerCase().includes(searchTerm.toLowerCase());
}) : positions.filter(position => {
  return position.name.toLowerCase().includes(searchTerm.toLowerCase());
});

// Añadir estados para la paginación y el número de elementos por página
const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);

// Calcular los datos a mostrar en la página actual
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

// Calcular el número total de páginas
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

// Función para cambiar de página
const paginate = (pageNumber) => setCurrentPage(pageNumber);

// Función para cambiar el número de elementos por página
const handleItemsPerPageChange = (event) => {
  setItemsPerPage(Number(event.target.value));
  setCurrentPage(1); // Resetear a la primera página cuando se cambia el número de elementos por página
};
  return (
    <div className={`container mx-auto p-4 bg-gray-200 dark:bg-gray-900 min-h-screen transition-colors duration-300`}>
      <Navbar openModal={openModal} toggleDarkMode={toggleDarkMode} handleViewChange={handleViewChange} />
      <br></br>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchFilter={searchFilter}
        setSearchFilter={setSearchFilter}
        currentView={currentView}
      />
      {isModalOpen && (
        <Modal isOpen={isModalOpen} title={modalType === 'add' ? 'Add New' : 'Add new'} onClose={closeModal}>
  <ul>
    <li className="mb-2">
      <button
        onClick={handleAddPerson} // Usar la nueva función aquí
        className="w-full text-left px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-white"
      >
        Persons
      </button>
    </li>
    <li className="mb-2">
      <button
        onClick={handleAddTeam}
        className="w-full text-left px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-white"
      >
        Team
      </button>
    </li>
    <li>
      <button
        onClick={handleAddPosition}
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
        onSubmit={editData ? handleEditPersonSubmit : handlePersonSubmit}
        teams={teams}
        positions={positions}
        editData={editData}
        personFormData={personFormData}
        setPersonFormData={setPersonFormData}
      />

      <PositionModal
        isOpen={isPositionModalOpen}
        onClose={closePositionModal}
        onSubmit={editData ? handleEditPositionSubmit : handlePositionSubmit}
        editData={editData}
      />

      <TeamModal
        isOpen={isTeamModalOpen}
        onClose={closeTeamModal}
        onSubmit={editData ? handleEditTeamSubmit : handleTeamSubmit}
        editData={editData}
      />
            <div>
        <label htmlFor="itemsPerPage" className="mr-2 text-black dark:text-white">Items per page:</label>
        <select
          id="itemsPerPage"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>
      <div className="text-black dark:text-white">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
      </div>
      {loading ? ( // Mostrar el spinner de carga mientras loading es true
        <div className="flex justify-center items-center h-full">
          <div className="loader"></div>
        </div>
        
      ) : (
        <>
          {currentView === 'People' && (
            <Table
              data={currentItems}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              deletingId={deletingId}
              columns={['RUT', 'Name', 'Last Name', 'Email', 'Phone', 'Team', 'Position']}
            />
          )}
          {currentView === 'Teams' && (
            <Table
              data={currentItems}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              deletingId={deletingId}
              columns={['Name']}
            />
          )}
          {currentView === 'Positions' && (
            <Table
              data={currentItems}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              deletingId={deletingId}
              columns={['Name']}
            />
          )}
        </>
        
      )}
          <div className="flex justify-center mt-4">
      {Array.from({ length: totalPages }, (_, index) => (
        <button
          key={index + 1}
          onClick={() => paginate(index + 1)}
          className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700 text-black dark:text-white'}`}
        >
          {index + 1}
        </button>
      ))}
      <div className="flex justify-end">
  <button
    onClick={exportToExcel}
    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    Export to Excel
  </button>
</div>
    </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useData from './useData';
import useModal from './useModal';

export default function usePeopleTable() {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchFilter, setSearchFilter] = useState('RUT');
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
        if (error.message.includes('There is already a person with the same RUT')) {
          Swal.fire({
            icon: 'error',
            title: 'Duplicate RUT',
            text: 'There is already a person with the same RUT. Please use a different RUT.',
          });
        } else {
          setMessage('Error adding person');
          console.error('Error:', error.message);
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
        throw error;
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
  const filteredData = mappedPeople.filter(person => {
    if (currentView === 'People') {
      const value = person[searchFilter];
      return value ? value.toString().toLowerCase().includes(searchTerm.toLowerCase()) : true;
    } else if (currentView === 'Teams') {
      return person.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (currentView === 'Positions') {
      return person.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return {
    people,
    teams,
    positions,
    deletingId,
    darkMode,
    isModalOpen,
    isPositionModalOpen,
    isTeamModalOpen,
    isPersonModalOpen,
    modalType,
    message,
    currentView,
    searchTerm,
    searchFilter,
    editData,
    personFormData,
    loading,
    handleEdit,
    handleAddPerson,
    handleDelete,
    toggleDarkMode,
    handlePersonSubmit,
    handleAddPosition,
    handleAddTeam,
    handlePositionSubmit,
    handleTeamSubmit,
    handleEditPersonSubmit,
    handleEditPositionSubmit,
    handleEditTeamSubmit,
    handleViewChange,
    filteredData,
    openModal,
    closeModal,
    openPositionModal,
    closePositionModal,
    openTeamModal,
    closeTeamModal,
    openPersonModal,
    closePersonModal,
    setSearchTerm,
    setSearchFilter,
    setPersonFormData,
  };
}
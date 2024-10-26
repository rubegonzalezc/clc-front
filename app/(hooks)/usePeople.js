import { useState, useEffect } from 'react';

export const usePeople = () => {
  const [people, setPeople] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetch('https://localhost:44352/api/People')
      .then(response => response.json())
      .then(data => setPeople(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const deletePerson = (id) => {
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

  return { people, deletingId, deletePerson };
};
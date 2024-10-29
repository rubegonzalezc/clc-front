import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import 'animate.css';

const validateRut = (rut) => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  
  if (cleanRut.length < 2) return false;

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let multiplier = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += body[i] * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const calculatedDv = 11 - (sum % 11);
  const expectedDv = calculatedDv === 11 ? '0' : calculatedDv === 10 ? 'K' : calculatedDv.toString();

  return dv === expectedDv;
};

const formatRut = (rut) => {
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);
  return `${body}-${dv}`;
};

const PersonModal = ({ isOpen, onClose, onSubmit, teams, positions, editData }) => {
  const [formData, setFormData] = useState({
    rut: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    teamId: '',
    positionId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true); // Set loading to true when modal opens
      if (editData) {
        setFormData({
          rut: editData.rut,
          name: editData.name,
          lastName: editData.lastName,
          email: editData.email,
          phone: editData.phone,
          teamId: editData.teamId,
          positionId: editData.positionId
        });
      } else {
        setFormData({
          rut: '',
          name: '',
          lastName: '',
          email: '',
          phone: '',
          teamId: '',
          positionId: ''
        });
      }
      setTimeout(() => setLoading(false), 500); // Simulate loading delay
    }
  }, [isOpen, editData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Verificar si el clic se realiza en el SweetAlert
      if (Swal.isVisible() && Swal.getPopup().contains(event.target)) {
        return;
      }

      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!validateRut(formData.rut)) {
      newErrors.rut = 'Invalid RUT';
    }
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    if (!formData.lastName) {
      newErrors.lastName = 'Last Name is required';
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    if (!formData.phone || !/^\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Phone must be 9 digits';
    }
    if (!formData.teamId) {
      newErrors.teamId = 'Team is required';
    }
    if (!formData.positionId) {
      newErrors.positionId = 'Position is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please correct the errors in the form',
        didClose: () => {
          // No hacer nada cuando se cierra el SweetAlert
        }
      });
      return;
    }

    const team = teams.find(team => team.id === parseInt(formData.teamId));
    const position = positions.find(position => position.id === parseInt(formData.positionId));
    const personData = {
      ...formData,
      id: editData ? editData.id : undefined, // Incluir el id si es una edición
      rut: formatRut(formData.rut), // Formatear RUT antes de enviar
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
    setErrors({});
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: `Person ${editData ? 'updated' : 'added'} successfully`,
    }).then(() => {
      onClose(); // Cerrar el modal solo después de mostrar el mensaje de éxito
    });
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500); // Duration of the closing animation
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader"></div>
          </div>
        ) : (
          <div ref={modalRef} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 animate__animated ${isClosing ? 'animate__fadeOut' : 'animate__fadeIn'}`}>
            <h2 className="text-xl font-bold mb-4 dark:text-white">{editData ? 'Edit Person' : 'Add Person'}</h2>
            <div className="relative mb-6">
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                placeholder="Rut"
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.rut ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.rut && <p className="text-red-500 mt-1">{errors.rut}</p>}
            </div>
            <div className="relative mb-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div className="relative mb-6">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-red-500 mt-1">{errors.lastName}</p>}
            </div>
            <div className="relative mb-6">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div className="relative mb-6">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phone && <p className="text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div className="relative mb-6">
              <select
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.teamId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {errors.teamId && <p className="text-red-500 mt-1">{errors.teamId}</p>}
            </div>
            <div className="relative mb-6">
              <select
                name="positionId"
                value={formData.positionId}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white ${errors.positionId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select Position</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.name}
                  </option>
                ))}
              </select>
              {errors.positionId && <p className="text-red-500 mt-1">{errors.positionId}</p>}
            </div>
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
            >
              {editData ? 'Update' : 'Submit'}
            </button>
            <button
              onClick={handleClose}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            >
              Close
            </button>
          </div>
        )}
      </div>
    )
  );
};

export default PersonModal;
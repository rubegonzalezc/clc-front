import React, { useEffect, useState, useRef } from 'react';
import 'animate.css';

const Modal = ({ isOpen, title, children, onClose }) => {
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 500); 
  };

  if (!isOpen && !show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        ref={modalRef}
        className={`bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center animate__animated ${isClosing ? 'animate__fadeOut' : 'animate__fadeIn'}`}
      >
        <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
        {children}
        <button
          onClick={handleClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
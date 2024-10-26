// (components)/Modal.js
import React, { useEffect, useState } from 'react';

const Modal = ({ isOpen, title, children, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-out">
      <div className={`bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 text-center transform transition-transform duration-300 ease-out ${show ? 'modal-show' : 'modal-hide'}`}>
        <h2 className="text-xl font-bold mb-4 dark:text-white">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
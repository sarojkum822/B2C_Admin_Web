import React, { useState } from 'react';
import OutletPartnerForm from "./AddOutletPartnerForm.jsx";

const AddAnOutletPartner = () => {
  const [showForm, setShowForm] = useState(false);

  const handleClick = () => {
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
  };

  return (
    <>
      {!showForm ? (
        <button
          className=" bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 ease-in-out"
          onClick={handleClick}
        >
          + Add An Outlet Partner
        </button>
      ) : (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
        >
          <div className="bg-white p-8 rounded-md w-full max-w-3xl relative">
            <OutletPartnerForm handleClose={handleCloseModal} />
          </div>
        </div>
      )}
    </>
  );
};

export default AddAnOutletPartner;

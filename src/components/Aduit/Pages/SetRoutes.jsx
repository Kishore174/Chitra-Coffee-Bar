import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import SelectedRoutesDisplay from '../../SelectedRoutesDisplay';
 

const SetRoutes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  // Options for the dropdown
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' },
  ];

  // Example routes for modal
  const availableRoutes = ['Route A', 'Route B', 'Route C', 'Route D'];

  // Filter options based on the search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter available routes based on search term
  const filteredRoutes = availableRoutes.filter(route =>
    route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const toggleModal = () => {
    setModalOpen(prev => !prev);
    setSearchTerm(''); // Clear search term when opening modal
  };

  const handleSelectRoute = (route) => {
    if (!selectedRoutes.includes(route)) {
      setSelectedRoutes([...selectedRoutes, route]);
    }
  };

  const handleRemoveRoute = (route) => {
    setSelectedRoutes(selectedRoutes.filter(selected => selected !== route));
  };

  return (
    <div className="relative w-64 p-6">
      <h2 className="text-lg font-semibold mb-4">Set Routes</h2>

      <div
        className="flex items-center justify-between border border-gray-300 rounded p-2 cursor-pointer"
        onClick={() => setDropdownOpen(prev => !prev)}
      >
        <span>{selectedOption ? selectedOption.label : 'Select an option'}</span>
        {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
      </div>

      {dropdownOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 mt-1 rounded w-full max-h-60 overflow-y-auto shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full border-b border-gray-300 focus:outline-none"
          />

          <ul className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="p-2 text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}

      <SelectedRoutesDisplay
        selectedRoutes={selectedRoutes}
        toggleModal={toggleModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        modalOpen={modalOpen}
        handleSelectRoute={handleSelectRoute}
        filteredRoutes={filteredRoutes}
        handleRemoveRoute={handleRemoveRoute}
      />
    </div>
  );
};

export default SetRoutes;

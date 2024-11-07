import React, { useState } from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import SelectedRoutesDisplay from './SelectedRoutesDisplay';

const SetRoutes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState([]);

  // Options for the dropdown
  const options = [
    { label: 'Route 1', value: 'Route 1' },
    { label: 'Route 2', value: 'Route 2' },
    { label: 'Route 3', value: 'Route 3' },
    { label: 'Route 4', value: 'Route 4' },
    { label: 'Route 5', value: 'Route 5' },
    { label: 'Route 6', value: 'Route 6' },
    { label: 'Route 7', value: 'Route 7' },
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
    // Add selected option to selectedRoutes if not already present
    if (!selectedRoutes.includes(option.label)) {
      setSelectedRoutes([...selectedRoutes, option.label]);
    }
    setSelectedOption(option);
    setDropdownOpen(false);
  };

  const toggleModal = () => {
    setModalOpen(prev => !prev);
    setSearchTerm(''); // Clear search term when opening modal
  };

  const handleRemoveRoute = (route) => {
    setSelectedRoutes(selectedRoutes.filter(selected => selected !== route));
  };

  return (
    <div className='w-full'>
<div className="relative w-3/6 p-6">
  <h2 className="text-lg poppins-semibold mb-4">Select Routes</h2>

  <div
    className="flex items-center justify-between border border-gray-300 rounded-lg p-3 cursor-pointer transition duration-200 ease-in-out hover:shadow-md"
    onClick={() => setDropdownOpen(prev => !prev)}
    aria-haspopup="true"
    aria-expanded={dropdownOpen}
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && setDropdownOpen(prev => !prev)}
  >
    <span className="text-gray-800">{selectedOption ? selectedOption.label : 'Select an option'}</span>
    <span className={`text-gray-600 transition duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`}>
      {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
    </span>
  </div>

  {dropdownOpen && (
    <div className="absolute z-10 bg-white border border-gray-300 mt-1 rounded-lg w-full max-h-60 overflow-y-auto shadow-lg transition duration-200 ease-in-out">
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-3 w-full border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
      />

      <ul className="py-1">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <li
              key={option.value}
              className={`p-3 cursor-pointer rounded-lg hover:bg-gray-200 transition duration-200 ${selectedOption?.value === option.value ? 'bg-gray-300 font-semibold' : ''}`}
              onClick={() => handleOptionSelect(option)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleOptionSelect(option)}
            >
              {option.label}
            </li>
          ))
        ) : (
          <li className="p-3 text-gray-500">No options found</li>
        )}
      </ul>
    </div>
  )}
</div>




      {/* Conditionally render SelectedRoutesDisplay only if there are selected routes */}
      {selectedRoutes.length > 0 && (
        <div className='w-full'>
          <SelectedRoutesDisplay
            selectedRoutes={selectedRoutes}
            toggleModal={toggleModal}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            modalOpen={modalOpen}
            filteredRoutes={filteredRoutes}
            handleRemoveRoute={handleRemoveRoute}
          />
        </div>
      )}
    </div>
  );
};

export default SetRoutes;

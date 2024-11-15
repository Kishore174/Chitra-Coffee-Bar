import React, { useEffect, useState } from 'react';
import { HiPlus, HiTrash, HiPencil } from 'react-icons/hi'; // Plus, delete, and edit icons
import { createBrand, deleteBrand, getBrand, updateBrand } from '../../../../API/settings';
import toast from 'react-hot-toast';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const BrandName = () => {
  const [inputFields, setInputFields] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState({ _id: null,  name: '' });
  const navigate = useNavigate();

  const handleOpenDialog = (field = { id: null,  name: '' }) => {
    setCurrentField(field);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentField({ _id: null,  name: '' });
  };

  const handleSubmit = async() => {
    if (currentField._id) {
      updateBrand(currentField._id,{name:currentField.name})
      .then((res) => {
        toast.success(res.message);
      })             
      .catch (error=> {
        console.error('updatetest', error);
      })
      setInputFields(inputFields.map(field => 
        field._id === currentField._id ? { ...field, name: currentField. name } : field
      ));
    } else {
      const res= await createBrand({name:currentField.name})
    toast.success(res.message)
      setInputFields([...inputFields, { _id: Date.now(),name: currentField. name }]);
    }                                                                                                                                                                                                                                                                                                                                                                                  
    handleCloseDialog();
  };

useEffect(() => {
    const fetchBrands = async () => {
      try {
        const  res = await getBrand();
        console.log("test",  res); 
        setInputFields( res.data);
      } catch (error) {
        console.error('test', error);
      }
    };
    fetchBrands();
  }, []);
  const handleRemoveField = (id) => {
  
   
    deleteBrand(id)
      .then((res) => {
        toast.success(res.message);
        setInputFields(inputFields.filter((s) => s._id !== id));
        // setLiveSnackToDelete(null);
      })
      .catch((err) => toast.error(`Error: ${err.message}`));
 
};
  const handleInputChange = (event) => {
    setCurrentField({ ...currentField,  name: event.target.value });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
    {/* Navigation and Add Button */}
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-700 space-x-1 hover:text-red-600 transition duration-200"
      >
        <MdArrowBack className="w-5 h-5 md:w-6 md:h-6" />
        <span className="text-sm md:text-lg font-medium">Back</span>
      </button>
      <button
        onClick={() => handleOpenDialog()}
        className="px-4 py-2 rounded bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 text-sm md:text-base"
      >
        Add Snack
      </button>
    </div>

    {/* Snack List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {inputFields.map((field) => (
        <div
          key={field._id}
          className="flex items-center justify-between border border-gray-200 shadow-lg rounded-lg p-3 bg-white hover:shadow-xl transition-shadow duration-200 ease-in-out"
        >
          <span className="flex-grow text-xs  md:text-base font-medium text-gray-800">
            {field.name}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleOpenDialog(field)}
              className="text-blue-500 hover:text-blue-700 p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 focus:outline-none"
              title="Edit Snack"
            >
              <HiPencil size={18} />
            </button>
            <button
              onClick={() => handleRemoveField(field._id)}
              className="text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-200 focus:outline-none"
              title="Delete Snack"
            >
              <HiTrash size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Dialog */}
    {isDialogOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-11/12 md:w-96">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            {currentField._id ? 'Edit Snack' : 'Add Snack'}
          </h2>
          <input
            type="text"
            value={currentField.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg p-2 md:p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Enter Snack Name"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={handleCloseDialog}
              className="px-3 py-1 text-sm md:text-base bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1 text-sm md:text-base bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              {currentField._id ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default BrandName;

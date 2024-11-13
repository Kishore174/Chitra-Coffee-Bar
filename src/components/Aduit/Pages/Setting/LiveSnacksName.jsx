 
import React, { useEffect, useState } from 'react';
import { HiPlus, HiTrash, HiPencil } from 'react-icons/hi'; // Plus, delete, and edit icons
import { createBrand, createSnackBrand, deleteLiveSnacks, getBrand, getSnackBrand, updateLiveSnack } from '../../../../API/settings';
import toast from 'react-hot-toast';
const LiveSnacksName = () => {
  const [inputFields, setInputFields] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentField, setCurrentField] = useState({ _id: null,  name: '' });
const[liveSnackToDelete,setLiveSnackToDelete]=useState(null)
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
      updateLiveSnack(currentField._id,currentField. name)
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
      const res= await createSnackBrand({name:currentField.name})
    toast.success(res.message)
      setInputFields([...inputFields, { _id: Date.now(),name: currentField. name }]);
    }                                                                                                                                                                                                                                                                                                                                                                                  
    handleCloseDialog();
  };

useEffect(() => {
    const fetchBrands = async () => {
      try {
        const  res = await getSnackBrand();
        console.log("test",  res); 
        setInputFields( res.data);
      } catch (error) {
        console.error('test', error);
      }
    };
    fetchBrands();
  }, []);
  const handleRemoveField = (id) => {
  
   
      deleteLiveSnacks(id)
        .then((res) => {
          toast.success(res.message);
          setInputFields(inputFields.filter((s) => s._id !== id));
          setLiveSnackToDelete(null);
        })
        .catch((err) => toast.error(`Error: ${err.message}`));
   
  };

  const handleInputChange = (event) => {
    setCurrentField({ ...currentField,  name: event.target.value });
  };
  return (
    <div className="relative max-w-4xl mx-auto p-6 ">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
 {inputFields.map((field) => (
   <div
     key={field.id}
     className="flex items-center justify-between border border-gray-200 shadow-lg rounded-lg p-4 bg-white hover:shadow-xl transition-shadow duration-200 ease-in-out"
   >
     <span className="flex-grow text-lg font-semibold text-gray-800">{field.name}</span>
     <div className="flex items-center space-x-2">
       <button
         onClick={() => handleOpenDialog(field)}
         className="text-blue-500 hover:text-blue-700 p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
         title="Edit Brand"
       >
         <HiPencil size={20} />
       </button>
       <button
         onClick={() => handleRemoveField(field._id)}
         className="text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
         title="Delete Brand"
       >
         <HiTrash size={20} />
       </button>
     </div>
   </div>
 ))}
</div>


     <button
       onClick={() => handleOpenDialog()}
       className="fixed top-20 right-6 flex items-center justify-center  px-3 py-1  rounded bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
     >
        Add Snack
     </button>

    
     {isDialogOpen && (
       <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
           <h2 className="text-2xl mb-4">{currentField.id ? 'Edit Brand' : 'Add Brand'}</h2>
           <input
             type="text"
             value={currentField. name}
             onChange={handleInputChange}
             className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
             placeholder="Enter Brand Name"
           />
           <div className="flex justify-end space-x-4">
             <button
               onClick={handleCloseDialog}
               className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
             >
               Cancel
             </button>
             <button
               onClick={handleSubmit}
               className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
             >
               {currentField.id ? 'Update' : 'Add'}
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
  )
}

export default LiveSnacksName
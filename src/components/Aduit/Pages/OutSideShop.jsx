import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import CustomerAreaLightingSection from './Outsideall/CustomerAreaLightingSection';
import ShopBoardSection from './Outsideall/ShopBoardSection';
import LollipopStandSection from './Outsideall/LollipopStandSection';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

const OutSideShop = () => {
  const [selectedCustomerAreaLighting, setSelectedCustomerAreaLighting] = useState('');
  const [customerAreaLightingRating, setCustomerAreaLightingRating] = useState(0);
  const [customerAreaLightingImagePreview, setCustomerAreaLightingImagePreview] = useState('');
  const customerAreaLightingFileInputRef = useRef(null);
  const [selectedShopBoardCondition, setSelectedShopBoardCondition] = useState('');
  const [lightWorkingStatus, setLightWorkingStatus] = useState('');
  const [shopBoardRating, setShopBoardRating] = useState(0);
  const [shopBoardImagePreview, setShopBoardImagePreview] = useState('');
  const shopBoardFileInputRef = useRef(null);
  // Additional state for lollipop stand condition
  const [selectedLollipopStandCondition, setSelectedLollipopStandCondition] = useState('');
  const [lollipopStandLightWorkingStatus, setLollipopStandLightWorkingStatus] = useState('');
  const [lollipopStandRating, setLollipopStandRating] = useState(0);
  const [lollipopStandImagePreview, setLollipopStandImagePreview] = useState('');
  const lollipopStandFileInputRef = useRef(null);

  // Handlers for lollipop stand condition
  const handleLollipopStandConditionClick = (condition) => {
    setSelectedLollipopStandCondition(condition);
  };

  const handleLollipopStandLightWorkingStatusClick = (status) => {
    setLollipopStandLightWorkingStatus(status);
  };

  const triggerLollipopStandFileInput = () => {
    lollipopStandFileInputRef.current.click();
  };

  const handleLollipopStandPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLollipopStandImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  
  const handleShopBoardConditionClick = (condition) => {
    setSelectedShopBoardCondition(condition);
  };

  const handleLightWorkingStatusClick = (status) => {
    setLightWorkingStatus(status);
  };

  const triggerShopBoardFileInput = () => {
    shopBoardFileInputRef.current.click();
  };

  const handleShopBoardPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopBoardImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for customer area lighting
  const handleCustomerAreaLightingClick = (lighting) => {
    setSelectedCustomerAreaLighting(lighting);
  };

  const triggerCustomerAreaLightingFileInput = () => {
    customerAreaLightingFileInputRef.current.click();
  };

  const handleCustomerAreaLightingPhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomerAreaLightingImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const navigate = useNavigate()
  return (
    <div className='   poppins-regular max-w-5xl  md:ml-28'>
<button onClick={() => navigate(-1)} className="text-gray-700 flex hover:text-red-600 transition duration-200">
            <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
          </button>
    <div className="p-4 flex flex-wrap mx-auto  justify-start gap-4">
         
<CustomerAreaLightingSection/>
        <ShopBoardSection/>

        <LollipopStandSection/>
          

      </div>
      <Link to="/add-audit">
       
       <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
    <span className='text-center  mx-auto'>Submit</span> 
       </button>
     </Link>
          </div>
  );
};

export default OutSideShop;

import React, { useState, useRef } from 'react';
import { CameraIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import InsideKitchen01 from './InsideKitchen01';
import { Link, useNavigate } from 'react-router-dom';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';

const InsideKitchen = () => {
  const [selectedSnackRemark, setSelectedSnackRemark] = useState('');
  const [snackUserRemark, setSnackUserRemark] = useState('');
  const [granderRemark, setGranderRemark] = useState('');

  const [snackImagePreview, setSnackImagePreview] = useState([]);
  const [milkBrandName, setMilkBrandName] = useState('');
  const [milkRating, setMilkRating] = useState(0);
  const [milkImagePreview, setMilkImagePreview] = useState([]);
  const [grinderBrandName, setGrinderBrandName] = useState('');
  const [grinderRating, setGrinderRating] = useState(0);
  const [grinderImagePreview, setGrinderImagePreview] = useState([]);
  const [selectedGrinderRemark, setSelectedGrinderRemark] = useState('');

  // New state for Sink
  const [selectedSinkRemark, setSelectedSinkRemark] = useState('');
  const [sinkUserRemark, setSinkUserRemark] = useState('');
  const [sinkImagePreview, setSinkImagePreview] = useState([]);
  const [sinkRating, setSinkRating] = useState(0); // New state for sink rating
  const [previewImage, setPreviewImage] = useState(null);
  const [previewKitchinImage, setPreviewKitchenImage] = useState(null);
  const [previewWorkTableImage, setPreviewWorkTableImage] = useState(null);
  const [previewSinkImage, setPreviewSinkImage] = useState(null);
  const [previewGrinderImage, setPreviewGrinderImage] = useState(null);
  const [previewMilkImage, setPreviewMilkImage] = useState(null);
  const [previewSnackImage, setPreviewSnackImage] = useState(null);



  const [isSnackSubmitted, setIsSnackSubmitted] = useState(false); 

  const [isMilkSubmitted, setIsMilkSubmitted] = useState(false); 

  const [isGrinderSubmitted, setIsGrinderSubmitted] = useState(false); 

  const [isSinkSubmitted, setIsSinkSubmitted] = useState(false); 

  const [isSubmitted, setIsSubmitted] = useState(false); 
  const [isKitchenSubmitted, setIsKitchenSubmitted] = useState(false); 
  
  const [isWorkTableSubmitted, setIsWorkTableSubmitted] = useState(false); 


  
  const [selectedWorkTableRemark, setSelectedWorkTableRemark] = useState('');
  const [workTableUserRemark, setWorkTableUserRemark] = useState('');
  const [workTableImagePreview, setWorkTableImagePreview] = useState([]);
  const [workTableRating, setWorkTableRating] = useState(0); // New state for work table rating
  const [selectedKitchenFloorRemark, setSelectedKitchenFloorRemark] = useState('');
  const [kitchenFloorUserRemark, setKitchenFloorUserRemark] = useState('');
  const [kitchenFloorRating, setKitchenFloorRating] = useState(0);
  const [kitchenFloorImagePreview, setKitchenFloorImagePreview] = useState([]);
  const kitchenFloorFileInputRef = useRef(null);
  const snackFileInputRef = useRef(null);
  const milkFileInputRef = useRef(null);
  const grinderFileInputRef = useRef(null);
  const sinkFileInputRef = useRef(null);
  const workTableFileInputRef = useRef(null); // Ref for work table file input
// Additional state for exhaust fan
const [selectedExhaustFanCondition, setSelectedExhaustFanCondition] = useState('');
const [selectedExhaustFanRemark, setSelectedExhaustFanRemark] = useState('');
const [exhaustFanUserRemark, setExhaustFanUserRemark] = useState('');
const [exhaustFanRating, setExhaustFanRating] = useState(0);
 
 
const [exhaustFanImagePreview, setExhaustFanImagePreview] = useState([]);
const exhaustFanFileInputRef = useRef(null);
const handleExhaustFanConditionClick = (condition) => {
    setSelectedExhaustFanCondition(condition);
  };
  
  const handleExhaustFanRemarkClick = (remark) => {
    setSelectedExhaustFanRemark(remark);
  };
  
  const triggerExhaustFanFileInput = () => {
    exhaustFanFileInputRef.current.click();
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`Lat: ${latitude.toFixed(2)}, Long: ${longitude.toFixed(2)}`);
        },
        (error) => {
          resolve("Location unavailable"); // Use fallback if location access is denied
        }
      );
    });
  };
  const handleExhaustFanPhotoCapture=async(e) =>{
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const location = await getLocation();

 
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setExhaustFanImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };
 
  
const removeImage = (index) => {
  setExhaustFanImagePreview((prev) => prev.filter((_, i) => i !== index));
};

 
const handleImageClick = (image) => {
  setPreviewImage(image);
};
 
const handleClosePreview = () => {
  setPreviewImage(null);
};

 
const handleSubmit = () => {
   
  setIsSubmitted(true);  
};
//
const handleKitchenConditionClick = (condition) => {
  setSelectedKitchenFloorRemark(condition);
};

 ;

 
const handleKitchenFloorPhotoCapture=async(e) =>{
  const files = Array.from(e.target.files);
  const dateTime = getCurrentDateTime();
  const location = await getLocation();


  files.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Set watermark style
        ctx.font = '16px Arial';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
        ctx.fillStyle = 'black';
        ctx.fillText(`Location: ${location}`, 15, img.height - 40);
        ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

        // Convert canvas to data URL and store it in the state
        const watermarkedImage = canvas.toDataURL('image/png');
        setKitchenFloorImagePreview((prev) => [...prev, watermarkedImage]);
      };
    };
    reader.readAsDataURL(file);
  });

  e.target.value = null;
};

const removeKitchenImage = (index) => {
setKitchenFloorImagePreview((prev) => prev.filter((_, i) => i !== index));
};


const handleKitchenClick = (image) => {
setPreviewKitchenImage(image);
};

const handleCloseKitchenPreview = () => {
setPreviewKitchenImage(null);
};


const handleKitchenSubmit = () => {
 
setIsKitchenSubmitted(true);  
};
 
const removeSinkImage = (index) => {
  setSinkImagePreview((prev) => prev.filter((_, i) => i !== index));
  };
  
  
  const handleSinkClick = (image) => {
  setPreviewSinkImage (image);
  };
  
  const handleCloseSinkPreview = () => {
  setPreviewSinkImage(null);
  };
  
  
  const handleSinkSubmit = () => {
   
  setIsSinkSubmitted(true);  
  };
  const handleSnackRemarkClick = (remark) => {
    setSelectedSnackRemark(remark);
  };

  const handleGrinderRemarkClick = (remark) => {
    setSelectedGrinderRemark(remark);
  };

  const handleSinkRemarkClick = (remark) => {
    setSelectedSinkRemark(remark);
  };

  // New remark click handler for Work Table
  const handleWorkTableRemarkClick = (remark) => {
    setSelectedWorkTableRemark(remark);
  };

  const handleSnackPhotoCapture =async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const location = await getLocation();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setSnackImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  
  const removeSnackImage = (index) => {
    setSnackImagePreview((prev) => prev.filter((_, i) => i !== index));
    };
    
    
    const handleSnackClick = (image) => {
    setPreviewSnackImage(image);
    };
    
    
 
    const handleCloseSnack= () => {
      setPreviewSnackImage(null);
      };
    
    const handleSnackSubmit = () => {
     
    setIsSnackSubmitted(true);  
    };

  const handleMilkPhotoCapture =async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const location = await getLocation();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setMilkImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeMilkImage = (index) => {
    setMilkImagePreview((prev) => prev.filter((_, i) => i !== index));
    };
    
    
    const handleMilkClick = (image) => {
    setPreviewMilkImage(image);
    };
    
    
 
    const handleCloseMilk= () => {
      setPreviewMilkImage(null);
      };
    
    const handleMilkSubmit = () => {
     
    setIsMilkSubmitted(true);  
    };
  const handleGrinderPhotoCapture =async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const location = await getLocation();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setGrinderImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const removeGrinderImage = (index) => {
    setGrinderImagePreview((prev) => prev.filter((_, i) => i !== index));
    };
    
    
    const handleGrinderClick = (image) => {
    setPreviewGrinderImage(image);
    };
    
    
 
    const handleCloseGrinder = () => {
      setPreviewGrinderImage(null);
      };
    
    const handleGrinderSubmit = () => {
     
    setIsGrinderSubmitted(true);  
    };

  const handleSinkPhotoCapture =async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const location = await getLocation();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setSinkImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };
  const removeWorkTableImage = (index) => {
    setWorkTableImagePreview((prev) => prev.filter((_, i) => i !== index));
    };
    
    
    const handleWorkTableClick = (image) => {
    setPreviewWorkTableImage(image);
    };
    
    const handleCloseWorkTablePreview = () => {
    setPreviewWorkTableImage(null);
    };
    
    
    const handleWorkTableSubmit = () => {
     
     setIsWorkTableSubmitted(true);  
    };
  // New function for Work Table photo capture
  const handleWorkTablePhotoCapture =async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const location = await getLocation();

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = '16px Arial';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = 'black';
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${dateTime}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL('image/png');
          setWorkTableImagePreview((prev) => [...prev, watermarkedImage]);
        };
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null;
  };

  const triggerSnackFileInput = () => {
    snackFileInputRef.current.click();
  };

  const triggerMilkFileInput = () => {
    milkFileInputRef.current.click();
  };

  const triggerGrinderFileInput = () => {
    grinderFileInputRef.current.click();
  };

  const triggerSinkFileInput = () => {
    sinkFileInputRef.current.click();
  };

  // New function to trigger Work Table file input
  const triggerWorkTableFileInput = () => {
    workTableFileInputRef.current.click();
  };

  const handleKitchenFloorRemarkClick = (remark) => {
    setSelectedKitchenFloorRemark(remark);
  };
  
  const triggerKitchenFloorFileInput = () => {
    kitchenFloorFileInputRef.current.click();
  };
  
  const navigate = useNavigate()
  // Remove image preview


  return (
    <div className='   poppins-regular  max-w-7xl  md:ml-24'>
<button onClick={() => navigate(-1)} className="text-gray-700 flex hover:text-red-600 transition duration-200">
            <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
          </button>
    <div className="  flex flex-wrap justify-start  mx-auto gap-5">
          {/* Card for Snack Making */}
          <div className="border relative rounded-lg shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
              <h1 className="text-md whitespace-nowrap text-center font-semibold mb-4">Snack Making Counter</h1>
              <div className="mb-2"> 
    <label className="text-sm font-medium text-gray-500 mb-2 block">Hygiene</label>

              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark} 
                          onClick={() => handleSnackRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedSnackRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              </div>
              <div> 
    <label className="text-sm font-medium text-gray-500 mb-2 block">Remark</label>

              <textarea
                  placeholder="Enter your remark..."
                  value={snackUserRemark}
                  onChange={(e) => setSnackUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-4" />
                  </div>
              <div className="flex flex-wrap gap-2 mb-4"> 
                  
                    {snackImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Kitchen Light ${index + 1}`}
              className="h-8 w-8 border rounded-md object-cover cursor-pointer"
              onClick={() => handleSnackClick(image)}
            />
            <button
              onClick={() => removeSnackImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
                        <div onClick={triggerSnackFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
                  <PlusIcon className="w-8 h-8 text-gray-600" />

        </div>
        </div>
              <input
                  typasse="file"
                  accept="image/*"
                  ref={snackFileInputRef}
                  onChange={handleSnackPhotoCapture}
                  className="hidden" 
                  multiple/>
          
           {/* <button
        onClick={handleSnackSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isSnackSubmitted? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isSnackSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button> */}
      {previewSnackImage  && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={previewSnackImage} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseSnack}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon  className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* {isSnackSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )} */}
          
</div>
          {/* Card for Milk Freezer */}
          <div className="border rounded-lg relative shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Milk Freezer</h2>
              <div> 
              <label className="text-sm font-medium text-gray-500 mb-2 block">Brand Name</label>
              <input
                  type="text"
                  placeholder="Milk Brand Name"
                  value={milkBrandName}
                  onChange={(e) => setMilkBrandName(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
                  </div>
                  <div className="mb-4">
                  < lable className="  whitespace-nowrap text-gray-700 text-sm">Rate MilkFreezer experience</ lable>
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setMilkRating(index + 1)}
                          className={`cursor-pointer text-2xl ${milkRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4"> 

              {milkImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Kitchen Light ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleMilkClick(image)}
            />
            <button
              onClick={() => removeMilkImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
                        <div
          onClick={triggerMilkFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
              <input
                  type="file"
                  accept="image/*"
                  ref={milkFileInputRef}
                  onChange={handleMilkPhotoCapture}
                  className="hidden"
                  multiple />
          </div>

          {/* <button
        onClick={handleMilkSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isMilkSubmitted? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isMilkSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button> */}
      {previewMilkImage  && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={previewMilkImage} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseMilk}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon  className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* {isMilkSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )} */}
          </div>

          {/* Card for Grinder */}
          <div className="border relative rounded-lg shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Grinder</h2>
              <div className='mb-2'> 
              <label className="text-sm font-medium text-gray-500 mb-2 block"> Hygiene</label>                    
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleGrinderRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedGrinderRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                    {remark}
                      </div>
                  ))}
              </div>
              </div>
              <div> 
              <label className="text-sm font-medium text-gray-500 mb-2 block">Brand Name</label>
              <input
                  type="text"
                  placeholder="Grinder Brand Name"
                  value={grinderBrandName}
                  onChange={(e) => setGrinderBrandName(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
                  </div>
                  <div className="mb-4">
                  <h3 className=" text-gray-700 text-sm">Rate Grander experience</h3>
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setGrinderRating(index + 1)}
                          className={`cursor-pointer text-2xl ${grinderRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4"> 

              {grinderImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Kitchen Light ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleGrinderClick(image)}
            />
            <button
              onClick={() => removeGrinderImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
                  <div
          onClick={triggerGrinderFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
              <input
                  type="file"
                  accept="image/*" 
                  ref={grinderFileInputRef}
                  onChange={handleGrinderPhotoCapture}
                  className="hidden" 
                  multiple/>
                  </div>
                  {/* <button
        onClick={handleGrinderSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isGrinderSubmitted? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isSinkSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button> */}
      {previewGrinderImage  && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={previewGrinderImage} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseGrinder}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon  className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* {isGrinderSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )} */}
          </div>

      
          <div className="border rounded-lg relative shadow-md p-4 w-full flex flex-col justify-between sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Sink</h2>
              <div className='mb-2'>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Hygiene</label>

              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleSinkRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedSinkRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              </div>
              <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Remark</label>
              <textarea
                  type="text"
                  placeholder="Enter your remark..."
                  value={sinkUserRemark}
                  onChange={(e) => setSinkUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
              </div>
            <div className='mb-2'>
                   
        <h3 className="  text-gray-700 text-sm">Rate Sink experience</h3>
           
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setSinkRating(index + 1)}
                          className={`cursor-pointer text-2xl ${sinkRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4"> 

              {sinkImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Kitchen Light ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleSinkClick(image)}
            />
            <button
              onClick={() => removeSinkImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
               <div
          onClick={triggerSinkFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
              <input
                  type="file"
                  accept="image/*"
                  ref={sinkFileInputRef}
                  onChange={handleSinkPhotoCapture}
                  className="hidden" 
                 multiple/>
          </div>
    {/* <button
        onClick={handleSinkSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isSinkSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isSinkSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button> */}
      {previewSinkImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={previewSinkImage} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseSinkPreview}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon  className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* {isSinkSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )} */}
</div>
      {/* Image Preview Modal */}
     
          {/* Card for Work Table */}
          <div className="border relative rounded-lg shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Work Table</h2>
              <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Hygiene</label>

              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleWorkTableRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                hover:bg-red-600 hover:text-white ${selectedWorkTableRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              </div>   
              <div>

              <label className="text-sm font-medium text-gray-500 mb-2 block">Remark</label>


              
              <textarea
                  type="text"
                  placeholder="Enter your remark..."
                  value={workTableUserRemark}
                  onChange={(e) => setWorkTableUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
                  </div>
                  <div className='mb-2'>
                   
                   <h3 className="  text-gray-700 text-sm">Rate Work Table experience</h3>
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setWorkTableRating(index + 1)}
                          className={`cursor-pointer text-2xl ${workTableRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">

              {workTableImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Kitchen Light ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleWorkTableClick(image)}
            />
            <button
              onClick={() => removeWorkTableImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
               <div
          onClick={triggerWorkTableFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
              <input
                  type="file"
                  accept="image/*"
                  ref={workTableFileInputRef}
                  onChange={handleWorkTablePhotoCapture}
                  className="hidden" 
                  multiple/>
          </div>
          {/* <button
        onClick={handleWorkTableSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isWorkTableSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isWorkTableSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button> */}

      {/* Image Preview Modal */}
      {previewWorkTableImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={workTableImagePreview} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseWorkTablePreview}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon  className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* {isWorkTableSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )} */}
          </div>
          <div className="border rounded-lg relative shadow-md p-4 w-full sm:w-1/2 lg:w-1/4">
              <h2 className="text-xl font-semibold mb-2">Kitchen Floor</h2>
              <div className='mb-2'>
              <label className="text-sm font-medium text-gray-500 mb-2 block">Hygiene</label>
              <div className="flex space-x-4 mb-4">
                  {['Good', 'Bad'].map((remark) => (
                      <div
                          key={remark}
                          onClick={() => handleKitchenFloorRemarkClick(remark)}
                          className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
          hover:bg-red-600 hover:text-white ${selectedKitchenFloorRemark === remark ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
                      >
                          {remark}
                      </div>
                  ))}
              </div>
              </div>
              <div>
              <label className="text-sm font-medium text-gray-500 mb-2 block"> Remark</label>

          
              <textarea
                  type="text"
                  placeholder="Enter your remark..."
                  value={kitchenFloorUserRemark}
                  onChange={(e) => setKitchenFloorUserRemark(e.target.value)}
                  className="border rounded-md p-2 w-full mb-2" />
                      </div>
                      <div className="mb-4">
                      <h3 className="  text-gray-700 text-sm">Rate Kitchen experience</h3>
              <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, index) => (
                      <span
                          key={index}
                          onClick={() => setKitchenFloorRating(index + 1)}
                          className={`cursor-pointer text-2xl ${kitchenFloorRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                          ★
                      </span>
                  ))}
              </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
              {kitchenFloorImagePreview.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Kitchen Light ${index + 1}`}
              className="h-12 w-12 border rounded-md object-cover cursor-pointer"
              onClick={() => handleKitchenClick(image)}
            />
            <button
              onClick={() => removeKitchenImage(index)}
              className="absolute top-0 right-0 text-red-500 hover:text-red-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
              <div
          onClick={triggerKitchenFloorFileInput}
          className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
        >
          <PlusIcon className="w-8 h-8 text-gray-600" />
        </div>
        <input
        type="file"
        accept="image/*"
        ref={kitchenFloorFileInputRef}
        onChange={handleKitchenFloorPhotoCapture}
        className="hidden"
        multiple
      />
</div>
      {/* Submit Button */}
      {/* <button
        onClick={handleKitchenSubmit}
        className={`mt-4 w-full text-center mx-auto py-2 rounded-md text-white ${isKitchenSubmitted ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'}`}
      >
        {isKitchenSubmitted ? (
          <div className="flex items-center justify-center">
            <span>Submitted</span>
          </div>
        ) : (
          'Submit'
        )}
      </button> */}

      {/* Image Preview Modal */}
      {previewKitchinImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative bg-white p-4 rounded-lg">
            <img src={kitchenFloorImagePreview} alt="Preview" className="max-h-96 max-w-full rounded" />
            <button
              onClick={handleCloseKitchenPreview}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <XMarkIcon  className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
      {/* {isKitchenSubmitted && (
        <div className="absolute -top-2 -right-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
            <path
              fillRule="evenodd"
              d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )} */}
          </div>
          <div className="border rounded-lg relative shadow-lg p-3 w-full sm:w-1/2 lg:w-1/4 bg-white">
  <h2 className="text-xl font-semibold mb-4 text-gray-800">Exhaust Fan</h2>
<div className='mb-2'>
  <label className="text-sm font-medium text-gray-500 mb-2 block">Condition</label>
<div className="flex  space-x-2 p-1 mb-4">
  {['Working', 'Not Working'].map((condition) => (
    <div
      key={condition}
      onClick={() => handleExhaustFanConditionClick(condition)}
      className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm rounded-full border items-center transition-transform duration-300 ease-in-out transform hover:scale-105 
        ${selectedExhaustFanCondition === condition ? 'bg-green-500 text-white' : '  text-gray-700 border-gray-300'}`}
    >
      {condition}
    </div>
  ))}
</div>
</div>

<div className='mb-2'>
<label className="text-sm font-medium text-gray-500 mb-2 block">Hygiene</label>

  <div className="flex  space-x-4 mb-4">
    {['Good', 'Bad'].map((remark) => (
      <div
        key={remark}
        onClick={() => handleExhaustFanRemarkClick(remark)}
        className={`cursor-pointer whitespace-nowrap px-4 py-2 text-sm rounded-full border transition-transform duration-300 ease-in-out transform hover:scale-105 
          ${selectedExhaustFanRemark === remark ? 'bg-red-500 text-white' : '  text-gray-700 border-gray-300'}`}
      >
        {remark}
      </div>
    ))}
  </div>
  </div>
  <label className="text-sm font-medium text-gray-500 mb-2 block"> Remark</label>
  <textarea
    type="text"
    placeholder="Enter your remark..."
    value={exhaustFanUserRemark}
    onChange={(e) => setExhaustFanUserRemark(e.target.value)}
    className="border rounded-md p-3 w-full mb-4  focus:ring-2 focus:ring-green-500"
  />

  {/* Star Rating */}
  <div className="flex items-center mb-4">
    {[...Array(5)].map((_, index) => (
      <span
        key={index}
        onClick={() => setExhaustFanRating(index + 1)}
        className={`cursor-pointer text-2xl transition-colors duration-300 ${exhaustFanRating > index ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ))}
  </div>

  {/* Image Upload and Preview */}
  <div className="flex flex-wrap gap-2 mb-4">
    {exhaustFanImagePreview.map((image, index) => (
      <div key={index} className="relative">
        <img
          src={image}
          alt={`Exhaust Fan ${index + 1}`}
          className="h-12 w-12 border rounded-md object-cover cursor-pointer hover:opacity-75"
          onClick={() => handleImageClick(image)}
        />
        <button
          onClick={() => removeImage(index)}
          className="absolute top-0 right-0 text-red-500 hover:text-red-700"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
      </div>
    ))}
    <div
      onClick={triggerExhaustFanFileInput}
      className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
    >
      <PlusIcon className="w-8 h-8 text-gray-600" />
    </div>
  </div>

  <input
    type="file"
    accept="image/*"
    ref={exhaustFanFileInputRef}
    onChange={handleExhaustFanPhotoCapture}
    className="hidden"
    multiple
  />

  {/* Submit Button
  <button
    onClick={handleSubmit}
    className={`mt-4 w-full py-3 rounded-md text-white transition-transform transform duration-300 ease-in-out hover:scale-105 
      ${isSubmitted ? 'bg-green-500' : 'bg-red-500 hover:bg-red-700'}`}
  >
    {isSubmitted ? 'Submitted' : 'Submit'}
  </button> */}

  {/* Image Preview Modal */}
  {previewImage && (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="relative bg-white p-4 rounded-lg shadow-lg">
        <img src={previewImage} alt="Preview" className="max-h-96 max-w-full rounded" />
        <button
          onClick={handleClosePreview}
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  )}

  {/* Success Icon */}
  {/* {isSubmitted && (
    <div className="absolute -top-2 -right-2">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" className="w-10 h-10">
        <path
          fillRule="evenodd"
          d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )} */}
</div>

          <InsideKitchen01 />
      </div>
      {/* <Link to="/Outsideshop">

              <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
                  <span className='text-center  mx-auto'> Go Outside Shop</span>
              </butto                                                      n>
          </Link> */}                                           
             <Link to="/add-audit">
       
       <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
    <span className='text-center  mx-auto'>Submit</span> 
       </button>
     </Link>
          </div>
  );
};

export default InsideKitchen;

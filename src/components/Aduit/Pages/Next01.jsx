import React, { useState, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

const Next01 = () => {
  const [selectedDiningArea, setSelectedDiningArea] = useState(null);
  const [selectedHandWash, setSelectedHandWash] = useState(null);
  const [selectedJuice, setSelectedJuice] = useState(null);
  const [selectedJuiceBar, setSelectedJuiceBar] = useState(null);
  const [selectedSnackCounter, setSelectedSnackCounter] = useState(null);
  const [selectedSnackQuality, setSelectedSnackQuality] = useState(null);
  const [snackProductName, setSnackProductName] = useState('');

  const [selectedDustBin, setSelectedDustBin] = useState(null);
  const [selectedDustBinQuality, setSelectedDustBinQuality] = useState(null);

  const [rating, setRating] = useState(0);
  const [DiningAreaImagePreview, setDiningAreaImagePreview] = useState(null);
  const [handWashImagePreview, setHandWashImagePreview] = useState(null);
  const [juiceImagePreview, setJuiceImagePreview] = useState(null);
  const [snackImagePreview, setSnackImagePreview] = useState(null);
  const [dustBinImagePreview, setDustBinImagePreview] = useState(null);
  const [dustBinRemark, setDustBinRemark] = useState('');

  const DiningAreaFileInputRef = useRef(null);
  const handWashFileInputRef = useRef(null);
  const juiceFileInputRef = useRef(null);
  const snackFileInputRef = useRef(null);
  const dustBinFileInputRef = useRef(null);
  const navigate = useNavigate()

  const handleAromaClick = (area, aroma) => {
    switch (area) {
      case 'Dining Area':
        setSelectedDiningArea(aroma);
        break;
      case 'handWash':
        setSelectedHandWash(aroma);
        break;
      case 'juice':
        setSelectedJuice(aroma);
        break;
      case 'juicebar':
        setSelectedJuiceBar(aroma);
        break;
      case 'snackCounter':
        setSelectedSnackCounter(aroma);
        break;
      case 'snackQuality':
        setSelectedSnackQuality(aroma);
        break;
      case 'dustBin':
        setSelectedDustBin(aroma);
        break;
      case 'dustBinQuality':
        setSelectedDustBinQuality(aroma);
        break;
      default:
        break;
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const triggerFileInput = (ref) => {
    ref.current.click();
  };

  const handlePhotoCapture = (event, setImagePreview) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div className="p-6 poppins-regular">
<button onClick={() => navigate(-1)} className="text-gray-700 flex hover:text-red-600 transition duration-200">
            <MdKeyboardDoubleArrowLeft className="w-6 h-6" /> Back
          </button>
      <div className="flex flex-wrap space-x-4">
        {/* Dining Area Section */}
        <div className="bg-white shadow-md rounded-md p-4 mb-4 w-1/4">
          <h2 className="text-lg font-semibold mb-2">Dining Area</h2>
          <div className="flex space-x-4 mb-4">
            {['Good', 'Bad'].map((aroma) => (
              <div
                key={aroma}
                onClick={() => handleAromaClick('Dining Area', aroma)}
                className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                  hover:bg-red-600 hover:text-white ${selectedDiningArea === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {aroma}
              </div>
            ))}
          </div>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleRatingClick(index + 1)}
                className={`cursor-pointer text-2xl ${rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          {DiningAreaImagePreview && (
            <div className="mt-4 mb-4">
              <img src={DiningAreaImagePreview} alt="Captured" className="h-24 w-24 border rounded-md object-cover" />
            </div>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
            onClick={() => triggerFileInput(DiningAreaFileInputRef)}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Capture Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={DiningAreaFileInputRef}
            onChange={(event) => handlePhotoCapture(event, setDiningAreaImagePreview)}
            className="hidden"
          />
        </div>

        {/* Hand Wash Area Section */}
        <div className="bg-white shadow-md rounded-md p-4 mb-4 w-1/4">
          <h2 className="text-lg font-semibold mb-2">Hand Wash Area</h2>
          <div className="flex space-x-4 mb-4">
            {['Good', 'Bad'].map((aroma) => (
              <div
                key={aroma}
                onClick={() => handleAromaClick('handWash', aroma)}
                className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                  hover:bg-red-600 hover:text-white ${selectedHandWash === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {aroma}
              </div>
            ))}
          </div>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleRatingClick(index + 1)}
                className={`cursor-pointer text-2xl ${rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          {handWashImagePreview && (
            <div className="mt-4 mb-4">
              <img src={handWashImagePreview} alt="Captured" className="h-24 w-24 border rounded-md object-cover" />
            </div>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
            onClick={() => triggerFileInput(handWashFileInputRef)}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Capture Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={handWashFileInputRef}
            onChange={(event) => handlePhotoCapture(event, setHandWashImagePreview)}
            className="hidden"
          />
        </div>

        {/* Juice Bar Section */}
        <div className="bg-white shadow-md rounded-md p-4 mb-4 w-1/4">
          <div className="flex space-x-3">
            <h2 className="text-lg font-semibold pt-2">Juice Bar</h2>
            <span className="flex mb-2 space-x-2 ">
              {['Yes', 'No'].map((option) => (
                <div
                  key={option}
                  onClick={() => handleAromaClick('juicebar', option)}
                  className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                    ${selectedJuiceBar === option 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-green-600 hover:text-white'}`}
                >
                  {option}
                </div>
              ))}
            </span>
          </div>
          <div className="flex space-x-4 mb-4">
            {['Good', 'Bad'].map((aroma) => (
              <div
                key={aroma}
                onClick={() => handleAromaClick('juice', aroma)}
                className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                  hover:bg-red-600 hover:text-white ${selectedJuice === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {aroma}
              </div>
            ))}
          </div>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleRatingClick(index + 1)}
                className={`cursor-pointer text-2xl ${rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          {juiceImagePreview && (
            <div className="mt-4 mb-4">
              <img src={juiceImagePreview} alt="Captured" className="h-24 w-24 border rounded-md object-cover" />
            </div>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
            onClick={() => triggerFileInput(juiceFileInputRef)}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Capture Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={juiceFileInputRef}
            onChange={(event) => handlePhotoCapture(event, setJuiceImagePreview)}
            className="hidden"
          />
        </div>

        {/* Snack Counter Section */}
        <div className="bg-white shadow-md rounded-md p-4 mb-4 w-1/4">
          <h2 className="text-lg font-semibold mb-2">Snack Counter</h2>
          <div className="flex space-x-4 mb-4">
            {['Good', 'Bad'].map((aroma) => (
              <div
                key={aroma}
                onClick={() => handleAromaClick('snackCounter', aroma)}
                className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                  hover:bg-red-600 hover:text-white ${selectedSnackCounter === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {aroma}
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Snack Product Name"
            value={snackProductName}
            onChange={(e) => setSnackProductName(e.target.value)}
            className="border rounded-md p-2 w-full mb-2"
          />
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleRatingClick(index + 1)}
                className={`cursor-pointer text-2xl ${rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          {snackImagePreview && (
            <div className="mt-4 mb-4">
              <img src={snackImagePreview} alt="Captured" className="h-24 w-24 border rounded-md object-cover" />
            </div>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
            onClick={() => triggerFileInput(snackFileInputRef)}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Capture Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={snackFileInputRef}
            onChange={(event) => handlePhotoCapture(event, setSnackImagePreview)}
            className="hidden"
          />
        </div>

    
        <div className="bg-white shadow-md rounded-md p-4 mb-4 w-1/4">
          <h2 className="text-lg font-semibold mb-2">Dust Bin</h2>
          <div className="flex space-x-4 mb-4">
            {['Good', 'Bad'].map((aroma) => (
              <div
                key={aroma}
                onClick={() => handleAromaClick('dustBin', aroma)}
                className={`cursor-pointer px-4 py-2 rounded-full border flex items-center justify-center transition-colors duration-200 
                  hover:bg-red-600 hover:text-white ${selectedDustBin === aroma ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border-gray-300'}`}
              >
                {aroma}
              </div>
            ))}
          </div>
          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                onClick={() => handleRatingClick(index + 1)}
                className={`cursor-pointer text-2xl ${rating > index ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={dustBinRemark}
              onChange={(e) => setDustBinRemark(e.target.value)}
              placeholder="Remark"
              className="border rounded-md p-2 w-full mb-2"
            />
          </div>
          {dustBinImagePreview && (
            <div className="mt-4 mb-4">
              <img src={dustBinImagePreview} alt="Captured" className="h-24 w-24 border rounded-md object-cover" />
            </div>
          )}
          <button
            type="button"
            className="flex items-center justify-center w-full py-2 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
            onClick={() => triggerFileInput(dustBinFileInputRef)}
          >
            <CameraIcon className="w-5 h-5 mr-2" />
            Capture Photo
          </button>
          <input
            type="file"
            accept="image/*"
            ref={dustBinFileInputRef}
            onChange={(event) => handlePhotoCapture(event, setDustBinImagePreview)}
            className="hidden"
          />
        </div>
      </div>
      <Link to="/Kitchenarea">
       
       <button className='bg-red-500 text-white  w-5/6 py-2  mx-auto flex items-center text-center  mt-12  rounded-md hover:bg-red-600'>
    <span className='text-center  mx-auto'> Go Inside Kitchen</span> 
       </button>
     </Link>
    </div>
  );
};

export default Next01;

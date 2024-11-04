import React, { useState, useRef, useEffect } from 'react';
import OtherBrand from '../../Form/OtherBrands';
import { Link } from 'react-router-dom';

const Bunzo = () => {
  const [activeTab, setActiveTab] = useState('Bunzo'); // Set default to Bunzo
  const [details, setDetails] = useState({ productName: '', quantity: 0, expirationDate: '' });
  const [capturedPhoto, setCapturedPhoto] = useState('');
  const fileInputRef = useRef(null);

  // Example product details for each brand
  const productDetails = {
    Bunzo: {
      productName: '',
      quantity: "",
      expirationDate: '',
    },
    bakshanm : {
      productName: ' ',
      quantity: '' ,
      expirationDate: ' ',
    },
     OtherBrands: {
      productName: ' ',
      quantity:  '',
      expirationDate: ' ',
    },
  };

  const tabs = Object.keys(productDetails);

  useEffect(() => {
    // Set default details for Bunzo on initial render
    setDetails(productDetails['Bunzo']);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedPhoto(imageUrl);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 border max-w-screen-md mx-auto rounded shadow-md bg-white">
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 px-2 text-center text-sm sm:text-base ${
              activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
            } rounded`}
            onClick={() => {
              setActiveTab(tab);
              setDetails(productDetails[tab]);
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab && (
        <div className="border-t pt-4">
          <h2 className="text-xl font-bold mb-4">{activeTab} Product Details</h2>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="product-name">
                Product Name
              </label>
              <input
                id="product-name"
                name="productName"
                type="text"
                value={details.productName}
                onChange={handleChange}
                placeholder="Enter product name"
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="quantity">
                Qty
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                value={details.quantity}
                onChange={handleChange}
                placeholder="0"
                className="mt-1 p-2 border rounded w-24"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="expiration-date">
                Expiration Date
              </label>
              <input
                id="expiration-date"
                name="expirationDate"
                type="date"
                value={details.expirationDate}
                onChange={handleChange}
                className="mt-1 p-2 border rounded"
              />
            </div>
          </div>

          {/* Photo Capture Section */}
          <div className="w-full flex flex-col items-center bg-white p-6 rounded-lg shadow-md mt-6">
            <h2 className="text-2xl font-semibold mb-6">Capture Product Photo</h2>
            <div className="flex flex-col items-center mb-4">
              {capturedPhoto && (
                <img src={capturedPhoto} alt="Captured" className="w-full h-auto max-w-md mb-4" />
              )}
              <button
                type="button"
                className="flex items-center justify-center w-full max-w-md py-3 px-5 text-black border rounded-lg hover:bg-red-600 hover:text-white transition duration-200"
                onClick={triggerFileInput}
              >
                Capture Photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </div>
           
            <div className="mt-auto w-full">
              <button
                type="submit"
                className="w-full py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-200"
              >
                Submit Audit
              </button>
            </div>
    
 
           
          </div>
        </div>
      )}
    </div>
  );
};

export default Bunzo;

import React, { useState, useRef, useEffect } from 'react';
import OtherBrand from '../../Form/OtherBrands';
import { Link } from 'react-router-dom';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'; // Import icons
const Bunzo = () => {
  const [activeTab, setActiveTab] = useState('Bunzo'); // Set default to Bunzo
  const [details, setDetails] = useState({ productName: '', quantity: 0, expirationDate: '' });
  const [liveSnackImagePreview, setLiveSnackImagePreview] = useState([]);
  const [previewLiveSnackImage, setPreviewLiveSnackImage] = useState(null);
  const liveSnackFileInputRef = useRef(null);

  // Example product details for each brand
  const productDetails = {
    Bunzo: {
      productName: '',
      quantity: "",
      expirationDate: '',
    },
    bakshanm: {
      productName: '',
      quantity: '',
      expirationDate: '',
    },
    OtherBrands: {
      productName: '',
      quantity: '',
      expirationDate: '',
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

  // Handle the image capture and preview
  const handleLiveSnackPhotoCapture = (e) => {
    const files = e.target.files;
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
    setLiveSnackImagePreview((prevImages) => [...prevImages, ...newImages]);
  };

  const triggerLiveSnackFileInput = () => {
    if (liveSnackFileInputRef.current) {
      liveSnackFileInputRef.current.click();
    }
  };

  // Handle the image preview on click
  const handleLiveSnackClick = (image) => {
    setPreviewLiveSnackImage(image);
  };

  // Handle closing the image preview
  const handleCloseLiveSnack = () => {
    setPreviewLiveSnackImage(null);
  };

  // Remove image from preview list
  const removeLiveSnackImage = (index) => {
    setLiveSnackImagePreview((prevImages) =>
      prevImages.filter((_, i) => i !== index)
    );
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
            {/* Product Name as a Select field for Bunzo and Bakshan */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="product-name">
                Product Name
              </label>
              {(activeTab === 'Bunzo' || activeTab === 'bakshanm') ? (
                <select
                  id="product-name"
                  name="productName"
                  value={details.productName}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded w-full"
                >
                  <option value="">Select Product</option>
                  {/* Add options for each product */}
                  <option value="Product1">Product 1</option>
                  <option value="Product2">Product 2</option>
                  <option value="Product3">Product 3</option>
                </select>
              ) : (
                <input
                  id="product-name"
                  name="productName"
                  type="text"
                  value={details.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="mt-1 p-2 border rounded w-full"
                />
              )}
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
           { activeTab !== 'OtherBrands'&& 
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="expiration-date">
                Expiry Date
              </label>
              <input
                id="expiration-date"
                name="expirationDate"
                type="date"
                value={details.expirationDate}
                onChange={handleChange}
                className="mt-1 p-2 border rounded"
              />
            </div>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {previewLiveSnackImage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                <div className="relative bg-white p-4 rounded-lg">
                  <img
                    src={previewLiveSnackImage}
                    alt="Preview"
                    className="max-h-96 max-w-full rounded"
                  />
                  <button
                    onClick={handleCloseLiveSnack}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
            {liveSnackImagePreview.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Hand Wash ${index + 1}`}
                  className="h-24 w-24 border rounded-md object-cover cursor-pointer"
                  onClick={() => handleLiveSnackClick(image)}
                />
                <button
                  onClick={() => removeLiveSnackImage(index)}
                  className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div
              onClick={triggerLiveSnackFileInput}
              className="h-12 w-12 border rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-200"
            >
              <PlusIcon className="w-8 h-8 text-gray-600" />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={liveSnackFileInputRef}
              onChange={handleLiveSnackPhotoCapture}
              className="hidden"
              multiple
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
      )}
    </div>
  );
};

export default Bunzo;

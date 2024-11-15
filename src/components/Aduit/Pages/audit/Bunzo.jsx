import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';
import { MdArrowBack } from 'react-icons/md';
import { getBrand, getProducts } from '../../../../API/settings';
import { createSnackAudit, getSnackAudit } from '../../../../API/snacks';
import toast from 'react-hot-toast';

const Bunzo = () => {
  const [activeTab, setActiveTab] = useState('');
  const [details, setDetails] = useState({ productName: '', quantity: 0, expirationDate: '' });
  const [submittedProducts, setSubmittedProducts] = useState([]);
  const [liveSnackImagePreview, setLiveSnackImagePreview] = useState([]);
  const [previewLiveSnackImage, setPreviewLiveSnackImage] = useState(null);
  const liveSnackFileInputRef = useRef(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [captureImages,setCaptureImages] = useState([]);
  const [previewImage, setPreviewImage] = useState([]);

  const { auditId } = useParams();

  const initializeProductDetails = () => {
    return { productName: '', quantity: 0, expirationDate: '' };
  };

  useEffect(() => {
    const fetchBrandsAndProducts = async () => {
      try {
        const brandResponse = await getBrand();
        setBrands(brandResponse.data);
        setActiveTab(brandResponse.data[0].name)
        const productResponse = await getProducts();
        setProducts(productResponse.data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchBrandsAndProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
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
  const handleLiveSnackPhotoCapture =async (e) => {
    const files = Array.from(e.target.files);
    const dateTime = getCurrentDateTime();
    const loc = await getLocation();
    setLocation(loc);
    setDate(dateTime);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw the image onto the canvas
          ctx.drawImage(img, 0, 0);

          // Set watermark style
          ctx.font = "16px Arial";
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          ctx.fillRect(10, img.height - 60, 220, 50); // background rectangle
          ctx.fillStyle = "black";
          ctx.fillText(`Location: ${location}`, 15, img.height - 40);
          ctx.fillText(`Date: ${date}`, 15, img.height - 20);

          // Convert canvas to data URL and store it in the state
          const watermarkedImage = canvas.toDataURL("image/png");
          setLiveSnackImagePreview((prev) => [...prev, watermarkedImage]);
          // setPreviewLiveSnackImage((prev) => [...prev, file]);
        };
      };
      reader.readAsDataURL(file);
      setCaptureImages(prev=>[...prev,file])
    });

    e.target.value = null;
  };
  const getCurrentDateTime = () => {
    const now = new Date();
    return `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  };
  const triggerLiveSnackFileInput = () => {
    if (liveSnackFileInputRef.current) {
      liveSnackFileInputRef.current.click();
    }
  };

  const handleLiveSnackClick = (image) => {
    setPreviewLiveSnackImage(image);
  };

  const handleCloseLiveSnack = () => {
    setPreviewLiveSnackImage(null);
  };

  const removeLiveSnackImage = (index) => {
    setLiveSnackImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit =async () => {
  let data;
  if(activeTab === "Other Brands"){
   data= {productName:details.productName,quantity:details.quantity,expiryDate:details.expirationDate,captureImages,location,date,brandName:"other brand"}
  }else{
    data={product:details.productName,quantity:details.quantity,expiryDate:details.expirationDate,captureImages,location,date}
  }
  createSnackAudit(auditId,data).then(res=>{
    toast.success(res.message)
  }).catch(err=>console.log(err.message))
  

    const productPhoto = liveSnackImagePreview.length > 0 ? liveSnackImagePreview[0] : null; // Get the first image for submission
    setSubmittedProducts((prev) => [
      ...prev,
      { ...details, tab: activeTab, brandName: activeTab, productPhoto } 
    ]);
    setDetails(initializeProductDetails()); 
    setCaptureImages([])
    setLiveSnackImagePreview([]);  
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(()=>{
    getSnackAudit(auditId).then(res=>{
      if(res.data){
        setSubmittedProducts(res.data)
        setPreviewImage(res.data.map(i=>i.captureImages))
      }
    })
  },[])
  return (
    <>
      <div className="flex items-center justify-between mx-auto p-4 max-w-4xl">
        <button onClick={() => navigate(-1)} className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200">
          <MdArrowBack className="w-6 h-6 mt-1" />
          <h1 className="text-xl md:text-xl font-semibold">Back</h1>
        </button>
        <div className="relative">
          <button
            onClick={togglePopup}
            className="px-3 py-1 rounded bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Previous Audit
          </button>
          {isPopupVisible && (
            <div className="absolute left-0 mt-2 w-56 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
              <ul className="space-y-2">
                {/* Add previous audit items here */}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border max-w-4xl mx-auto rounded shadow-md bg-white">
        <div className="flex space-x-2 mb-4">
          {brands.map((brand) => (
            <button
              key={brand._id}
              className={`flex-1 py-2 px-2 text-center text-sm sm:text-base ${activeTab === brand.name ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'} rounded`}
              onClick={() => {
                setActiveTab(brand.name);
                setDetails(initializeProductDetails());
                setLiveSnackImagePreview([])
                setCaptureImages([])
              }}
            >
              {brand.name}
            </button>
          ))}
          <button
            key="otherbrands"
            className={`flex-1 py-2 px-2 text-center text-sm sm:text-base ${activeTab === 'Other Brands' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'} rounded`}
            onClick={() => {
              setActiveTab('Other Brands');
              setDetails(initializeProductDetails());
              setLiveSnackImagePreview([])
              setCaptureImages([])
            }}
          >
            Other Brands
          </button>
        </div>

        {activeTab && (
          <div className="border-t pt-4">
            <h2 className="text-xl font-bold mb-4">{activeTab} Product Details</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="product-name">
                  Product Name
                </label>
                {activeTab !== 'Other Brands' ? (
                  <select
                    id="product-name"
                    name="productName"
                    value={details.productName}
                    onChange={handleChange}
                    className="mt-1 p-2 border rounded w-full"
                  >
                    <option value="" disabled>--Select Product--</option>
                    {products.filter((product) => product?.brand?.name === activeTab).map((product) => (
                      <option key={product._id} value={product._id}>{product.name}</option>
                    ))}
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

              {activeTab !== 'Other Brands' && (
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
                </div>
              )}
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
                      className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white  hover:text-black transition-colors duration-200"

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
                    className="absolute top-0 right-0 p-1 bg-red-500 border text-white border-gray-300 rounded-full shadow-md hover:bg-white  hover:text-black transition-colors duration-200"

                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div
                className="flex items-center justify-center h-16 w-16 gap-2 mt-2 border rounded-md cursor-pointer bg-gray-100 hover:bg-gray-200"
                onClick={triggerLiveSnackFileInput}
              >
                <PlusIcon className="w-6 h-6 text-gray-500" />
              </div>
              <input
                type="file"
                ref={liveSnackFileInputRef}
                onChange={handleLiveSnackPhotoCapture}
                accept="image/*"
                multiple
                className="hidden"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-500 text-white rounded shadow-lg hover:bg-red-600 focus:outline-none"
            >
              Add Product
            </button>
          </div>
        )}

        {submittedProducts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">Submitted Products</h2>
            <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
              <thead>
                <tr>
                  <th className="px-4 py-2 border-b">Brand Name</th>
                  <th className="px-4 py-2 border-b">Product Name</th>
                  <th className="px-4 py-2 border-b">Quantity</th>
                  <th className="px-4 py-2 border-b">Expiry Date</th>
                  <th className="px-4 py-2 border-b">Product Photo</th>
                </tr>
              </thead>
              <tbody>
                {submittedProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b">{products.find(p=>p._id===product?.product)?.brand.name||product.brandName}</td> {/* Added Brand Name */}
                    <td className="px-4 py-2 border-b">{products.find(p=>p._id===product?.product)?.name||products.find(p=>p._id===product.productName)?.name||product.productName}</td>
                    <td className="px-4 py-2 border-b">{product.quantity}</td>
                    <td className="px-4 py-2 border-b">{product.expirationDate||product.expiryDate}</td>
                    <td className="px-4 py-2 border-b flex flex-wrap gap-1">
                      {product.productPhoto ? (
                        <img src={product.productPhoto} alt="Product" className="h-5 w-5 object-cover rounded-md" />
                      ) : previewImage.length > 0 ? (
                        previewImage[index].map((image)=>(
                        <img src={image.imageUrl} alt="Product" className="h-5 w-5 object-cover rounded-md" />
 
                        ))
                      ):(
                        'No Image'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Bunzo;

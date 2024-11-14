import React, { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Select from 'react-select';
import { createProduct, getBrand, getProducts } from '../../../../API/settings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

const BakerProducts = () => {
  const [brandName, setBrandName] = useState('');
  const [productName, setProductName] = useState('');
  const [submissions, setSubmissions] = useState([]);  // State to store submitted products
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  const handleBrandNameChange = (selectedOption) => {
    setBrandName(selectedOption);  // Store the full object (value + label)
  };

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);  // Update product name
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (brandName && productName) {
      const newSubmission = {
        brandName: brandName.label,  // Use the label for display
        productNames: [productName],  // Add single product name
      };
      setSubmissions([...submissions, newSubmission]);  // Add new submission to the list
      setBrandName('');
      setProductName('');
      const res = await createProduct({ brand: brandName.value, name: productName });
      toast.success(res.message);
    } else {
      toast.error("Please select a brand and enter a product name");
    }
  };

  // Fetch brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await getBrand();  // Assuming getBrand() returns brand data
        if (res.success) {
          const dynamicBrandOptions = res.data.map(brand => ({
            value: brand._id,  // Use _id or another unique identifier as the value
            label: brand.name  // Use the name for the label that will be shown
          }));
          setBrands(dynamicBrandOptions);  // Update the state with the formatted brand options
        } else {
          toast.error('Failed to fetch brands');
        }
      } catch (error) {
        toast.error('Error fetching brands');
      }
    };

    fetchBrands();
  }, []);

  // Fetch products on mount and update submissions
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();  // Assuming getProducts() returns product data
        if (res.success) {
          const productsData = res.data.map(product => ({
            brandName: product.brand.name,  // Extract brand name
            productNames: [product.name],   // Add product name to the array
          }));
          setSubmissions(productsData);  // Update the submissions state with fetched products
        } else {
          toast.error('Failed to fetch products');
        }
      } catch (error) {
        toast.error('Error fetching products');
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <button onClick={() => navigate(-1)} className="text-gray-700 p-6 flex space-x-1 hover:text-red-600 transition duration-200">
        <MdArrowBack className="w-6 h-6 mt-1" />
        <h1 className="text-xl md:text-xl font-semibold">Back</h1>
      </button>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Bakery Product Entry</h2>

        {/* Brand Selection */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">Brand Name</label>
          <Select
            value={brandName}
            onChange={handleBrandNameChange}
            options={brands}  // Use the dynamically fetched brands
            isSearchable
            placeholder="Select a brand"
            className="border border-gray-300 rounded-lg"
          />
        </div>

        {/* Product Name */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-4">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={handleProductNameChange}
            placeholder="Enter product name"
            className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out"
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3 mt-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition flex items-center justify-center"
        >
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          Submit
        </button>

      </div>

      {/* Product List Table */}
      <div className='max-w-4xl mx-auto'>
        {submissions.length > 0 && (
          <div className="mt-8">
            <h3 className="text-2xl font-semibold mb-4">Submitted Products</h3>
            <table className="w-full border text-left">
              <thead>
                <tr className="bg-red-500 text-white">
                  <th className="py-3 px-4 font-medium">Brand Name</th>
                  <th className="py-3 px-4 font-medium">Product Name</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission, index) => (
                  <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                    <td className="py-4 px-4 text-gray-800">{submission.brandName}</td>
                    <td className="py-4 px-4 text-gray-800">
                      <ul className="list-disc pl-5 space-y-1">
                        {submission.productNames.map((name, idx) => (
                          <li key={idx}>{name}</li>
                        ))}
                      </ul>
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

export default BakerProducts;

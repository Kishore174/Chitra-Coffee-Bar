import React, { useState, useRef, useEffect } from 'react';
import { StarIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { createDress, getDress } from '../../../../API/audits';
import toast from 'react-hot-toast';

const Dressing = () => {
  const [rating, setRating] = useState(0);
  const [dressingRemark, setDressingRemark] = useState('');
  const [capWeared, setCapWeared] = useState(0);
  const [capNotWeared, setCapNotWeared] = useState(0);
  const [apronWeared, setApronWeared] = useState(0);
  const [apronNotWeared, setApronNotWeared] = useState(0);
  const [cortWeared, setCortWeared] = useState(0);
  const [glovesWeared, setGlovesWeared] = useState(0);
  const [glovesNotWeared, setGlovesNotWeared] = useState(0);
  const [cortNotWeared, setCortNotWeared] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const navigate = useNavigate();
  const { auditId } = useParams();

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const dressingData = {
      cap: { wear: capWeared, notWear: capNotWeared },
      apron: { wear: apronWeared, notWear: apronNotWeared },
      gloves: { wear: glovesWeared, notWear: glovesNotWeared },
      cort: { wear: cortWeared, notWear: cortNotWeared },
      rating,
      remark: dressingRemark,
    };

    try {
      const res = await createDress(auditId, dressingData);
      toast.success(res.message);
      navigate(-1);
    } catch (error) {
      toast.error('Submission failed. Please try again.');
      console.error('Error submitting data:', error);
    }

    console.log('Submitting Data:', dressingData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000); // Reset submission status after 2 seconds
  };

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  useEffect(() => {
    const fetchDressData = async () => {
      try {
        const res = await getDress(auditId);
        if (res.data) {
          const { cap, apron, gloves, cort, rating, remark } = res.data;
          setCapWeared(cap.wear);
          setCapNotWeared(cap.notWear);
          setApronWeared(apron.wear);
          setApronNotWeared(apron.notWear);
          setGlovesWeared(gloves.wear);
          setGlovesNotWeared(gloves.notWear);
          setCortWeared(cort.wear);
          setCortNotWeared(cort.notWear);
          setRating(rating);
          setDressingRemark(remark);
        }
      } catch (error) {
        console.error('Error fetching dress data:', error);
      }
    };

    fetchDressData();
  }, [auditId]);

  return (
    <>
      <div className="flex items-center justify-between mx-auto p-4 max-w-4xl">
        <button onClick={() => navigate(-1)} className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200">
          <MdArrowBack className="w-6 h-6 mt-1" />
          <h1 className="text-xl md:text-xl font-semibold">Back</h1> </button>
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
                {/* Previous audit items can be added here */}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-white rounded-md shadow-md mb-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-center mb-4">Dressing Section</h2>

        {/* Horizontal Flex Row for Cap, Apron, Gloves, and Cort Sections */}
        <div className="flex space-x-4 mb-6">

          {/* Cap Input Fields */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 mb-2 block">Cap</label>
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Weared</label>
                <input
                  type="number"
                  value={capWeared}
                  onChange={(e) => setCapWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Not Weared</label>
                <input
                  type="number"
                  value={capNotWeared}
                  onChange={(e) => setCapNotWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
            </div>
          </div>

          {/* Apron Input Fields */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 mb-2 block">Apron</label>
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Weared</label>
                <input
                  type="number"
                  value={apronWeared}
                  onChange={(e) => setApronWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Not Weared</label>
                <input
                  type="number"
                  value={apronNotWeared}
                  onChange={(e) => setApronNotWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
            </div>
          </div>

          {/* Cort Input Fields */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 mb-2 block">Cort</label>
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Weared</label>
                <input
                  type="number"
                  value={cortWeared}
                  onChange={(e) => setCortWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Not Weared</label>
                <input
                  type="number"
                  value={cortNotWeared}
                  onChange={(e) => setCortNotWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
            </div>
          </div>

          {/* Gloves Input Fields */}
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500 mb-2 block">Gloves</label>
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Weared</label>
                <input
                  type="number"
                  value={glovesWeared}
                  onChange={(e) => setGlovesWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500">Not Weared</label>
                <input
                  type="number"
                  value={glovesNotWeared}
                  onChange={(e) => setGlovesNotWeared(Number(e.target.value))}
                  placeholder="Enter number"
                  className="border rounded-md p-2 w-20" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Section */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-700">Rate Dressing Section</h3>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <StarIcon
                key={star}
                className={`w-6 h-6 cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => handleRatingClick(star)} />
            ))}
          </div>
        </div>

        {/* Remark Section */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-500 mb-2 block">Remark</label>
          <textarea
            value={dressingRemark}
            onChange={(e) => setDressingRemark(e.target.value)}
            placeholder="Enter your remark..."
            className="border rounded-md p-2 w-full mb-2" />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className={`flex items-center justify-center w-full py-2 px-4 rounded-md ${submitted ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`}
        >
          {submitted ? (
            <>
              <CheckIcon className="w-5 h-5 mr-2" />
              Submitted
            </>
          ) : (
            'Submit'
          )}
        </button>
      </div>
    </>
    );
};

export default Dressing;
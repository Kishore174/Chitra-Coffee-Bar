import React, { useState, useRef, useEffect } from 'react';
import { StarIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNavigate, useParams } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import { createDress, getDress, getPrevious } from '../../../../API/audits';
import toast from 'react-hot-toast';
import Loader from '../../../Loader';
import DateFormat from '../../../DateFormat';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [lastAudit, setLastAudit] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastAudits, setLastAudits] = useState([]);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false); 
  const handleRatingClick = (value) => {
    setRating(value);
  };
  const validateForm = () => {
    if (capWeared < 0 && capNotWeared < 0 && apronWeared < 0 && apronNotWeared < 0 && cortWeared < 0 && glovesWeared < 0 && glovesNotWeared < 0) {
      toast.error('Please enter valid numbers for all fields.');
      return false;
    }
    if (rating <= 0) {
      toast.error('Please provide a rating.');
      return false;
    }
    if (!dressingRemark.trim()) {
      toast.error('Please provide a remark.');
      return false;
    }
    return true;
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;
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
    getPrevious(auditId).then(res => {
      setLastAudits(res.data);
    });
  };

  const handleOpenDialog = (data) => {
    setSelectedDate(data.auditDate);
    setDialogOpen(true);
    getDress(data._id).then(res => {
      res.data && setLastAudit(res.data);
    });
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(null);
  };

  useEffect(() => {
    const fetchDressData = async () => {
    setLoading(true)

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
          setSubmitted(true)

        }

        setLoading(false)

      } catch (error) {
        console.error('Error fetching dress data:', error);
      }
    };

    fetchDressData();
  }, [auditId]);

  return (
   <>
   {
    loading?<Loader/>:(
      <>
    <div className="flex items-center justify-between mx-auto   max-w-4xl">
     <button onClick={() => navigate(-1)} className="text-gray-700 flex space-x-1 hover:text-red-600 transition duration-200">
       <MdArrowBack className="w-6 h-6 mt-1" />
       <h1 className="text-xl md:text-xl font-semibold  ">Back</h1>

     </button>
     <div className="relative">

       <button
         onClick={togglePopup}
         className="px-3 py-1 rounded bg-red-500 text-white shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
       >
         Previous Audit
       </button>
       <AnimatePresence>
            {isDialogOpen && (
              <motion.div
                className="fixed inset-0 flex z-50 mr-2 justify-end h-screen bg-black bg-opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseDialog}
              >
                <motion.div
                  className="relative bg-white rounded-lg p-8 w-2/5 shadow-2xl overflow-auto transition-all duration-300 transform hover:scale-105"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition duration-200 p-3 rounded-full bg-gray-100 hover:bg-red-100"
                    onClick={handleCloseDialog}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>

                  <h2 className="text-2xl font-semibold mb-6 text-red-600 border-b-2 border-red-600 pb-2">Audit Date</h2>
                  <p className="text-gray-700 text-sm mb-6"><DateFormat date={selectedDate}/></p>


                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
            {lastAudit && [
              { label: "Cap (Wear)", value: lastAudit.cap?.wear },
              { label: "Cap (Not Wear)", value: lastAudit.cap?.notWear },
              { label: "Apron (Wear)", value: lastAudit.apron?.wear },
              { label: "Apron (Not Wear)", value: lastAudit.apron?.notWear },
              { label: "Cort (Wear)", value: lastAudit.cort?.wear },
              { label: "Cort (Not Wear)", value: lastAudit.cort?.notWear },
              { label: "Gloves (Wear)", value: lastAudit.gloves?.wear },
              { label: "Gloves (Not Wear)", value: lastAudit.gloves?.notWear },
              { label: "Remark", value: lastAudit.remark },
              { label: "Rating", value: lastAudit.rating },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
              >
                <span className="text-sm font-medium capitalize text-red-700 p-1 bg-red-100  w-auto
                 py-1 rounded-full">
                  {item.label}
                </span>
                <span className="font-semibold  w-auto text-gray-800 text-lg">
                  {item.value || "N/A"}
                </span>
              </div>
            ))}
          </div>

                  {lastAudit?.captureImages && lastAudit?.captureImages.length > 0 && (
                    <div className="">
                      <h3 className="text-lg font-medium text-red-600 mb-1">Captured Images</h3>
                      <div className="flex flex-wrap gap-4">
                        {lastAudit?.captureImages.map((image, index) => (
                          <div key={index} className="group relative w-24 h-24 overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105">
                            <img
                              src={image.imageUrl}
                              alt={`Captured Image ${index + 1}`}
                              className="w-full h-full object-cover transition-transform duration-300"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {isPopupVisible && (
            <div className="absolute left-0 mt-2 w-44 p-4 bg-white rounded-lg shadow-lg border border-gray-300 transition-transform transform duration-200 ease-in-out">
              <ul>
                {lastAudits.map((date) => (
                  <li key={date._id} className="text-gray-800 font-semibold text-lg hover:cursor-pointer transition-colors duration-150"
                    onClick={() => handleOpenDialog(date)}
                  >
                    {date.auditDate.slice(0, 10)}
                  </li>
                ))}
              </ul>
            </div>
          )}
     </div>
   </div>
   <div className="p-4 bg-white rounded-md shadow-md mb-4 max-w-4xl mt-4 mx-auto">
  <h2 className="text-xl font-semibold text-center mb-4">Dressing Section</h2>

  {/* Horizontal Flex Row for Cap, Apron, Gloves, and Cort Sections */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500">Not Weared</label>
          <input
            type="number"
            value={capNotWeared}
            onChange={(e) => setCapNotWeared(Number(e.target.value))}
            placeholder="Enter number"
            className="border rounded-md p-2 w-full"
          />
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
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500">Not Weared</label>
          <input
            type="number"
            value={apronNotWeared}
            onChange={(e) => setApronNotWeared(Number(e.target.value))}
            placeholder="Enter number"
            className="border rounded-md p-2 w-full"
          />
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
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500">Not Weared</label>
          <input
            type="number"
            value={cortNotWeared}
            onChange={(e) => setCortNotWeared(Number(e.target.value))}
            placeholder="Enter number"
            className="border rounded-md p-2 w-full"
          />
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
            className="border rounded-md p-2 w-full"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs text-gray-500">Not Weared</label>
          <input
            type="number"
            value={glovesNotWeared}
            onChange={(e) => setGlovesNotWeared(Number(e.target.value))}
            placeholder="Enter number"
            className="border rounded-md p-2 w-full"
          />
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
          className={`w-6 h-6 cursor-pointer ${
            star <= rating ? 'text-yellow-500' : 'text-gray-300'
          }`}
          onClick={() => handleRatingClick(star)}
        />
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
      className="border rounded-md p-2 w-full mb-2"
    />
  </div>

  {/* Submit Button */}
  {!submitted && (
    <button
      onClick={() => setIsModalOpen(true)}
      className={`flex items-center justify-center w-full py-2 px-4 rounded-md ${
        submitted ? 'bg-green-500' : 'bg-red-500'
      } text-white font-semibold`}
    >
      Submit
    </button>
  )}

  {isModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-lg font-semibold">Confirm Submission</h2>
        <p className="mt-2 text-md">
          Once submitted, you won’t be able to edit. Are you sure?
        </p>
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}
</div>;

    </>
    )
   }
   </>
    );
};

export default Dressing;
import React, { useState } from 'react';
import Home from './Home';
import Bunzo from './Bunzo';
import Bakshanam from './Bakshanam';
import OtherBrand from './OtherBrands';
import LiveKitchenProduction from './LiveKitchenProduction';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';

const Tab = () => {
  const [activeTab, setActiveTab] = useState('Home');
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  
  const tabs = ['Home', 'Bunzo', 'Bakshanam', 'Other Brand', 'Live Kitchen Production'];

  const handleNext = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleSubmit = () => {
    setOpenDialog(true);
    setTimeout(() => {
      setOpenDialog(false);
      navigate("/aduit");
    }, 2000); // Dialog will automatically close after 2 seconds
  };

  return (
    <div className="w-full  mx-auto p-4">
      {/* Tab Header */}
      <div className="flex flex-wrap border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-2 px-2 text-center text-sm sm:text-base ${
              activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 bg-white">
        {activeTab === 'Home' && <Home />}
        {activeTab === 'Bunzo' && <Bunzo />}
        {activeTab === 'Bakshanam' && <Bakshanam />}
        {activeTab === 'Other Brand' && <OtherBrand />}
        {activeTab === 'Live Kitchen Production' && <LiveKitchenProduction />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleBack}
          disabled={tabs.indexOf(activeTab) === 0}
        >
          Back
        </Button>
        {tabs.indexOf(activeTab) === tabs.length - 1 ? (
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Next
          </Button>
        )}
      </div>

      {/* Success Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          <CheckCircleIcon style={{ color: 'green', marginRight: '8px' }} />
          Success
        </DialogTitle>
        <DialogContent>
          Your submission has been successful!
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tab;

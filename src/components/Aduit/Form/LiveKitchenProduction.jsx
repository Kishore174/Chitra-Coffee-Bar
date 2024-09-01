import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Rating from '@mui/material/Rating';
import { Paper, Divider } from '@mui/material';

const LiveKitchenProduction = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Existing Items */}
      <div className="space-y-8">
        <ProductEntry name="Medhu Vadai" />
        <ProductEntry name="Parupu Vadai" />
        <ProductEntry name="Ragi Vadai" />
        <ProductEntry name="Rose Milk" />
        <ProductEntry name="Butter Milk" />
      </div>

      {/* New Items */}
      <div className="mt-12">
        <Typography variant="h5" className="mb-4 font-semibold text-blue-600">
           Items To Taste
        </Typography>
        <Divider />
        <div className="space-y-8 mt-4">
          <AdditionalItem name="Elaichi Tea" />
          <AdditionalItem name="Coffee" />
          <AdditionalItem name="Onion Samosa" />
          <AdditionalItem name="Bajji" />
        </div>
      </div>
      <div className="mt-12">
        <Typography variant="h5" className="mb-4 font-semibold text-blue-600">
           Bunzo Case
        </Typography>
        <Divider />
        <div className="space-y-8 mt-4">
          <AdditionalItem name="Hygiene" />
          <AdditionalItem name="Cleanliness" />
          <AdditionalItem name="food Stack" />
          <AdditionalItem name="SKU Ranges" />
          <AdditionalItem name="Fullfillment" />

        </div>
      </div>
      {/* Overall Remark */}
      <div className="mt-12">
        <Typography variant="h5" className="mb-4 font-semibold text-blue-600">
          Overall Remark
        </Typography>
        <TextField
          label="Remark"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          className="bg-white"
        />
      </div>
    </div>
  );
};

const ProductEntry = ({ name }) => (
  <Paper elevation={3} className="p-4 rounded-lg bg-white shadow-md">
    <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
      {name}
    </Typography>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <Typography variant="subtitle2" color="textSecondary">
          Quantity
        </Typography>
        <TextField label="Quantity" type="number" variant="outlined" fullWidth />
      </div>
      <div className="flex flex-col">
        <Typography variant="subtitle2" color="textSecondary">
          Source Price
        </Typography>
        <TextField label="Source Price" type="number" variant="outlined" fullWidth />
      </div>
      <div className="flex flex-col">
        <Typography variant="subtitle2" color="textSecondary">
          Selling Price
        </Typography>
        <TextField label="Selling Price" type="number" variant="outlined" fullWidth />
      </div>
    </div>
  </Paper>
);

const AdditionalItem = ({ name }) => (
  <Paper elevation={3} className="p-4 rounded-lg bg-white shadow-md">
    <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
      {name}
    </Typography>
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-col w-full md:w-1/2">
        <Typography variant="subtitle2" color="textSecondary">
          Rating
        </Typography>
        <Rating name="rating" />
      </div>
      <div className="flex flex-col w-full md:w-1/2">
        <Typography variant="subtitle2" color="textSecondary">
          Remark
        </Typography>
        <TextField
          label="Remark"
          multiline
          rows={2}
          variant="outlined"
          fullWidth
        />
      </div>
    </div>
  </Paper>
);

export default LiveKitchenProduction;

import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';

const OtherBrand = () => {
  return (
    <div className="p-6 bg-gray-100  ">
      {/* Product Entries */}
      <div className="space-y-6">
        <ProductEntry name="Mini Samosa" />
        <ProductEntry name="Aloo Bonda" />
      </div>
    </div>
  );
};

const ProductEntry = ({ name }) => (
  <Paper elevation={3} className="p-4 rounded-lg bg-white shadow-md">
    <Typography variant="h6" className="mb-4 font-semibold text-gray-800">
      {name}
    </Typography>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex flex-col">
        <Typography variant="subtitle2" color="textSecondary">
          Quantity:
        </Typography>
        <TextField label="Quantity" type="number" variant="outlined" fullWidth />
      </div>
      <div className="flex flex-col">
        <Typography variant="subtitle2" color="textSecondary">
          Source Price:
        </Typography>
        <TextField label="Source Price" type="number" variant="outlined" fullWidth />
      </div>
      <div className="flex flex-col">
        <Typography variant="subtitle2" color="textSecondary">
          Selling Price:
        </Typography>
        <TextField label="Selling Price" type="number" variant="outlined" fullWidth />
      </div>
    </div>
  </Paper>
);

export default OtherBrand;

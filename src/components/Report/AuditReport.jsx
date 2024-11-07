import React from 'react';
import { auditdata } from '../../Assets/data';

const AuditReport = () => {
  const auditData = auditdata;

  return (
    <div className="p-4 bg-white text-gray-800 font-sans max-w-3xl mx-auto">
      {/* Report Title */}
      <div className="text-center mb-4 border-b border-red-500 pb-2">
        <h1 className="text-2xl font-bold text-red-600">Audit Report</h1>
        <p className="text-gray-500 text-sm">{new Date(auditData?.auditDate).toLocaleDateString()}</p>
      </div>

      {/* General Information Section */}
      {/* <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">General Information</h2>
        <div className="p-2 flex flex-wrap gap-4">
          <InfoRow label="Shop ID" value={auditData?.shop} />
          <InfoRow label="Auditor ID" value={auditData?.auditor} />
          <InfoRow label="Status" value={auditData?.status} />
        </div>
      </section> */}

      {/* Tea Audit Section */}
      <AuditSection
        title="Tea Audit"
        data={auditData?.teaAudit}
        fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating']}
      />

      {/* Coffee Audit Section */}
      <AuditSection
        title="Coffee Audit"
        data={auditData?.coffieAudit}
        fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating']}
      />

      {/* Live Snacks Section */}
      <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Live Snacks</h2>
        <div className="p-2 flex flex-wrap gap-4">
          {auditData?.liveSnacks?.snacks.map((snack, index) => (
            <p key={index} className="text-gray-600 text-sm">
              <span className="font-semibold">{snack.name}:</span> {snack.status}
            </p>
          ))}
          <InfoRow label="Remark" value={auditData?.liveSnacks?.remark} />
          <InfoRow label="Rating" value={`${auditData?.liveSnacks?.rating}/5`} />
        </div>
      </section>

      {/* Bakery Products Section */}
      <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Bakery Products</h2>
        <div className="p-2 flex flex-wrap gap-4">
          {auditData?.bakeryProducts.map((product, index) => (
            <div key={index} className="flex flex-wrap gap-4 mb-2">
              <InfoRow label="Product" value={product.product} />
              <InfoRow label="Quantity" value={product.quantity} />
              <InfoRow label="Expiration Date" value={new Date(product.expirationDate).toLocaleDateString()} />
            </div>
          ))}
        </div>
      </section>

      {/* Summary Section */}
      <section className="border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Summary</h2>
        <div className="p-2 flex flex-wrap gap-4">
          <InfoRow label="Total Items Checked" value={auditData?.total_items_checked} />
          <InfoRow label="Comments" value={auditData?.comments} />
          <InfoRow label="Overall Rating" value={`${auditData?.rating}/5`} />
        </div>
      </section>
    </div>
  );
};

// Audit Section for Tea and Coffee
const AuditSection = ({ title, data, fields }) => (
  <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
    <h2 className="bg-red-100 text-red-600 text-md poppins-semibold p-2">{title}</h2>
    <div className="p-2 flex flex-wrap gap-4">
      {fields.map((field, index) => (
        <InfoRow
          key={index}
          label={field.replace(/([A-Z])/g, ' $1')}
          value={data ? data[field] : 'N/A'}
        />
      ))}
    </div>
  </section>
);

// Component for Info Rows
const InfoRow = ({ label, value }) => (
  <div className="flex items-center text-sm border border-gray-200 rounded p-2">
    <span className="font-semibold text-gray-700 mr-1">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default AuditReport;

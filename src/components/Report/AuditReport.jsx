import React, { useRef, useState, useEffect } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { BsFillMicFill, BsStopFill } from 'react-icons/bs';
import SignatureCanvas from 'react-signature-canvas';
import { useParams } from 'react-router-dom';
import { getAudit } from '../../API/audits';

const AuditReport = () => {
  const [name, setName] = useState('');
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef({});
  const [auditData, setAuditData] = useState({});
  const { auditId } = useParams();

  useEffect(() => {
    // Fetch audit data when the component is mounted
    getAudit(auditId).then(res => setAuditData(res.data));
  }, [auditId]);

  const handleClearSignature = () => {
    signatureRef.current.clear();
  };

  const handleSaveSignature = () => {
    setSignature(signatureRef.current.getTrimmedCanvas().toDataURL('image/png'));
  };

  return (
    <div className="p-4 bg-white text-gray-800 font-sans max-w-3xl mx-auto">
      {/* Report Title */}
      <div className="flex items-center justify-between text-center mb-6 border-b border-gray-300 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <h1 className="text-2xl font-bold text-red-600">Audit Report</h1>
          <p className="text-gray-500 text-sm">
            {new Date(auditData?.auditDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center">
          <RecordingControls />
        </div>
      </div>

      {/* General Information Sections */}
      <div className="flex flex-col space-y-4">
        <AuditSection
          title="Tea Audit"
          data={auditData?.teaAudit}
          fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating']}
        />
        <AuditSection
          title="Coffee Audit"
          data={auditData?.coffeeAudit}
          fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating']}
        />
        <AuditSection
          title="Shop Information"
          data={auditData?.shop}
          fields={['shopName', 'ownerName', 'phone', 'email', 'address', 'location']}
        />
        <AuditSection
          title="Inside Shop"
          data={auditData?.insideShop}
          fields={['dining', 'liveSnackDisplay', 'teaCounter', 'dustbin', 'frontView', 'handWash', 'hotCounter', 'iceCreamCounter', 'juiceBar', 'normalCounter', 'snackCounter']}
        />
        <AuditSection
          title="Inside Kitchen"
          data={auditData?.insideKitchen}
          fields={['exhaustFan', 'grinder', 'kitchenFloor', 'kitchenLight', 'milkFreezer', 'sink', 'snackMaking', 'workTable']}
        />
        <AuditSection
          title="Outside Kitchen"
          data={auditData?.outsideKitchen}
          fields={['lollipopStandArea', 'shopBoard']}
        />
        <AuditSection
          title="Wall Branding"
          data={auditData?.wallBranding}
          fields={['map', 'menuBrand', 'bunzoSection', 'bakshanamSection', 'pillarBranding']}
        />
        <AuditSection
          title="Bakery Section"
          data={auditData?.bakerySection}
          fields={['bakeryDisplay', 'bakeryItems', 'displayCleanliness', 'itemFreshness', 'bakeryRemark']}
        />
        <AuditSection
          title="Live Snacks"
          data={auditData?.liveSnacks}
          fields={['snackDisplay', 'snackVarieties', 'snackFreshness', 'snackRemark']}
        />
        <AuditSection
          title="Uniform Section"
          data={auditData?.uniformSection}
          fields={['staffUniform', 'uniformCleanliness', 'staffAppearance', 'uniformRemark']}
        />
      </div>

      {/* Stock Section */}
      <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
 <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Stock</h2>
        <div className="p-2 flex flex-wrap gap-4">
          {auditData?.stock?.captureImages?.map((image, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={image.imageUrl} alt={`Stock Image ${index + 1}`} className="w-32 h-32 object-cover border border-gray-300 mb-2" />
            </div>
          ))}
          <InfoRow label="Remark" value={auditData?.stock?.remark} />
        </div>
      </section>

      {/* Employees Section */}
      <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Employees</h2>
        <div className="p-2 flex flex-wrap gap-4">
          {auditData?.employees?.map((employee, index) => (
            <InfoRow key={index} label={`Area: ${employee.area}`} value={`Count: ${employee.count}, Names: ${employee.names}`} />
          ))}
        </div>
      </section>

      {/* Summary Section */}
      <section className="border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Summary</h2>
        <div className="p-2 flex flex-wrap gap-4">
          <InfoRow label="Total Items Checked" value={auditData?.total_items_checked} />
          <InfoRow label="Comments" value={auditData?.comment} />
          <InfoRow label="Overall Rating" value={`${auditData?.rating}/5`} />
        </div>
      </section>

      {/* Signature Section */}
      <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Signature</h2>
        <div className="p-2 flex flex-col items-center">
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="border border-gray-300 rounded p-2 mb-4 w-full"
          />
          <SignatureCanvas 
            ref={signatureRef}
            penColor='black'
            canvasProps={{ className: 'border border-gray-300 w-full h-32' }}
          />
          <div className="flex justify-between space-x-4 mt-4">
            <button 
              onClick={handleClearSignature} 
              className="bg-gray-400 text-white p-2 rounded hover:bg-gray-500"
            >
              Clear
            </button>
            <button 
              onClick={handleSaveSignature} 
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
            >
              Save Signature
            </button>
          </div>
          {signature && (
            <div className="mt-4">
              <h3 className="font-semibold">Your Signature:</h3>
              <img src={signature} alt="Signature" className="border border-gray-300 mt-2" />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const RecordingControls = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });

  return (
    <div className="flex flex-col items-center mt-4 p-4 border border-gray-300 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-sm font-semibold ${status === 'recording' ? 'text-red-500' : 'text-gray-600'}`}>
          Recording Status: {status}
        </span>
        {status === 'recording' && (
          <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        )}
      </div>
      
      <div className="flex border border-red-600 rounded-full p-1 gap-4">
        <button
          onClick={startRecording}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-all duration-300"
        >
          <BsFillMicFill size={30} className="text-white" />
        </button>
 <button
          onClick={stopRecording}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-400 hover:bg-gray-500 shadow-lg transition-all duration-300"
        >
          <BsStopFill size={30} className="text-white" />
        </button>
      </div>
      {mediaBlobUrl && (
        <audio className="mt-4" controls>
          <source src={mediaBlobUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

const AuditSection = ({ title, data, fields }) => {
  return (
    <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
      <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">{title}</h2>
      <div className="p-2 flex gap-4">
        {fields.map((field, index) => {
          const value = data?.[field];

          // If the value is an object and not null
          if (typeof value === 'object' && value !== null) {
            // Check if it's a nested object (object of objects)
            if (Array.isArray(value)) {
              // Handle arrays
              return (
                <div key={index} className="w-full sm:w-1/2">
                  <p className="text-sm font-semibold text-gray-600">{capitalizeFirstLetter(field)}</p>
                  <ul className="list-disc pl-5 text-gray-800">
                    {value.map((item, idx) => (
                      <li key={idx}>{JSON.stringify(item, null, 2)}</li> // Render each array item
                    ))}
                  </ul>
                </div>
              );
            } else {
              // If it's a nested object (an object of objects), render each property
              return (
                <div key={index} className="w-full sm:w-1/2">
                  <p className="text-sm font-semibold text-gray-600">{capitalizeFirstLetter(field)}</p>
                  <div className="pl-4 flex text-gray-800">
                    {Object.keys(value).map((nestedField, nestedIndex) => {
                      const nestedValue = value[nestedField];

                      // Check if the nested value has images
                      if (nestedField === 'captureImages' && Array.isArray(nestedValue)) {
                        return (
                          <div key={nestedIndex}>
                            <p className="text-sm font-semibold text-gray-600">Images:</p>
                            <div className="flex flex-wrap gap-2">
                              {nestedValue.map((image, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={image.imageUrl}
                                  alt={`Image ${imgIndex + 1}`}
                                  className="w-32 h-32 object-cover border border-gray-300"
                                />
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // Render other nested fields
                      return (
                        <div key={nestedIndex}>
                          <p className="text-sm font-semibold text-gray-600">{capitalizeFirstLetter(nestedField)}</p>
                          <pre>{JSON.stringify(nestedValue, null, 2)}</pre>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }
          }

          // Handle regular non-object values
          return (
            <InfoRow key={index} label={capitalizeFirstLetter(field)} value={value || 'No data available'} />
          );
        })}
      </div>
    </section>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="w-full sm:w-1/2">
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-gray-800">{value}</p>
    </div>
  );
};

// Capitalize the first letter of the string (for field labels)
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default AuditReport;
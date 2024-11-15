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
  const [isRecording, setIsRecording] = useState(false);
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
        <div className={`flex items-center ${isRecording ? 'fixed right-4 top-4' : ''}`}>
          <RecordingControls 
            setIsRecording={setIsRecording} // Pass down the state setter
          />
        </div>
      </div>

      {/* General Information Sections */}
      <div className="flex flex-col space-y-4">
      <AuditSection
          title="Shop Information"
          data={auditData?.shop}
          fields={['shopName', 'ownerName', 'phone', 'email', 'address', 'location']}
        />
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
          title="Painting"
          data={auditData?.painting}
          fields={['fan', 'light', 'celling',  'wallPainting',
            "floorTail",
            "remark",
            "rating",]}
        />
        <AuditSection
          title="Uniform Section"
          data={auditData?.uniformSection}
          fields={['cap', 'cort', 'gloves', 'apron']}
        />
      </div>

      {/* Stock Section */}
      <section className="my-4 border border-red-200 rounded-lg overflow-hidden">
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
      <section className="my-4 border border-red-200 rounded-lg overflow-hidden">
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

const RecordingControls = ({setIsRecording }) => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
  const handleStartRecording = () => {
    startRecording();
    setIsRecording(true);  
  };

  const handleStopRecording = () => {
    stopRecording();
    setIsRecording(false); // Set recording state to false
  };
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
          onClick={handleStartRecording}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-all duration-300"
        >
          <BsFillMicFill size={30} className="text-white" />
        </button>
        <button
          onClick={handleStopRecording}
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
    <section className="mb-6 border border-red-200 rounded-lg overflow-hidden">
      {/* Section Title */}
      <h2 className="bg-red-100 text-red-600 text-lg font-semibold p-4">{title}</h2>

      {/* Content Wrapper */}
      <div className="p-4 flex flex-wrap gap-6">
        {fields.map((field, index) => {
          const value = data?.[field];

          // If the value is an object and not null
          if (typeof value === 'object' && value !== null) {
            // Handle arrays
            if (Array.isArray(value)) {
              return (
                <div key={index} className="flex-shrink-0  w-auto">
                  <p className="text-sm font-semibold text-gray-600 mb-2">{capitalizeFirstLetter(field)}</p>
                  <ul className="list-disc pl-5 text-gray-800">
                    {value.map((item, idx) => (
                      <li key={idx} className="mb-2">
                        <pre className="bg-gray-50 p-2 rounded-lg overflow-x-auto text-sm">{JSON.stringify(item, null, 2)}</pre>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            } else {
              // Handle nested objects
              return (
                <div key={index} className="flex-shrink-0">
                  <p className="text-sm poppins-bold text-black mb-2">{capitalizeFirstLetter(field)}</p>
                  <div className="px-4 flex gap-10 text-gray-800">
                    {Object.keys(value).filter(i=>i!=="_id").map((nestedField, nestedIndex) => {
                      const nestedValue = value[nestedField];

                      // Check if the nested value has images
                      if (nestedField === 'captureImages' && Array.isArray(nestedValue)) {
                        return (
                          <div key={nestedIndex} className="flex-shrink-0  w-auto">
                            <p className="text-sm poppins-semibold text-black mb-2">Images</p>
                            <div className="flex gap-4">
                              {nestedValue.map((image, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={image.imageUrl}
                                  alt={`Image ${imgIndex + 1}`}
                                  className="w-12 h-12 object-cover border border-gray-300 rounded-md shadow-sm"
                                />
                              ))}
                            </div>
                          </div>
                        );
                      }

                      // Render other nested fields
                      if ((nestedField === 'available' || nestedField === 'brandName'|| nestedField === 'pillarCount') && !nestedValue) {
                        return null;
                      }
                      return (
                        <div key={nestedIndex} className="flex-shrink-0 w-auto">
                          <p className="text-sm poppins-semibold text-black mb-1">{capitalizeFirstLetter(nestedField)}</p>
                          <pre className="p-2 rounded-lg overflow-x-auto text-sm">{nestedValue}</pre>
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
            <div key={index} className="flex-shrink-0 w-auto">
              <InfoRow
                label={capitalizeFirstLetter(field)}
                value={value || 'No data available'}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
};



const InfoRow = ({ label, value }) => {
  return (
    <div className="w-full sm:w-1/2">
      <p className="text-sm poppins-semibold text-black">{label}</p>
      <p className="text-gray-800  whitespace-nowrap">{value}</p> 
    </div>
  );
};

// Capitalize the first letter of the string (for field labels)
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default AuditReport;
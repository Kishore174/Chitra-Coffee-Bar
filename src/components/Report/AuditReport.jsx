import React, { useRef, useState, useEffect } from 'react';
import { useReactMediaRecorder } from "react-media-recorder";
import { BsFillMicFill, BsStopFill } from 'react-icons/bs';
import SignatureCanvas from 'react-signature-canvas';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { getAudit } from '../../API/audits';
import { sendSignatureToBackend, uploadAudioToBackend } from '../../API/Api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';
import Loader from '../Loader';

const AuditReport = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef({});
  const [auditData, setAuditData] = useState({});
  const { auditId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal state
  const [loading, setLoading] = useState(false); // Loading state

  const [signatureType, setSignatureType] = useState(''); 
  const [currentAudio, setCurrentAudio] = useState(null);
  const navigate = useNavigate()
const { user } = useAuth();

  useEffect(() => {
    setLoading(true)
    // Fetch audit data when the component is mounted
    getAudit(auditId).then(res => {

      setAuditData(res.data)
      setAudio(res.data?.audioRecord);
      setComment(res.data?.comment)
      if(res.data?.audioRecord){
        setIsModalOpen(false)
      }
      setSignature(res.data?.signature)
      setLoading(false)

    });
  }, [auditId]);

  const handleClearSignature = () => {
    signatureRef.current.clear();
  };

  const handlePlayAudio = (audioUrl) => {
    // Stop currently playing audio if it exists
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset to start
    }

    const audio = new Audio(audioUrl);
    setCurrentAudio(audio); // Set the current audio
    audio.play();

    // Add an event listener to reset the current audio when it ends
    audio.onended = () => {
      setCurrentAudio(null);
    };
  };
  const handleStopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reset to start
      setCurrentAudio(null); // Clear the current audio state
    }
  };
  const handleSaveSignature = async () => {
    // Get the trimmed signature image as a Blob
    const signatureBlob = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
    const file = dataURLtoFile(signatureBlob, `${name}_signature.png`);

    // Prepare the form data to send to backend
    const formData = new FormData();
    formData.append('signatureFile', file);  // Add the signature file
    // formData.append('name', name);       // Add the name
    formData.append('signaturedBy', signatureType); // Add the signature type (Owner/Employee)
    formData.append('signaturedName',name)
    formData.append('comment',comment)
    try {
      const response = await sendSignatureToBackend(auditId,formData);
      if (response) {
        navigate('/audit')
        toast.success(response.message);
      } else {
        toast.error('Failed to save signature');
      }
    } catch (error) {
      toast.error('Error while saving signature');
    }
  };

  // Convert the base64 signature data to a File object
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };
  return (
  <>
  {
    loading?<Loader/>:(
      <div className="p-4 bg-white text-gray-800 font-sans max-w-3xl mx-auto">
      {user?.role !=="super-admin"&&isModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
           <div className="bg-white p-6 rounded shadow-lg">
             {/* <h2 className="text-lg font-semibold">Confirm Submission</h2> */}
             <p className="mt-2 text-md">Once you start the audio, you won't be able to go back. <br/>Ensure you're ready before proceeding</p>
             <div className="flex justify-end mt-4 space-x-2">
               <button
                 onClick={()=>{
                   setIsModalOpen(false)
                   navigate(-1)
                 }}
                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
               >
                 Cancel
               </button>
               <button
                 onClick={()=>{
                   setIsRecording(true)
                   setIsModalOpen(false)
                 }}
                 className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
               >
                 Confirm
               </button>
             </div>
           </div>
         </div>
       )}
   {/* Report Title */}
   <div className="flex items-center justify-between text-center mb-6 border-b border-gray-300 pb-4">
     <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
       <h1 className="text-2xl font-bold text-red-600">Audit Report</h1>
       <p className="text-gray-500 text-sm">
         {new Date(auditData?.auditDate).toLocaleDateString()}
       </p>
     </div>
     {!audio && user?.role!== "super-admin" && <div className={`flex items-center ${isRecording ? 'fixed right-4 top-4' : ''}`}>
       <RecordingControls 
        isRecording={isRecording}
         setIsRecording={setIsRecording} // Pass down the state setter
       />
     </div>}
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
     {/* Live Snacks Section */}
     <LiveSnacksSection
       snacks={auditData?.liveSnacks?.snacks}
       remark={auditData?.liveSnacks?.remark}
       rating={auditData?.liveSnacks?.rating}
       captureImages={auditData?.liveSnacks?.captureImages}
     />
     {/* Bakery Products Section */}
     {auditData?.bakeryProducts && auditData.bakeryProducts.length > 0 && (
       <BakeryProductsSection products={auditData.bakeryProducts} />
     )}
     {/* Additional Sections could go here */}
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
       title="Outside Shop"
       data={auditData?.outsideKitchen}
       fields={['lollipopStandArea', 'shopBoard']}
     />
     <AuditSection
       title="Wall Branding"
       data={auditData?.wallBranding}
       fields={['map', 'menuBrand', 'bunzoSection', 'bakshanamSection', 'pillarBranding']}
     />
      
     
     <AuditSection
       title="Interior"
       data={auditData?.painting}
       fields={['fan', 'light', 'celling',  'wallPainting',
         "floorTail",
         "remark",
         "rating",]}
     />
     <AuditSection
       title="Dress Code "
       data={auditData?.uniformSection}
       fields={['cap', 'cort', 'gloves', 'apron']}
     />
   </div>

   {/* Stock Section */}
   <section className="my-4 border border-red-200 rounded-lg overflow-hidden">
     <h2 className="bg-red-100 text-red-600 text-md poppins-bold p-2">Stock</h2>
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
     <h2 className="bg-red-100 text-red-600 text-md poppins-bold p-2">Employees</h2>
     <div className="p-2 flex flex-wrap gap-4">
       {auditData?.employees?.map((employee, index) => (
         <InfoRow key={index} label={`Area: ${employee.area}`} value={`Count: ${employee.count}, Names: ${employee.names}`} />
       ))}
     </div>
   </section>

   {/* Summary Section */}
   <section className="border border-red-200 rounded-lg overflow-hidden">
     <h2 className="bg-red-100 text-red-600 text-md poppins-bold p-2">Summary</h2>
     <div className="p-2 flex flex-wrap gap-4">
       {/* <InfoRow label="Total Items Checked" value={auditData?.total_items_checked} /> */}
      {
       user?.role !== "super-admin" && auditData && auditData.comment=="" ? 
       <div>
         <label htmlFor="comment">Remark</label>
         <input
             type="text"
             placeholder="Enter your Remark"
             value={ comment}
             onChange={(e) => setComment(e.target.value)}
             className="border border-gray-300 rounded p-2 mb-4 w-full"
       />
       </div> :
       <InfoRow label="Comments" value={auditData?.comment} />
      }
       <InfoRow label="Overall Rating" value={`${auditData?.rating}/5`} />
     </div>
   </section>
   {audio && (
     <section className="my-4 border border-red-200 rounded-lg overflow-hidden">
       <h2 className="bg-red-100 text-red-600 text-md poppins-semibold p-2">Previous Audio Report</h2>
       <div className="p-2">
         <div className="flex items-center justify-between mb-4">
           <p className="text-gray-800">
             Audio Recorded On: {new Date(audio.date).toLocaleDateString()}
           </p>
           <div className="flex space-x-2">
             {/* <button
               onClick={() => handlePlayAudio(audio.recordUrl)}
               className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
             >
               Play Audio
             </button> */}
          { audio &&  <audio className="rounded-md" controls>
           <source src={audio.recordUrl} type="audio/wav" />
           Your browser does not support the audio element.
         </audio>}
           </div>
         </div>
       </div>
     </section>
   )}
   {/* Signature Section */}
   {/* Signature Section */}
   <section className="my-4 border border-red-200 rounded-lg overflow-hidden">
     <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Signature</h2>
     <div className="p-2 flex flex-col items-center">
       
       {/* Render the signature input form only if there's no signature already available */}
       {!signature && user?.role!=="super-admin"  && (
         <>

           <input
             type="text"
             placeholder="Enter your name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="border border-gray-300 rounded p-2 mb-4 w-full"
           />

           {/* Dropdown for Signature Type (Owner/Employee) */}
           <select
             value={signatureType}
             onChange={(e) => setSignatureType(e.target.value)}
             className="border border-gray-300 rounded p-2 mb-4 w-full"
           >
             <option value="">--Select who signatured--</option>
             <option value="owner">Owner</option>
             <option value="employee">Employee</option>
           </select>

           {/* Signature Canvas */}
           <SignatureCanvas
             ref={signatureRef}
             penColor="black"
             canvasProps={{ className: 'border border-gray-300 w-full h-32' }}
           />

           {/* Buttons to clear or save the signature */}
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
         </>
       )}

       {/* If signature is available (either in local state or audit data), show the saved signature */}
       {signature && (
         <div className="mt-4 p-4">
           <h3 className="font-semibold">Signature Name : {`${auditData?.signaturedName}(${auditData?.signaturedBy})`||""}</h3>
           <h3 className="font-semibold">Your Signature:</h3>
           <img
             src={signature}
             alt="Signature"
             className="border border-gray-300 mt-2"
           />
         </div>
       )}
     </div>
   </section>

 </div>
    )
  }
  </>
  );
};

const RecordingControls = ({ setIsRecording,isRecording }) => {
  const { user } = useAuth();
  const { auditId } = useParams();
  const [status, setStatus] = useState('idle');  // idle, recording, stopped
  const [isRecordingComplete, setIsRecordingComplete] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null); // Reference to store the MediaRecorder instance
  const audioChunksRef = useRef([]); // Array to store the audio chunks during recording

  // Start recording function
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Access microphone
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Collect audio data chunks
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // When recording stops, create a blob and generate a URL for the audio
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setMediaBlobUrl(audioUrl);
        setIsRecordingComplete(true);
        setStatus('stopped');
      };

      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus('recording');
      setIsRecordingComplete(false);
      audioChunksRef.current = []; // Reset chunks on start
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast.error('Error accessing microphone');
    }
  };

  // Stop recording function
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setStatus('stopped');
    }
  };

  // Upload the recorded audio to the backend
  const uploadAudio = () => {
    if (audioBlob) {
      uploadAudioToBackend(auditId, audioBlob).then((res) => {
        setIsRecordingComplete(false)
        toast.success(res.message);
      }).catch((err) => {
        toast.error('Error uploading audio');
      });
    }
  };
  useEffect(()=>{
    if(isRecording && !isRecordingComplete){
      console.log("work")
      handleStartRecording()
    }
  },[isRecordingComplete,isRecording])
  return (
    <div className={`flex justify-center items-center ${isRecordingComplete?"fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50" :"fixed top-20 right-20 z-50"}`}>
      {/* Quick access floating action buttons */}
      <div className="relative flex flex-col items-center">
        <div className="absolute flex flex-col gap-4">
          {/* Recording Button */}
          <button
            onClick={handleStartRecording}
            className={`w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${status === 'recording' ? 'opacity-50' : ''} ${isRecordingComplete&&"hidden"}`}
            disabled={status === 'recording'}
          >
            <BsFillMicFill size={30} />
          </button>

          {/* Stop Button */}
          {status === 'recording' && (
            <button
              onClick={handleStopRecording}
              className="w-16 h-16 rounded-full bg-gray-600 text-white flex items-center justify-center shadow-lg transition-all duration-300"
            >
              <BsStopFill size={30} />
            </button>
          )}
        </div>
        
        {/* Audio playback section */}
        {mediaBlobUrl  && isRecordingComplete && (
          <div className="mt-4">
            <audio className="rounded-md" controls>
              <source src={mediaBlobUrl} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Submit Button */}
        {isRecordingComplete && (
          <button
            onClick={uploadAudio}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400"
          >
            Submit Recording
          </button>
        )}
      </div>
    </div>
  );
};
// Live Snacks Section Component
const LiveSnacksSection = ({ snacks, remark, rating, captureImages }) => (
  <section className="my-4 border border-red-200 rounded-lg overflow-hidden">
    <h2 className="bg-red-100 text-red-600 text-md poppins-bold p-2">Live Snacks</h2>
    <div className="p-2 flex flex-wrap gap-3">
      {snacks?.map((snack, index) => (
        <div key={index} className="mb-4">
          <div className="poppins-semibold text-black">{snack.snack?.name || 'No snack name'}</div>
          <div className="text-sm text-gray-700 poppins-regular"> {snack.status}</div>
        </div>
      ))}
      <InfoRow label="Remark" value={remark} className="w-full" />
      <InfoRow label="Rating" value={rating} />

      {captureImages && captureImages.length > 0 && (
        <div className="mt-2">
          <p className="poppins-medium">Images:</p>
          <div className="flex gap-2">
            {captureImages.map((image, idx) => (
              <div key={idx} className="relative">
                <img
                  src={image.imageUrl}
                  alt={`Snack Image ${idx + 1}`}
                  className="w-16 h-16 object-cover border border-gray-300"
                />
                {/* <p className="absolute bottom-0 left-0 text-xs bg-black text-white px-1 py-0.5">{image.location}</p> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </section>
);
const BakeryProductsSection = ({ products }) => (
  <section className="my-4 border border-red-200 rounded-lg overflow-hidden">
    <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Bakery Products</h2>
    <div className="p-2 flex flex-wrap">
      {products.map((product, index) => (
        <div key={index} className="mb-4 flex flex-wrap gap-3">
          <div className="font-semibold">{product.productName || product?.product?.name || 'No product name'}</div>
          <div className="text-sm">Brand Name: {product.brandName || ""}</div>
          <div className="text-sm">Quantity: {product.quantity}</div>
          <div className="text-sm">Expiry Date: {new Date(product.expiryDate).toLocaleDateString()}</div>
          {product.captureImages && product.captureImages.length > 0 && (
            <div className="mx-auto">
              <p className="font-medium">Images:</p>
              <div className="flex ">
                {product.captureImages.map((image, idx) => (
                  <img
                    key={idx}
                    src={image.imageUrl}
                    alt={`Bakery Product Image ${idx + 1}`}
                    className="w-16 h-16 object-cover border border-gray-300"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
);
const AuditSection = ({ title, data, fields }) => {
  return (
    <section className="mb-6 border border-red-200 rounded-lg overflow-hidden">
      {/* Section Title */}
      <h2 className="bg-red-100 text-red-600 text-lg poppins-bold p-4">{title}</h2>

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
                  <p className="text-sm poppins-semibold text-gray-600 mb-2">{capitalizeFirstLetter(field)}</p>
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
      <p className="text-gray-600  poppins-regular  whitespace-nowrap">{value}</p> 
    </div>  
  );
};

// Capitalize the first letter of the string (for field labels)
const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default AuditReport;

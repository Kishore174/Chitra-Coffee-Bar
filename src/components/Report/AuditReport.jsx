import React, { useRef, useState } from 'react';
import { auditdata } from '../../Assets/data';
import { useReactMediaRecorder } from "react-media-recorder";
import { BsFillMicFill, BsStopFill } from 'react-icons/bs';
import SignatureCanvas from 'react-signature-canvas';

const AuditReport = () => {
  const auditData = auditdata;
  const [name, setName] = useState('');
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef({});

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

      {/* General Information Section */}
      <AuditSection
        title="Tea Audit"
        data={auditData?.teaAudit}
        fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating']}
      />
      <AuditSection
        title="Coffee Audit"
        data={auditData?.coffieAudit}
        fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating']}
      />

      {/* Signature Section */}
   

      {/* Summary Section */}
      <section className="border border-red-200 rounded-lg overflow-hidden">
        <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">Summary</h2>
        <div className="p-2 flex flex-wrap gap-4">
          <InfoRow label="Total Items Checked" value={auditData?.total_items_checked} />
          <InfoRow label="Comments" value={auditData?.comments} />
          <InfoRow label="Overall Rating" value={`${auditData?.rating}/5`} />
        </div>
      </section>
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
      
      <div className="flex  border border-red-600 rounded-full p-1 gap-4">
        <button
          onClick={startRecording}
          className="flex items-center  justify-center w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 shadow-lg transition-all duration-200"
          title="Start Recording"
        >
          <BsFillMicFill className="text-white text-xl" />
        </button>
        <button
          onClick={stopRecording}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-200"
          title="Stop Recording"
        >
          <BsStopFill className="text-white text-xl" />
        </button>
      </div>

      {mediaBlobUrl && (
        <audio src={mediaBlobUrl} controls className="mt-4 w-full rounded border border-gray-300">
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

const AuditSection = ({ title, data, fields }) => (
  <section className="mb-4 border border-red-200 rounded-lg overflow-hidden">
    <h2 className="bg-red-100 text-red-600 text-md font-semibold p-2">{title}</h2>
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

const InfoRow = ({ label, value }) => (
  <div className="flex items-center text-sm border border-gray-200 rounded p-2">
    <span className="font-semibold text-gray-700 mr-1">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

export default AuditReport;
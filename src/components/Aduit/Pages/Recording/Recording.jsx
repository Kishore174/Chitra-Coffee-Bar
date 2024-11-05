import React, { useState } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { HiMicrophone, HiStop, HiCheckCircle } from 'react-icons/hi';

const WaveAnimation = ({ isRecording }) => {
  return (
    <div className={`flex items-center justify-center mt-4 transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-6 bg-blue-500 animate-wave"></div>
        <div className="w-2 h-8 bg-blue-500 animate-wave"></div>
        <div className="w-2 h-5 bg-blue-500 animate-wave"></div>
        <div className="w-2 h-7 bg-blue-500 animate-wave"></div>
        <div className="w-2 h-6 bg-blue-500 animate-wave"></div>
      </div>
    </div>
  );
};

const Recording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Audio Recorder</h1>
      
      <ReactMediaRecorder
        audio
        onStart={() => {
          console.log("Recording started");
          setIsRecording(true);
        }}
        onStop={(blobUrl) => {
          console.log("Recording stopped, Blob URL:", blobUrl);
          setMediaBlobUrl(blobUrl); // Set the media blob URL for playback
          setIsRecording(false);
        }}
        render={({ status, startRecording, stopRecording }) => (
          <div className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
            <p className="text-lg text-gray-700 mb-4">{status}</p>
            <WaveAnimation isRecording={isRecording} />
            <div className="flex flex-col space-y-4 w-full mt-4">
              <button
                className="flex items-center justify-center bg-blue-600 text-white text-lg px-5 py-2 rounded-lg shadow transition duration-300 hover:bg-blue-700"
                onClick={startRecording}
              >
                <HiMicrophone className="mr-2 text-xl" />
                Start Recording
              </button>
              <button
                className="flex items-center justify-center bg-red-600 text-white text-lg px-5 py-2 rounded-lg shadow transition duration-300 hover:bg-red-700"
                onClick={stopRecording}
              >
                <HiStop className="mr-2 text-xl" />
                Stop Recording
              </button>
            </div>
            {mediaBlobUrl && (
              <audio
                controls
                src={mediaBlobUrl}
                className="mt-6 w-full rounded border border-gray-300"
              >
                Your browser does not support the audio element.
              </audio>
            )}
            {mediaBlobUrl && ( // Show submit button only after recording
              <button
                className="flex items-center justify-center bg-red-500 text-white text-lg px-5 py-2 rounded-lg shadow transition duration-300 hover:bg-red-600 w-full mt-4"
                onClick={() => console.log("Submitted:", mediaBlobUrl)} // Handle submit action
              >
                <HiCheckCircle className="mr-2 text-xl" />
                Submit Recording
              </button>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default Recording;

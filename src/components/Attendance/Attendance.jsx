import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { checkIn, checkOut, getTodayStatus, getMyAttendance } from "../../API/attendance";
import { useAuth } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import {
  FaCamera,
  FaSignInAlt,
  FaSignOutAlt,
  FaClock,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRedo,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import dayjs from "dayjs";

const Attendance = () => {
  const { user } = useAuth();
  const webcamRef = useRef(null);
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [location, setLocation] = useState({ latitude: 0, longitude: 0, address: "" });
  const [history, setHistory] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1);
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const [fetchingHistory, setFetchingHistory] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [liveHours, setLiveHours] = useState("");

  const fetchTodayStatus = useCallback(async () => {
    try {
      const res = await getTodayStatus();
      setTodayStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setFetchingHistory(true);
    try {
      const res = await getMyAttendance(selectedMonth, selectedYear);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingHistory(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Auto-show selfie popup if not checked in
  useEffect(() => {
    if (!pageLoading && !todayStatus) {
      handleStartAction("checkin");
    }
  }, [pageLoading, todayStatus]);

  // Live working hours timer
  useEffect(() => {
    if (todayStatus?.status === "checked-in" && todayStatus?.checkIn?.time) {
      const updateTimer = () => {
        const checkInTime = dayjs(todayStatus.checkIn.time);
        const now = dayjs();
        const diffMs = now.diff(checkInTime);
        const hrs = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        setLiveHours(
          `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        );
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [todayStatus]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: "",
          });
        },
        (error) => {
          console.error("Location error:", error);
          toast.error("Please enable location access");
        }
      );
    }
  };

  const handleStartAction = (type) => {
    setActionType(type);
    setShowCamera(true);
    setCapturedImage(null);
    getCurrentLocation();
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowCamera(false);
  }, [webcamRef]);

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmit = async () => {
    if (!capturedImage) {
      toast.error("Please capture a selfie first");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    const file = dataURLtoFile(capturedImage, `selfie_${Date.now()}.jpg`);
    formData.append("selfie", file);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("address", location.address);

    try {
      if (actionType === "checkin") {
        const res = await checkIn(formData);
        toast.success(res.message);
      } else {
        const res = await checkOut(formData);
        toast.success(res.message);
      }
      setCapturedImage(null);
      setActionType(null);
      setShowCamera(false);
      fetchTodayStatus();
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setCapturedImage(null);
    setActionType(null);
    setShowCamera(false);
  };

  const changeMonth = (offset) => {
    let m = selectedMonth + offset;
    let y = selectedYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setSelectedMonth(m);
    setSelectedYear(y);
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
      </div>
    );
  }

  const isNotCheckedIn = !todayStatus;
  const isCheckedIn = todayStatus?.status === "checked-in";
  const isCheckedOut = todayStatus?.status === "checked-out";

  return (
    <div className="p-4 md:p-6 mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl poppins-semibold text-gray-800">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">
          {dayjs().format("dddd, DD MMMM YYYY")}
        </p>
      </div>

      {/* ===== CHECK-IN / CHECK-OUT ACTION AREA ===== */}
      {!actionType && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          {/* Not Checked In */}
          {isNotCheckedIn && (
            <div className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <FaSignInAlt className="text-red-500 text-3xl" />
              </div>
              <p className="poppins-semibold text-gray-800 text-lg mb-1">Ready to start your day?</p>
              <p className="text-sm text-gray-500 mb-6">Take a selfie to check in</p>
              <button
                onClick={() => handleStartAction("checkin")}
                className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-md poppins-semibold transition-colors"
              >
                <FaCamera /> Check In
              </button>
            </div>
          )}

          {/* Checked In */}
          {isCheckedIn && (
            <div>
              <div className="bg-gradient-to-r from-red-800 to-red-500 p-4 text-white text-center">
                <p className="text-xs poppins-medium opacity-80">Checked in at</p>
                <p className="text-2xl poppins-semibold">
                  {dayjs(todayStatus.checkIn?.time).format("hh:mm A")}
                </p>
                {liveHours && (
                  <div className="mt-2 bg-white/20 rounded-md inline-block px-4 py-1.5">
                    <p className="text-[10px] poppins-medium opacity-80">Working Hours</p>
                    <p className="text-xl poppins-semibold tracking-widest font-mono">{liveHours}</p>
                  </div>
                )}
              </div>
              <div className="p-4 flex items-center gap-3">
                {todayStatus.checkIn?.selfieUrl && (
                  <img
                    src={todayStatus.checkIn.selfieUrl}
                    alt="Check-in"
                    className="w-14 h-14 rounded-lg object-cover border cursor-pointer"
                    onClick={() => setPreviewImage(todayStatus.checkIn.selfieUrl)}
                  />
                )}
                <div className="flex-1">
                  <p className="text-sm poppins-medium text-gray-700">Check-in selfie</p>
                  {todayStatus.checkIn?.location?.latitude !== 0 && (
                    <a
                      href={`https://www.google.com/maps?q=${todayStatus.checkIn.location.latitude},${todayStatus.checkIn.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-500 flex items-center gap-1 mt-0.5"
                    >
                      <FaMapMarkerAlt /> View Location
                    </a>
                  )}
                </div>
              </div>
              <div className="px-4 pb-4">
                <button
                  onClick={() => handleStartAction("checkout")}
                  className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-md poppins-semibold transition-colors"
                >
                  <FaSignOutAlt /> Check Out
                </button>
              </div>
            </div>
          )}

          {/* Checked Out */}
          {isCheckedOut && (
            <div>
              <div className="bg-gradient-to-r from-red-800 to-red-500 p-4 text-white text-center">
                <FaCheck className="text-2xl mx-auto mb-1" />
                <p className="poppins-semibold text-lg">Day Complete</p>
                {todayStatus.totalHours > 0 && (
                  <div className="mt-2 bg-white/20 rounded-md inline-block px-4 py-1.5">
                    <p className="text-[10px] poppins-medium opacity-80">Total Working Hours</p>
                    <p className="text-xl poppins-semibold">{todayStatus.totalHours} hrs</p>
                  </div>
                )}
              </div>
              <div className="p-4 grid grid-cols-2 gap-3">
                {/* Check-in */}
                <div className="border rounded-lg p-3">
                  <p className="text-[10px] text-red-500 poppins-semibold uppercase mb-2 flex items-center gap-1">
                    <FaSignInAlt /> Check-in
                  </p>
                  {todayStatus.checkIn?.selfieUrl && (
                    <img
                      src={todayStatus.checkIn.selfieUrl}
                      alt="In"
                      className="w-full h-24 rounded-md object-cover mb-2 cursor-pointer"
                      onClick={() => setPreviewImage(todayStatus.checkIn.selfieUrl)}
                    />
                  )}
                  <p className="text-sm poppins-semibold text-gray-800">
                    {dayjs(todayStatus.checkIn?.time).format("hh:mm A")}
                  </p>
                  {todayStatus.checkIn?.location?.latitude !== 0 && (
                    <a
                      href={`https://www.google.com/maps?q=${todayStatus.checkIn.location.latitude},${todayStatus.checkIn.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-red-500 flex items-center gap-1 mt-1"
                    >
                      <FaMapMarkerAlt /> Location
                    </a>
                  )}
                </div>
                {/* Check-out */}
                <div className="border rounded-lg p-3">
                  <p className="text-[10px] text-red-500 poppins-semibold uppercase mb-2 flex items-center gap-1">
                    <FaSignOutAlt /> Check-out
                  </p>
                  {todayStatus.checkOut?.selfieUrl && (
                    <img
                      src={todayStatus.checkOut.selfieUrl}
                      alt="Out"
                      className="w-full h-24 rounded-md object-cover mb-2 cursor-pointer"
                      onClick={() => setPreviewImage(todayStatus.checkOut.selfieUrl)}
                    />
                  )}
                  <p className="text-sm poppins-semibold text-gray-800">
                    {dayjs(todayStatus.checkOut?.time).format("hh:mm A")}
                  </p>
                  {todayStatus.checkOut?.location?.latitude !== 0 && (
                    <a
                      href={`https://www.google.com/maps?q=${todayStatus.checkOut.location.latitude},${todayStatus.checkOut.location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-red-500 flex items-center gap-1 mt-1"
                    >
                      <FaMapMarkerAlt /> Location
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ===== CAMERA / SELFIE CAPTURE ===== */}
      {actionType && (
        <div className=" fixed inset-0 z-50 h-screen bg-black bg-opacity-70 flex items-center justify-center p-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="bg-red-500 p-3 text-center text-white poppins-semibold">
            {actionType === "checkin" ? "Check-in Selfie" : "Check-out Selfie"}
          </div>

          {showCamera && (
            <div className="p-4">
              <div className="rounded-lg overflow-hidden mb-4 bg-black">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user", width: 480, height: 480 }}
                  className="w-full"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-md border border-gray-300 text-black poppins-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={capture}
                  className="flex-1 py-2.5 rounded-md bg-red-500 hover:bg-red-600 text-white poppins-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <FaCamera /> Capture
                </button>
              </div>
            </div>
          )}

          {capturedImage && (
            <div className="p-4">
              <img src={capturedImage} alt="Captured" className="rounded-lg mb-3 w-full" />

              {location.latitude !== 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4 justify-center">
                  <FaMapMarkerAlt className="text-red-400" />
                  <span>Location captured</span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => { setCapturedImage(null); setShowCamera(true); }}
                  className="flex-1 py-2.5 rounded-md border border-gray-300 text-black poppins-medium hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <FaRedo className="text-sm" /> Retake
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-md bg-red-500 hover:bg-red-600 text-white poppins-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaCheck /> Confirm
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
      )}

      {/* ===== ATTENDANCE HISTORY ===== */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="poppins-semibold text-gray-800 flex items-center gap-2">
            <FaCalendarAlt className="text-red-500" /> History
          </h2>
          <div className="flex items-center gap-1">
            <button onClick={() => changeMonth(-1)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
              <FaChevronLeft className="text-gray-400 text-xs" />
            </button>
            <span className="text-sm poppins-medium text-gray-600 min-w-[100px] text-center">
              {dayjs().month(selectedMonth - 1).format("MMM")} {selectedYear}
            </span>
            <button onClick={() => changeMonth(1)} className="p-1.5 rounded hover:bg-gray-100 transition-colors">
              <FaChevronRight className="text-gray-400 text-xs" />
            </button>
          </div>
        </div>

        {fetchingHistory ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-red-500"></div>
          </div>
        ) : history.length > 0 ? (
          <div className="divide-y">
            {history.map((record) => {
              const isComplete = record.status === "checked-out";
              const isActive = record.status === "checked-in";
              return (
                <div key={record._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors">
                  {/* Date */}
                  <div className="w-11 h-11 rounded-lg flex flex-col items-center justify-center shrink-0 bg-red-50">
                    <span className="text-xs poppins-semibold text-gray-800 leading-none">
                      {dayjs(record.date).format("DD")}
                    </span>
                    <span className="text-[9px] text-gray-400 uppercase leading-none mt-0.5">
                      {dayjs(record.date).format("ddd")}
                    </span>
                  </div>

                  {/* Selfies */}
                  <div className="flex gap-1.5 shrink-0">
                    {record.checkIn?.selfieUrl ? (
                      <img
                        src={record.checkIn.selfieUrl}
                        alt="In"
                        className="w-10 h-10 rounded-md object-cover border cursor-pointer"
                        onClick={() => setPreviewImage(record.checkIn.selfieUrl)}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <FaSignInAlt className="text-gray-300 text-xs" />
                      </div>
                    )}
                    {record.checkOut?.selfieUrl ? (
                      <img
                        src={record.checkOut.selfieUrl}
                        alt="Out"
                        className="w-10 h-10 rounded-md object-cover border cursor-pointer"
                        onClick={() => setPreviewImage(record.checkOut.selfieUrl)}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center">
                        <FaSignOutAlt className="text-gray-300 text-xs" />
                      </div>
                    )}
                  </div>

                  {/* Times */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-700 poppins-medium">
                        {record.checkIn?.time ? dayjs(record.checkIn.time).format("hh:mm A") : "--:--"}
                      </span>
                      <span className="text-gray-300">—</span>
                      <span className="text-gray-700 poppins-medium">
                        {record.checkOut?.time ? dayjs(record.checkOut.time).format("hh:mm A") : "--:--"}
                      </span>
                    </div>
                    {record.totalHours > 0 && (
                      <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                        <FaClock className="text-red-400" /> {record.totalHours} hrs
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <span className={`px-2 py-1 rounded text-[10px] poppins-semibold shrink-0 ${
                    isComplete
                      ? "bg-green-100 text-green-700"
                      : isActive
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {isComplete ? "Present" : isActive ? "Active" : "Absent"}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <FaCalendarAlt className="text-gray-200 text-4xl mx-auto mb-2" />
            <p className="text-sm text-gray-400 poppins-medium">No records for this month</p>
          </div>
        )}
      </div>

      {/* Selfie Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="w-full rounded-lg shadow-2xl" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 bg-white text-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 text-lg font-bold"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;

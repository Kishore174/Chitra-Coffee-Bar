import React, { useEffect, useState } from "react";
import { getAllDevices, deleteDevice, toggleDevicePin, assignDeviceAuditor, updateDeviceWhitelist } from "../../API/device";
import { getAllAuditors } from "../../API/auditor";
import { 
    BsTrash, BsPhone, BsBatteryFull, 
    BsListUl, BsSearch, BsCheckCircleFill, BsX, BsCpu 
} from "react-icons/bs";
import { FaMobileAlt, FaPlug, FaLock, FaLockOpen } from "react-icons/fa";
import { MdDelete, MdApps, MdAdd, MdSearch, MdOutlineSecurity } from "react-icons/md";
import Loader from "../Loader";
import toast from "react-hot-toast";

const DeviceManagement = () => {
    const [devices, setDevices] = useState([]);
    const [auditors, setAuditors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    
    // Deletion Modal
    const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deviceToDelete, setDeviceToDelete] = useState(null);

    // Whitelist Modal State
    const [showWhitelistModal, setShowWhitelistModal] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [newApp, setNewApp] = useState("");
    const [tempWhitelist, setTempWhitelist] = useState([]);
    const [appSearch, setAppSearch] = useState("");

    const fetchData = async () => {
        try {
            const [deviceRes, auditorRes] = await Promise.all([
                getAllDevices(),
                getAllAuditors()
            ]);
            setDevices(deviceRes.data);
            setAuditors(auditorRes.data);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleDeleteClick = (device) => {
        setDeviceToDelete(device);
        setConfirmDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (deviceToDelete) {
            try {
                await deleteDevice(deviceToDelete.deviceId);
                toast.success("Device Purged");
                fetchData();
            } catch (err) {
                toast.error("Access Denied");
            } finally {
                setConfirmDialogOpen(false);
                setDeviceToDelete(null);
            }
        }
    };

    const handleTogglePin = async (deviceId, currentPinned) => {
        try {
            await toggleDevicePin(deviceId, !currentPinned);
            toast.success(currentPinned ? "System Unlocked" : "Kiosk Mode Active");
            fetchData();
        } catch (err) {
            toast.error("Command Error");
        }
    };

    const handleAssignAuditor = async (deviceId, auditorId) => {
        try {
            await assignDeviceAuditor(deviceId, auditorId);
            toast.success("Identity Synced");
            fetchData();
        } catch (err) {
            toast.error("Sync Failed");
        }
    };

    const openWhitelistModal = (device) => {
        setSelectedDevice(device);
        const whitelistedPackages = device.installedApps?.filter(app => app.isWhitelisted).map(app => app.packageName) || [];
        setTempWhitelist(whitelistedPackages);
        setShowWhitelistModal(true);
    };

    const addToWhitelist = (packageName) => {
        const appToAdd = packageName || newApp;
        if (appToAdd && !tempWhitelist.includes(appToAdd)) {
            setTempWhitelist([...tempWhitelist, appToAdd]);
            setNewApp("");
        }
    };

    const handleToggleApp = (packageName) => {
        setTempWhitelist(prev => 
            prev.includes(packageName) 
                ? prev.filter(p => p !== packageName) 
                : [...prev, packageName]
        );
    };

    const removeFromWhitelist = (app) => {
        setTempWhitelist(prev => prev.filter(i => i !== app));
    };

    const saveWhitelist = async () => {
        try {
            await updateDeviceWhitelist(selectedDevice.deviceId, tempWhitelist);
            toast.success("Ecosystem Updated");
            setShowWhitelistModal(false);
            fetchData();
        } catch (err) {
            toast.error("Update Error");
        }
    };

    const getAppName = (packageName) => {
        if (!selectedDevice || !selectedDevice.installedApps) return packageName;
        const app = selectedDevice.installedApps.find(a => a.packageName === packageName);
        return app ? app.name : packageName;
    };

    const filteredDevices = devices.filter(d => 
        d.model?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        d.deviceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDevices.length / itemsPerPage);
    const paginatedDevices = filteredDevices.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const filteredInstalledApps = selectedDevice?.installedApps?.filter(app => 
        app.name.toLowerCase().includes(appSearch.toLowerCase()) || 
        app.packageName.toLowerCase().includes(appSearch.toLowerCase())
    ) || [];

    // Merged list: All installed apps + any manually added packages that aren't installed
    const manualApps = tempWhitelist.filter(pkg => 
        !selectedDevice?.installedApps?.some(app => app.packageName === pkg)
    ).map(pkg => ({
        packageName: pkg,
        name: pkg, // Fallback to package name
        isManual: true
    }));

    const unifiedAppList = [...filteredInstalledApps, ...manualApps].filter(app => 
        app.name.toLowerCase().includes(appSearch.toLowerCase()) || 
        app.packageName.toLowerCase().includes(appSearch.toLowerCase())
    );

    // Stats
    const onlineCount = devices.filter(d => d.status === "online").length;

    return (
        <div className="min-h-screen px-4 py-6 max-w-screen-xl mx-auto poppins-regular">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white p-2.5 rounded-xl shadow-lg shadow-red-100">
                        <FaMobileAlt size={18} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Device Fleet</h1>
                        <p className="text-sm text-gray-500 mt-0.5">{filteredDevices.length} assets connected • <span className="text-green-600 font-semibold">{onlineCount} online</span></p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-red-400 text-sm" />
                        <input
                            type="text"
                            placeholder="Search by model, brand or ID..."
                            className="w-full sm:w-64 pl-9 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-700 placeholder-gray-400 shadow-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>
                </div>
            </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader /></div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-red-600 text-white">
                                    <tr>
                                        {["Device", "Status", "Auditor", "Ecosystem", "Kiosk Mode", "Actions"].map((h, i) => (
                                            <th key={i} className="px-6 py-4 font-semibold uppercase tracking-wider text-[11px]">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedDevices.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-20 text-gray-400">
                                                <BsPhone size={48} className="mx-auto mb-4 opacity-10" />
                                                <p className="font-medium">No devices found matching your criteria.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedDevices.map((device) => {
                                            const whitelistedCount = device.installedApps?.filter(a => a.isWhitelisted).length || 0;
                                            return (
                                                <tr key={device.deviceId} className="hover:bg-red-50/30 transition-colors group">
                                                    {/* Device */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                                                <BsPhone size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-900 uppercase">{device.model}</p>
                                                                <p className="text-[10px] text-gray-400 font-mono tracking-tighter uppercase">{device.brand} • {device.deviceId.slice(-8)}</p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Status */}
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-1.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className={`w-1.5 h-1.5 rounded-full ${device.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${device.status === 'online' ? 'text-green-600' : 'text-gray-400'}`}>
                                                                    {device.status}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-500">
                                                                {device.isCharging ? <FaPlug size={10} className="text-blue-500" /> : <BsBatteryFull size={12} className={device.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'} />}
                                                                <span className="text-[11px] font-bold">{device.batteryLevel}%</span>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Auditor */}
                                                    <td className="px-6 py-4">
                                                        <select 
                                                            className="text-[11px] font-bold border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all cursor-pointer w-full max-w-[160px]"
                                                            value={device.assignedAuditor?._id || ""}
                                                            onChange={(e) => handleAssignAuditor(device.deviceId, e.target.value)}
                                                        >
                                                            <option value="">UNASSIGNED</option>
                                                            {auditors.map(auditor => (
                                                                <option key={auditor._id} value={auditor._id}>
                                                                    {auditor.name.toUpperCase()}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </td>

                                                    {/* Ecosystem */}
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => openWhitelistModal(device)}
                                                            className="flex items-center gap-2 bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg border border-slate-100 hover:border-red-100 transition-all group/btn"
                                                        >
                                                            <BsListUl size={14} />
                                                            <span className="text-[11px] font-bold uppercase tracking-tighter">{whitelistedCount} Apps</span>
                                                        </button>
                                                    </td>

                                                    {/* Kiosk Mode */}
                                                    <td className="px-6 py-4">
                                                        <button 
                                                            onClick={() => handleTogglePin(device.deviceId, device.isPinned)}
                                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${device.isPinned ? 'bg-red-600 text-white shadow-md shadow-red-100' : 'bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200'}`}
                                                        >
                                                            {device.isPinned ? <><FaLock size={10} /> LOCKED</> : <><FaLockOpen size={10} /> UNLOCKED</>}
                                                        </button>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteClick(device)}
                                                            className="p-2 text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                        >
                                                            <MdDelete size={20} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {paginatedDevices.map((device) => {
                                const whitelistedCount = device.installedApps?.filter(a => a.isWhitelisted).length || 0;
                                return (
                                    <div key={device.deviceId} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-slate-100 p-2.5 rounded-xl text-slate-400">
                                                    <BsPhone size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 uppercase text-sm">{device.model}</h3>
                                                    <p className="text-[10px] text-gray-400 font-mono uppercase tracking-tighter">{device.brand} • {device.deviceId.slice(-8)}</p>
                                                </div>
                                            </div>
                                            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${device.status === 'online' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                                                {device.status}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Battery</p>
                                                <div className="flex items-center gap-2">
                                                    {device.isCharging ? <FaPlug size={10} className="text-blue-500" /> : <BsBatteryFull size={12} className={device.batteryLevel < 20 ? 'text-red-500' : 'text-green-500'} />}
                                                    <span className="text-xs font-bold text-slate-700">{device.batteryLevel}%</span>
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ecosystem</p>
                                                <button onClick={() => openWhitelistModal(device)} className="flex items-center gap-1.5 text-xs font-bold text-red-600">
                                                    <BsListUl size={12} /> {whitelistedCount} Apps
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Assigned Auditor</label>
                                                <select 
                                                    className="w-full text-xs font-bold border border-gray-200 rounded-xl px-4 py-2.5 bg-gray-50 focus:ring-2 focus:ring-red-500/20 outline-none transition-all"
                                                    value={device.assignedAuditor?._id || ""}
                                                    onChange={(e) => handleAssignAuditor(device.deviceId, e.target.value)}
                                                >
                                                    <option value="">UNASSIGNED</option>
                                                    {auditors.map(auditor => (
                                                        <option key={auditor._id} value={auditor._id}>
                                                            {auditor.name.toUpperCase()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="flex gap-2 pt-2 border-t border-gray-50">
                                                <button 
                                                    onClick={() => handleTogglePin(device.deviceId, device.isPinned)}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-widest transition-all ${device.isPinned ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-100 text-gray-500'}`}
                                                >
                                                    {device.isPinned ? <><FaLock size={12} /> LOCKED</> : <><FaLockOpen size={12} /> UNLOCKED</>}
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(device)}
                                                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-300 hover:text-red-600 rounded-xl transition-colors"
                                                >
                                                    <MdDelete size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-8 flex-wrap gap-4">
                                <p className="text-sm text-gray-400 font-medium">
                                    Showing <span className="text-gray-700">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredDevices.length)}</span> of <span className="text-gray-700">{filteredDevices.length}</span> devices
                                </p>

                                <div className="flex items-center gap-1.5">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        ‹
                                    </button>

                                    {(() => {
                                        const pages = [];
                                        const delta = 1; // pages around current
                                        const left = currentPage - delta;
                                        const right = currentPage + delta;

                                        let lastPrinted = 0;

                                        for (let i = 1; i <= totalPages; i++) {
                                            const isEdge = i === 1 || i === totalPages;
                                            const isNearCurrent = i >= left && i <= right;

                                            if (isEdge || isNearCurrent) {
                                                if (lastPrinted && i - lastPrinted > 1) {
                                                    pages.push(
                                                        <span key={`dots-${i}`} className="px-1 text-gray-400 text-sm select-none">
                                                            …
                                                        </span>
                                                    );
                                                }
                                                pages.push(
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i)}
                                                        className={`w-9 h-9 flex items-center justify-center text-sm font-bold rounded-xl transition-all ${
                                                            currentPage === i
                                                                ? 'bg-red-600 text-white shadow-md shadow-red-100'
                                                                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600 shadow-sm'
                                                        }`}
                                                    >
                                                        {i}
                                                    </button>
                                                );
                                                lastPrinted = i;
                                            }
                                        }
                                        return pages;
                                    })()}

                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Delete Confirmation Modal */}
                {isConfirmDialogOpen && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 animate-in zoom-in duration-300">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mx-auto mb-6">
                                <MdDelete className="text-red-600" size={28} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 text-center mb-2 tracking-tight">Purge Device?</h2>
                            <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
                                <span className="font-bold text-gray-900 uppercase">{deviceToDelete?.model}</span> will be permanently disconnected from the secure network.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setConfirmDialogOpen(false)}
                                    className="flex-1 py-3.5 text-xs font-black text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3.5 text-xs font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-100 uppercase tracking-widest"
                                >
                                    Yes, Purge
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            {/* Premium App Registry Modal */}
            {showWhitelistModal && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-100">
                        {/* Minimal Header */}
                        <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Authorized Registry</h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">{selectedDevice?.model} • {selectedDevice?.deviceId}</p>
                            </div>
                            <button onClick={() => setShowWhitelistModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors"><BsX size={28} /></button>
                        </div>
                        
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {/* Minimal Search/Add */}
                            <div className="px-8 py-5 border-b border-slate-50 flex gap-3">
                                <div className="relative flex-1">
                                    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                    <input 
                                        type="text" 
                                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-200 transition-all outline-none"
                                        placeholder="Search apps..."
                                        value={appSearch}
                                        onChange={(e) => setAppSearch(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        className="w-40 px-4 py-2 text-sm bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:border-slate-200 transition-all outline-none"
                                        placeholder="Add package..."
                                        value={newApp}
                                        onChange={(e) => setNewApp(e.target.value)}
                                    />
                                    <button onClick={addToWhitelist} className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-800 transition-all">Add</button>
                                </div>
                            </div>

                            {/* Minimal List */}
                            <div className="flex-1 overflow-y-auto px-6 py-2">
                                {unifiedAppList.length > 0 ? (
                                    unifiedAppList.map((app, index) => {
                                        const isAuthorized = tempWhitelist.includes(app.packageName);
                                        return (
                                            <div key={app.packageName} className={`flex items-center justify-between py-4 px-2 ${index !== unifiedAppList.length - 1 ? 'border-b border-slate-50' : ''}`}>
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAuthorized ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-300'}`}>
                                                        <MdApps size={20} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className={`text-sm font-semibold truncate ${isAuthorized ? 'text-slate-900' : 'text-slate-500'}`}>{app.name}</h4>
                                                        <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{app.packageName}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleToggleApp(app.packageName)}
                                                    className={`relative w-10 h-5 rounded-full transition-all duration-200 flex items-center px-0.5 ${isAuthorized ? 'bg-red-500' : 'bg-slate-200'}`}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${isAuthorized ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </button>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-20 text-slate-300 text-[10px] font-bold uppercase tracking-widest">No apps found</div>
                                )}
                            </div>
                        </div>

                        {/* Minimal Footer */}
                        <div className="px-8 py-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{tempWhitelist.length} apps authorized</span>
                            <div className="flex gap-3">
                                <button onClick={() => setShowWhitelistModal(false)} className="px-5 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all">Cancel</button>
                                <button onClick={saveWhitelist} className="bg-red-600 text-white px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeviceManagement;

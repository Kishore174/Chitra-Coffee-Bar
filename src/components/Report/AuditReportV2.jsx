import React, { useRef, useState, useEffect } from 'react';
import { BsFillMicFill, BsStopFill } from 'react-icons/bs';
import SignatureCanvas from 'react-signature-canvas';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAuditV2, sendSignatureToBackendV2, uploadAudioToBackendV2 } from '../../API/auditV2';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';
import Loader from '../Loader';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

/* ─── Helpers ─────────────────────────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const cap = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1') : '';

/* ─── extract scalar value ───────────────────────────────── */
const extractVal = (v) => {
  if (v === null || v === undefined || v === '') return '—';
  if (Array.isArray(v)) {
    const isImageArray = v.length > 0 && v.every(item => typeof item === 'string' && (item.startsWith('http') || item.startsWith('/') || item.startsWith('file://')));
    if (isImageArray) return `${v.length} image(s)`;
    return v.map(item => {
      const valStr = String(item || '');
      const otherPrefixes = ['other brand - ', 'others - ', 'other - '];
      let matchedPrefix = otherPrefixes.find(p => valStr.toLowerCase().startsWith(p));
      return matchedPrefix ? `${item.slice(0, matchedPrefix.length - 3)} - ${item.slice(matchedPrefix.length)}` : item;
    }).filter(Boolean).join(', ');
  }
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'object') {
    if (v.status != null) return String(v.status);
    if (v.remark != null) return String(v.remark);
    const first = Object.entries(v).find(([k, val]) => k !== '_id' && k !== 'captureImages' && typeof val !== 'object');
    return first ? String(first[1]) : '—';
  }

  const valStr = String(v);
  const otherPrefixes = ['other brand - ', 'others - ', 'other - '];
  let matchedPrefix = otherPrefixes.find(p => valStr.toLowerCase().startsWith(p));
  return matchedPrefix ? `${v.slice(0, matchedPrefix.length - 3)} - ${v.slice(matchedPrefix.length)}` : valStr;
};

/* ─── Field Row ───────────────────────────────────── */
const FieldRow = ({ field }) => {
  const { label, value, type, obtainedPoints, maxPoints, isAvailable } = field;
  const isUnavailable = isAvailable === 'no';
  const isImage = type === 'single_image' || type === 'multi_image';
  if (isImage && !isUnavailable) return null; // handled separately

  const cur = isUnavailable ? 'Not Available' : extractVal(value);
  const isScored = ['dropdown', 'boolean', 'rating', 'number'].includes(type) && maxPoints > 0;

  return (
    <tr className="transition-colors duration-150">
      <td className="py-3 px-4 w-1/4 border-l-4 border-transparent">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-sm font-medium ${isUnavailable ? 'text-red-600 font-bold' : 'text-slate-800'}`}>
            {cur}
          </span>
          {isScored && !isUnavailable && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {obtainedPoints} / {maxPoints} pts
            </span>
          )}
        </div>
        {field.remarks && (
          <p className="text-xs text-slate-400 mt-1 italic">Remark: {field.remarks}</p>
        )}
      </td>
    </tr>
  );
};

/* ─── Table header row ───────────────────────────────────── */
const TableHead = () => (
  <thead>
    <tr className="bg-slate-50 border-b border-slate-200">
      <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-4 py-3 w-1/4">Field</th>
      <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-4 py-3">Value</th>
    </tr>
  </thead>
);

/* ─── Section Card wrapper ───────────────────────────────── */
const SectionCard = ({ title, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white"
      >
        <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        <div className="flex items-center gap-2">
          {open ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </div>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

/* ─── Image strip ─────────────────────────────────────────── */
const ImageStrip = ({ images, setPreview, setSelImage }) => {
  if (!images?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-slate-100">
      {images.map((img, i) => (
        <img key={i} src={img.url || img.imageUrl || img} alt=""
          className="w-16 h-16 object-cover rounded-lg border border-slate-200 cursor-pointer hover:scale-105 hover:border-red-400 transition-all"
          onClick={() => { setSelImage?.(img.url || img.imageUrl || img); setPreview?.(true); }}
        />
      ))}
    </div>
  );
};

/* ─── Recording Controls ──────────────────────────────────── */
const RecordingControls = ({ isRecording, setIsRecording }) => {
  const { auditId } = useParams();
  const [status, setStatus] = useState('idle');
  const [isComplete, setIsComplete] = useState(false);
  const [mediaBlobUrl, setMediaBlobUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const recRef = useRef(null);
  const chunksRef = useRef([]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recRef.current = new MediaRecorder(stream);
      recRef.current.ondataavailable = (e) => chunksRef.current.push(e.data);
      recRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        setMediaBlobUrl(URL.createObjectURL(blob));
        setIsComplete(true);
        setStatus('stopped');
      };
      recRef.current.start();
      setIsRecording(true);
      setStatus('recording');
      setIsComplete(false);
      chunksRef.current = [];
    } catch { toast.error('Microphone access denied'); }
  };

  const stop = () => {
    if (recRef.current?.state === 'recording') {
      recRef.current.stop();
      setIsRecording(false);
      setStatus('stopped');
    }
  };

  const upload = () => {
    if (!audioBlob) return;
    uploadAudioToBackendV2(auditId, audioBlob)
      .then(r => { setIsComplete(false); toast.success(r.message); })
      .catch(() => toast.error('Upload failed'));
  };

  useEffect(() => { if (isRecording && !isComplete) start(); }, [isComplete, isRecording]);

  if (isComplete) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
        <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-4">Review Recording</p>
        {mediaBlobUrl && <audio className="w-full rounded-lg" controls><source src={mediaBlobUrl} type="audio/wav" /></audio>}
        <div className="flex gap-3 justify-center mt-6">
          <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold hover:bg-slate-50" onClick={() => setIsComplete(false)}>Re-record</button>
          <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700" onClick={upload}>Submit</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed top-20 right-6 z-50 flex flex-col items-center gap-2">
      {status !== 'recording' && (
        <button onClick={start} className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 hover:scale-105 transition-all">
          <BsFillMicFill size={22} />
        </button>
      )}
      {status === 'recording' && (
        <>
          <button onClick={stop} className="w-14 h-14 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-lg animate-pulse">
            <BsStopFill size={22} />
          </button>
          <span className="text-[10px] font-bold text-red-600 bg-white px-2 py-0.5 rounded-full shadow">REC</span>
        </>
      )}
    </div>
  );
};

/* ─── Preview Image ───────────────────────────────────────── */
const PreviewImage = ({ image, setPreview }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setPreview(false)}>
    <img src={image} alt="Preview" className="max-h-[90vh] max-w-[90vw] rounded-xl" onClick={e => e.stopPropagation()} />
    <button onClick={() => setPreview(false)} className="absolute top-5 right-5 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors">
      <XMarkIcon className="w-5 h-5 text-slate-700" />
    </button>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════ */
const AuditReportV2 = () => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [signature, setSignature] = useState(null);
  const signatureRef = useRef({});
  const [auditData, setAuditData] = useState({});
  const { auditId } = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [signatureType, setSignatureType] = useState('');
  const [selImage, setSelImage] = useState('');
  const [previewImage, setPreviewImage] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super-admin';

  /* Load current audit */
  useEffect(() => {
    setLoading(true);
    getAuditV2(auditId).then((res) => {
      setAuditData(res.data);
      setAudio(res.data?.audioRecord);
      setComment(res.data?.comment || '');
      if (res.data?.audioRecord) setIsModalOpen(false);
      setSignature(res.data?.signature);
      setLoading(false);
    }).catch((err) => {
      toast.error("Failed to load audit");
      setLoading(false);
    });
  }, [auditId]);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]); let n = bstr.length; const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new File([u8], filename, { type: mime });
  };

  const handleSaveSignature = async () => {
    const blob = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
    const file = dataURLtoFile(blob, `${name}_signature.png`);
    const fd = new FormData();
    fd.append('signatureFile', file);
    fd.append('signaturedBy', signatureType);
    fd.append('signaturedName', name);
    fd.append('comment', comment);
    try {
      const res = await sendSignatureToBackendV2(auditId, fd);
      if (res) { navigate('/audit'); toast.success(res.message); }
      else toast.error('Failed to save signature');
    } catch { toast.error('Error saving signature'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 -m-5">

      {/* ── Start Modal ─────────────────────────────────────── */}
      {!isSuperAdmin && isModalOpen && !audio && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-3">Before You Begin</p>
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Once you start the audio recording, you won't be able to go back. Make sure you're ready before proceeding.
            </p>
            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                onClick={() => { setIsModalOpen(false); navigate(-1); }}>Cancel</button>
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                onClick={() => { setIsRecording(true); setIsModalOpen(false); }}>Start Recording</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Sticky Top Bar ──────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-white shadow-sm">
        <div className=" mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <h1 className="text-lg font-bold text-slate-800 flex-1">Audit Report (V2)</h1>
          <span className="text-sm text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg hidden sm:block">{fmt(auditData?.auditDate)}</span>

          {auditData?.status === "completed" && (
            <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1.5 rounded-lg">Completed</span>
          )}

          {!audio && !isSuperAdmin && (
            <RecordingControls isRecording={isRecording} setIsRecording={setIsRecording} />
          )}
        </div>
      </div>

      {/* ── Main Body ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto flex flex-col gap-5 mt-6 px-4 pb-12">

        {/* Rating Summary */}
        {auditData?.status === 'completed' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center bg-red-50 border-2 border-red-100 rounded-xl p-5 flex flex-col justify-center items-center">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Overall Rating</p>
              <p className="text-5xl font-black text-red-600 leading-none">
                {auditData?.overallRating || auditData?.rating || 0}<span className="text-xl text-slate-400">/5</span>
              </p>
              <p className="text-xs font-extrabold text-red-700 uppercase mt-2 bg-red-100 px-3 py-1 rounded-full">
                Grade: {auditData?.overallGrade || 'N/A'}
              </p>
              <p className="text-xs font-bold text-red-400 uppercase mt-2">
                {auditData?.finalPercentage?.toFixed(2)}%
              </p>
            </div>

            <div className="flex flex-col justify-center bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Audit Details</p>
              <p className="text-sm text-slate-700 mt-2"><b>Shop:</b> {auditData?.shop?.shopName}</p>
              <p className="text-sm text-slate-700"><b>Auditor:</b> {auditData?.auditor?.name}</p>
              <p className="text-sm text-slate-700"><b>Config:</b> {auditData?.configName}</p>
              <p className="text-sm text-slate-700"><b>Date:</b> {fmt(auditData?.auditDate)}</p>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-5 flex flex-col justify-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Calculations Summary</p>
              <div className="text-xs text-slate-600 mt-2 flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span>Score Sum:</span>
                  <span className="font-semibold text-slate-800">
                    {auditData?.sections?.reduce((acc, sec) => acc + (sec.obtainedScore || 0), 0)} / {auditData?.sections?.reduce((acc, sec) => acc + (sec.totalScore || 0), 0)} pts
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Weighted Sum:</span>
                  <span className="font-semibold text-slate-800">
                    {auditData?.finalPercentage?.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Overall Rating:</span>
                  <span className="font-semibold text-slate-800">
                    ({auditData?.finalPercentage?.toFixed(2)}% / 100) * 5 = {auditData?.overallRating || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Score Calculation Details */}
        {auditData?.status === 'completed' && (
          <SectionCard title="Score Calculation Details" defaultOpen={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Section Name</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Raw Score</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Percentage</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Weightage</th>
                    <th className="py-3 px-4 text-xs font-bold text-slate-400 uppercase tracking-wide">Weighted Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditData?.sections?.map((sec, idx) => {
                    const obtained = Number(sec.obtainedScore) || 0;
                    const total = Number(sec.totalScore) || 0;
                    const perc = Number(sec.percentage) || 0;
                    const wt = Number(sec.weightage) || 0;
                    const weighted = Number(sec.weightedScore) || 0;

                    return (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-sm font-semibold text-slate-700">{sec.sectionName}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{obtained} / {total} pts</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{perc.toFixed(2)}%</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{wt}%</td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-800">{weighted.toFixed(2)}%</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200">
                    <td className="py-3 px-4 text-sm text-slate-800">Total / Overall</td>
                    <td className="py-3 px-4 text-sm text-slate-800">
                      {auditData?.sections?.reduce((sum, s) => sum + (s.obtainedScore || 0), 0)} / {auditData?.sections?.reduce((sum, s) => sum + (s.totalScore || 0), 0)} pts
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-800">—</td>
                    <td className="py-3 px-4 text-sm text-slate-800">
                      {auditData?.sections?.reduce((sum, s) => sum + (s.weightage || 0), 0)}%
                    </td>
                    <td className="py-3 px-4 text-sm font-extrabold text-red-600">
                      {auditData?.finalPercentage?.toFixed(2)}%
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SectionCard>
        )}

        {/* ── Dynamic V2 Sections ── */}
        {auditData?.sections?.map((sec, idx) => {
          if (sec.isRepeatable && sec.rows && sec.rows.length > 0) {
            return (
              <SectionCard key={idx} title={`${sec.sectionName} (Repeatable - ${sec.rows.length} Items)`} defaultOpen={true}>
                <div className="flex flex-col gap-4 p-4">
                  {sec.rows.map((row, rIdx) => {
                    const rowScalarFields = (row.fields || []).filter(f => !['single_image', 'multi_image'].includes(f.type) || f.isAvailable === 'no');
                    const rowImgFields = (row.fields || []).filter(f => ['single_image', 'multi_image'].includes(f.type) && f.pictures?.length > 0);

                    return (
                      <div key={rIdx} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200">
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Item #{rIdx + 1}
                          </span>
                        </div>
                        {rowScalarFields.length > 0 && (
                          <table className="w-full bg-white">
                            <TableHead />
                            <tbody className="divide-y divide-slate-100">
                              {rowScalarFields.map(f => (
                                <FieldRow key={f.key} field={f} />
                              ))}
                            </tbody>
                          </table>
                        )}
                        {rowImgFields.map(f => (
                          <div key={f.key} className="border-t border-slate-100 bg-white">
                            <div className="px-4 py-2 bg-slate-50">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{f.label}</span>
                            </div>
                            <ImageStrip images={f.pictures} setPreview={setPreviewImage} setSelImage={setSelImage} />
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            );
          }

          // Separate scalar fields from images
          const fields = sec.fields || [];
          const scalarFields = fields.filter(f => !['single_image', 'multi_image'].includes(f.type) || f.isAvailable === 'no');
          const imgFields = fields.filter(f => ['single_image', 'multi_image'].includes(f.type) && f.pictures?.length > 0);

          let obtained = 0;
          let total = 0;
          fields.forEach((f) => {
            obtained += Number(f.obtainedPoints) || 0;
            total += Number(f.maxPoints) || 0;
          });
          const perc = total > 0 ? (obtained / total) * 100 : 0;

          return (
            <SectionCard key={idx} title={`${sec.sectionName} (${perc.toFixed(0)}%)`} defaultOpen={true}>
              {scalarFields.length > 0 && (
                <table className="w-full">
                  <TableHead />
                  <tbody className="divide-y divide-slate-100">
                    {scalarFields.map(f => (
                      <FieldRow key={f.key} field={f} />
                    ))}
                  </tbody>
                </table>
              )}
              {imgFields.map(f => (
                <div key={f.key} className="border-t border-slate-100">
                  <div className="px-4 py-2 bg-slate-50">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{f.label}</span>
                  </div>
                  <ImageStrip images={f.pictures} setPreview={setPreviewImage} setSelImage={setSelImage} />
                </div>
              ))}
            </SectionCard>
          );
        })}

        {/* ── Summary / Remark ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-800">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Summary</span>
          </div>
          <div className="p-5 flex flex-col">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Final Remark</p>
            {!isSuperAdmin && auditData?.comment === '' ? (
              <input
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-400 transition-colors"
                placeholder="Enter remark…"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            ) : (
              <p className="text-sm text-slate-700">{auditData?.comment || '—'}</p>
            )}
          </div>
        </div>

        {/* ── Audio ── */}
        {audio && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-800">
              <span className="text-xs font-bold uppercase tracking-widest text-white">Audio Report</span>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-400 mb-3">Recorded on {fmt(audio.date)}</p>
              <audio className="w-full rounded-lg" controls>
                <source src={audio.recordUrl} type="audio/wav" />
              </audio>
            </div>
          </div>
        )}

        {/* ── Signature ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-800">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Signature</span>
          </div>
          <div className="p-5">
            {!signature && !isSuperAdmin && (
              <div className="flex flex-col gap-4">
                <input
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 transition-colors"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
                <select
                  className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-red-400 bg-white transition-colors"
                  value={signatureType}
                  onChange={e => setSignatureType(e.target.value)}
                >
                  <option value="">— Select signatory —</option>
                  <option value="owner">Owner</option>
                  <option value="employee">Employee</option>
                </select>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Draw Signature</p>
                  <SignatureCanvas
                    ref={signatureRef}
                    penColor="#0F172A"
                    canvasProps={{ className: 'border-2 border-dashed border-slate-200 rounded-xl w-full h-32 cursor-crosshair hover:border-red-300 transition-colors' }}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                    onClick={() => signatureRef.current.clear()}
                  >Clear</button>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                    onClick={handleSaveSignature}
                  >Save & Submit</button>
                </div>
              </div>
            )}
            {!signature && isSuperAdmin && (
              <p className="text-sm text-slate-500 italic text-center py-4">No signature has been collected for this audit yet.</p>
            )}
            {signature && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  {auditData?.signaturedName}{' '}
                  <span className="text-slate-400 font-normal">({auditData?.signaturedBy})</span>
                </p>
                <img src={signature} alt="Signature" className="border border-slate-200 rounded-xl max-w-full" />
              </div>
            )}
          </div>
        </div>

      </div>

      {previewImage && <PreviewImage image={selImage} setPreview={setPreviewImage} />}
    </div>
  );
};

export default AuditReportV2;

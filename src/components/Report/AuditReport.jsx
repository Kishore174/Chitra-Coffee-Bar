import React, { useRef, useState, useEffect } from 'react';
import { BsFillMicFill, BsStopFill } from 'react-icons/bs';
import SignatureCanvas from 'react-signature-canvas';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getAudit, getPrevious } from '../../API/audits';
import { sendSignatureToBackend, uploadAudioToBackend } from '../../API/Api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthProvider';
import Loader from '../Loader';
import { XMarkIcon, ChevronDownIcon, ChevronUpIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

/* ─── Helpers ─────────────────────────────────────────────── */
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const cap = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).replace(/([A-Z])/g, ' $1') : '';

const RATING_FIELDS = new Set(['rating', 'quality', 'sugarLevel', 'temperature']);

function diffStatus(field, cur, prv) {
  if (prv === undefined || prv === null) return 'neutral';
  const cs = String(cur ?? ''), ps = String(prv ?? '');
  if (cs === ps) return 'same';
  if (RATING_FIELDS.has(field) && !isNaN(parseFloat(cs)) && !isNaN(parseFloat(ps)))
    return parseFloat(cs) > parseFloat(ps) ? 'better' : 'worse';
  return 'changed';
}

const ROW_BG   = { same: '', better: 'bg-green-50', worse: 'bg-red-50',   changed: 'bg-amber-50', neutral: '' };
const BADGE_CL = { better: 'bg-green-100 text-green-700', worse: 'bg-red-100 text-red-700', changed: 'bg-amber-100 text-amber-700' };
const BADGE_TX = { better: '↑ Better', worse: '↓ Worse', changed: 'Changed' };
const L_BORDER = { better: 'border-l-4 border-green-400', worse: 'border-l-4 border-red-400', changed: 'border-l-4 border-amber-400', same: 'border-l-4 border-transparent', neutral: 'border-l-4 border-transparent' };

/* ─── extract scalar value ───────────────────────────────── */
const extractVal = (v) => {
  if (v == null) return '—';
  if (Array.isArray(v)) return `${v.length} image(s)`;
  if (typeof v === 'object') {
    if (v.status != null) return String(v.status);
    if (v.remark != null) return String(v.remark);
    const first = Object.entries(v).find(([k, val]) => k !== '_id' && k !== 'captureImages' && typeof val !== 'object');
    return first ? String(first[1]) : '—';
  }
  return String(v);
};

/* ─── CompareField row ───────────────────────────────────── */
const CompareField = ({ label, curVal, prvVal, hasPrev }) => {
  const cur = extractVal(curVal);
  const prv = extractVal(prvVal);
  const fieldKey = label.toLowerCase().replace(/ /g, '');
  const status = hasPrev ? diffStatus(fieldKey, cur, prv) : 'neutral';

  return (
    <tr className={`${ROW_BG[status]} transition-colors duration-150`}>
      <td className={`py-3 px-4 w-1/4 ${L_BORDER[status]}`}>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-medium ${
            status === 'better' ? 'text-green-700' : status === 'worse' ? 'text-red-700' : 'text-slate-800'
          }`}>{cur}</span>
          {status !== 'same' && status !== 'neutral' && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${BADGE_CL[status]}`}>
              {BADGE_TX[status]}
            </span>
          )}
        </div>
      </td>
      {hasPrev && (
        <td className="py-3 px-4">
          <span className="text-sm text-slate-400">{prv}</span>
        </td>
      )}
    </tr>
  );
};

/* ─── Table header row ───────────────────────────────────── */
const TableHead = ({ hasPrev }) => (
  <thead>
    <tr className="bg-slate-50 border-b border-slate-200">
      <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-4 py-3 w-1/4">Field</th>
      <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-4 py-3">Current</th>
      {hasPrev && <th className="text-left text-xs font-bold text-slate-400 uppercase tracking-wide px-4 py-3">Previous</th>}
    </tr>
  </thead>
);

/* ─── Section Card wrapper ───────────────────────────────── */
const SectionCard = ({ title, changeCount = 0, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white"
      >
        <span className="text-xs font-bold uppercase tracking-widest">{title}</span>
        <div className="flex items-center gap-2">
          {changeCount > 0 && (
            <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {changeCount} change{changeCount > 1 ? 's' : ''}
            </span>
          )}
          {open ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
        </div>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

/* ─── Count changes in a flat fields list ─────────────────── */
const countChanges = (fields, curData, prvData) =>
  fields.filter(f => {
    const c = extractVal(curData?.[f]), p = extractVal(prvData?.[f]);
    return c !== p;
  }).length;

/* ─── Image strip ─────────────────────────────────────────── */
const ImageStrip = ({ images, setPreview, setSelImage }) => {
  if (!images?.length) return null;
  return (
    <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-slate-100">
      {images.map((img, i) => (
        <img key={i} src={img.imageUrl} alt=""
          className="w-14 h-14 object-cover rounded-lg border border-slate-200 cursor-pointer hover:scale-105 hover:border-red-400 transition-all"
          onClick={() => { setSelImage?.(img.imageUrl); setPreview?.(true); }}
        />
      ))}
    </div>
  );
};

/* ─── Generic AuditSection ────────────────────────────────── */
const AuditSection = ({ title, data, prevData, fields, hasPrev, setPreview, setSelImage }) => {
  // Separate flat fields from nested-object fields from image-array fields
  const flatFields   = fields.filter(f => { const v = data?.[f]; return !Array.isArray(v) && (typeof v !== 'object' || v === null); });
  const imgFields    = fields.filter(f => Array.isArray(data?.[f]));
  const nestedFields = fields.filter(f => { const v = data?.[f]; return typeof v === 'object' && v !== null && !Array.isArray(v); });

  const changes = hasPrev ? countChanges(flatFields, data, prevData) : 0;

  return (
    <SectionCard title={title} changeCount={changes}>
      {/* Flat fields table */}
      {flatFields.length > 0 && (
        <table className="w-full">
          <TableHead hasPrev={hasPrev} />
          <tbody className="divide-y divide-slate-100">
            {flatFields.map(f => (
              <CompareField key={f} label={cap(f)} curVal={data?.[f]} prvVal={prevData?.[f]} hasPrev={hasPrev} />
            ))}
          </tbody>
        </table>
      )}

      {/* Nested object fields */}
      {nestedFields.map(f => {
        const cur  = data?.[f]    ?? {};
        const prv  = prevData?.[f] ?? {};
        const sub  = Object.keys(cur).filter(k => k !== '_id' && k !== 'captureImages');
        const imgs = cur.captureImages || [];
        const nc   = hasPrev ? countChanges(sub, cur, prv) : 0;
        return (
          <div key={f} className="border-t border-slate-100">
            <div className="px-4 py-2 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {f === 'juiceBar' ? 'Juice Counter' : f === 'snackCounter' ? 'Showcase Rack' : cap(f)}
              </span>
              {nc > 0 && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{nc} change{nc > 1 ? 's' : ''}</span>}
            </div>
            <table className="w-full">
              <TableHead hasPrev={hasPrev} />
              <tbody className="divide-y divide-slate-100">
                {sub.map(k => <CompareField key={k} label={cap(k)} curVal={cur[k]} prvVal={prv[k]} hasPrev={hasPrev} />)}
              </tbody>
            </table>
            {imgs.length > 0 && <ImageStrip images={imgs} setPreview={setPreview} setSelImage={setSelImage} />}
          </div>
        );
      })}

      {/* Top-level image arrays */}
      {imgFields.map(f => (
        <div key={f} className="border-t border-slate-100">
          <div className="px-4 py-2 bg-slate-50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{cap(f)}</span>
          </div>
          <ImageStrip images={data[f]} setPreview={setPreview} setSelImage={setSelImage} />
        </div>
      ))}
    </SectionCard>
  );
};

/* ─── Live Snacks Section ─────────────────────────────────── */
const LiveSnacksSection = ({ cur, prv, hasPrev, setPreview, setSelImage }) => {
  const fields = ['remark', 'rating'];
  const changes = hasPrev ? countChanges(fields, cur, prv) : 0;
  return (
    <SectionCard title="Live Snacks" changeCount={changes}>
      {/* Snack pills */}
      <div className="px-4 py-3 flex flex-wrap gap-2 border-b border-slate-100">
        {cur?.snacks?.map((s, i) => (
          <span key={i} className="text-xs bg-red-50 text-red-700 border border-red-100 rounded-full px-3 py-1 font-medium">
            {s.snack?.name || 'Unknown'} — {s.status}
          </span>
        ))}
        {!cur?.snacks?.length && <span className="text-xs text-slate-400">No snacks recorded</span>}
      </div>
      <table className="w-full">
        <TableHead hasPrev={hasPrev} />
        <tbody className="divide-y divide-slate-100">
          {fields.map(f => <CompareField key={f} label={cap(f)} curVal={cur?.[f]} prvVal={prv?.[f]} hasPrev={hasPrev} />)}
        </tbody>
      </table>
      <ImageStrip images={cur?.captureImages} setPreview={setPreview} setSelImage={setSelImage} />
    </SectionCard>
  );
};

/* ─── Bakery Products Section ─────────────────────────────── */
const BakeryProductsSection = ({ products, setPreview, setSelImage }) => {
  const grouped = (products || []).reduce((acc, p) => {
    const brand = p?.product?.brand?.name || p.brandName || 'Unknown Brand';
    (acc[brand] = acc[brand] || []).push(p);
    return acc;
  }, {});
  return (
    <SectionCard title="Bakery Products">
      <div className="p-4 flex flex-col gap-4">
        {Object.entries(grouped).map(([brand, items]) => (
          <div key={brand}>
            <p className="text-xs font-bold text-red-600 uppercase tracking-widest mb-2">{brand}</p>
            {items.map((p, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-3 mb-2 border border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
                  <div><p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Product</p><p className="text-sm font-medium">{p.productName || p?.product?.name || '—'}</p></div>
                  <div><p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Qty</p><p className="text-sm font-medium">{p.quantity}</p></div>
                  {!p.productName && <div><p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Expiry</p><p className="text-sm font-medium">{fmt(p.expiryDate)}</p></div>}
                  {p.reason && <div><p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Reason</p><p className="text-sm font-medium">{p.reason}</p></div>}
                </div>
                <ImageStrip images={p.captureImages} setPreview={setPreview} setSelImage={setSelImage} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionCard>
  );
};

/* ─── Rating Delta Pill ───────────────────────────────────── */
const RatingDelta = ({ cur, prv }) => {
  if (!prv) return null;
  const delta = (parseFloat(cur) - parseFloat(prv)).toFixed(1);
  const up = parseFloat(delta) > 0, down = parseFloat(delta) < 0;
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${up ? 'bg-green-100 text-green-700' : down ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
      {up ? `↑ +${delta}` : down ? `↓ ${delta}` : '→ No change'} vs prev
    </span>
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
    uploadAudioToBackend(auditId, audioBlob)
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
const AuditReport = () => {
  const [name, setName]               = useState('');
  const [comment, setComment]         = useState('');
  const [signature, setSignature]     = useState(null);
  const signatureRef                  = useRef({});
  const [auditData, setAuditData]     = useState({});
  const [prevAudit, setPrevAudit]     = useState(null);
  const [prevList, setPrevList]       = useState([]);
  const [selectedPrevId, setSelectedPrevId] = useState('');
  const { auditId }                   = useParams();
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio]             = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [loading, setLoading]         = useState(false);
  const [loadingPrev, setLoadingPrev] = useState(false);
  const [signatureType, setSignatureType] = useState('');
  const [selImage, setSelImage]       = useState('');
  const [previewImage, setPreviewImage] = useState(false);
  const [showPrevList, setShowPrevList] = useState(false);
  const navigate                      = useNavigate();
  const { user }                      = useAuth();
  const isSuperAdmin                  = user?.role === 'super-admin';

  /* Load current audit + previous list */
  useEffect(() => {
    setLoading(true);
    Promise.all([getAudit(auditId), getPrevious(auditId)]).then(([cur, prev]) => {
      setAuditData(cur.data);
      setAudio(cur.data?.audioRecord);
      setComment(cur.data?.comment || '');
      if (cur.data?.audioRecord) setIsModalOpen(false);
      setSignature(cur.data?.signature);
      const list = (prev.data || []).filter(p => p._id !== auditId).slice(0, 5);
      setPrevList(list);
      if (list.length > 0) setSelectedPrevId(list[0]._id);
      setLoading(false);
    });
  }, [auditId]);

  /* Load selected previous audit */
  useEffect(() => {
    if (!selectedPrevId) { setPrevAudit(null); return; }
    setLoadingPrev(true);
    getAudit(selectedPrevId).then(res => { setPrevAudit(res.data); setLoadingPrev(false); });
  }, [selectedPrevId]);

  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]); let n = bstr.length; const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new File([u8], filename, { type: mime });
  };

  const handleSaveSignature = async () => {
    const blob = signatureRef.current.getTrimmedCanvas().toDataURL('image/png');
    const file = dataURLtoFile(blob, `${name}_signature.png`);
    const fd   = new FormData();
    fd.append('signatureFile', file);
    fd.append('signaturedBy', signatureType);
    fd.append('signaturedName', name);
    fd.append('comment', comment);
    try {
      const res = await sendSignatureToBackend(auditId, fd);
      if (res) { navigate('/audit'); toast.success(res.message); }
      else toast.error('Failed to save signature');
    } catch { toast.error('Error saving signature'); }
  };

  if (loading) return <Loader />;

  const hasPrev = !!prevAudit && !loadingPrev;

  return (
    <div className="min-h-screen bg-slate-50 -m-5">

      {/* ── Start Modal ─────────────────────────────────────── */}
      {!isSuperAdmin && isModalOpen && (
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
      <div className="sticky top-0 z-40 bg-white">
        <div className=" mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
          <h1 className="text-lg font-bold text-slate-800 flex-1">Audit Report</h1>
          <span className="text-sm text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg hidden sm:block">{fmt(auditData?.auditDate)}</span>

          {/* Previous audit selector */}
          {prevList.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:block">Compare:</span>
              <select
                value={selectedPrevId}
                onChange={e => setSelectedPrevId(e.target.value)}
                className="text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:border-red-400 cursor-pointer"
              >
                <option value="">— No comparison —</option>
                {prevList.map(p => (
                  <option key={p._id} value={p._id}>{fmt(p.auditDate)} · {p.rating}/5</option>
                ))}
              </select>
            </div>
          )}

          {!audio && !isSuperAdmin && (
            <RecordingControls isRecording={isRecording} setIsRecording={setIsRecording} />
          )}
        </div>

        {/* Comparison legend strip */}
        {hasPrev && (
          <div className=" px-4 py-2">
            <div className="max-w-5xl mx-auto flex items-center gap-4 flex-wrap">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Legend:</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-700"><span className="w-2 h-2 rounded-full bg-green-400" />Better</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-red-700"><span className="w-2 h-2 rounded-full bg-red-400" />Worse</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-amber-700"><span className="w-2 h-2 rounded-full bg-amber-400" />Changed</span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-300" />No change</span>
              <span className="ml-auto text-xs text-slate-400">
                vs <strong className="text-slate-600">{fmt(prevAudit?.auditDate)}</strong>
                {prevAudit?.auditor?.name && <> · {prevAudit.auditor.name}</>}
              </span>
            </div>
          </div>
        )}
        {loadingPrev && (
          <div className="border-t border-slate-100 bg-amber-50 px-4 py-2 text-center text-xs text-amber-600 font-semibold">
            Loading previous audit…
          </div>
        )}
      </div>

      {/* ── Main Body ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto flex flex-col gap-5">

        {/* Rating Summary */}
        {hasPrev && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 grid grid-cols-2 gap-4">
            <div className="text-center bg-red-50 border-2 border-red-100 rounded-xl p-5">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Current Audit</p>
              <p className="text-5xl font-black text-red-600 leading-none">
                {auditData?.rating}<span className="text-xl text-slate-400">/5</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">{fmt(auditData?.auditDate)}</p>
              <div className="flex justify-center mt-3">
                <RatingDelta cur={auditData?.rating} prv={prevAudit?.rating} />
              </div>
            </div>
            <div className="text-center bg-slate-50 border-2 border-slate-200 rounded-xl p-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Previous Audit</p>
              <p className="text-5xl font-black text-slate-300 leading-none">
                {prevAudit?.rating}<span className="text-xl text-slate-200">/5</span>
              </p>
              <p className="text-xs text-slate-400 mt-2">{fmt(prevAudit?.auditDate)}</p>
              <p className="text-xs text-slate-400 mt-1">Auditor: {prevAudit?.auditor?.name || 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Previous Audits Accordion */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <button onClick={() => setShowPrevList(v => !v)}
            className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white">
            <span className="text-xs font-bold uppercase tracking-widest">Previous Audits (Last 5)</span>
            {showPrevList ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </button>
          {showPrevList && (
            <div className="divide-y divide-slate-100">
              {prevList.length === 0 && <p className="px-5 py-4 text-sm text-slate-400">No previous audits found.</p>}
              {prevList.map(prev => (
                <div key={prev._id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{fmt(prev.auditDate)}</p>
                    <p className="text-xs text-slate-400">Auditor: {prev.auditor?.name || 'N/A'}</p>
                    {prev.comment && <p className="text-xs text-slate-500 mt-0.5">Remark: {prev.comment}</p>}
                    <Link to={`/report/${prev._id}`} className="text-xs text-red-500 hover:text-red-700 mt-1 inline-block font-medium">
                      View Full Report →
                    </Link>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    {prev.status === 'completed' && <span className="text-sm font-bold text-amber-600">⭐ {prev.rating}/5</span>}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
                      prev.status === 'completed'   ? 'bg-green-100 text-green-700' :
                      prev.status === 'in progress' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>{prev.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── All Audit Sections ── */}
        <AuditSection title="Shop Information"
          data={auditData?.shop} prevData={prevAudit?.shop}
          fields={['shopName', 'ownerName', 'phone', 'email', 'address', 'location']}
          hasPrev={hasPrev} />

        <AuditSection title="Tea Audit"
          data={auditData?.teaAudit} prevData={prevAudit?.teaAudit}
          fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating', 'captureImages']}
          hasPrev={hasPrev} setPreview={setPreviewImage} setSelImage={setSelImage} />

        <AuditSection title="Coffee Audit"
          data={auditData?.coffeeAudit} prevData={prevAudit?.coffeeAudit}
          fields={['quality', 'color', 'sugarLevel', 'temperature', 'aroma', 'taste', 'remark', 'rating', 'captureImages']}
          hasPrev={hasPrev} setPreview={setPreviewImage} setSelImage={setSelImage} />

        <LiveSnacksSection
          cur={auditData?.liveSnacks} prv={prevAudit?.liveSnacks}
          hasPrev={hasPrev} setPreview={setPreviewImage} setSelImage={setSelImage} />

        {auditData?.bakeryProducts?.length > 0 && (
          <BakeryProductsSection products={auditData.bakeryProducts} setPreview={setPreviewImage} setSelImage={setSelImage} />
        )}

        <AuditSection title="Inside Shop"
          data={auditData?.insideShop} prevData={prevAudit?.insideShop}
          fields={['dining', 'liveSnackDisplay', 'teaCounter', 'dustbin', 'frontView', 'handWash', 'hotCounter', 'iceCreamCounter', 'juiceBar', 'normalCounter', 'snackCounter']}
          hasPrev={hasPrev} setPreview={setPreviewImage} setSelImage={setSelImage} />

        <AuditSection title="Inside Kitchen"
          data={auditData?.insideKitchen} prevData={prevAudit?.insideKitchen}
          fields={['exhaustFan', 'grinder', 'kitchenFloor', 'kitchenLight', 'milkFreezer', 'sink', 'snackMaking', 'workTable']}
          hasPrev={hasPrev} setPreview={setPreviewImage} setSelImage={setSelImage} />

        <AuditSection title="Outside Shop"
          data={auditData?.outsideKitchen} prevData={prevAudit?.outsideKitchen}
          fields={['lollipopStandArea', 'shopBoard']}
          hasPrev={hasPrev} setPreview={setPreviewImage} setSelImage={setSelImage} />

        <AuditSection title="Wall Branding"
          data={auditData?.wallBranding} prevData={prevAudit?.wallBranding}
          fields={['map', 'menuBrand', 'bunzoSection', 'bakshanamSection', 'pillarBranding']}
          hasPrev={hasPrev} setPreview={setPreviewImage} setSelImage={setSelImage} />

        <AuditSection title="Interior"
          data={auditData?.painting} prevData={prevAudit?.painting}
          fields={['fan', 'light', 'celling', 'wallPainting', 'floorTail', 'remark', 'rating']}
          hasPrev={hasPrev} />

        <AuditSection title="Dress Code"
          data={auditData?.uniformSection} prevData={prevAudit?.uniformSection}
          fields={['cap', 'cort', 'gloves', 'apron']}
          hasPrev={hasPrev} />

        {/* ── Stock ── */}
        <SectionCard title="Stock">
          <ImageStrip images={auditData?.stock?.captureImages} setPreview={setPreviewImage} setSelImage={setSelImage} />
          <table className="w-full">
            <TableHead hasPrev={hasPrev} />
            <tbody className="divide-y divide-slate-100">
              <CompareField label="Remark"             curVal={auditData?.stock?.remark}            prvVal={prevAudit?.stock?.remark}            hasPrev={hasPrev} />
              <CompareField label="FIFO Followed"      curVal={auditData?.stock?.fifoFollowed}       prvVal={prevAudit?.stock?.fifoFollowed}       hasPrev={hasPrev} />
              <CompareField label="Critical Deviation" curVal={auditData?.stock?.criticalDeviation}  prvVal={prevAudit?.stock?.criticalDeviation}  hasPrev={hasPrev} />
            </tbody>
          </table>
        </SectionCard>

        {/* ── Employees ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-800">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Employees</span>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {auditData?.employees?.map((e, i) => (
              <div key={i} className="bg-red-50 border border-red-100 rounded-lg px-4 py-2">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wide">{e.area}</p>
                <p className="text-sm text-slate-600 mt-0.5">Count: {e.count}</p>
                <p className="text-xs text-slate-400">{e.names}</p>
              </div>
            ))}
            {!auditData?.employees?.length && <p className="text-sm text-slate-400">No employees recorded.</p>}
          </div>
        </div>

        {/* ── Summary ── */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-800">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Summary</span>
          </div>
          <div className="p-5 flex flex-wrap items-start gap-8">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Overall Rating</p>
              <div className="flex items-end gap-3">
                <span className="text-5xl font-black text-red-600 leading-none">{auditData?.rating}</span>
                <span className="text-xl text-slate-400 mb-1">/5</span>
                <div className="mb-1"><RatingDelta cur={auditData?.rating} prv={prevAudit?.rating} /></div>
              </div>
            </div>
            <div className="flex-1 min-w-48">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Remark</p>
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
              {hasPrev && prevAudit?.comment && (
                <p className="text-xs text-slate-400 mt-2 italic">
                  Previous: {prevAudit.comment}
                </p>
              )}
            </div>
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

export default AuditReport;
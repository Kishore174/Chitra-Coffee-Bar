import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { MdArrowBack } from "react-icons/md";
import { HiTrash } from "react-icons/hi";
import { getActiveAuditConfig } from "../../../../API/auditConfig";
import { getAuditV2, submitAuditV2 } from "../../../../API/auditV2";
import { getAudit } from "../../../../API/audits";
import Loader from "../../../Loader";
import { axiosintance } from "../../../../API/Api";

/* field types that actually contribute an obtained score */
const SCORED_TYPES = ["dropdown", "boolean", "rating", "number"];

const inputCls =
  "w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300";

/* default empty value for a freshly-initialised field */
const defaultValue = (type) => {
  if (type === "multi_image") return [];
  if (type === "single_image") return null;
  return "";
};

/* derive obtainedPoints from a field's current value */
const computeObtained = (field, value) => {
  switch (field.type) {
    case "dropdown":
    case "boolean": {
      const opt = (field.options || []).find((o) => o.value === value);
      return opt ? Number(opt.points) || 0 : 0;
    }
    case "rating":
    case "number": {
      const n = Number(value) || 0;
      return Math.min(Math.max(n, 0), Number(field.maxPoints) || 0);
    }
    default:
      return 0; // text / textarea / images are informational
  }
};

/* turn a config (or resumed audit) into an editable working copy */
const initSections = (sections, fromConfig) =>
  (sections || []).map((sec) => ({
    sectionName: sec.sectionName,
    sectionKey: sec.sectionKey,
    weightage: Number(sec.weightage) || 0,
    fields: (sec.fields || []).map((f) => ({
      label: f.label,
      key: f.key,
      type: f.type,
      required: !!f.required,
      maxPoints: Number(f.maxPoints) || 0,
      options: f.options || [],
      value: fromConfig ? defaultValue(f.type) : f.value ?? defaultValue(f.type),
      obtainedPoints: fromConfig ? 0 : Number(f.obtainedPoints) || 0,
      remarks: fromConfig ? "" : f.remarks || "",
      pictures: fromConfig ? [] : f.pictures || [], // already-uploaded urls
      _files: [], // newly selected File objects (not yet uploaded)
    })),
  }));

const PerformAuditV2 = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [shop, setShop] = useState(null);
  const [configName, setConfigName] = useState("");
  const [sections, setSections] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [auditRes, v2Res] = await Promise.all([
          getAudit(auditId),
          getAuditV2(auditId),
        ]);
        setShop(auditRes.data?.shop || null);

        if (v2Res.data && v2Res.data.sections?.length) {
          // resume an in-progress / completed audit
          setSections(initSections(v2Res.data.sections, false));
          setConfigName(v2Res.data.configName || "");
        } else {
          // start fresh from the active template
          const cfgRes = await getActiveAuditConfig();
          setSections(initSections(cfgRes.data.sections, true));
          setConfigName(cfgRes.data.name || "");
        }
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "No active audit config found"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [auditId]);

  /* ----------------------------- mutations ------------------------------ */
  const patchField = (si, fi, patch) =>
    setSections((prev) => {
      const next = [...prev];
      const fields = [...next[si].fields];
      fields[fi] = { ...fields[fi], ...patch };
      next[si] = { ...next[si], fields };
      return next;
    });

  const setValue = (si, fi, value) =>
    setSections((prev) => {
      const next = [...prev];
      const fields = [...next[si].fields];
      const field = { ...fields[fi], value };
      field.obtainedPoints = computeObtained(field, value);
      fields[fi] = field;
      next[si] = { ...next[si], fields };
      return next;
    });

  const addFiles = (si, fi, fileList) => {
    const incoming = Array.from(fileList || []);
    if (!incoming.length) return;
    const field = sections[si].fields[fi];
    const _files =
      field.type === "single_image"
        ? incoming.slice(0, 1)
        : [...field._files, ...incoming];
    patchField(si, fi, { _files });
  };

  const removeNewFile = (si, fi, idx) => {
    const _files = sections[si].fields[fi]._files.filter((_, i) => i !== idx);
    patchField(si, fi, { _files });
  };

  const removeExistingPic = (si, fi, idx) => {
    const pictures = sections[si].fields[fi].pictures.filter((_, i) => i !== idx);
    patchField(si, fi, { pictures });
  };

  /* --------------------------- live scoring ----------------------------- */
  const scored = sections.map((sec) => {
    let obtained = 0;
    let total = 0;
    sec.fields.forEach((f) => {
      obtained += Number(f.obtainedPoints) || 0;
      total += Number(f.maxPoints) || 0;
    });
    const percentage = total > 0 ? (obtained / total) * 100 : 0;
    const weightedScore = (percentage * sec.weightage) / 100;
    return { obtained, total, percentage, weightedScore };
  });
  const finalPercentage = scored.reduce((s, x) => s + x.weightedScore, 0);

  /* ------------------------------ submit -------------------------------- */
  const handleSubmit = async () => {
    // required-field validation
    for (const sec of sections) {
      for (const f of sec.fields) {
        if (!f.required) continue;
        const empty =
          f.value === "" ||
          f.value === null ||
          (Array.isArray(f.value) && f.value.length === 0);
        const noImage =
          (f.type === "single_image" || f.type === "multi_image") &&
          !f._files.length &&
          !f.pictures.length;
        if ((SCORED_TYPES.includes(f.type) && empty) || (f.type.includes("image") && noImage) || (["text", "textarea"].includes(f.type) && empty)) {
          toast.error(`"${f.label}" in ${sec.sectionName} is required`);
          return;
        }
      }
    }

    setSubmitting(true);
    setProgress(0);
    try {
      // strip File objects out of the JSON payload; collect them separately
      const files = [];
      const payloadSections = sections.map((sec) => ({
        sectionName: sec.sectionName,
        sectionKey: sec.sectionKey,
        weightage: sec.weightage,
        fields: sec.fields.map((f) => {
          (f._files || []).forEach((file) => files.push({ key: f.key, file }));
          const rest = { ...f };
          delete rest._files;
          return rest;
        }),
      }));

      await submitAuditV2(
        auditId,
        { sections: payloadSections, configName },
        files,
        setProgress
      );
      toast.success("Audit saved");
      navigate(`/report-v2/${auditId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  if (!sections.length) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-500">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-700 hover:text-red-600 mb-6"
        >
          <MdArrowBack className="w-5 h-5" /> Back
        </button>
        No active audit config found. Create and activate one under Settings →
        Audit Config.
      </div>
    );
  }

  /* ------------------------------ render -------------------------------- */
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-gray-700 hover:text-red-600"
        >
          <MdArrowBack className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-sm md:text-lg font-medium">Back</span>
        </button>
        <span className="text-sm font-medium px-3 py-1 rounded bg-green-100 text-green-700">
          Score: {finalPercentage.toFixed(2)}%
        </span>
      </div>

      <div className="mb-4">
        <h1 className="text-lg md:text-xl font-semibold capitalize">
          {shop?.shopName || "Audit"}
        </h1>
        {configName && (
          <p className="text-xs text-gray-500">Template: {configName}</p>
        )}
      </div>

      {/* sections */}
      {sections.map((sec, si) => (
        <div
          key={si}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-800">{sec.sectionName}</h2>
            <span className="text-xs text-gray-500">
              {scored[si].obtained}/{scored[si].total} pts ·{" "}
              {scored[si].percentage.toFixed(0)}% · weight {sec.weightage}%
            </span>
          </div>

          {sec.fields.map((f, fi) => (
            <div
              key={fi}
              className="bg-white border border-gray-200 rounded-lg p-3 mb-3"
            >
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {f.label}
                {f.required && <span className="text-red-500"> *</span>}
                {SCORED_TYPES.includes(f.type) && (
                  <span className="ml-2 text-xs text-gray-400">
                    ({f.obtainedPoints}/{f.maxPoints})
                  </span>
                )}
              </label>

              <FieldInput
                field={f}
                onValue={(v) => setValue(si, fi, v)}
                onFiles={(list) => addFiles(si, fi, list)}
                onRemoveNewFile={(idx) => removeNewFile(si, fi, idx)}
                onRemoveExistingPic={(idx) => removeExistingPic(si, fi, idx)}
              />

              {/* per-field remark */}
              <input
                className={`${inputCls} mt-2`}
                placeholder="Remark (optional)"
                value={f.remarks}
                onChange={(e) => patchField(si, fi, { remarks: e.target.value })}
              />
            </div>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full px-4 py-2 rounded bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-60"
      >
        {submitting
          ? progress > 0 && progress < 100
            ? `Uploading ${progress}%`
            : "Saving..."
          : "Submit Audit"}
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                         single field renderer                              */
/* -------------------------------------------------------------------------- */
const FieldInput = ({
  field,
  onValue,
  onFiles,
  onRemoveNewFile,
  onRemoveExistingPic,
}) => {
  const [apiOptions, setApiOptions] = useState([]);
  const [loadingApi, setLoadingApi] = useState(false);

  useEffect(() => {
    if (field.type === "api_dropdown" && field.apiEndpoint) {
      setLoadingApi(true);
      axiosintance.get(field.apiEndpoint)
        .then((res) => {
          if (res.data?.data && Array.isArray(res.data.data)) {
            // Assume the endpoint returns an array of objects with a 'name' field
            setApiOptions(res.data.data.map(item => ({
              label: item.name || item.title || "Unnamed Option",
              value: item.name || item.title || item._id,
              points: field.maxPoints || 0
            })));
          }
        })
        .catch((err) => console.error("Failed to fetch API dropdown options", err))
        .finally(() => setLoadingApi(false));
    }
  }, [field.type, field.apiEndpoint, field.maxPoints]);

  switch (field.type) {
    case "textarea":
      return (
        <textarea
          className={inputCls}
          rows={3}
          value={field.value || ""}
          onChange={(e) => onValue(e.target.value)}
        />
      );

    case "number":
    case "rating":
      return (
        <input
          type="number"
          min="0"
          max={field.maxPoints}
          className={inputCls}
          value={field.value}
          onChange={(e) => onValue(e.target.value)}
        />
      );

    case "dropdown":
    case "boolean":
      return (
        <select
          className={inputCls}
          value={field.value || ""}
          onChange={(e) => onValue(e.target.value)}
        >
          <option value="">Select…</option>
          {(field.options || []).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label} ({o.points} pts)
            </option>
          ))}
        </select>
      );

    case "api_dropdown":
      return (
        <select
          className={inputCls}
          value={field.value || ""}
          onChange={(e) => onValue(e.target.value)}
          disabled={loadingApi}
        >
          <option value="">{loadingApi ? "Loading..." : "Select…"}</option>
          {apiOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label} ({o.points} pts)
            </option>
          ))}
        </select>
      );

    case "date":
      return (
        <input
          type="date"
          className={inputCls}
          value={field.value || ""}
          onChange={(e) => onValue(e.target.value)}
        />
      );

    case "single_image":
    case "multi_image":
      return (
        <div>
          <input
            type="file"
            accept="image/*"
            multiple={field.type === "multi_image"}
            onChange={(e) => onFiles(e.target.files)}
            className="text-sm"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {(field.pictures || []).map((p, idx) => (
              <Thumb
                key={`p${idx}`}
                src={p.url}
                onRemove={() => onRemoveExistingPic(idx)}
              />
            ))}
            {(field._files || []).map((file, idx) => (
              <Thumb
                key={`f${idx}`}
                src={URL.createObjectURL(file)}
                onRemove={() => onRemoveNewFile(idx)}
              />
            ))}
          </div>
        </div>
      );

    default: // text
      return (
        <input
          className={inputCls}
          value={field.value || ""}
          onChange={(e) => onValue(e.target.value)}
        />
      );
  }
};

const Thumb = ({ src, onRemove }) => (
  <div className="relative">
    <img
      src={src}
      alt=""
      className="h-16 w-16 object-cover rounded border border-gray-200"
    />
    <button
      type="button"
      onClick={onRemove}
      className="absolute -top-2 -right-2 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
    >
      <HiTrash size={12} />
    </button>
  </div>
);

export default PerformAuditV2;

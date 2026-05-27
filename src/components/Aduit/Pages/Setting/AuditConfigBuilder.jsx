import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { HiPlus, HiTrash, HiPencil, HiCheckCircle } from "react-icons/hi";
import {
  createAuditConfig,
  getAuditConfigs,
  updateAuditConfig,
  deleteAuditConfig,
  setActiveAuditConfig,
} from "../../../../API/auditConfig";

/* field types supported by the AuditV2 schema */
const FIELD_TYPES = [
  "text",
  "textarea",
  "number",
  "dropdown",
  "rating",
  "boolean",
  "single_image",
  "multi_image",
  "date",
  "api_dropdown",
  "multi_select",
];

const TYPES_WITH_OPTIONS = ["dropdown", "boolean", "multi_select"];

const slugify = (str = "") =>
  str
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const emptyOption = () => ({ label: "", value: "", points: 0 });

const emptyField = () => ({
  label: "",
  key: "",
  type: "dropdown",
  required: false,
  maxPoints: 5,
  apiEndpoint: "",
  options: [emptyOption()],
});

const emptySection = () => ({
  sectionName: "",
  sectionKey: "",
  weightage: 0,
  isRepeatable: false,
  fields: [],
});

const emptyConfig = () => ({
  _id: null,
  name: "",
  description: "",
  isActive: false,
  sections: [],
});

const inputCls =
  "w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300";

const AuditConfigBuilder = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState([]);
  const [view, setView] = useState("list"); // 'list' | 'editor'
  const [editing, setEditing] = useState(emptyConfig());
  const [saving, setSaving] = useState(false);

  const loadConfigs = async () => {
    try {
      const res = await getAuditConfigs();
      setConfigs(res.data || []);
    } catch (err) {
      toast.error("Failed to load configs");
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  /* ----------------------------- list actions ---------------------------- */
  const startNew = () => {
    setEditing(emptyConfig());
    setView("editor");
  };

  const startEdit = (config) => {
    // deep clone so edits don't mutate the list until saved
    setEditing(JSON.parse(JSON.stringify(config)));
    setView("editor");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this audit config?")) return;
    try {
      const res = await deleteAuditConfig(id);
      toast.success(res.message);
      setConfigs((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  const handleActivate = async (id) => {
    try {
      const res = await setActiveAuditConfig(id);
      toast.success(res.message);
      loadConfigs();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Activate failed");
    }
  };

  /* --------------------------- editor mutations --------------------------- */
  const setField = (key, value) =>
    setEditing((prev) => ({ ...prev, [key]: value }));

  const addSection = () =>
    setEditing((prev) => ({
      ...prev,
      sections: [...prev.sections, emptySection()],
    }));

  const removeSection = (si) =>
    setEditing((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== si),
    }));

  const updateSection = (si, key, value) =>
    setEditing((prev) => {
      if (key === "weightage") {
        const valNum = Number(value) || 0;
        if (valNum < 0) return prev;
        const otherSum = prev.sections.reduce(
          (sum, sec, idx) => sum + (idx === si ? 0 : Number(sec.weightage) || 0),
          0
        );
        if (otherSum + valNum > 100) {
          toast.error(`Total weightage cannot exceed 100% (limit for this section is ${100 - otherSum}%)`);
          return prev;
        }
      }
      const sections = [...prev.sections];
      sections[si] = { ...sections[si], [key]: value };
      return { ...prev, sections };
    });

  const addFieldTo = (si) =>
    setEditing((prev) => {
      const sections = [...prev.sections];
      sections[si] = {
        ...sections[si],
        fields: [...sections[si].fields, emptyField()],
      };
      return { ...prev, sections };
    });

  const removeFieldFrom = (si, fi) =>
    setEditing((prev) => {
      const sections = [...prev.sections];
      sections[si] = {
        ...sections[si],
        fields: sections[si].fields.filter((_, i) => i !== fi),
      };
      return { ...prev, sections };
    });

  const updateFieldIn = (si, fi, key, value) =>
    setEditing((prev) => {
      const sections = [...prev.sections];
      const fields = [...sections[si].fields];
      let field = { ...fields[fi], [key]: value };
      // when the type changes, set sensible option defaults
      if (key === "type") {
        if (value === "boolean") {
          field.options = [
            { label: "Yes", value: "yes", points: Number(field.maxPoints) || 5 },
            { label: "No", value: "no", points: 0 },
          ];
        } else if (value === "dropdown") {
          field.options =
            field.options && field.options.length ? field.options : [emptyOption()];
        } else {
          field.options = [];
        }
      }
      fields[fi] = field;
      sections[si] = { ...sections[si], fields };
      return { ...prev, sections };
    });

  const addOptionTo = (si, fi) =>
    setEditing((prev) => {
      const sections = [...prev.sections];
      const fields = [...sections[si].fields];
      fields[fi] = {
        ...fields[fi],
        options: [...(fields[fi].options || []), emptyOption()],
      };
      sections[si] = { ...sections[si], fields };
      return { ...prev, sections };
    });

  const removeOptionFrom = (si, fi, oi) =>
    setEditing((prev) => {
      const sections = [...prev.sections];
      const fields = [...sections[si].fields];
      fields[fi] = {
        ...fields[fi],
        options: fields[fi].options.filter((_, i) => i !== oi),
      };
      sections[si] = { ...sections[si], fields };
      return { ...prev, sections };
    });

  const updateOptionIn = (si, fi, oi, key, value) =>
    setEditing((prev) => {
      const sections = [...prev.sections];
      const fields = [...sections[si].fields];
      const options = [...fields[fi].options];
      options[oi] = { ...options[oi], [key]: value };
      fields[fi] = { ...fields[fi], options };
      sections[si] = { ...sections[si], fields };
      return { ...prev, sections };
    });

  /* ------------------------------ save logic ------------------------------ */
  const totalWeightage = editing.sections.reduce(
    (sum, sec) => sum + (Number(sec.weightage) || 0),
    0
  );

  const buildPayload = () => ({
    name: editing.name.trim(),
    description: editing.description,
    isActive: editing.isActive,
    sections: editing.sections.map((sec) => ({
      sectionName: sec.sectionName,
      sectionKey: sec.sectionKey || slugify(sec.sectionName),
      weightage: Number(sec.weightage) || 0,
      isRepeatable: !!sec.isRepeatable,
      fields: sec.fields.map((f) => ({
        label: f.label,
        key: f.key || slugify(f.label),
        type: f.type,
        required: !!f.required,
        requiresAvailabilityCheck: !!f.requiresAvailabilityCheck,
        maxPoints: Number(f.maxPoints) || 0,
        apiEndpoint: f.apiEndpoint || "",
        options: TYPES_WITH_OPTIONS.includes(f.type)
          ? (f.options || []).map((o) => ({
            label: o.label,
            value: o.value || slugify(o.label),
            points: Number(o.points) || 0,
          }))
          : [],
      })),
    })),
  });

  const validate = () => {
    if (!editing.name.trim()) {
      toast.error("Config name is required");
      return false;
    }
    if (!editing.sections.length) {
      toast.error("Add at least one section");
      return false;
    }
    if (totalWeightage > 100) {
      toast.error(`Total weightage cannot exceed 100% (currently ${totalWeightage}%)`);
      return false;
    }
    for (const sec of editing.sections) {
      if (!sec.sectionName.trim()) {
        toast.error("Every section needs a name");
        return false;
      }
      for (const f of sec.fields) {
        if (!f.label.trim()) {
          toast.error(`A field in "${sec.sectionName}" needs a label`);
          return false;
        }
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = buildPayload();
      const res = editing._id
        ? await updateAuditConfig(editing._id, payload)
        : await createAuditConfig(payload);
      toast.success(res.message || "Saved");
      await loadConfigs();
      setView("list");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  /* ------------------------------- list view ------------------------------ */
  if (view === "list") {
    return (
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-700 space-x-1 hover:text-red-600 transition"
          >
            <MdArrowBack className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-sm md:text-lg font-medium">Back</span>
          </button>
          <button
            onClick={startNew}
            className="flex items-center gap-1 px-4 py-2 rounded bg-red-500 text-white shadow hover:bg-red-600 text-sm md:text-base"
          >
            <HiPlus size={18} /> New Config
          </button>
        </div>

        <h1 className="text-lg md:text-xl font-semibold mb-4">Audit Configs</h1>

        {configs.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No configs yet. Create one to define the audit template.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((cfg) => (
              <div
                key={cfg._id}
                className="border border-gray-200 shadow rounded-lg p-4 bg-white flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{cfg.name}</span>
                  {cfg.isActive && (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <HiCheckCircle size={16} /> Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {cfg.sections?.length || 0} sections · weightage{" "}
                  {cfg.totalWeightage ?? 0}%
                </p>
                {cfg.description && (
                  <p className="text-xs text-gray-600">{cfg.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {!cfg.isActive && (
                    <button
                      onClick={() => handleActivate(cfg._id)}
                      className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Set Active
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(cfg)}
                    className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    title="Edit"
                  >
                    <HiPencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(cfg._id)}
                    className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="Delete"
                  >
                    <HiTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ------------------------------ editor view ----------------------------- */
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setView("list")}
          className="flex items-center text-gray-700 space-x-1 hover:text-red-600 transition"
        >
          <MdArrowBack className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-sm md:text-lg font-medium">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-medium px-3 py-1 rounded ${totalWeightage === 100
                ? "bg-green-100 text-green-700"
                : totalWeightage > 100
                ? "bg-red-100 text-red-700 font-semibold"
                : "bg-amber-100 text-amber-700"
              }`}
          >
            Total weightage: {totalWeightage}%
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-red-500 text-white shadow hover:bg-red-600 disabled:opacity-60 text-sm md:text-base"
          >
            {saving ? "Saving..." : editing._id ? "Update Config" : "Save Config"}
          </button>
        </div>
      </div>

      {/* config meta */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 grid gap-3 md:grid-cols-2">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Config name *
          </label>
          <input
            className={inputCls}
            value={editing.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="e.g. Standard CCB Audit"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Description
          </label>
          <input
            className={inputCls}
            value={editing.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Optional"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={editing.isActive}
            onChange={(e) => setField("isActive", e.target.checked)}
          />
          Set as active config (used for new audits)
        </label>
      </div>

      {/* sections */}
      {editing.sections.map((sec, si) => (
        <div
          key={si}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
        >
          <div className="grid gap-3 md:grid-cols-12 mb-3 items-end">
            <div className="md:col-span-6">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Section name *
              </label>
              <input
                className={inputCls}
                value={sec.sectionName}
                onChange={(e) =>
                  updateSection(si, "sectionName", e.target.value)
                }
                placeholder="e.g. Kitchen Hygiene"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Weightage (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                className={inputCls}
                value={sec.weightage}
                onChange={(e) =>
                  updateSection(si, "weightage", e.target.value)
                }
              />
            </div>
            <div className="md:col-span-2 flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                checked={sec.isRepeatable || false}
                onChange={(e) =>
                  updateSection(si, "isRepeatable", e.target.checked)
                }
              />
              <span className="text-xs text-gray-600 font-medium">Repeatable</span>
            </div>
            <div className="md:col-span-1 flex justify-end pb-1">
              <button
                onClick={() => removeSection(si)}
                className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 shrink-0"
                title="Remove section"
              >
                <HiTrash size={16} />
              </button>
            </div>
          </div>

          {/* fields */}
          {sec.fields.map((f, fi) => (
            <div
              key={fi}
              className="bg-white border border-gray-200 rounded-lg p-3 mb-3"
            >
              <div className="grid gap-2 md:grid-cols-12 items-end">
                <div className="md:col-span-4">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">
                    Field label *
                  </label>
                  <input
                    className={inputCls}
                    value={f.label}
                    onChange={(e) =>
                      updateFieldIn(si, fi, "label", e.target.value)
                    }
                    placeholder="e.g. Kitchen Floor"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">
                    Type
                  </label>
                  <select
                    className={inputCls}
                    value={f.type}
                    onChange={(e) =>
                      updateFieldIn(si, fi, "type", e.target.value)
                    }
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">
                    Max points
                  </label>
                  <input
                    type="number"
                    min="0"
                    className={inputCls}
                    value={f.maxPoints}
                    onChange={(e) =>
                      updateFieldIn(si, fi, "maxPoints", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1 pb-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={f.required}
                      onChange={(e) =>
                        updateFieldIn(si, fi, "required", e.target.checked)
                      }
                    />
                    <span className="text-[11px] text-gray-600">Required</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={f.requiresAvailabilityCheck || false}
                      onChange={(e) =>
                        updateFieldIn(si, fi, "requiresAvailabilityCheck", e.target.checked)
                      }
                    />
                    <span className="text-[11px] text-gray-600">Availability Check</span>
                  </label>
                </div>
                <div className="md:col-span-1 flex justify-end pb-1">
                  <button
                    onClick={() => removeFieldFrom(si, fi)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="Remove field"
                  >
                    <HiTrash size={14} />
                  </button>
                </div>
              </div>

              {/* api endpoint for api_dropdown */}
              {f.type === "api_dropdown" && (
                <div className="mt-2 pl-3 border-l-2 border-gray-200">
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">
                    API Endpoint (e.g. /products)
                  </label>
                  <input
                    className={inputCls}
                    value={f.apiEndpoint || ""}
                    onChange={(e) =>
                      updateFieldIn(si, fi, "apiEndpoint", e.target.value)
                    }
                    placeholder="e.g. /products"
                  />
                </div>
              )}

              {/* options (dropdown / boolean) */}
              {TYPES_WITH_OPTIONS.includes(f.type) && (
                <div className="mt-3 pl-3 border-l-2 border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-gray-500 uppercase">
                      Options (points)
                    </span>
                    <button
                      onClick={() => addOptionTo(si, fi)}
                      className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                    >
                      <HiPlus size={14} /> Option
                    </button>
                  </div>
                  {(f.options || []).map((o, oi) => (
                    <div
                      key={oi}
                      className="grid grid-cols-12 gap-2 items-center mb-2"
                    >
                      <input
                        className={`${inputCls} col-span-5`}
                        value={o.label}
                        onChange={(e) =>
                          updateOptionIn(si, fi, oi, "label", e.target.value)
                        }
                        placeholder="Label (e.g. Good)"
                      />
                      <input
                        className={`${inputCls} col-span-4`}
                        value={o.value}
                        onChange={(e) =>
                          updateOptionIn(si, fi, oi, "value", e.target.value)
                        }
                        placeholder="Value (e.g. good)"
                      />
                      <input
                        type="number"
                        className={`${inputCls} col-span-2`}
                        value={o.points}
                        onChange={(e) =>
                          updateOptionIn(si, fi, oi, "points", e.target.value)
                        }
                        placeholder="Pts"
                      />
                      <button
                        onClick={() => removeOptionFrom(si, fi, oi)}
                        className="col-span-1 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 justify-self-center"
                        title="Remove option"
                      >
                        <HiTrash size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button
            onClick={() => addFieldTo(si)}
            className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600"
          >
            <HiPlus size={16} /> Add field
          </button>
        </div>
      ))}

      <button
        onClick={addSection}
        className="flex items-center gap-1 px-4 py-2 rounded border border-dashed border-gray-400 text-gray-700 hover:border-red-400 hover:text-red-600 w-full justify-center"
      >
        <HiPlus size={18} /> Add section
      </button>
    </div>
  );
};

export default AuditConfigBuilder;

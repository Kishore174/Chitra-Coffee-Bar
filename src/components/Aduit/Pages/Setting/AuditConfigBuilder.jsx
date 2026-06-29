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
  "w-full border border-gray-200 bg-white rounded-xl p-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm hover:border-gray-300";

const selectCls =
  "w-full border border-gray-200 bg-white rounded-xl p-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent shadow-sm hover:border-gray-300 appearance-none";

const ToggleSwitch = ({ checked, onChange, label, className = "" }) => (
  <label className={`inline-flex items-center gap-3 cursor-pointer group ${className}`}>
    <div className="relative flex-shrink-0">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-red-500' : 'bg-gray-200 border border-gray-300'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform shadow-sm ${checked ? 'transform translate-x-4' : ''}`}></div>
    </div>
    {label && (
      <span className="text-xs font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
        {label}
      </span>
    )}
  </label>
);

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
      <div className="bg-white font-sans w-full">
        <div className=" mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-red-500 transition-colors mb-2 group"
              >
                <MdArrowBack className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                Audit Configurations
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and customize the templates used for your store audits.
              </p>
            </div>
            <button
              onClick={startNew}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium shadow-lg shadow-red-500/30 hover:shadow-red-500/50 transition-all hover:-translate-y-0.5"
            >
              <HiPlus size={18} /> Create Template
            </button>
          </div>

          {/* List */}
          {configs.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-200">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                <HiPlus className="text-gray-300 w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-1">No templates found</h3>
              <p className="text-gray-500 text-sm">Create your first audit configuration to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {configs.map((cfg) => (
                <div
                  key={cfg._id}
                  className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:border-red-100 transition-all relative flex flex-col h-full hover:-translate-y-1"
                >
                  {cfg.isActive && (
                    <div className="absolute top-0 right-0 bg-gradient-to-bl from-green-400 to-emerald-500 text-white px-3 py-1 rounded-bl-xl rounded-tr-2xl text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1 z-10">
                      <HiCheckCircle size={14} /> Active
                    </div>
                  )}
                  <div className="flex-1 z-10 relative">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 pr-16 leading-tight">
                      {cfg.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {cfg.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                      <div className="flex flex-col">
                        <span className="text-gray-600 font-bold text-lg">{cfg.sections?.length || 0}</span>
                        <span>Sections</span>
                      </div>
                      <div className="w-px h-8 bg-gray-100"></div>
                      <div className="flex flex-col">
                        <span className="text-gray-600 font-bold text-lg">{cfg.totalWeightage ?? 0}%</span>
                        <span>Weightage</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center gap-2 justify-between z-10">
                    {!cfg.isActive ? (
                      <button
                        onClick={() => handleActivate(cfg._id)}
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-semibold hover:bg-green-100 hover:text-green-700 transition-colors flex items-center gap-1"
                      >
                        <HiCheckCircle size={14} /> Set Active
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-lg flex items-center gap-1 cursor-default">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Currently Active
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(cfg)}
                        className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors hover:scale-105"
                        title="Edit Template"
                      >
                        <HiPencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(cfg._id)}
                        className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors hover:scale-105"
                        title="Delete Template"
                      >
                        <HiTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ------------------------------ editor view ----------------------------- */
  return (
    <div className="bg-white pb-20 font-sans w-full">
      <div className="sticky top-0 z-50 bg-white -mx-5 border border-gray-50">
        <div className=" mx-auto p-4 md:p-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setView("list")}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <MdArrowBack className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {editing._id ? "Edit Configuration" : "New Configuration"}
              </h2>
              <p className="text-xs text-gray-500">Build your audit template</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Weightage</span>
              <span
                className={`text-sm font-bold px-3 py-1 rounded-full ${totalWeightage === 100
                  ? "bg-green-100 text-green-700"
                  : totalWeightage > 100
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
                  }`}
              >
                {totalWeightage}%
              </span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-60 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiCheckCircle size={18} />
              )}
              {saving ? "Saving..." : "Save Config"}
            </button>
          </div>
        </div>
      </div>

      <div className=" mx-auto p-4 md:p-6 space-y-8">

        {/* config meta */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <h3 className="text-lg font-bold text-gray-800 mb-6">General Information</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Configuration Name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputCls}
                value={editing.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="e.g. Daily Store Operations"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <input
                className={inputCls}
                value={editing.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Briefly describe this template..."
              />
            </div>
            <div className="md:col-span-2 pt-2">
              <label className="inline-flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={editing.isActive}
                    onChange={(e) => setField("isActive", e.target.checked)}
                  />
                  <div className={`block w-14 h-8 rounded-full transition-colors ${editing.isActive ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${editing.isActive ? 'transform translate-x-6' : ''}`}></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">Set as Active Configuration</span>
                  <span className="text-xs text-gray-500">Make this the default template for new audits</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* sections */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">Audit Sections</h3>
            <span className="text-sm text-gray-500">{editing.sections.length} sections total</span>
          </div>

          {editing.sections.map((sec, si) => (
            <div
              key={si}
              className="bg-gray-50 border border-gray-200 rounded-2xl shadow-sm relative"
            >
              {/* Section Header */}
              <div className="sticky top-[80px] z-40 bg-white p-5 border-b border-gray-200 rounded-t-2xl flex flex-col md:flex-row md:items-center gap-4 shadow-sm">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Section Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full text-lg font-bold text-gray-800 bg-transparent border-none focus:ring-0 p-0 placeholder-gray-300 transition-colors hover:text-red-600 focus:text-red-600 outline-none"
                    value={sec.sectionName}
                    onChange={(e) => updateSection(si, "sectionName", e.target.value)}
                    placeholder="e.g. Kitchen Hygiene"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 text-center">
                      Weight (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-center font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 shadow-sm"
                      value={sec.weightage}
                      onChange={(e) => updateSection(si, "weightage", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 h-full mt-4">
                    <ToggleSwitch
                      checked={sec.isRepeatable || false}
                      onChange={(val) => updateSection(si, "isRepeatable", val)}
                      label="Repeatable"
                      className="p-2 rounded-lg hover:bg-gray-100"
                    />
                  </div>

                  <div className="h-full mt-4">
                    <button
                      onClick={() => removeSection(si)}
                      className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      title="Remove section"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Section Fields */}
              <div className="p-4 md:p-6 bg-gray-50/50 space-y-4">
                {sec.fields.map((f, fi) => (
                  <div
                    key={fi}
                    className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative group"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-200 to-gray-300 rounded-l-xl group-hover:from-red-300 group-hover:to-red-400 transition-colors"></div>

                    <div className="grid gap-4 md:grid-cols-12 items-start pl-2">
                      <div className="md:col-span-4">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Field Label <span className="text-red-500">*</span>
                        </label>
                        <input
                          className={inputCls}
                          value={f.label}
                          onChange={(e) => updateFieldIn(si, fi, "label", e.target.value)}
                          placeholder="e.g. Floor Cleanliness"
                        />
                      </div>

                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Type
                        </label>
                        <div className="relative">
                          <select
                            className={selectCls}
                            value={f.type}
                            onChange={(e) => updateFieldIn(si, fi, "type", e.target.value)}
                          >
                            {FIELD_TYPES.map((t) => (
                              <option key={t} value={t}>
                                {t.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                          Max Pts
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={inputCls}
                          value={f.maxPoints}
                          onChange={(e) => updateFieldIn(si, fi, "maxPoints", e.target.value)}
                        />
                      </div>

                      <div className="md:col-span-2 flex flex-col gap-3 pt-6">
                        <ToggleSwitch
                          checked={f.required || false}
                          onChange={(val) => updateFieldIn(si, fi, "required", val)}
                          label="Required"
                        />
                        <ToggleSwitch
                          checked={f.requiresAvailabilityCheck || false}
                          onChange={(val) => updateFieldIn(si, fi, "requiresAvailabilityCheck", val)}
                          label="Avail. Check"
                        />
                      </div>

                      <div className="md:col-span-1 flex justify-end pt-6">
                        <button
                          onClick={() => removeFieldFrom(si, fi)}
                          className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                          title="Remove field"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    </div>

                    {/* api endpoint for api_dropdown */}
                    {f.type === "api_dropdown" && (
                      <div className="mt-4 pl-4 ml-2 border-l-2 border-indigo-200">
                        <label className="block text-xs font-bold text-indigo-500 uppercase tracking-wider mb-1.5">
                          API Endpoint
                        </label>
                        <input
                          className={`${inputCls} border-indigo-100 focus:ring-indigo-300`}
                          value={f.apiEndpoint || ""}
                          onChange={(e) => updateFieldIn(si, fi, "apiEndpoint", e.target.value)}
                          placeholder="e.g. /api/v1/products"
                        />
                      </div>
                    )}

                    {/* options (dropdown / boolean) */}
                    {TYPES_WITH_OPTIONS.includes(f.type) && (
                      <div className="mt-4 bg-gray-50/80 rounded-xl p-4 border border-gray-100 ml-2">
                        <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Dropdown Options
                          </span>
                          <button
                            onClick={() => addOptionTo(si, fi)}
                            className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded-md transition-colors"
                          >
                            <HiPlus size={14} /> Add Option
                          </button>
                        </div>

                        <div className="space-y-3 mt-3">
                          {(f.options || []).map((o, oi) => (
                            <div key={oi} className="flex gap-3 items-center">
                              <div className="flex-1">
                                <input
                                  className={inputCls}
                                  value={o.label}
                                  onChange={(e) => updateOptionIn(si, fi, oi, "label", e.target.value)}
                                  placeholder="Display Label (e.g. Excellent)"
                                />
                              </div>
                              <div className="flex-1">
                                <input
                                  className={inputCls}
                                  value={o.value}
                                  onChange={(e) => updateOptionIn(si, fi, oi, "value", e.target.value)}
                                  placeholder="Internal Value (e.g. excellent)"
                                />
                              </div>
                              <div className="w-24">
                                <input
                                  type="number"
                                  className={inputCls}
                                  value={o.points}
                                  onChange={(e) => updateOptionIn(si, fi, oi, "points", e.target.value)}
                                  placeholder="Pts"
                                />
                              </div>
                              <button
                                onClick={() => removeOptionFrom(si, fi, oi)}
                                className="p-2.5 rounded-xl text-gray-400 hover:bg-red-100 hover:text-red-500 transition-colors shrink-0"
                                title="Remove option"
                              >
                                <HiTrash size={18} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addFieldTo(si)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 font-bold hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all mt-4 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <HiPlus size={20} /> Add New Field
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={addSection}
            className="flex items-center justify-center gap-2 w-full py-4.5 rounded-2xl border-2 border-dashed border-red-300 text-red-500 font-bold hover:border-red-500 hover:bg-red-50 hover:shadow-md transition-all mt-8 bg-white hover:-translate-y-0.5 active:translate-y-0"
            style={{ padding: '1rem' }}
          >
            <HiPlus size={22} /> Add New Section
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditConfigBuilder;

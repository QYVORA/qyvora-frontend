import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import { Bootcamp } from './types';
import ModuleEditor from './ModuleEditor';
import { newModule } from './helpers';

interface ContentTabProps {
  bootcamps: Bootcamp[];
  selectedBootcampId: string;
  setSelectedBootcampId: (id: string) => void;
  onSave: (bootcamps: Bootcamp[]) => Promise<void>;
  saving: boolean;
}

const ContentTab: React.FC<ContentTabProps> = ({
  bootcamps,
  selectedBootcampId,
  setSelectedBootcampId,
  onSave,
  saving,
}) => {
  const [local, setLocal] = useState<Bootcamp[]>(bootcamps);

  useEffect(() => {
    setLocal(bootcamps);
  }, [bootcamps]);

  const selected = local.find((b) => b.id === selectedBootcampId) ?? local[0];

  function updateBootcamp(updated: Bootcamp) {
    setLocal((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  }

  function metaField(
    key: keyof Bootcamp,
    label: string,
    type: "text" | "checkbox" | "number" = "text"
  ) {
    if (!selected) return null;
    if (type === "checkbox") {
      return (
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input
            type="checkbox"
            checked={selected[key] as boolean}
            onChange={(e) => updateBootcamp({ ...selected, [key]: e.target.checked })}
            className="accent-accent"
          />
          {label}
        </label>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-muted">{label}</label>
        <input
          type={type}
          value={selected[key] as string | number}
          onChange={(e) =>
            updateBootcamp({
              ...selected,
              [key]: type === "number" ? Number(e.target.value) : e.target.value,
            })
          }
          className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Bootcamp list */}
      <div className="w-48 shrink-0 flex flex-col gap-1">
        <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Bootcamps</p>
        {local.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelectedBootcampId(b.id)}
            className={`text-left px-3 py-2 rounded text-sm truncate ${
              b.id === selectedBootcampId
                ? "bg-accent-dim text-accent border border-accent/30"
                : "text-text-secondary hover:bg-accent-dim/30"
            }`}
          >
            {b.title || b.id}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            const nb: Bootcamp = {
              id: `bootcamp-${Date.now()}`,
              title: "",
              description: "",
              level: "",
              duration: "",
              priceLabel: "",
              image: "",
              isActive: false,
              sortOrder: local.length,
              modules: [],
            };
            setLocal((prev) => [...prev, nb]);
            setSelectedBootcampId(nb.id);
          }}
          className="flex items-center gap-1 text-xs text-accent hover:text-accent/70 mt-2 px-2 transition-colors"
        >
          <Plus size={12} /> New Bootcamp
        </button>
      </div>

      {/* Editor */}
      {selected && (
        <div className="flex-1 overflow-y-auto pr-1">
          <p className="text-xs text-text-muted uppercase tracking-wide mb-3">Metadata</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {metaField("id", "ID")}
            {metaField("title", "Title")}
            {metaField("level", "Level")}
            {metaField("duration", "Duration")}
            {metaField("priceLabel", "Price Label")}
            {metaField("image", "Image URL")}
            {metaField("sortOrder", "Sort Order", "number")}
            <div className="flex items-end pb-1">{metaField("isActive", "Active", "checkbox")}</div>
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-xs text-text-muted">Description</label>
            <textarea
              rows={3}
              value={selected.description}
              onChange={(e) => updateBootcamp({ ...selected, description: e.target.value })}
              className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors resize-y"
            />
          </div>

          <p className="text-xs text-text-muted uppercase tracking-wide mb-3">Modules</p>
          {selected.modules.map((mod, mi) => (
            <ModuleEditor
              key={mod.moduleId}
              mod={mod}
              onChange={(updated) => {
                const modules = [...selected.modules];
                modules[mi] = updated;
                updateBootcamp({ ...selected, modules });
              }}
              onRemove={() =>
                updateBootcamp({
                  ...selected,
                  modules: selected.modules.filter((_, i) => i !== mi),
                })
              }
            />
          ))}
          <button
            type="button"
            onClick={() =>
              updateBootcamp({ ...selected, modules: [...selected.modules, newModule()] })
            }
            className="flex items-center gap-1 text-xs text-accent hover:text-accent/70 transition-colors mb-6"
          >
            <Plus size={12} /> Add Module
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(local)}
            className="flex items-center gap-2 btn-primary text-sm disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving…" : "Save All"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentTab;

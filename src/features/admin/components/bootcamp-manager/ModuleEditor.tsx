import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus } from 'lucide-react';
import { Module } from './types';
import RoomEditor from './RoomEditor';
import { newRoom } from './helpers';

interface ModuleEditorProps {
  mod: Module;
  onChange: (m: Module) => void;
  onRemove: () => void;
}

const ModuleEditor: React.FC<ModuleEditorProps> = ({
  mod,
  onChange,
  onRemove,
}) => {
  const [open, setOpen] = useState(false);

  function field(key: keyof Module, label: string) {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-muted">{label}</label>
        <input
          type={key === "moduleId" ? "number" : "text"}
          value={mod[key] as string | number}
          onChange={(e) =>
            onChange({
              ...mod,
              [key]: key === "moduleId" ? Number(e.target.value) : e.target.value,
            })
          }
          className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl bg-bg-card mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-accent-dim/30 rounded-xl transition-colors"
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          Module {mod.moduleId}: {mod.title || "(untitled)"}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="text-red-400 hover:text-red-300 p-1 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </button>

      {open && (
        <div className="px-3 pb-3">
          <div className="grid grid-cols-2 gap-3 mb-3">
            {field("moduleId", "Module ID")}
            {field("title", "Title")}
            {field("description", "Description")}
            {field("codename", "Codename")}
            {field("ctf", "CTF")}
          </div>

          <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">Rooms</p>
          {mod.rooms.map((room, ri) => (
            <RoomEditor
              key={room.roomId}
              room={room}
              onChange={(updated) => {
                const rooms = [...mod.rooms];
                rooms[ri] = updated;
                onChange({ ...mod, rooms });
              }}
              onRemove={() => {
                onChange({ ...mod, rooms: mod.rooms.filter((_, i) => i !== ri) });
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...mod, rooms: [...mod.rooms, newRoom()] })}
            className="flex items-center gap-1 text-xs text-accent hover:text-accent/70 mt-1 transition-colors"
          >
            <Plus size={12} /> Add Room
          </button>
        </div>
      )}
    </div>
  );
};

export default ModuleEditor;

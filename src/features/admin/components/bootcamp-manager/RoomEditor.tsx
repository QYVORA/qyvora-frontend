import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { Room } from './types';

interface RoomEditorProps {
  room: Room;
  onChange: (r: Room) => void;
  onRemove: () => void;
}

const RoomEditor: React.FC<RoomEditorProps> = ({
  room,
  onChange,
  onRemove,
}) => {
  const [open, setOpen] = useState(false);

  function field(key: keyof Room, label: string, type = "text") {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-text-muted">{label}</label>
        <input
          type={type}
          min={type === "number" ? 250 : undefined}
          value={room[key] as string | number}
          onChange={(e) =>
            onChange({
              ...room,
              [key]: type === "number" ? Number(e.target.value) : e.target.value,
            })
          }
          className="bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
        />
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl bg-bg-card mb-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-text-primary hover:bg-accent-dim/30 rounded-xl transition-colors"
      >
        <span className="flex items-center gap-2">
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          Room {room.roomId}: {room.title || "(untitled)"}
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
        <div className="px-3 pb-3 grid grid-cols-2 gap-3">
          {field("roomId", "Room ID", "number")}
          {field("title", "Title")}
          <div className="col-span-2">{field("overview", "Overview")}</div>
          {field("meetingLink", "Meeting Link")}
          {field("cpReward", "CP Reward", "number")}
        </div>
      )}
    </div>
  );
};

export default RoomEditor;

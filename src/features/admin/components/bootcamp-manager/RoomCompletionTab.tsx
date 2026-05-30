import React, { useState, useEffect } from 'react';
import { Bootcamp, ApiClient } from './types';

type EnrolledStudent = {
  id: string;
  name: string;
  hackerHandle: string;
  email: string;
  bootcampStatus: string;
  cpPoints: number;
  completedRooms: string[];
};

interface RoomCompletionTabProps {
  bootcamp: Bootcamp | undefined;
  api: ApiClient;
  addToast: (msg: string, type: string) => void;
}

const RoomCompletionTab: React.FC<RoomCompletionTabProps> = ({
  bootcamp,
  api,
  addToast,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number | "">("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [completing, setCompleting] = useState(false);

  const selectedModule = bootcamp?.modules.find((m) => m.moduleId === selectedModuleId);
  const selectedRoom = selectedModule?.rooms.find((r) => r.roomId === selectedRoomId);

  useEffect(() => {
    if (!bootcamp) return;
    setLoadingStudents(true);
    api
      .get(`/admin/bootcamp/enrolled-students?bootcampId=${encodeURIComponent(bootcamp.id)}`)
      .then((res) => setStudents(Array.isArray(res.data?.students) ? res.data.students : []))
      .catch(() => addToast("Failed to load students", "error"))
      .finally(() => setLoadingStudents(false));
  }, [bootcamp?.id, api, addToast]);

  function toggleStudent(id: string) {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selectedUserIds.size === students.length) {
      setSelectedUserIds(new Set());
    } else {
      setSelectedUserIds(new Set(students.map((s) => s.id)));
    }
  }

  async function markComplete() {
    if (!bootcamp || !selectedModuleId || !selectedRoomId || selectedUserIds.size === 0) {
      addToast("Select a module, room, and at least one student", "error");
      return;
    }
    setCompleting(true);
    try {
      const res = await api.post("/admin/bootcamp/rooms/complete", {
        bootcampId: bootcamp.id,
        moduleId: selectedModuleId,
        roomId: selectedRoomId,
        userIds: Array.from(selectedUserIds),
      });
      const updated = Array.isArray(res.data?.updated) ? res.data.updated : [];
      const granted = updated.filter((u: any) => !u.skipped).length;
      const skipped = updated.filter((u: any) => u.skipped).length;
      addToast(`Done — ${granted} student(s) marked complete${skipped ? `, ${skipped} already done` : ""}`, "success");
      setSelectedUserIds(new Set());
      // Refresh student list
      const refreshed = await api.get(`/admin/bootcamp/enrolled-students?bootcampId=${encodeURIComponent(bootcamp.id)}`);
      setStudents(Array.isArray(refreshed.data?.students) ? refreshed.data.students : []);
    } catch {
      addToast("Failed to mark rooms complete", "error");
    } finally {
      setCompleting(false);
    }
  }

  if (!bootcamp) return <p className="text-zinc-500 text-sm">No bootcamp selected.</p>;

  const roomKey = selectedModuleId && selectedRoomId ? `${selectedModuleId}:${selectedRoomId}` : null;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs text-text-muted">
        Select a phase and room, then choose which enrolled students to mark as complete. CP will be granted automatically.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">Phase (Module)</label>
          <select
            value={selectedModuleId}
            onChange={(e) => { setSelectedModuleId(e.target.value === "" ? "" : Number(e.target.value)); setSelectedRoomId(""); }}
            className="bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          >
            <option value="">— Select Phase —</option>
            {bootcamp.modules.map((m) => (
              <option key={m.moduleId} value={m.moduleId}>
                Module {m.moduleId}: {m.title || "(untitled)"}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-text-muted">Room</label>
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value === "" ? "" : Number(e.target.value))}
            disabled={!selectedModule}
            className="bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors disabled:opacity-40"
          >
            <option value="">— Select Room —</option>
            {(selectedModule?.rooms || []).map((r) => (
              <option key={r.roomId} value={r.roomId}>
                Room {r.roomId}: {r.title || "(untitled)"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRoom && (
        <div className="px-3 py-2 bg-bg-card border border-border rounded-xl text-xs text-text-secondary">
          <span className="text-text-muted">Selected: </span>
          <span className="font-bold text-text-primary">{selectedRoom.title}</span>
          <span className="text-text-muted ml-2">— CP reward: </span>
          <span className="font-bold text-accent">{Math.max(250, selectedRoom.cpReward || 250)} CP</span>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-text-muted uppercase tracking-wide">
            Enrolled Students ({students.length})
          </p>
          {students.length > 0 && (
            <button
              type="button"
              onClick={toggleAll}
              className="text-xs text-accent hover:text-accent/70 transition-colors"
            >
              {selectedUserIds.size === students.length ? "Deselect All" : "Select All"}
            </button>
          )}
        </div>

        {loadingStudents ? (
          <p className="text-zinc-500 text-sm">Loading students…</p>
        ) : students.length === 0 ? (
          <p className="text-zinc-500 text-sm">No enrolled students yet.</p>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden max-h-80 overflow-y-auto">
            {students.map((s) => {
              const alreadyDone = roomKey ? s.completedRooms.includes(roomKey) : false;
              const checked = selectedUserIds.has(s.id);
              return (
                <label
                  key={s.id}
                  className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 cursor-pointer transition-colors ${
                    alreadyDone ? "opacity-50" : "hover:bg-accent-dim/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={alreadyDone}
                    onChange={() => !alreadyDone && toggleStudent(s.id)}
                    className="accent-accent shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-text-primary truncate">
                      {s.hackerHandle || s.name || s.email}
                    </div>
                    <div className="text-xs text-text-muted truncate">{s.email}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {alreadyDone && (
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Done</span>
                    )}
                    <span className="text-[10px] text-text-muted font-mono">{s.cpPoints.toLocaleString()} CP</span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      <button
        type="button"
        disabled={completing || selectedUserIds.size === 0 || !selectedModuleId || !selectedRoomId}
        onClick={markComplete}
        className="flex items-center gap-2 bg-red-700 hover:bg-accent disabled:opacity-40 text-white text-sm px-4 py-2.5 rounded w-fit font-bold"
      >
        {completing ? "Marking…" : `Mark Complete for ${selectedUserIds.size} Student${selectedUserIds.size !== 1 ? "s" : ""}`}
      </button>
    </div>
  );
};

export default RoomCompletionTab;

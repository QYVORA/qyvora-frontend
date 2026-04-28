import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Room = {
  roomId: number;
  title: string;
  overview: string;
  meetingLink: string;
  cpReward: number;
};

type Module = {
  moduleId: number;
  title: string;
  description: string;
  codename: string;
  ctf: string;
  rooms: Room[];
};

type Bootcamp = {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: string;
  priceLabel: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  modules: Module[];
};

type AccessConfig = {
  started: boolean;
  unlockedModules: number[];
  unlockedRooms: Record<string, number[]>;
  quizRelease: {
    enabled: boolean;
    modules: number[];
    rooms: Record<string, number[]>;
  };
};

type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
};

type ApiClient = {
  get: (url: string) => Promise<{ data: any }>;
  post: (url: string, data?: any) => Promise<{ data: any }>;
  patch: (url: string, data?: any) => Promise<{ data: any }>;
  delete: (url: string) => Promise<{ data: any }>;
};

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
  bootcamps: Bootcamp[];
  selectedBootcampId: string;
  setSelectedBootcampId: (id: string) => void;
  contentVersion: number;
  onSave: (bootcamps: any[]) => Promise<void>;
  saving: boolean;
  addToast: (msg: string, type: string) => void;
  api: ApiClient;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function newRoom(): Room {
  return {
    roomId: Date.now(),
    title: "",
    overview: "",
    meetingLink: "",
    cpReward: 250,
  };
}

function newModule(): Module {
  return {
    moduleId: Date.now(),
    title: "",
    description: "",
    codename: "",
    ctf: "",
    rooms: [newRoom()],
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RoomEditor({
  room,
  onChange,
  onRemove,
}: {
  room: Room;
  onChange: (r: Room) => void;
  onRemove: () => void;
}) {
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
}

function ModuleEditor({
  mod,
  onChange,
  onRemove,
}: {
  mod: Module;
  onChange: (m: Module) => void;
  onRemove: () => void;
}) {
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
}

// ─── Content Tab ──────────────────────────────────────────────────────────────

function ContentTab({
  bootcamps,
  selectedBootcampId,
  setSelectedBootcampId,
  onSave,
  saving,
}: {
  bootcamps: Bootcamp[];
  selectedBootcampId: string;
  setSelectedBootcampId: (id: string) => void;
  onSave: (bootcamps: Bootcamp[]) => Promise<void>;
  saving: boolean;
}) {
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
}

// ─── Phase Access Tab ─────────────────────────────────────────────────────────

function PhaseAccessTab({
  bootcamp,
  contentVersion,
  api,
  addToast,
}: {
  bootcamp: Bootcamp | undefined;
  contentVersion: number;
  api: ApiClient;
  addToast: (msg: string, type: string) => void;
}) {
  const [access, setAccess] = useState<AccessConfig>({
    started: false,
    unlockedModules: [],
    unlockedRooms: {},
    quizRelease: { enabled: false, modules: [], rooms: {} },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!bootcamp) return;
    setLoading(true);
    api
      .get("/admin/content")
      .then((res) => {
        const cfg: AccessConfig =
          res.data?.learn?.bootcampAccess?.[bootcamp.id] ?? {
            started: false,
            unlockedModules: [],
            unlockedRooms: {},
            quizRelease: { enabled: false, modules: [], rooms: {} },
          };
        setAccess(cfg);
      })
      .catch(() => addToast("Failed to load access config", "error"))
      .finally(() => setLoading(false));
  }, [bootcamp?.id]);

  function toggleModule(moduleId: number) {
    setAccess((prev) => {
      const has = prev.unlockedModules.includes(moduleId);
      return {
        ...prev,
        unlockedModules: has
          ? prev.unlockedModules.filter((id) => id !== moduleId)
          : [...prev.unlockedModules, moduleId],
      };
    });
  }

  function toggleRoom(moduleId: number, roomId: number) {
    setAccess((prev) => {
      const key = String(moduleId);
      const current = prev.unlockedRooms[key] ?? [];
      const has = current.includes(roomId);
      return {
        ...prev,
        unlockedRooms: {
          ...prev.unlockedRooms,
          [key]: has ? current.filter((id) => id !== roomId) : [...current, roomId],
        },
      };
    });
  }

  async function saveAccess() {
    if (!bootcamp) return;
    setSaving(true);
    try {
      await api.patch("/admin/content", {
        version: contentVersion,
        learn: {
          bootcampAccess: {
            [bootcamp.id]: access,
          },
        },
      });
      addToast("Access config saved", "success");
    } catch {
      addToast("Failed to save access config", "error");
    } finally {
      setSaving(false);
    }
  }

  if (!bootcamp) return <p className="text-zinc-500 text-sm">No bootcamp selected.</p>;
  if (loading) return <p className="text-zinc-500 text-sm">Loading…</p>;

  return (
    <div className="flex flex-col gap-4">
      {/* Started toggle */}
      <div className="flex items-center gap-3 w-fit">
        <button
          type="button"
          role="switch"
          aria-checked={access.started}
          aria-label="Bootcamp started"
          onClick={() => setAccess((p) => ({ ...p, started: !p.started }))}
          className={`relative flex h-7 w-12 flex-none cursor-pointer items-center rounded-full px-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
            access.started ? "bg-accent" : "bg-border"
          }`}
        >
          <span
            className={`pointer-events-none block h-6 w-6 shrink-0 rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
              access.started ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-text-primary select-none">Bootcamp Started</span>
      </div>

      {/* Module / room tree */}
      <div className="flex flex-col gap-3">
        {bootcamp.modules.map((mod) => {
          const modUnlocked = access.unlockedModules.includes(mod.moduleId);
          return (
            <div key={mod.moduleId} className="border border-border rounded-xl p-3">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={modUnlocked}
                  onChange={() => toggleModule(mod.moduleId)}
                  className="accent-accent"
                />
                <span className="text-sm text-text-primary flex items-center gap-1">
                  {modUnlocked ? (
                    <Unlock size={13} className="text-red-400" />
                  ) : (
                    <Lock size={13} className="text-zinc-500" />
                  )}
                  Module {mod.moduleId}: {mod.title || "(untitled)"}
                </span>
              </label>

              {modUnlocked && (
                <div className="ml-6 flex flex-col gap-1">
                  {mod.rooms.map((room) => {
                    const roomUnlocked = (
                      access.unlockedRooms[String(mod.moduleId)] ?? []
                    ).includes(room.roomId);
                    return (
                      <label key={room.roomId} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={roomUnlocked}
                          onChange={() => toggleRoom(mod.moduleId, room.roomId)}
                          className="accent-accent"
                        />
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          {roomUnlocked ? (
                            <Unlock size={11} className="text-red-400" />
                          ) : (
                            <Lock size={11} className="text-zinc-500" />
                          )}
                          Room {room.roomId}: {room.title || "(untitled)"}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={saveAccess}
        className="flex items-center gap-2 btn-primary text-sm disabled:opacity-50 w-fit"
      >
        <Save size={14} />
        {saving ? "Saving…" : "Save Access Config"}
      </button>
    </div>
  );
}

// ─── Quizzes Tab ──────────────────────────────────────────────────────────────

// ── blank question factory — 4 fixed options, no correct selected ────────────
function blankQuestion(index: number): QuizQuestion {
  return {
    id: `q${index + 1}_${Date.now()}`,
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
  };
}

function QuizzesTab({
  bootcamps,
  api,
  addToast,
}: {
  bootcamps: Bootcamp[];
  api: ApiClient;
  addToast: (msg: string, type: string) => void;
}) {
  const MIN_Q = 3;
  const MAX_Q = 4;

  const [selectedBootcampId, setSelectedBootcampId] = useState(bootcamps[0]?.id ?? "");
  const [selectedModuleId, setSelectedModuleId] = useState<number | "">("");
  const [selectedRoomId, setSelectedRoomId] = useState<number | "">("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([blankQuestion(0), blankQuestion(1), blankQuestion(2)]);
  const [existing, setExisting] = useState<any>(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const selectedBootcamp = bootcamps.find((b) => b.id === selectedBootcampId);
  const selectedModule = selectedBootcamp?.modules.find((m) => m.moduleId === selectedModuleId);
  const selectedRoom = selectedModule?.rooms.find((r) => r.roomId === selectedRoomId);

  // Load existing quiz whenever room changes
  useEffect(() => {
    if (!selectedBootcampId || !selectedModuleId || !selectedRoomId) {
      setExisting(null);
      return;
    }
    setLoadingExisting(true);
    api.get(
      `/admin/quiz?bootcampId=${encodeURIComponent(selectedBootcampId)}&moduleId=${encodeURIComponent(String(selectedModuleId))}&roomId=${encodeURIComponent(String(selectedRoomId))}`
    )
      .then((res) => {
        if (res.data?.exists && res.data.quiz) {
          setExisting(res.data.quiz);
        } else {
          setExisting(null);
        }
      })
      .catch(() => setExisting(null))
      .finally(() => setLoadingExisting(false));
  }, [selectedBootcampId, selectedModuleId, selectedRoomId]);

  function updateQuestion(id: string, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function updateOption(qId: string, oi: number, value: string) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId) return q;
        const options = [...q.options];
        options[oi] = value;
        return { ...q, options };
      })
    );
  }

  function addQuestion() {
    if (questions.length >= MAX_Q) return;
    setQuestions((prev) => [...prev, blankQuestion(prev.length)]);
  }

  function removeQuestion(id: string) {
    if (questions.length <= MIN_Q) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  async function saveQuiz() {
    if (!selectedBootcampId || !selectedModuleId || !selectedRoomId) {
      addToast("Select a bootcamp, module, and room first.", "error");
      return;
    }
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) { addToast(`Question ${i + 1} is empty.`, "error"); return; }
      if (q.options.some((o) => !o.trim())) { addToast(`All options in question ${i + 1} must be filled.`, "error"); return; }
    }
    setSaving(true);
    try {
      await api.post("/admin/quiz", {
        bootcampId: selectedBootcampId,
        moduleId: Number(selectedModuleId),
        roomId: Number(selectedRoomId),
        totalPoints: questions.length * 10,
        questions: questions.map((q, i) => ({
          id: `q${i + 1}`,
          text: q.text.trim(),
          options: q.options.map((o) => o.trim()),
          correctIndex: q.correctIndex,
          points: 10,
        })),
      });
      addToast("Quiz saved.", "success");
      // Reload existing
      const res = await api.get(
        `/admin/quiz?bootcampId=${encodeURIComponent(selectedBootcampId)}&moduleId=${encodeURIComponent(String(selectedModuleId))}&roomId=${encodeURIComponent(String(selectedRoomId))}`
      );
      setExisting(res.data?.exists ? res.data.quiz : null);
    } catch (e: any) {
      addToast(e?.response?.data?.error || "Failed to save quiz.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteQuiz() {
    if (!window.confirm("Delete this quiz? Students will no longer be able to take it.")) return;
    setDeleting(true);
    try {
      await api.delete(
        `/admin/quiz?bootcampId=${encodeURIComponent(selectedBootcampId)}&moduleId=${encodeURIComponent(String(selectedModuleId))}&roomId=${encodeURIComponent(String(selectedRoomId))}`
      );
      addToast("Quiz deleted.", "success");
      setExisting(null);
      setQuestions([blankQuestion(0), blankQuestion(1), blankQuestion(2)]);
    } catch (e: any) {
      addToast(e?.response?.data?.error || "Failed to delete quiz.", "error");
    } finally {
      setDeleting(false);
    }
  }

  const inp = "w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors";
  const LETTERS = ["A", "B", "C", "D"];

  return (
    <div className="space-y-5 max-w-2xl">

      {/* ── Room selector ── */}
      <div className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Select Room</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Bootcamp */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-text-muted tracking-widest">Bootcamp</label>
            <select
              value={selectedBootcampId}
              onChange={(e) => { setSelectedBootcampId(e.target.value); setSelectedModuleId(""); setSelectedRoomId(""); }}
              className={inp}
            >
              {bootcamps.map((b) => (
                <option key={b.id} value={b.id}>{b.title || b.id}</option>
              ))}
            </select>
          </div>
          {/* Module */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-text-muted tracking-widest">Module</label>
            <select
              value={selectedModuleId}
              onChange={(e) => { setSelectedModuleId(e.target.value === "" ? "" : Number(e.target.value)); setSelectedRoomId(""); }}
              className={inp}
              disabled={!selectedBootcamp?.modules.length}
            >
              <option value="">— Select —</option>
              {(selectedBootcamp?.modules || []).map((m) => (
                <option key={m.moduleId} value={m.moduleId}>M{m.moduleId}: {m.title || "(untitled)"}</option>
              ))}
            </select>
          </div>
          {/* Room */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase text-text-muted tracking-widest">Room</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value === "" ? "" : Number(e.target.value))}
              className={inp}
              disabled={!selectedModule?.rooms.length}
            >
              <option value="">— Select —</option>
              {(selectedModule?.rooms || []).map((r) => (
                <option key={r.roomId} value={r.roomId}>R{r.roomId}: {r.title || "(untitled)"}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Existing quiz status */}
        {selectedRoomId && (
          <div className="pt-1">
            {loadingExisting ? (
              <p className="text-xs text-text-muted">Checking for existing quiz…</p>
            ) : existing ? (
              <div className="flex items-center justify-between gap-3 p-3 bg-accent-dim border border-accent/20 rounded-xl">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">Quiz exists</span>
                  <span className="text-xs text-text-muted ml-2">
                    {existing.questions?.length ?? 0} questions · {existing.totalPoints ?? 0} pts total
                  </span>
                </div>
                <button
                  onClick={() => void deleteQuiz()}
                  disabled={deleting}
                  className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-xl hover:bg-red-500/10 transition-colors disabled:opacity-40"
                >
                  {deleting ? "Deleting…" : "Delete"}
                </button>
              </div>
            ) : (
              <p className="text-xs text-text-muted">No quiz for this room yet.</p>
            )}
          </div>
        )}
      </div>

      {/* ── Question builder ── */}
      {selectedRoomId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
              Questions ({questions.length} / {MAX_Q})
              <span className="ml-2 font-normal normal-case">min {MIN_Q}, max {MAX_Q}</span>
            </p>
            {questions.length < MAX_Q && (
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:text-accent/70 transition-colors"
              >
                <Plus size={13} /> Add Question
              </button>
            )}
          </div>

          {questions.map((q, qi) => (
            <div key={q.id} className="bg-bg-card border border-border rounded-xl p-4 space-y-3">
              {/* Question header */}
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-black text-accent uppercase tracking-widest mt-3 w-6 shrink-0">Q{qi + 1}</span>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  placeholder={`Question ${qi + 1}…`}
                  className="flex-1 bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
                {questions.length > MIN_Q && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="text-text-muted hover:text-red-400 transition-colors mt-2 shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              {/* 4 fixed options */}
              <div className="space-y-2 pl-9">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2.5">
                    {/* Correct answer radio */}
                    <input
                      type="radio"
                      name={`correct-${q.id}`}
                      checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(q.id, { correctIndex: oi })}
                      className="accent-accent shrink-0 w-4 h-4"
                      title="Mark as correct"
                    />
                    {/* Letter badge */}
                    <span className={`text-[10px] font-black w-5 shrink-0 ${q.correctIndex === oi ? 'text-accent' : 'text-text-muted'}`}>
                      {LETTERS[oi]}.
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(q.id, oi, e.target.value)}
                      placeholder={`Option ${LETTERS[oi]}`}
                      className={`flex-1 bg-bg border rounded-xl px-3 py-2 text-sm text-text-primary focus:outline-none transition-colors ${
                        q.correctIndex === oi ? 'border-accent/50 focus:border-accent' : 'border-border focus:border-accent'
                      }`}
                    />
                  </div>
                ))}
                <p className="text-[10px] text-text-muted pt-1">Select the radio button next to the correct answer.</p>
              </div>
            </div>
          ))}

          {/* Save */}
          <button
            type="button"
            disabled={saving || !selectedRoomId}
            onClick={() => void saveQuiz()}
            className="btn-primary text-sm disabled:opacity-50 inline-flex items-center gap-2"
          >
            <Save size={14} />
            {saving ? "Saving…" : existing ? "Update Quiz" : "Save Quiz"}
          </button>
          <p className="text-[10px] text-text-muted">Each question is worth 10 pts · Total: {questions.length * 10} pts</p>
        </div>
      )}
    </div>
  );
}

// ─── Room Completion Tab ──────────────────────────────────────────────────────

type EnrolledStudent = {
  id: string;
  name: string;
  hackerHandle: string;
  email: string;
  bootcampStatus: string;
  cpPoints: number;
  completedRooms: string[];
};

function RoomCompletionTab({
  bootcamp,
  api,
  addToast,
}: {
  bootcamp: Bootcamp | undefined;
  api: ApiClient;
  addToast: (msg: string, type: string) => void;
}) {
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
  }, [bootcamp?.id]);

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

      {/* Module + Room selectors */}
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

      {/* Student list */}
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
}

// ─── JSON Import Tab ──────────────────────────────────────────────────────────

const JSON_IMPORT_EXAMPLE = {
  id: "bc_1775270338500",
  modules: [
    {
      moduleId: 1,
      title: "Reconnaissance & OSINT",
      description: "Learn passive and active recon techniques used by real operators.",
      codename: "GHOST_EYE",
      roleTitle: "Intelligence Analyst",
      ctf: "",
      rooms: [
        {
          roomId: 1,
          title: "Introduction to OSINT",
          overview: "Understand what OSINT is, why it matters, and the mindset of an intelligence operator.",
          cpReward: 250,
          meetingLink: ""
        }
      ]
    }
  ]
};

function JsonImportTab({
  bootcamps,
  selectedBootcampId,
  contentVersion,
  onSave,
  saving,
  addToast,
}: {
  bootcamps: Bootcamp[];
  selectedBootcampId: string;
  contentVersion: number;
  onSave: (bootcamps: any[]) => Promise<void>;
  saving: boolean;
  addToast: (msg: string, type: string) => void;
}) {
  const [jsonText, setJsonText] = useState('');
  const [showExample, setShowExample] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [parseError, setParseError] = useState('');

  const handleParse = () => {
    setParseError('');
    setPreview(null);
    try {
      const parsed = JSON.parse(jsonText);
      // Accept either a single bootcamp object or an array
      const asArray = Array.isArray(parsed) ? parsed : [parsed];
      setPreview(asArray);
    } catch (e: any) {
      setParseError(`JSON parse error: ${e.message}`);
    }
  };

  const handleImport = async () => {
    if (!preview) return;
    // Merge: replace matching bootcamps by id, append new ones
    const merged = [...bootcamps];
    for (const incoming of preview) {
      const idx = merged.findIndex((b) => b.id === incoming.id);
      if (idx >= 0) {
        // Preserve top-level meta, only replace modules if provided
        merged[idx] = {
          ...merged[idx],
          ...(incoming.title ? { title: incoming.title } : {}),
          ...(incoming.description ? { description: incoming.description } : {}),
          ...(incoming.level ? { level: incoming.level } : {}),
          ...(incoming.duration ? { duration: incoming.duration } : {}),
          ...(incoming.modules ? { modules: incoming.modules } : {}),
        };
      } else {
        merged.push(incoming);
      }
    }
    await onSave(merged);
    setJsonText('');
    setPreview(null);
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="text-xs text-text-muted leading-relaxed">
        Paste a bootcamp JSON object (or array of objects) below. The import will merge modules into the matching bootcamp by <code className="text-red-300">id</code>. Existing metadata is preserved unless you include it in the JSON.
      </div>

      {/* Toggle example */}
      <button
        type="button"
        onClick={() => setShowExample((v) => !v)}
        className="text-xs font-bold text-accent hover:text-accent/70 uppercase tracking-widest transition-colors"
      >
        {showExample ? '▲ Hide example' : '▼ Show example JSON'}
      </button>

      {showExample && (
        <div className="bg-bg border border-border rounded-xl p-4 overflow-x-auto">
          <pre className="text-[11px] text-text-secondary font-mono whitespace-pre leading-relaxed">
            {JSON.stringify(JSON_IMPORT_EXAMPLE, null, 2)}
          </pre>
        </div>
      )}

      {/* Textarea */}
      <textarea
        value={jsonText}
        onChange={(e) => { setJsonText(e.target.value); setParseError(''); setPreview(null); }}
        rows={16}
        placeholder={'Paste your bootcamp JSON here...\n\n{ "id": "bc_...", "modules": [...] }'}
        className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary font-mono resize-y focus:outline-none focus:border-accent transition-colors"
      />

      {parseError && (
        <div className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          {parseError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleParse}
          disabled={!jsonText.trim()}
          className="px-4 py-2 border border-border rounded-xl text-xs font-bold uppercase text-text-muted hover:border-accent/30 hover:text-accent disabled:opacity-40 transition-colors"
        >
          Validate JSON
        </button>
        {preview && (
          <button
            type="button"
            onClick={() => void handleImport()}
            disabled={saving}
            className="flex items-center gap-2 bg-red-700 hover:bg-accent disabled:opacity-50 text-white text-xs font-bold uppercase px-4 py-2 rounded transition-colors"
          >
            <Save size={13} />
            {saving ? 'Importing…' : `Import ${preview.length} bootcamp${preview.length !== 1 ? 's' : ''}`}
          </button>
        )}
      </div>

      {/* Preview summary */}
      {preview && (
        <div className="border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-bg-card border-b border-border text-[10px] font-bold uppercase text-text-muted tracking-widest">
            Preview — {preview.length} bootcamp{preview.length !== 1 ? 's' : ''}
          </div>
          {preview.map((bc: any, i: number) => (
            <div key={i} className="px-4 py-3 border-b border-border last:border-0">
              <div className="text-sm font-bold text-text-primary">{bc.title || bc.id || `Bootcamp ${i + 1}`}</div>
              <div className="text-xs text-text-muted mt-0.5">
                id: <span className="text-text-secondary font-mono">{bc.id || '—'}</span>
                {' · '}
                {Array.isArray(bc.modules) ? bc.modules.length : 0} module{(Array.isArray(bc.modules) ? bc.modules.length : 0) !== 1 ? 's' : ''}
                {' · '}
                {Array.isArray(bc.modules) ? bc.modules.reduce((acc: number, m: any) => acc + (Array.isArray(m.rooms) ? m.rooms.length : 0), 0) : 0} rooms
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type Tab = "content" | "access" | "quizzes" | "completion" | "import";

export default function BootcampManager({
  bootcamps,
  selectedBootcampId,
  setSelectedBootcampId,
  contentVersion,
  onSave,
  saving,
  addToast,
  api,
}: Props) {
  const [tab, setTab] = useState<Tab>("content");

  const selectedBootcamp = bootcamps.find((b) => b.id === selectedBootcampId);

  const tabs: { id: Tab; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "access", label: "Phase Access" },
    { id: "quizzes", label: "Quizzes" },
    { id: "completion", label: "Room Completion" },
    { id: "import", label: "JSON Import" },
  ];

  return (
    <div className="flex flex-col h-full bg-bg text-text-primary">
      {/* Sub-tab bar */}
      <div className="flex gap-1 border-b border-border mb-4 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "text-accent border-b-2 border-accent -mb-px"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === "content" && (
          <ContentTab
            bootcamps={bootcamps}
            selectedBootcampId={selectedBootcampId}
            setSelectedBootcampId={setSelectedBootcampId}
            onSave={onSave}
            saving={saving}
          />
        )}
        {tab === "access" && (
          <PhaseAccessTab
            bootcamp={selectedBootcamp}
            contentVersion={contentVersion}
            api={api}
            addToast={addToast}
          />
        )}
        {tab === "quizzes" && <QuizzesTab bootcamps={bootcamps} api={api} addToast={addToast} />}
        {tab === "completion" && (
          <RoomCompletionTab
            bootcamp={selectedBootcamp}
            api={api}
            addToast={addToast}
          />
        )}
        {tab === "import" && (
          <JsonImportTab
            bootcamps={bootcamps}
            selectedBootcampId={selectedBootcampId}
            contentVersion={contentVersion}
            onSave={onSave}
            saving={saving}
            addToast={addToast}
          />
        )}
      </div>
    </div>
  );
}

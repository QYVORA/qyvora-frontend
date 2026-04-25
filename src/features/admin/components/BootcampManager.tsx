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
  readingContent: string;
  readingLinks: { title: string; url: string }[];
  bullets: string[];
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
    readingContent: "",
    readingLinks: [],
    bullets: [],
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
        <label className="text-xs text-zinc-400">{label}</label>
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
          className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
        />
      </div>
    );
  }

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-900 mb-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800 rounded-lg"
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
          className="text-red-400 hover:text-red-300 p-1"
        >
          <Trash2 size={14} />
        </button>
      </button>

      {open && (
        <div className="px-3 pb-3 grid grid-cols-2 gap-3">
          {field("roomId", "Room ID", "number")}
          {field("title", "Title")}
          {field("overview", "Overview")}
          {field("meetingLink", "Meeting Link")}
          {field("cpReward", "CP Reward", "number")}
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-xs text-zinc-400">Reading Content</label>
            <textarea
              rows={3}
              value={room.readingContent}
              onChange={(e) => onChange({ ...room, readingContent: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500 resize-y"
            />
          </div>
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
        <label className="text-xs text-zinc-400">{label}</label>
        <input
          type={key === "moduleId" ? "number" : "text"}
          value={mod[key] as string | number}
          onChange={(e) =>
            onChange({
              ...mod,
              [key]: key === "moduleId" ? Number(e.target.value) : e.target.value,
            })
          }
          className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
        />
      </div>
    );
  }

  return (
    <div className="border border-zinc-700 rounded-lg bg-zinc-950 mb-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800 rounded-lg"
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
          className="text-red-400 hover:text-red-300 p-1"
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

          <p className="text-xs text-zinc-400 mb-2 font-medium uppercase tracking-wide">Rooms</p>
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
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-1"
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
        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={selected[key] as boolean}
            onChange={(e) => updateBootcamp({ ...selected, [key]: e.target.checked })}
            className="accent-red-500"
          />
          {label}
        </label>
      );
    }
    return (
      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-400">{label}</label>
        <input
          type={type}
          value={selected[key] as string | number}
          onChange={(e) =>
            updateBootcamp({
              ...selected,
              [key]: type === "number" ? Number(e.target.value) : e.target.value,
            })
          }
          className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
        />
      </div>
    );
  }

  return (
    <div className="flex gap-4 h-full">
      {/* Bootcamp list */}
      <div className="w-48 shrink-0 flex flex-col gap-1">
        <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Bootcamps</p>
        {local.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => setSelectedBootcampId(b.id)}
            className={`text-left px-3 py-2 rounded text-sm truncate ${
              b.id === selectedBootcampId
                ? "bg-red-900/40 text-red-300 border border-red-700"
                : "text-zinc-300 hover:bg-zinc-800"
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
          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mt-2 px-2"
        >
          <Plus size={12} /> New Bootcamp
        </button>
      </div>

      {/* Editor */}
      {selected && (
        <div className="flex-1 overflow-y-auto pr-1">
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">Metadata</p>
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
            <label className="text-xs text-zinc-400">Description</label>
            <textarea
              rows={3}
              value={selected.description}
              onChange={(e) => updateBootcamp({ ...selected, description: e.target.value })}
              className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500 resize-y"
            />
          </div>

          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">Modules</p>
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
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 mb-6"
          >
            <Plus size={12} /> Add Module
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() => onSave(local)}
            className="flex items-center gap-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded"
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
      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <div
          onClick={() => setAccess((p) => ({ ...p, started: !p.started }))}
          className={`w-10 h-5 rounded-full transition-colors ${
            access.started ? "bg-red-600" : "bg-zinc-700"
          } relative`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
              access.started ? "translate-x-5" : ""
            }`}
          />
        </div>
        <span className="text-sm text-zinc-200">Bootcamp Started</span>
      </label>

      {/* Module / room tree */}
      <div className="flex flex-col gap-3">
        {bootcamp.modules.map((mod) => {
          const modUnlocked = access.unlockedModules.includes(mod.moduleId);
          return (
            <div key={mod.moduleId} className="border border-zinc-800 rounded-lg p-3">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={modUnlocked}
                  onChange={() => toggleModule(mod.moduleId)}
                  className="accent-red-500"
                />
                <span className="text-sm text-zinc-200 flex items-center gap-1">
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
                          className="accent-red-500"
                        />
                        <span className="text-xs text-zinc-300 flex items-center gap-1">
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
        className="flex items-center gap-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded w-fit"
      >
        <Save size={14} />
        {saving ? "Saving…" : "Save Access Config"}
      </button>
    </div>
  );
}

// ─── Quizzes Tab ──────────────────────────────────────────────────────────────

function QuizzesTab({
  api,
  addToast,
}: {
  api: ApiClient;
  addToast: (msg: string, type: string) => void;
}) {
  const [moduleId, setModuleId] = useState<number | "">("");
  const [roomId, setRoomId] = useState<number | "">("");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizMessage, setQuizMessage] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [releasing, setReleasing] = useState(false);

  function addQuestion() {
    setQuestions((prev) => [
      ...prev,
      { id: String(Date.now()), text: "", options: ["", ""], correctIndex: 0 },
    ]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id: string, patch: Partial<QuizQuestion>) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function addOption(qId: string) {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === qId && q.options.length < 4 ? { ...q, options: [...q.options, ""] } : q
      )
    );
  }

  function removeOption(qId: string, oi: number) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== qId || q.options.length <= 2) return q;
        const options = q.options.filter((_, i) => i !== oi);
        return {
          ...q,
          options,
          correctIndex: q.correctIndex >= options.length ? 0 : q.correctIndex,
        };
      })
    );
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

  async function releaseQuiz() {
    if (!moduleId || !roomId || !quizTitle) {
      addToast("Module ID, Room ID, and Title are required", "error");
      return;
    }
    setReleasing(true);
    try {
      await api.post("/admin/bootcamp/quizzes/release", {
        moduleId,
        roomId,
        title: quizTitle,
        message: quizMessage,
        questions: questions.map(({ id: _id, ...q }) => q),
      });
      addToast("Quiz released successfully", "success");
      setQuestions([]);
      setQuizTitle("");
      setQuizMessage("");
    } catch {
      addToast("Failed to release quiz", "error");
    } finally {
      setReleasing(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 max-w-2xl">
      {/* Header fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Module ID</label>
          <input
            type="number"
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Room ID</label>
          <input
            type="number"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Quiz Title</label>
          <input
            type="text"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Quiz Message</label>
          <input
            type="text"
            value={quizMessage}
            onChange={(e) => setQuizMessage(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        <p className="text-xs text-zinc-500 uppercase tracking-wide">Questions</p>
        {questions.map((q, qi) => (
          <div key={q.id} className="border border-zinc-800 rounded-lg p-3 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs text-zinc-400">Question {qi + 1}</label>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                  placeholder="Enter question text…"
                  className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="text-red-400 hover:text-red-300 mt-5"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-xs text-zinc-400">Options</p>
              {q.options.map((opt, oi) => (
                <div key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`correct-${q.id}`}
                    checked={q.correctIndex === oi}
                    onChange={() => updateQuestion(q.id, { correctIndex: oi })}
                    className="accent-red-500 shrink-0"
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(q.id, oi, e.target.value)}
                    placeholder={`Option ${oi + 1}`}
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-red-500"
                  />
                  {q.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(q.id, oi)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))}
              <p className="text-xs text-zinc-500 italic">
                Radio button = correct answer
              </p>
              {q.options.length < 4 && (
                <button
                  type="button"
                  onClick={() => addOption(q.id)}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 w-fit"
                >
                  <Plus size={11} /> Add Option
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 w-fit"
        >
          <Plus size={14} /> Add Question
        </button>
      </div>

      <button
        type="button"
        disabled={releasing}
        onClick={releaseQuiz}
        className="flex items-center gap-2 bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-sm px-4 py-2 rounded w-fit"
      >
        <Save size={14} />
        {releasing ? "Releasing…" : "Release Quiz"}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "content" | "access" | "quizzes";

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
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100">
      {/* Sub-tab bar */}
      <div className="flex gap-1 border-b border-zinc-800 mb-4 shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "text-red-300 border-b-2 border-red-500 -mb-px"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
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
        {tab === "quizzes" && <QuizzesTab api={api} addToast={addToast} />}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Save } from 'lucide-react';
import { Bootcamp, AccessConfig, ApiClient } from './types';

interface PhaseAccessTabProps {
  bootcamp: Bootcamp | undefined;
  contentVersion: number;
  api: ApiClient;
  addToast: (msg: string, type: string) => void;
}

const PhaseAccessTab: React.FC<PhaseAccessTabProps> = ({
  bootcamp,
  contentVersion,
  api,
  addToast,
}) => {
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
  }, [bootcamp?.id, api, addToast]);

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
};

export default PhaseAccessTab;

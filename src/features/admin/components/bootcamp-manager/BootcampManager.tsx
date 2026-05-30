import React, { useState } from "react";
import { Bootcamp, ApiClient } from "./types";
import ContentTab from "./ContentTab";
import PhaseAccessTab from "./PhaseAccessTab";
import RoomCompletionTab from "./RoomCompletionTab";
import JsonImportTab from "./JsonImportTab";

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

type Tab = "content" | "access" | "completion" | "import";

const BootcampManager: React.FC<Props> = ({
  bootcamps,
  selectedBootcampId,
  setSelectedBootcampId,
  contentVersion,
  onSave,
  saving,
  addToast,
  api,
}) => {
  const [tab, setTab] = useState<Tab>("content");

  const selectedBootcamp = bootcamps.find((b) => b.id === selectedBootcampId);

  const tabs: { id: Tab; label: string }[] = [
    { id: "content", label: "Content" },
    { id: "access", label: "Phase Access" },
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
};

export default BootcampManager;

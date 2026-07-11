import { useState, useCallback, useMemo } from 'react';
import {
  Network, ArrowLeft, CheckCircle, AlertTriangle, Send,
  ArrowRight, Eye, Lock, Globe, Code,
} from 'lucide-react';
import { PROXY_SCENARIOS } from '@/features/student/data/simulations/proxy-data';
import type {
  ProxyRequest, ProxyTask,
} from '@/features/student/data/simulations/proxy-data';
import { verifyLabFlag } from '../../../services/lab.service';

type DetailTab = 'headers' | 'body' | 'raw';
type MobilePanel = 'list' | 'request' | 'response';

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'text-green-400 bg-green-400/10',
  intermediate: 'text-yellow-400 bg-yellow-400/10',
  advanced: 'text-red-400 bg-red-400/10',
};

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-400/15 text-green-400 border-green-400/30',
  POST: 'bg-blue-400/15 text-blue-400 border-blue-400/30',
  PUT: 'bg-orange-400/15 text-orange-400 border-orange-400/30',
  DELETE: 'bg-red-400/15 text-red-400 border-red-400/30',
};

interface TaskState {
  completed: boolean;
  hintUsed: boolean;
  flagInput: string;
  flagFeedback: 'success' | 'error' | null;
}

export default function ProxyLab() {
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [requestTab, setRequestTab] = useState<DetailTab>('headers');
  const [responseTab, setResponseTab] = useState<DetailTab>('headers');
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('list');
  const [taskStates, setTaskStates] = useState<Record<string, TaskState>>({});

  const activeScenario = useMemo(
    () => PROXY_SCENARIOS.find((s) => s.id === activeScenarioId) ?? null,
    [activeScenarioId],
  );

  const selectedRequest = useMemo(() => {
    if (!activeScenario || !selectedRequestId) return null;
    return activeScenario.requests.find((r) => r.id === selectedRequestId) ?? null;
  }, [activeScenario, selectedRequestId]);

  const completedTasks = useMemo(() => {
    if (!activeScenario) return 0;
    return activeScenario.tasks.filter((_, i) => taskStates[`${activeScenarioId}-${i}`]?.completed).length;
  }, [activeScenario, activeScenarioId, taskStates]);

  const totalCP = useMemo(() => {
    if (!activeScenario) return 0;
    const perTask = Math.floor(activeScenario.cpReward / activeScenario.tasks.length);
    return activeScenario.tasks.reduce((acc, _, i) => {
      return acc + (taskStates[`${activeScenarioId}-${i}`]?.completed ? perTask : 0);
    }, 0);
  }, [activeScenario, activeScenarioId, taskStates]);

  const overallCompleted = useMemo(() => {
    return PROXY_SCENARIOS.reduce((acc, scenario) => {
      const allDone = scenario.tasks.every((_, i) => taskStates[`${scenario.id}-${i}`]?.completed);
      return acc + (allDone ? 1 : 0);
    }, 0);
  }, [taskStates]);

  const handleStartScenario = useCallback((scenarioId: string) => {
    setActiveScenarioId(scenarioId);
    const scenario = PROXY_SCENARIOS.find((s) => s.id === scenarioId);
    if (scenario && scenario.requests.length > 0) {
      setSelectedRequestId(scenario.requests[0].id);
    }
    setRequestTab('headers');
    setResponseTab('headers');
    setMobilePanel('list');
  }, []);

  const handleBack = useCallback(() => {
    setActiveScenarioId(null);
    setSelectedRequestId(null);
    setMobilePanel('list');
  }, []);

  const handleSelectRequest = useCallback((requestId: string) => {
    setSelectedRequestId(requestId);
    setRequestTab('headers');
    setResponseTab('headers');
    setMobilePanel('request');
  }, []);

  const handleTaskFlagSubmit = useCallback(async (scenarioId: string, taskIndex: number, task: ProxyTask) => {
    const key = `${scenarioId}-${taskIndex}`;
    setTaskStates((prev) => {
      const current = prev[key] ?? { completed: false, hintUsed: false, flagInput: '', flagFeedback: null };
      return { ...prev, [key]: { ...current, flagFeedback: null as 'success' | 'error' | null } };
    });
    try {
      const currentInput = taskStates[key]?.flagInput ?? '';
      const result = await verifyLabFlag('proxy', scenarioId, currentInput.trim());
      setTaskStates((prev) => {
        const current = prev[key] ?? { completed: false, hintUsed: false, flagInput: '', flagFeedback: null };
        if (result.correct) {
          return { ...prev, [key]: { ...current, completed: true, flagFeedback: 'success' as const } };
        }
        return { ...prev, [key]: { ...current, flagFeedback: 'error' as const } };
      });
    } catch {
      setTaskStates((prev) => {
        const current = prev[key] ?? { completed: false, hintUsed: false, flagInput: '', flagFeedback: null };
        return { ...prev, [key]: { ...current, flagFeedback: 'error' as const } };
      });
    }
    setTimeout(() => {
      setTaskStates((prev) => {
        const current = prev[key];
        if (current?.flagFeedback) {
          return { ...prev, [key]: { ...current, flagFeedback: null } };
        }
        return prev;
      });
    }, 3000);
  }, [taskStates]);

  const handleTaskHintToggle = useCallback((scenarioId: string, taskIndex: number) => {
    const key = `${scenarioId}-${taskIndex}`;
    setTaskStates((prev) => {
      const current = prev[key] ?? { completed: false, hintUsed: false, flagInput: '', flagFeedback: null };
      return { ...prev, [key]: { ...current, hintUsed: true } };
    });
  }, []);

  const handleTaskFlagInput = useCallback((scenarioId: string, taskIndex: number, value: string) => {
    const key = `${scenarioId}-${taskIndex}`;
    setTaskStates((prev) => {
      const current = prev[key] ?? { completed: false, hintUsed: false, flagInput: '', flagFeedback: null };
      return { ...prev, [key]: { ...current, flagInput: value } };
    });
  }, []);

  const formatRawRequest = (req: ProxyRequest) => {
    const lines: string[] = [];
    lines.push(`${req.method} ${req.path} HTTP/1.1`);
    lines.push(`Host: ${new URL(req.url).hostname}`);
    Object.entries(req.headers).forEach(([key, val]) => {
      if (key !== 'Host') lines.push(`${key}: ${val}`);
    });
    if (req.body) {
      lines.push('');
      lines.push(req.body);
    }
    return lines.join('\n');
  };

  const formatRawResponse = (req: ProxyRequest) => {
    const lines: string[] = [];
    lines.push(`HTTP/1.1 ${req.response.statusCode} ${req.response.statusText}`);
    Object.entries(req.response.headers).forEach(([key, val]) => {
      lines.push(`${key}: ${val}`);
    });
    lines.push('');
    lines.push(req.response.body);
    return lines.join('\n');
  };

  const getStatusColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-400';
    if (code >= 300 && code < 400) return 'text-yellow-400';
    if (code >= 400 && code < 500) return 'text-orange-400';
    return 'text-red-400';
  };

  /* ── Scenario Selection ── */
  if (!activeScenario) {
    return (
      <div className="bg-bg min-h-full">
        <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Network className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tight">
                    Web <span className="text-accent">Proxy</span>
                  </h1>
                  <p className="text-sm text-text-muted font-mono mt-1">
                    Burp Suite Simulator Lab
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-border/30 bg-bg-card px-4 py-2 flex items-center gap-2">
                <Network className="w-4 h-4 text-accent" />
                <span className="text-xs font-black text-text-primary">{overallCompleted}/{PROXY_SCENARIOS.length}</span>
                <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Scenarios</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROXY_SCENARIOS.map((scenario) => {
              const tasksDone = scenario.tasks.filter((_, i) => taskStates[`${scenario.id}-${i}`]?.completed).length;
              return (
                <button
                  key={scenario.id}
                  onClick={() => handleStartScenario(scenario.id)}
                  className="text-left rounded-2xl border border-border/30 bg-bg-card p-5 hover:border-accent/30 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                      <Network className="w-5 h-5 text-accent" />
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
                      {scenario.difficulty}
                    </span>
                  </div>
                  <h3 className="text-sm font-black text-text-primary mb-1">{scenario.title}</h3>
                  <p className="text-[11px] text-text-muted font-mono leading-relaxed mb-4 line-clamp-2">
                    {scenario.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3 h-3 text-text-muted" />
                        <span className="text-[10px] font-mono text-text-muted">{scenario.requests.length} requests</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3 text-text-muted" />
                        <span className="text-[10px] font-mono text-text-muted">{tasksDone}/{scenario.tasks.length}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-2 py-1">
                      <span className="text-[10px] font-black text-accent">{scenario.cpReward}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-accent">CP</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black uppercase tracking-widest">Start Lab</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ── Active Scenario ── */
  return (
    <div className="bg-bg min-h-full">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-8 pb-20 lg:pb-24 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-xl border border-border/30 bg-bg-card flex items-center justify-center hover:border-accent/30 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-text-muted" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black text-text-primary">{activeScenario.title}</h2>
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${DIFFICULTY_COLORS[activeScenario.difficulty]}`}>
                  {activeScenario.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-text-muted font-mono mt-0.5">{activeScenario.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-border/30 bg-bg-card px-3 py-1.5 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] font-black text-text-primary">{completedTasks}/{activeScenario.tasks.length}</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-text-muted">Tasks</span>
            </div>
            <div className="rounded-2xl border border-accent/30 bg-accent/5 px-3 py-1.5 flex items-center gap-2">
              <span className="text-xs font-black text-accent">{totalCP}</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-accent">CP</span>
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden gap-1 bg-bg-card rounded-xl border border-border/30 p-1">
          {(['list', 'request', 'response'] as const).map((panel) => (
            <button
              key={panel}
              onClick={() => setMobilePanel(panel)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${
                mobilePanel === panel
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {panel === 'list' ? 'Requests' : panel === 'request' ? 'Request' : 'Response'}
            </button>
          ))}
        </div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Request List */}
          <div className={`w-full lg:w-[280px] shrink-0 rounded-2xl border border-border/30 bg-bg-card overflow-hidden flex flex-col ${
            mobilePanel !== 'list' ? 'hidden lg:flex' : 'flex'
          }`}>
            <div className="px-4 py-3 border-b border-border/20">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">
                  Intercepted Requests
                </span>
              </div>
              <p className="text-[9px] font-mono text-text-muted mt-1">
                {activeScenario.requests.length} requests captured
              </p>
            </div>
            <div className="flex-1 overflow-auto max-h-[500px] divide-y divide-border/10">
              {activeScenario.requests.map((req, index) => (
                <button
                  key={req.id}
                  onClick={() => handleSelectRequest(req.id)}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    selectedRequestId === req.id
                      ? 'bg-accent/10 border-l-2 border-l-accent'
                      : req.isInteresting
                        ? 'hover:bg-white/[0.02] border-l-2 border-l-accent/30'
                        : 'hover:bg-white/[0.02] border-l-2 border-l-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-mono text-text-muted/50 w-4 text-right">{index + 1}</span>
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg border ${METHOD_COLORS[req.method] ?? 'bg-gray-400/15 text-gray-400 border-gray-400/30'}`}>
                      {req.method}
                    </span>
                    <span className={`text-[10px] font-mono ${getStatusColor(req.response.statusCode)}`}>
                      {req.response.statusCode}
                    </span>
                    {req.isInteresting && (
                      <Eye className="w-3 h-3 text-accent shrink-0" />
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-text-muted truncate pl-6">
                    {req.path}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex-1 min-w-0 space-y-4">
            {selectedRequest ? (
              <>
                {/* Request Details */}
                <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${
                  mobilePanel === 'response' ? 'hidden lg:block' : mobilePanel === 'list' ? 'hidden lg:block' : 'block'
                }`}>
                  <div className="px-4 py-3 border-b border-border/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="w-3.5 h-3.5 text-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-accent">Request</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-lg border ${METHOD_COLORS[selectedRequest.method] ?? ''}`}>
                        {selectedRequest.method}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">{selectedRequest.url}</span>
                    </div>
                    {selectedRequest.vulnerability && (
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                        <AlertTriangle className="w-3 h-3 text-yellow-400" />
                        <span className="text-[9px] font-black text-yellow-400">Interesting</span>
                      </div>
                    )}
                  </div>
                  <DetailTabs
                    activeTab={requestTab}
                    onTabChange={setRequestTab}
                    headers={selectedRequest.headers}
                    body={selectedRequest.body}
                    raw={formatRawRequest(selectedRequest)}
                  />
                </div>

                {/* Response Details */}
                <div className={`rounded-2xl border border-border/30 bg-bg-card overflow-hidden ${
                  mobilePanel === 'request' ? 'hidden lg:block' : mobilePanel === 'list' ? 'hidden lg:block' : 'block'
                }`}>
                  <div className="px-4 py-3 border-b border-border/20 flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Response</span>
                    <span className={`text-[10px] font-mono font-bold ${getStatusColor(selectedRequest.response.statusCode)}`}>
                      {selectedRequest.response.statusCode} {selectedRequest.response.statusText}
                    </span>
                  </div>
                  <DetailTabs
                    activeTab={responseTab}
                    onTabChange={setResponseTab}
                    headers={selectedRequest.response.headers}
                    body={selectedRequest.response.body}
                    raw={formatRawResponse(selectedRequest)}
                  />
                </div>

                {/* Vulnerability hint */}
                {selectedRequest.vulnerability && (
                  <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 px-4 py-3 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest">Potential Vulnerability</p>
                      <p className="text-[11px] font-mono text-text-muted mt-1">{selectedRequest.vulnerability}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-border/30 bg-bg-card p-8 text-center">
                <Network className="w-10 h-10 text-text-muted/30 mx-auto mb-3" />
                <p className="text-xs text-text-muted font-mono">
                  Select a request from the list to view details.
                </p>
              </div>
            )}

            {/* Tasks */}
            <div className="rounded-2xl border border-border/30 bg-bg-card p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Tasks</span>
              </div>
              {activeScenario.tasks.map((task, index) => {
                const key = `${activeScenarioId}-${index}`;
                const state = taskStates[key] ?? { completed: false, hintUsed: false, flagInput: '', flagFeedback: null };
                return (
                  <div
                    key={index}
                    className={`rounded-xl border p-3 transition-colors ${
                      state.completed
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-border/20 bg-bg'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {state.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-border/40 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-[11px] font-mono leading-relaxed ${state.completed ? 'text-green-400' : 'text-text-primary'}`}>
                          {task.description}
                        </p>

                        {!state.completed && (
                          <div className="mt-2 space-y-2">
                            {state.hintUsed ? (
                              <div className="px-2.5 py-1.5 rounded-lg bg-yellow-400/5 border border-yellow-400/20 text-[10px] font-mono text-yellow-400">
                                Hint: {task.hint}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleTaskHintToggle(activeScenarioId!, index)}
                                className="btn-secondary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest text-yellow-400 hover:text-yellow-300 transition-colors"
                              >
                                <AlertTriangle className="w-3 h-3 mr-1 inline" />
                                Show Hint
                              </button>
                            )}

                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="FLAG{...}"
                                value={state.flagInput}
                                onChange={(e) => handleTaskFlagInput(activeScenarioId!, index, e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleTaskFlagSubmit(activeScenarioId!, index, task); }}
                                className={`flex-1 bg-bg border border-border rounded-xl py-3 px-4 text-text-primary focus:border-accent outline-none font-mono text-sm ${
                                  state.flagFeedback === 'error'
                                    ? 'border-red-500/50'
                                    : 'border-border/30 focus:border-accent'
                                }`}
                              />
                              <button
                                onClick={() => handleTaskFlagSubmit(activeScenarioId!, index, task)}
                                className="btn-primary !rounded-xl !text-[10px] !font-black !uppercase !tracking-widest !px-3 !py-1.5 shrink-0"
                              >
                                Submit
                              </button>
                            </div>
                            {state.flagFeedback === 'error' && (
                              <p className="text-[9px] font-mono text-red-400">Incorrect flag. Try again.</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Detail Tabs Component ── */

interface DetailTabsProps {
  activeTab: DetailTab;
  onTabChange: (tab: DetailTab) => void;
  headers: Record<string, string>;
  body?: string;
  raw: string;
}

function DetailTabs({ activeTab, onTabChange, headers, body, raw }: DetailTabsProps) {
  return (
    <div>
      <div className="flex items-center gap-1 px-4 pt-2 border-b border-border/20">
        {(['headers', 'body', 'raw'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-t-lg text-[9px] font-black uppercase tracking-widest transition-colors ${
              activeTab === tab
                ? 'bg-bg text-accent border border-border/30 border-b-transparent -mb-px'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab === 'headers' && <Lock className="w-2.5 h-2.5" />}
            {tab === 'body' && <Code className="w-2.5 h-2.5" />}
            {tab === 'raw' && <Eye className="w-2.5 h-2.5" />}
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4 min-h-[120px] max-h-[300px] overflow-auto">
        {activeTab === 'headers' && (
          <div className="rounded-xl border border-border/20 bg-bg overflow-hidden">
            <table className="w-full text-[10px] font-mono">
              <thead>
                <tr className="border-b border-border/20">
                  <th className="text-left px-3 py-1.5 text-text-muted font-black uppercase tracking-widest">Header</th>
                  <th className="text-left px-3 py-1.5 text-text-muted font-black uppercase tracking-widest">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(headers).map(([key, val]) => (
                  <tr key={key} className="border-b border-border/10 last:border-0">
                    <td className="px-3 py-1.5 text-yellow-400 whitespace-nowrap">{key}</td>
                    <td className="px-3 py-1.5 text-text-muted break-all">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'body' && (
          <div className="rounded-xl border border-border/20 bg-bg p-3">
            <pre className="text-[10px] font-mono text-text-muted/70 whitespace-pre-wrap break-all leading-relaxed">
              {body ?? <span className="text-text-muted/40 italic">No body</span>}
            </pre>
          </div>
        )}
        {activeTab === 'raw' && (
          <div className="rounded-xl border border-border/20 bg-[#0a0f1a] p-3">
            <pre className="text-[10px] font-mono text-text-muted/60 whitespace-pre-wrap break-all leading-relaxed">
              {raw}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Search, Github, ExternalLink, Calendar, User, BookOpen, RefreshCw } from 'lucide-react';
import api from '../../../core/services/api';

interface AssignmentSubmission {
  id: string;
  userId: string;
  userName: string;
  hackerHandle: string;
  email: string;
  bootcampId: string;
  moduleId: number;
  githubRepoUrl: string;
  status: string;
  submittedAt: string;
}

const AssignmentManager: React.FC = () => {
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/bootcamp/assignments');
      setSubmissions(res.data?.items || []);
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const filtered = submissions.filter(s => 
    s.userName.toLowerCase().includes(query.toLowerCase()) ||
    s.hackerHandle.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase()) ||
    s.githubRepoUrl.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by student, handle, or URL..."
            className="w-full bg-bg border-2 border-border rounded-xl pl-12 pr-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <button
          onClick={loadSubmissions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-border bg-bg-card text-text-muted text-sm font-bold hover:text-accent hover:border-accent/40 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="h-48 rounded-2xl border-2 border-border bg-bg-card animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-bg-card border-2 border-dashed border-border rounded-2xl">
            <Github className="w-12 h-12 text-text-muted/30 mx-auto mb-4" />
            <p className="text-sm text-text-muted font-bold uppercase tracking-widest">No assignments found</p>
          </div>
        ) : filtered.map(item => (
          <div key={item.id} className="bg-bg-card border-2 border-border rounded-2xl p-6 space-y-4 hover:border-accent/30 transition-colors group">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-dim border border-accent/20">
                  <User className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-black text-text-primary text-lg leading-tight group-hover:text-accent transition-colors">
                    {item.hackerHandle || item.userName}
                  </h3>
                  <p className="text-xs text-text-muted font-mono">{item.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-2 py-1 rounded bg-accent-dim text-[10px] font-black uppercase tracking-widest text-accent border border-accent/20">
                  Module {item.moduleId}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-mono">
                  <Calendar className="h-3 w-3" />
                  {new Date(item.submittedAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-text-muted">
                <BookOpen className="h-3.5 w-3.5" />
                Bootcamp: {item.bootcampId}
              </div>
              
              <div className="relative flex items-center gap-3 rounded-xl bg-bg border border-border p-4 overflow-hidden">
                <Github className="h-5 w-5 text-text-muted" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-accent mb-0.5">GitHub Repository</p>
                  <p className="text-xs font-mono text-text-primary truncate">{item.githubRepoUrl}</p>
                </div>
                <a
                  href={item.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-bg transition-all"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Auto-Verified
              </span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Submitted {new Date(item.submittedAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignmentManager;

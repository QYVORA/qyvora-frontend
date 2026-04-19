import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Terminal, 
  Users, 
  ShoppingBag, 
  LayoutDashboard, 
  LogOut, 
  ArrowRight, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Settings,
  Database,
  Lock
} from 'lucide-react';
import { useAuth } from '../../../core/contexts/AuthContext';
import { useToast } from '../../../core/contexts/ToastContext';
import Logo from '../../../shared/components/brand/Logo';
import api from '../../../core/services/api';

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'users' | 'bootcamps' | 'rooms'>('users');
  const [overview, setOverview] = useState<any>(null);

  const handleLogout = async () => {
    await logout();
    addToast('Security session terminated.', 'info');
    navigate('/login');
  };

  const [users, setUsers] = useState([
    { id: '1', username: 'OPERATOR_N0D3', role: 'Admin', cp: 2450, rank: 'Senior' },
    { id: '2', username: 'shadow_walk', role: 'User', cp: 21200, rank: 'Master' },
    { id: '3', username: 'null_pointer', role: 'User', cp: 15900, rank: 'Senior' },
  ]);

  const [bootcamps, setBootcamps] = useState([
    { id: '1', title: 'Web Penetration Mastery', students: 124, status: 'Active' },
    { id: '2', title: 'Offensive Infrastructure', students: 85, status: 'Active' },
    { id: '3', title: 'AV Evasion Pro', students: 42, status: 'Draft' },
  ]);

  const [rooms, setRooms] = useState([
    { id: '1', title: 'Rooting Solaris', difficulty: 'Med', clears: 156 },
    { id: '2', title: 'AD Ghost Town', difficulty: 'Hard', clears: 142 },
    { id: '3', title: 'Blind SQLi Mastery', difficulty: 'Spec', clears: 128 },
  ]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [overviewRes, usersRes, bootcampsRes, roomsRes] = await Promise.all([
          api.get('/admin/overview'),
          api.get('/admin/users'),
          api.get('/public/bootcamps'),
          api.get('/admin/rooms'),
        ]);
        if (!mounted) return;

        setOverview(overviewRes.data || null);

        const userItems = Array.isArray(usersRes.data?.items) ? usersRes.data.items : [];
        if (userItems.length) {
          setUsers(
            userItems.map((item: any) => ({
              id: String(item?.id || ''),
              username: item?.hackerHandle || item?.name || item?.email || 'operator',
              role: item?.role === 'admin' ? 'Admin' : 'User',
              cp: Number(item?.cpPoints || 0),
              rank: Number(item?.cpPoints || 0) >= 1500 ? 'Vanguard' : Number(item?.cpPoints || 0) >= 900 ? 'Architect' : Number(item?.cpPoints || 0) >= 450 ? 'Specialist' : 'Candidate',
            }))
          );
        }

        const bootcampItems = Array.isArray(bootcampsRes.data?.items) ? bootcampsRes.data.items : [];
        if (bootcampItems.length) {
          setBootcamps(
            bootcampItems.map((item: any, index: number) => ({
              id: String(item?.id || index + 1),
              title: String(item?.title || 'Bootcamp'),
              students: Number(overviewRes.data?.users?.byRole?.student || 0),
              status: item?.isActive === false ? 'Draft' : 'Active',
            }))
          );
        }

        const roomItems = Array.isArray(roomsRes.data?.items) ? roomsRes.data.items : [];
        if (roomItems.length) {
          setRooms(
            roomItems.map((item: any) => ({
              id: String(item?.id || ''),
              title: String(item?.title || 'Room'),
              difficulty: String(item?.level || 'Medium'),
              clears: 0,
            }))
          );
        }
      } catch {
        if (!mounted) return;
        setOverview(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const sidebarLinks = [
    { label: 'Admin Home', path: '/mr-robot', icon: Lock },
    { label: 'Platform Home', path: '/', icon: ArrowRight },
    { label: 'Operator View', path: '/dashboard', icon: LayoutDashboard }
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 border-r border-border bg-bg-card p-6 flex flex-col z-20">
        <div className="mb-10">
          <Link to="/"><Logo size="md" className="mb-2" /></Link>
          <div className="text-[10px] font-bold text-accent font-mono tracking-[0.2em]">ADMIN_CONSOLE // V2.0</div>
        </div>

        <nav className="flex-grow space-y-1">
          {sidebarLinks.map((link) => (
            <Link 
              key={link.label} 
              to={link.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${
                location.pathname === link.path || (link.path === '/mr-robot' && location.pathname.startsWith('/mr-robot')) ? 'bg-accent text-bg shadow-[0_0_15px_rgba(136,173,124,0.3)]' : 'text-text-muted hover:bg-accent-dim hover:text-text-primary'
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}

          <div className="pt-8 pb-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest px-4">Management</span>
          </div>

          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'users' ? 'text-accent bg-accent-dim' : 'text-text-muted hover:bg-accent-dim'}`}
          >
            <Users className="w-4 h-4" /> Users
          </button>
          <button 
             onClick={() => setActiveTab('bootcamps')}
             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'bootcamps' ? 'text-accent bg-accent-dim' : 'text-text-muted hover:bg-accent-dim'}`}
          >
            <Shield className="w-4 h-4" /> Bootcamps
          </button>
          <button 
             onClick={() => setActiveTab('rooms')}
             className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors ${activeTab === 'rooms' ? 'text-accent bg-accent-dim' : 'text-text-muted hover:bg-accent-dim'}`}
          >
            <Terminal className="w-4 h-4" /> Rooms
          </button>
        </nav>

        <div className="mt-10 pt-6 border-t border-border">
          <div className="flex items-center gap-4 mb-6 px-4">
             <div className="w-8 h-8 rounded bg-accent-dim flex items-center justify-center text-accent font-bold text-xs">
               {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
             </div>
             <div className="flex flex-col">
               <span className="text-xs font-bold text-text-primary">{user?.username || 'ADMIN'}</span>
               <span className="text-[9px] text-accent uppercase font-bold tracking-tighter">System Admin</span>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-400/10 rounded transition-colors"
          >
            <LogOut className="w-4 h-4" /> Terminate
          </button>
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="flex-grow p-4 md:p-10 pb-24 md:pb-10 overflow-y-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary uppercase flex items-center gap-3 tracking-tighter">
              {activeTab} Management <div className="w-1.5 h-6 bg-accent" />
            </h1>
            <p className="text-sm text-text-muted mt-1 font-mono">/root/console/{activeTab}</p>
          </div>
          <button className="btn-primary flex items-center gap-2 !py-2 !px-5 text-sm">
             <Plus className="w-4 h-4" /> ADD_{activeTab.toUpperCase().slice(0, -1)}
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-8 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input 
            type="text" 
            placeholder={`Filter ${activeTab}...`} 
            className="w-full bg-bg-card border border-border rounded-md pl-10 pr-4 py-2 text-sm text-text-primary focus:border-accent outline-none font-mono"
          />
        </div>

        {/* DATA TABLE */}
        <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {activeTab === 'users' && (
              <table className="w-full text-left">
                <thead className="bg-bg border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Operator</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Role</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Rank</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">CP Balance</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-accent-dim/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-text-primary">{u.username}</div>
                        <div className="text-[10px] text-text-muted font-mono tracking-tighter">UID: {u.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${u.role === 'Admin' ? 'bg-accent-dim text-accent border-accent/20' : 'bg-bg text-text-muted border-border'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{u.rank}</td>
                      <td className="px-6 py-4 text-sm font-mono text-accent font-bold">{u.cp.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-text-muted hover:text-accent transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'bootcamps' && (
              <table className="w-full text-left">
                <thead className="bg-bg border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Module Title</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Students</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bootcamps.map((b) => (
                    <tr key={b.id} className="hover:bg-accent-dim/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-text-primary">{b.title}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{b.students} ENROLLED</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${b.status === 'Active' ? 'bg-green-400/10 text-green-400 border-green-400/20' : 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-text-muted hover:text-accent transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'rooms' && (
              <table className="w-full text-left">
                <thead className="bg-bg border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Room Name</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Diff</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Total Clears</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rooms.map((r) => (
                    <tr key={r.id} className="hover:bg-accent-dim/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-text-primary">{r.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-bg text-text-muted border-border">
                          {r.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary font-mono">{r.clears} NODES</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-text-muted hover:text-accent transition-colors"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 text-text-muted hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* SYSTEM STATUS FOOTER */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-tighter">Database Load</span>
            </div>
            <span className="text-xs font-mono text-accent">{Number(overview?.users?.active24h || 0)} ACTIVE</span>
          </div>
          <div className="p-4 bg-bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-tighter">API Status</span>
            </div>
            <span className="text-xs font-mono text-accent">HEALTHY</span>
          </div>
          <div className="p-4 bg-bg-card border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plus className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-text-primary uppercase tracking-tighter">Queue size</span>
            </div>
            <span className="text-xs font-mono text-accent">{Number(overview?.pentests?.total || 0)} PENTESTS</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

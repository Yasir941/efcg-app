import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  ShieldCheck,
  Users,
  AlertCircle,
  ClipboardList,
  Bug,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';

export default function Administration() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAdminData() {
      try {
        const [statsRes, usersRes, auditRes, errorsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/audit'),
          api.get('/admin/errors')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data || []);
        setAuditLogs(auditRes.data || []);
        setErrorLogs(errorsRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load administration data.');
      } finally {
        setLoading(false);
      }
    }
    fetchAdminData();
  }, []);

  const fmtDate = (d) => new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-cardBg rounded-xl"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-cardBg border border-borderColor/40 rounded-2xl shimmer"></div>
          ))}
        </div>
        <div className="h-96 bg-cardBg border border-borderColor/40 rounded-2xl shimmer"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">System <span className="text-gradient-brand">Administration</span></h2>
        <p className="text-textSecondary mt-1.5 text-sm">Platform oversight — users, audit trails, and system error logs.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 p-4 bg-coralAccent/10 border border-coralAccent/20 text-coralAccent text-sm rounded-xl animate-scale-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <p className="font-medium text-xs">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 stagger-in">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'primaryAccent' },
            { label: 'Total Clients', value: stats.totalClients, icon: Layers, color: 'secondaryAccent' },
            { label: 'Audit Events', value: stats.totalAudits, icon: ClipboardList, color: 'goldAccent' },
            { label: 'Error Logs', value: stats.totalErrors, icon: Bug, color: 'coralAccent' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card-interactive bg-cardBg border border-borderColor/40 rounded-2xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-textMuted">{label}</p>
                  <h3 className="text-3xl font-extrabold mt-2 text-textPrimary">{value}</h3>
                </div>
                <div className={`w-11 h-11 bg-${color}/10 border border-${color}/20 rounded-xl flex items-center justify-center text-${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-2 bg-surfaceBg border border-borderColor/40 p-1.5 rounded-xl w-fit flex-wrap">
        {[
          { id: 'users', label: `Users (${users.length})`, icon: Users },
          { id: 'audit', label: `Audit Log (${auditLogs.length})`, icon: ClipboardList },
          { id: 'errors', label: `Error Log (${errorLogs.length})`, icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primaryAccent to-primaryDark text-white shadow-glow'
                  : 'text-textMuted hover:text-textPrimary hover:bg-darkBg/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="card-interactive bg-cardBg rounded-2xl overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borderColor/40 bg-surfaceBg/50">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Name</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Email</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Title</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Role</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-16 text-center text-textMuted text-sm">No users found.</td></tr>
                ) : users.map((u) => (
                  <tr key={u._id} className="border-b border-borderColor/30 hover:bg-surfaceBg/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-textPrimary">{u.name}</td>
                    <td className="px-6 py-4 text-textSecondary text-xs">{u.email}</td>
                    <td className="px-6 py-4 text-textSecondary text-xs">{u.title || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`badge ${u.role === 'admin' ? 'badge-gold' : 'badge-purple'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textSecondary text-xs">{fmtDate(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log Table */}
      {activeTab === 'audit' && (
        <div className="card-interactive bg-cardBg rounded-2xl overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borderColor/40 bg-surfaceBg/50">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Timestamp</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">User</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Action</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Details</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-16 text-center text-textMuted text-sm">No audit events recorded.</td></tr>
                ) : auditLogs.map((log) => (
                  <tr key={log._id} className="border-b border-borderColor/30 hover:bg-surfaceBg/50 transition-colors">
                    <td className="px-6 py-4 text-textSecondary text-[11px] whitespace-nowrap">{fmtDate(log.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-textPrimary text-xs">{log.userId?.name || 'System'}</div>
                      <div className="text-[10px] text-textMuted uppercase mt-0.5">{log.userId?.role || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="badge badge-teal whitespace-nowrap">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-textSecondary text-[11px] max-w-xs truncate">{log.details || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error Log Table */}
      {activeTab === 'errors' && (
        <div className="card-interactive bg-cardBg rounded-2xl overflow-hidden fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-borderColor/40 bg-surfaceBg/50">
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Timestamp</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Error</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">User</th>
                  <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Destination</th>
                </tr>
              </thead>
              <tbody>
                {errorLogs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-successColor/10 text-successColor rounded-full flex items-center justify-center mb-4">
                          <Activity className="w-8 h-8" />
                        </div>
                        <p className="text-textPrimary font-bold text-base">Platform is Healthy</p>
                        <p className="text-textMuted text-xs mt-1">No system errors recorded.</p>
                      </div>
                    </td>
                  </tr>
                ) : errorLogs.map((log) => (
                  <tr key={log._id} className="border-b border-borderColor/30 hover:bg-surfaceBg/50 transition-colors">
                    <td className="px-6 py-4 text-textSecondary text-[11px] whitespace-nowrap">{fmtDate(log.createdAt)}</td>
                    <td className="px-6 py-4">
                      <p className="text-coralAccent font-semibold text-xs">{log.errorMessage}</p>
                      {log.stackTrace && (
                         <div className="mt-1.5 p-2 bg-darkBg/50 rounded border border-borderColor/30">
                           <p className="text-textMuted text-[10px] font-mono truncate max-w-sm">{log.stackTrace.split('\n')[0]}</p>
                         </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-textSecondary text-xs">{log.userId?.name || 'Anonymous'}</td>
                    <td className="px-6 py-4">
                      <span className="badge badge-gold">
                        {log.logDestination}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

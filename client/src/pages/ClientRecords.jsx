import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  Users,
  Search,
  CheckCircle,
  XCircle,
  UserPlus,
  X,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';

export default function ClientRecords() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '', status: 'active', dataConsentStatus: false });
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data || []);
    } catch (err) {
      console.error('Failed to load clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    setAddError('');
    if (!newClient.name.trim()) {
      setAddError('Client name is required.');
      return;
    }
    setAddLoading(true);
    try {
      await api.post('/clients', newClient);
      setNewClient({ name: '', email: '', phone: '', status: 'active', dataConsentStatus: false });
      setShowAdd(false);
      await fetchClients();
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add client.');
    } finally {
      setAddLoading(false);
    }
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getInitials = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const avatarColors = [
    'from-primaryAccent to-primaryDark text-white',
    'from-secondaryAccent to-[#05B68E] text-white',
    'from-goldAccent to-[#E6AB17] text-[#070B14]',
    'from-coralAccent to-[#D9254D] text-white'
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Client <span className="text-gradient-brand">Records</span></h2>
          <p className="text-textSecondary mt-1.5 text-sm">Manage and review all advisory client profiles.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary px-5 py-3 text-sm flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative fade-in">
        <Search className="absolute inset-y-0 left-4 my-auto w-4 h-4 text-textMuted" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-field w-full pl-12"
        />
      </div>

      {/* Clients Table */}
      <div className="card-interactive bg-cardBg rounded-2xl overflow-hidden fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-borderColor/40 bg-surfaceBg/50">
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Client</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Contact</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Joined</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Status</th>
                <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted">Consent</th>
                <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-textMuted"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-borderColor/20">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-borderColor/30 rounded shimmer"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-textMuted text-sm">
                    {searchQuery ? 'No clients match your search.' : 'No clients found. Add your first client.'}
                  </td>
                </tr>
              ) : (
                filtered.map((client, idx) => (
                  <tr
                    key={client._id}
                    onClick={() => setSelectedClient(client)}
                    className="border-b border-borderColor/30 hover:bg-surfaceBg/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center text-xs font-extrabold shrink-0 shadow-sm`}>
                          {getInitials(client.name)}
                        </div>
                        <span className="font-semibold text-textPrimary group-hover:text-primaryAccent transition-colors">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-textSecondary text-xs">{client.email || '—'}</td>
                    <td className="px-6 py-4 text-textSecondary text-xs">
                      {new Date(client.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        client.status === 'active' ? 'badge-teal' : 'badge-coral'
                      }`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {client.dataConsentStatus
                        ? <div className="w-7 h-7 rounded-full bg-secondaryAccent/10 flex items-center justify-center text-secondaryAccent"><CheckCircle className="w-4 h-4" /></div>
                        : <div className="w-7 h-7 rounded-full bg-surfaceBg border border-borderColor flex items-center justify-center text-textMuted"><XCircle className="w-4 h-4" /></div>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-textMuted hover:text-primaryAccent p-2 rounded-full hover:bg-primaryAccent/10 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Client Detail Side Panel */}
      {selectedClient && (
        <div className="fixed inset-0 z-[60] flex justify-end" onClick={() => setSelectedClient(null)}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
          <div
            className="w-full max-w-sm bg-cardBg border-l border-borderColor/40 h-full overflow-y-auto p-8 shadow-2xl animate-slide-in relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-bold text-lg text-textPrimary flex items-center gap-2">
                <Users className="w-5 h-5 text-primaryAccent" />
                Client Profile
              </h3>
              <button onClick={() => setSelectedClient(null)} className="p-2 rounded-xl bg-surfaceBg border border-borderColor/40 text-textMuted hover:text-white hover:border-coralAccent/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Avatar & Name */}
            <div className="flex flex-col items-center mb-10">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColors[0]} flex items-center justify-center text-2xl font-extrabold mb-4 shadow-glow`}>
                {getInitials(selectedClient.name)}
              </div>
              <h4 className="font-extrabold text-2xl text-textPrimary mb-2">{selectedClient.name}</h4>
              <span className={`badge ${selectedClient.status === 'active' ? 'badge-teal' : 'badge-coral'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${selectedClient.status === 'active' ? 'bg-secondaryAccent' : 'bg-coralAccent'} animate-pulse`}></span>
                {selectedClient.status}
              </span>
            </div>

            {/* Details */}
            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email Address', value: selectedClient.email || 'Not provided' },
                { icon: Phone, label: 'Phone Number', value: selectedClient.phone || 'Not provided' },
                { icon: Calendar, label: 'Client Since', value: new Date(selectedClient.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                { icon: ShieldCheck, label: 'Data Consent', value: selectedClient.dataConsentStatus ? 'Granted ✓' : 'Not Granted', isConsent: true },
              ].map(({ icon: Icon, label, value, isConsent }) => (
                <div key={label} className="flex items-start gap-4 p-4 bg-surfaceBg rounded-xl border border-borderColor/40 hover:border-primaryAccent/30 transition-colors">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isConsent && selectedClient.dataConsentStatus ? 'bg-secondaryAccent/10 text-secondaryAccent' : 'bg-primaryAccent/10 text-primaryAccent'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-textMuted font-bold uppercase tracking-wider">{label}</p>
                    <p className={`text-sm font-semibold mt-0.5 ${isConsent && selectedClient.dataConsentStatus ? 'text-secondaryAccent' : 'text-textPrimary'}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
          <div className="bg-cardBg border border-borderColor/40 rounded-2xl p-8 w-full max-w-md shadow-2xl fade-in relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-textPrimary flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primaryAccent" />
                Register New Client
              </h3>
              <button onClick={() => setShowAdd(false)} className="p-2 rounded-xl bg-surfaceBg border border-borderColor/40 text-textMuted hover:text-white hover:border-coralAccent/30 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="flex items-start gap-2.5 p-4 mb-6 bg-coralAccent/10 border border-coralAccent/20 text-coralAccent text-sm rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="font-medium text-xs">{addError}</p>
              </div>
            )}

            <form onSubmit={handleAddClient} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Full Name <span className="text-coralAccent">*</span></label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
                  <input type="text" required value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                    className="input-field w-full pl-10" placeholder="Client full name" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
                  <input type="email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    className="input-field w-full pl-10" placeholder="client@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-textMuted mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
                  <input type="text" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    className="input-field w-full pl-10" placeholder="+971 50 000 0000" />
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 bg-surfaceBg border border-borderColor/40 rounded-xl mt-2">
                <input type="checkbox" id="consent" checked={newClient.dataConsentStatus}
                  onChange={(e) => setNewClient({ ...newClient, dataConsentStatus: e.target.checked })}
                  className="w-4 h-4 accent-primaryAccent cursor-pointer rounded bg-darkBg border-borderColor" />
                <label htmlFor="consent" className="text-xs text-textMuted cursor-pointer select-none">
                  Data processing consent provided by client
                </label>
              </div>

              <button type="submit" disabled={addLoading}
                className="btn-primary w-full mt-6 py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {addLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Registering...
                  </span>
                ) : 'Register Client'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

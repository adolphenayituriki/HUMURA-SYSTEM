import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faUserPlus, faTrashCan, faPenToSquare, faUsers as faUsersIcon, faGear, faMagnifyingGlass, faMobileScreen, faPeopleGroup, faHeart, faHandHoldingHeart, faServer, faCodeBranch, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { User, UserRole } from '../../types';

const roleColor: Record<string, 'brand' | 'forest' | 'warm' | 'rose' | 'slate'> = {
  admin:                    'brand',
  district_hospital:        'brand',
  health_center:            'forest',
  chw:                      'warm',
  sociotherapy_facilitator: 'brand',
  cooperative_leader:       'forest',
  youth_counselor:          'warm',
  emergency_responder:      'rose',
  community_member:         'slate',
};

const allRoles: UserRole[] = [
  'admin',
  'district_hospital',
  'health_center',
  'chw',
  'sociotherapy_facilitator',
  'cooperative_leader',
  'youth_counselor',
  'emergency_responder',
  'community_member',
];

interface FormData {
  fullName: string;
  email: string;
  role: UserRole;
  facility: string;
  district: string;
}

const emptyForm: FormData = { fullName: '', email: '', role: 'community_member', facility: '', district: '' };

export default function AdminPage() {
  const { t } = useI18nStore();
  const trans = t();
  const { addToast } = useToastStore();

  const roleLabel: Record<string, string> = {
    admin:                    trans.admin.roles.nationalAdmin,
    district_hospital:        trans.admin.roles.districtHospital,
    health_center:            trans.admin.roles.healthCenter,
    chw:                      trans.admin.roles.communityHealthWorker,
    sociotherapy_facilitator: trans.admin.roles.sociotherapyFacilitator,
    cooperative_leader:       trans.admin.roles.cooperativeLeader,
    youth_counselor:          trans.admin.roles.youthCounselor,
    emergency_responder:      trans.admin.roles.emergencyResponder,
    community_member:         trans.admin.roles.communityMember,
  };

  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const [users, setUsers] = useState(service.getUsers());
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const q = search.toLowerCase();
    return users.filter(u => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, search]);

  function openAdd() {
    setEditingUser(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(u: User) {
    setEditingUser(u);
    setForm({ fullName: u.fullName, email: u.email, role: u.role, facility: u.facility || '', district: u.district || '' });
    setModalOpen(true);
  }

  function handleSave() {
    if (editingUser) {
      const updated = service.updateUser(editingUser.id, { ...form, facility: form.facility || undefined, district: form.district || undefined });
      if (updated) { setUsers(service.getUsers()); addToast('User updated successfully'); }
    } else {
      const nextId = `U-${String(users.length + 1).padStart(3, '0')}`;
      const newUser: User = { id: nextId, ...form, facility: form.facility || undefined, district: form.district || undefined };
      service.addUser(newUser);
      setUsers(service.getUsers());
      addToast('User created successfully');
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteTarget) {
      service.deleteUser(deleteTarget.id);
      addToast('User deleted successfully');
      setUsers(service.getUsers());
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.admin.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.admin.subtitle}</p>
        </div>
        <Badge color="brand" className="shrink-0">{users.length} {trans.admin.users}</Badge>
      </div>

      <div className="flex gap-2 pb-4 border-b border-ink-100 overflow-x-auto mt-4">
        {[
          { k: 'users' as const,   label: trans.admin.platformUsers,    badge: `${users.length}`, icon: faUsersIcon },
          { k: 'settings' as const,  label: trans.admin.platformSettings, badge: '', icon: faGear },
        ].map(tab => (
          <Button key={tab.k} onClick={() => setActiveTab(tab.k)}
            variant={activeTab === tab.k ? 'primary' : 'secondary'} size="sm"
            className={`shrink-0 ${activeTab !== tab.k ? '!border-ink-200/70' : ''}`}>
            <FontAwesomeIcon icon={tab.icon} className="text-[13px]" />
            {tab.label}
            {tab.badge && <span className="ml-1.5 text-[10px] opacity-70">({tab.badge})</span>}
          </Button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 text-[13px]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all" />
            </div>
          </div>

          <Card className="!p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faUsersIcon} className="text-[18px] text-brand-600" />
              <div>
                <p className="text-sm font-bold text-ink-800">{trans.admin.platformUsers}</p>
                <p className="text-xs text-ink-400 mt-0.5">{filteredUsers.length} / {users.length} {trans.admin.registeredUsers}</p>
              </div>
            </div>
            <Button variant="brand-outline" size="md" onClick={openAdd}>
              <FontAwesomeIcon icon={faUserPlus} className="text-[14px]" /> {trans.admin.addUser}
            </Button>
          </Card>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {filteredUsers.map((u, i) => {
              const initials = u.fullName.split(' ').map(w => w[0]).slice(0, 2).join('');
              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}>
                  <Card className="!p-0 overflow-hidden group">
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-ink-50 border border-ink-200 text-ink-500 flex items-center justify-center text-sm font-bold">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-ink-800">{u.fullName}</p>
                            <p className="text-xs text-ink-400">{u.email}</p>
                          </div>
                        </div>
                        <Badge color={roleColor[u.role] ?? 'slate'}>{roleLabel[u.role]}</Badge>
                      </div>
                      <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
                        <span className="text-xs text-ink-400">{u.facility || u.district || trans.admin.fallbackEmpty}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="!text-ink-300 hover:!text-ink-600" onClick={() => openEdit(u)}>
                            <FontAwesomeIcon icon={faPenToSquare} className="text-[13px]" />
                          </Button>
                          <Button variant="ghost" size="icon" className="!text-ink-300 hover:!text-rose-500" onClick={() => setDeleteTarget(u)}>
                            <FontAwesomeIcon icon={faTrashCan} className="text-[13px]" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {filteredUsers.length === 0 && (
            <p className="text-sm text-ink-400 text-center py-8">{trans.admin.fallbackEmpty || 'No users found.'}</p>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid lg:grid-cols-2 gap-5 md:gap-6">
          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faGear} className="text-[15px] text-brand-500" />
              Platform Configuration
            </h3>
            <div className="space-y-0">
              {[
                [trans.admin.platformName,      'HUMURA — Trauma Recovery Platform'],
                [trans.admin.defaultLanguage,   'Kinyarwanda · English · Français'],
                [trans.admin.platformVersion,   trans.admin.platformVersionVal],
                [trans.admin.smsProvider,       'SMS Africa Rwanda — Twilio Gateway'],
                [trans.admin.cloudBackup,       'AWS S3 — AES-256 (Enabled, Weekly)'],
                [trans.admin.dataRetention,     '7 Years — Rwanda Health Records Act'],
                [trans.admin.hostingRegion,     'Rwanda / AWS East Africa (Nairobi)'],
                [trans.admin.hostingInfra,      trans.admin.hostingInfraDesc],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start justify-between py-2.5 border-b border-ink-100 last:border-b-0 gap-2 sm:gap-4">
                  <span className="text-xs text-ink-500 shrink-0">{label}</span>
                  <span className="text-xs font-semibold text-ink-800 text-right max-w-[55%] sm:max-w-none">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faMobileScreen} className="text-[15px] text-brand-500" />
              {trans.admin.multiChannel}
            </h3>
            <p className="text-xs text-ink-500 mb-4">{trans.admin.multiChannelDesc}</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'USSD (*811#)', icon: faMobileScreen },
                { label: 'SMS Gateway', icon: faMobileScreen },
                { label: 'WhatsApp Bot', icon: faCodeBranch },
                { label: 'Web Platform', icon: faServer },
                { label: 'Mobile App', icon: faMobileScreen },
                { label: 'CHW Portal', icon: faPeopleGroup },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-2.5 p-3 rounded-xl border border-ink-200/60 bg-ink-50/20">
                  <FontAwesomeIcon icon={c.icon} className="text-[13px] text-brand-500" />
                  <span className="text-[11px] font-medium text-ink-700">{c.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faHeart} className="text-[15px] text-warm-500" />
              {trans.admin.youthModule}
            </h3>
            <p className="text-xs text-ink-500 mb-3">{trans.admin.youthModuleDesc}</p>
            <div className="flex flex-wrap gap-2">
              {['Identity & Self', 'Inherited Trauma', 'Emotional Awareness', 'Peer Pressure', 'Social Stress', 'Safe Spaces'].map(t => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-warm-50 border border-warm-200/60 text-warm-700 text-[10px] font-semibold">{t}</span>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faPeopleGroup} className="text-[15px] text-forest-500" />
              {trans.admin.chwIntegration}
            </h3>
            <p className="text-xs text-ink-500 mb-3">{trans.admin.chwIntegrationDesc}</p>
            <div className="space-y-2">
              {[
                '1,200+ trained CHWs across 12 districts',
                'CHW-managed community onboarding',
                'Automated high-risk beneficiary referrals',
                'Trust-based community engagement model',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-forest-50/20 border border-forest-200/60">
                  <span className="text-forest-600 text-[10px] mt-0.5 font-bold shrink-0">✓</span>
                  <span className="text-[11px] text-ink-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faHandHoldingHeart} className="text-[15px] text-brand-500" />
              {trans.admin.traumaModel}
            </h3>
            <p className="text-xs text-ink-500 mb-3">{trans.admin.traumaModelDesc}</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {['Safety', 'Trust', 'Care', 'Respect', 'New Orientation', 'Reconciliation'].map((phase, i) => (
                <span key={phase} className="flex items-center gap-1 text-[10px] font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-200/60">
                  {phase}
                  {i < 5 && <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-brand-300" />}
                </span>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faServer} className="text-[15px] text-ink-500" />
              Infrastructure & Affordability
            </h3>
            <p className="text-xs text-ink-500 mb-3">{trans.admin.affordabilityDesc}</p>
            <div className="space-y-2">
              {[
                trans.admin.hostingInfraDesc,
                'Digital-first reduces cost per patient by 60% vs in-person',
                'Asynchronous counselling: 1 counsellor serves up to 50 patients',
                'Leverages existing CHW network (no new infrastructure)',
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-ink-50/30 border border-ink-200/60">
                  <span className="text-brand-500 text-[10px] mt-0.5 font-bold shrink-0">▸</span>
                  <span className="text-[11px] text-ink-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faShield} className="text-[15px] text-forest-500" />
              {trans.admin.securityTitle}
            </h3>
            <div className="grid sm:grid-cols-2 gap-2">
              {trans.admin.securityItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-forest-200/60 bg-forest-50/20">
                  <span className="text-forest-600 mt-0.5 shrink-0 font-bold text-xs">✓</span>
                  <span className="text-xs text-ink-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingUser ? 'Edit User' : 'Add User'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Full Name</label>
            <input type="text" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Role</label>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
              className="w-full h-10 px-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all">
              {allRoles.map(r => (
                <option key={r} value={r}>{roleLabel[r]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">Facility <span className="text-ink-300 font-normal">(optional)</span></label>
            <input type="text" value={form.facility} onChange={e => setForm({ ...form, facility: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-medium text-ink-600 mb-1.5">District <span className="text-ink-300 font-normal">(optional)</span></label>
            <input type="text" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-400/40 focus:border-brand-400 transition-all" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={() => setModalOpen(false)}
              className="flex-1 h-10 rounded-xl text-sm font-medium text-ink-600 bg-ink-50 hover:bg-ink-100 transition-all">
              Cancel
            </button>
            <button onClick={handleSave}
              className="flex-1 h-10 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all">
              {editingUser ? 'Update' : 'Add'} User
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteTarget?.fullName}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faUsers, faLocationDot, faUserTie, faCalendar, faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useI18nStore } from '../../i18n';
import type { SociotherapyGroup, SociotherapySession } from '../../types';

type GroupForm = {
  name: string;
  phase: SociotherapyGroup['phase'];
  facilitatorName: string;
  location: string;
  memberCount: number;
  maxMembers: number;
  status: SociotherapyGroup['status'];
};

type SessionForm = {
  date: string;
  theme: string;
  phase: string;
  facilitator: string;
  attendance: number;
  notes: string;
};

const PHASES: SociotherapyGroup['phase'][] = ['Safety', 'Trust', 'Care', 'Respect', 'New Orientation', 'Memory and Reconciliation'];

const defaultGroupForm: GroupForm = {
  name: '',
  phase: 'Safety',
  facilitatorName: '',
  location: '',
  memberCount: 0,
  maxMembers: 15,
  status: 'active',
};

const defaultSessionForm: SessionForm = {
  date: '',
  theme: '',
  phase: '',
  facilitator: '',
  attendance: 0,
  notes: '',
};

export default function SociotherapyPage() {
  const { t } = useI18nStore();
  const trans = t();
  const { addToast } = useToastStore();

  const PHASE_LABELS: Record<string, string> = {
    'Safety': trans.sociotherapy.phases.safety,
    'Trust': trans.sociotherapy.phases.trust,
    'Care': trans.sociotherapy.phases.care,
    'Respect': trans.sociotherapy.phases.respect,
    'New Orientation': trans.sociotherapy.phases.newOrientation,
    'Memory and Reconciliation': trans.sociotherapy.phases.memoryReconciliation,
  };

  const [groups, setGroups] = useState(service.getSociotherapyGroups());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [sessions, setSessions] = useState(service.getSessions());

  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SociotherapyGroup | null>(null);
  const [groupForm, setGroupForm] = useState<GroupForm>(defaultGroupForm);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SociotherapySession | null>(null);
  const [sessionGroupId, setSessionGroupId] = useState<string | null>(null);
  const [sessionForm, setSessionForm] = useState<SessionForm>(defaultSessionForm);

  const [deleteSessionConfirmOpen, setDeleteSessionConfirmOpen] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const filtered = phaseFilter === 'all' ? groups : groups.filter(g => g.phase === phaseFilter);
  const active = groups.filter(g => g.status === 'active');

  function openAddGroup() {
    setGroupForm(defaultGroupForm);
    setEditingGroup(null);
    setGroupModalOpen(true);
  }

  function openEditGroup(g: SociotherapyGroup) {
    setGroupForm({
      name: g.name,
      phase: g.phase,
      facilitatorName: g.facilitatorName,
      location: g.location,
      memberCount: g.memberCount,
      maxMembers: g.maxMembers,
      status: g.status,
    });
    setEditingGroup(g);
    setGroupModalOpen(true);
  }

  function saveGroup() {
    if (editingGroup) {
      const updated = service.updateGroup(editingGroup.id, groupForm);
      if (updated) {
        setGroups(prev => prev.map(g => g.id === editingGroup.id ? updated : g));
        addToast('Group updated successfully');
      }
    } else {
      const newGroup: SociotherapyGroup = {
        id: `SG-${Date.now()}`,
        ...groupForm,
        facilitatorId: '',
        startedAt: new Date().toISOString().split('T')[0],
      };
      const created = service.addGroup(newGroup);
      setGroups(prev => [created, ...prev]);
      addToast('Group created successfully');
    }
    setGroupModalOpen(false);
  }

  function confirmDeleteGroup(id: string) {
    setDeletingGroupId(id);
    setDeleteConfirmOpen(true);
  }

  function deleteGroup() {
    if (deletingGroupId) {
      service.deleteGroup(deletingGroupId);
      addToast('Group deleted successfully');
      setGroups(prev => prev.filter(g => g.id !== deletingGroupId));
      setSessions(prev => prev.filter(s => s.groupId !== deletingGroupId));
      if (expanded === deletingGroupId) setExpanded(null);
      setDeletingGroupId(null);
    }
    setDeleteConfirmOpen(false);
  }

  function openAddSession(groupId: string) {
    const g = groups.find(g => g.id === groupId);
    setSessionForm({ ...defaultSessionForm, phase: g?.phase ?? '', facilitator: g?.facilitatorName ?? '' });
    setEditingSession(null);
    setSessionGroupId(groupId);
    setSessionModalOpen(true);
  }

  function openEditSession(s: SociotherapySession) {
    setSessionForm({
      date: s.date,
      theme: s.theme,
      phase: s.phase,
      facilitator: s.facilitator,
      attendance: s.attendance,
      notes: s.notes,
    });
    setEditingSession(s);
    setSessionGroupId(s.groupId);
    setSessionModalOpen(true);
  }

  function saveSession() {
    if (editingSession) {
      const updated = service.updateSession(editingSession.id, sessionForm);
      if (updated) {
        setSessions(prev => prev.map(s => s.id === editingSession.id ? updated : s));
        addToast('Session updated successfully');
      }
    } else if (sessionGroupId) {
      const g = groups.find(g => g.id === sessionGroupId);
      const newSession: SociotherapySession = {
        id: `SES-${Date.now()}`,
        groupId: sessionGroupId,
        groupName: g?.name ?? '',
        ...sessionForm,
      };
      const created = service.addSession(newSession);
      setSessions(prev => [created, ...prev]);
      addToast('Session created successfully');
    }
    setSessionModalOpen(false);
  }

  function confirmDeleteSession(id: string) {
    setDeletingSessionId(id);
    setDeleteSessionConfirmOpen(true);
  }

  function deleteSession() {
    if (deletingSessionId) {
      service.deleteSession(deletingSessionId);
      addToast('Session deleted successfully');
      setSessions(prev => prev.filter(s => s.id !== deletingSessionId));
      setDeletingSessionId(null);
    }
    setDeleteSessionConfirmOpen(false);
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.sociotherapy.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.sociotherapy.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge color="warm" className="shrink-0">{active.length} {trans.common.active}</Badge>
          <Button onClick={openAddGroup} variant="primary" size="sm">
            <FontAwesomeIcon icon={faPlus} className="text-[12px]" />
            Add Group
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <StatCard label={trans.sociotherapy.totalGroups} value={groups.length}
          icon={<FontAwesomeIcon icon={faUsers} className="text-[16px] text-brand-500 shrink-0" />} />
        <StatCard label={trans.sociotherapy.active} value={active.length}
          icon={<FontAwesomeIcon icon={faUsers} className="text-[16px] text-forest-500 shrink-0" />} />
        <StatCard label={trans.sociotherapy.totalMembers} value={groups.reduce((a, g) => a + g.memberCount, 0)}
          icon={<FontAwesomeIcon icon={faUsers} className="text-[16px] text-warm-500 shrink-0" />} />
        <StatCard label={trans.sociotherapy.avgCapacity} value={groups.length ? Math.round(groups.reduce((a, g) => a + (g.memberCount / g.maxMembers) * 100, 0) / groups.length) + '%' : '0%'}
          icon={<FontAwesomeIcon icon={faUsers} className="text-[16px] text-rose-500 shrink-0" />} />
      </div>

      <div className="overflow-x-auto -mx-3 px-3">
        <div className="flex gap-2 p-3 rounded-xl border border-ink-200/60 bg-white shadow-sm w-max min-w-full">
          <Button onClick={() => setPhaseFilter('all')}
            variant={phaseFilter === 'all' ? 'primary' : 'secondary'} size="sm"
            className={phaseFilter !== 'all' ? '!border-ink-200/60' : '!shrink-0'}>
            {trans.sociotherapy.allPhases}
          </Button>
          {PHASES.map(p => (
            <Button key={p} onClick={() => setPhaseFilter(p)}
              variant={phaseFilter === p ? 'primary' : 'secondary'} size="sm"
              className={phaseFilter !== p ? '!border-ink-200/60' : '!shrink-0'}>
              {PHASE_LABELS[p]}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {filtered.map((g, i) => {
          const pct = Math.round((g.memberCount / g.maxMembers) * 100);
          const fillColor = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-warm-500' : 'bg-brand-500';
          const groupSessions = sessions.filter(s => s.groupId === g.id);
          return (
            <motion.div key={g.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.35) }}
            >
              <Card className="group overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-800 truncate">{g.name}</p>
                    <div className="flex items-center gap-3 text-xs text-ink-400 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1"><FontAwesomeIcon icon={faLocationDot} className="text-[11px] text-ink-300" /> {g.location}</span>
                      <span className="flex items-center gap-1"><FontAwesomeIcon icon={faUserTie} className="text-[11px] text-ink-300" /> {g.facilitatorName}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1">
                      <Badge color={g.status === 'active' ? 'forest' : g.status === 'completed' ? 'brand' : 'slate'}>{g.status === 'active' ? trans.sociotherapy.active : g.status === 'completed' ? trans.referrals.completed : g.status}</Badge>
                      <button onClick={() => openEditGroup(g)} className="w-6 h-6 rounded-md flex items-center justify-center text-ink-300 hover:text-brand-600 hover:bg-brand-50 transition-all" title="Edit group">
                        <FontAwesomeIcon icon={faPenToSquare} className="text-[11px]" />
                      </button>
                      <button onClick={() => confirmDeleteGroup(g.id)} className="w-6 h-6 rounded-md flex items-center justify-center text-ink-300 hover:text-rose-500 hover:bg-rose-50 transition-all" title="Delete group">
                        <FontAwesomeIcon icon={faTrashCan} className="text-[11px]" />
                      </button>
                    </div>
                    <Badge color={
                      g.phase === 'Memory and Reconciliation' ? 'rose' :
                      g.phase === 'New Orientation' ? 'warm' :
                      g.phase === 'Respect' ? 'warm' :
                      g.phase === 'Care' ? 'forest' :
                      'brand'
                    }>{PHASE_LABELS[g.phase] || g.phase}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-ink-400 mb-3">
                  <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faUsers} className="text-[12px] text-ink-300" /> {g.memberCount}/{g.maxMembers} members</span>
                  <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCalendar} className="text-[12px] text-ink-300" /> {groupSessions.length} sessions</span>
                </div>

                <div className="w-full h-2 rounded-full bg-ink-100/70 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: Math.min(i * 0.06 + 0.15, 1), duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${fillColor}`}
                  />
                </div>
                <p className="text-[10px] text-ink-300 mt-1 text-right">{pct}% {trans.sociotherapy.capacity}</p>

                <Button onClick={() => setExpanded(expanded === g.id ? null : g.id)} variant="ghost" size="xs" className="w-full mt-3">
                  {expanded === g.id ? <><FontAwesomeIcon icon={faChevronUp} className="text-[13px]" /> {trans.sociotherapy.hideSessions}</> : <><FontAwesomeIcon icon={faChevronDown} className="text-[13px]" /> {trans.sociotherapy.viewSessions}</>}
                </Button>

                <AnimatePresence>
                {expanded === g.id && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-ink-100 overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.08em]">{trans.sociotherapy.sessionHistory}</p>
                      <button onClick={() => openAddSession(g.id)} className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
                        <FontAwesomeIcon icon={faPlus} className="text-[9px]" /> Add Session
                      </button>
                    </div>
                    {groupSessions.length === 0 ? (
                      <p className="text-xs text-ink-300 text-center py-4">No sessions recorded yet</p>
                    ) : (
                      <div className="space-y-1.5">
                        {groupSessions.map((s) => (
                          <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-ink-50/30 border border-ink-100/60 hover:bg-brand-50/10 transition-colors">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-medium text-ink-600">{s.theme}</span>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[10px] text-ink-400 flex items-center gap-1">
                                  <FontAwesomeIcon icon={faCalendar} className="text-[9px]" /> {s.date}
                                </span>
                                <span className="text-[10px] text-ink-400">{s.attendance}/{g.memberCount} attended</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <button onClick={() => openEditSession(s)} className="w-5 h-5 rounded flex items-center justify-center text-ink-300 hover:text-brand-600 hover:bg-brand-50 transition-all" title="Edit session">
                                <FontAwesomeIcon icon={faPenToSquare} className="text-[9px]" />
                              </button>
                              <button onClick={() => confirmDeleteSession(s.id)} className="w-5 h-5 rounded flex items-center justify-center text-ink-300 hover:text-rose-500 hover:bg-rose-50 transition-all" title="Delete session">
                                <FontAwesomeIcon icon={faTrashCan} className="text-[9px]" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Modal open={groupModalOpen} onClose={() => setGroupModalOpen(false)} title={editingGroup ? 'Edit Group' : 'Add Group'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Group Name</label>
            <input type="text" value={groupForm.name} onChange={e => setGroupForm(f => ({ ...f, name: e.target.value }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Phase</label>
            <select value={groupForm.phase} onChange={e => setGroupForm(f => ({ ...f, phase: e.target.value as SociotherapyGroup['phase'] }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all">
              {PHASES.map(p => <option key={p} value={p}>{PHASE_LABELS[p]}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Facilitator Name</label>
            <input type="text" value={groupForm.facilitatorName} onChange={e => setGroupForm(f => ({ ...f, facilitatorName: e.target.value }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Location</label>
            <input type="text" value={groupForm.location} onChange={e => setGroupForm(f => ({ ...f, location: e.target.value }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1">Member Count</label>
              <input type="number" min={0} value={groupForm.memberCount} onChange={e => setGroupForm(f => ({ ...f, memberCount: Math.max(0, Number(e.target.value)) }))}
                className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-600 mb-1">Max Members</label>
              <input type="number" min={1} value={groupForm.maxMembers} onChange={e => setGroupForm(f => ({ ...f, maxMembers: Math.max(1, Number(e.target.value)) }))}
                className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Status</label>
            <select value={groupForm.status} onChange={e => setGroupForm(f => ({ ...f, status: e.target.value as SociotherapyGroup['status'] }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all">
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={() => setGroupModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
            <Button onClick={saveGroup} variant="primary" size="sm">{editingGroup ? 'Save Changes' : 'Add Group'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={deleteGroup}
        title="Delete Group"
        message="Are you sure you want to delete this group? This will also remove all associated sessions. This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />

      <Modal open={sessionModalOpen} onClose={() => setSessionModalOpen(false)} title={editingSession ? 'Edit Session' : 'Add Session'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Date</label>
            <input type="text" value={sessionForm.date} onChange={e => setSessionForm(f => ({ ...f, date: e.target.value }))} placeholder="YYYY-MM-DD"
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Theme</label>
            <input type="text" value={sessionForm.theme} onChange={e => setSessionForm(f => ({ ...f, theme: e.target.value }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Phase</label>
            <input type="text" value={sessionForm.phase} onChange={e => setSessionForm(f => ({ ...f, phase: e.target.value }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Facilitator</label>
            <input type="text" value={sessionForm.facilitator} onChange={e => setSessionForm(f => ({ ...f, facilitator: e.target.value }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Attendance</label>
            <input type="number" min={0} value={sessionForm.attendance} onChange={e => setSessionForm(f => ({ ...f, attendance: Math.max(0, Number(e.target.value)) }))}
              className="w-full h-9 px-3 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Notes</label>
            <textarea value={sessionForm.notes} onChange={e => setSessionForm(f => ({ ...f, notes: e.target.value }))} rows={3}
              className="w-full px-3 py-2 text-sm rounded-xl border border-ink-200/60 bg-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button onClick={() => setSessionModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
            <Button onClick={saveSession} variant="primary" size="sm">{editingSession ? 'Save Changes' : 'Add Session'}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteSessionConfirmOpen}
        onClose={() => setDeleteSessionConfirmOpen(false)}
        onConfirm={deleteSession}
        title="Delete Session"
        message="Are you sure you want to delete this session? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

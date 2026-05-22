import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faClock, faLocationDot, faUserCheck, faTruck, faCheck, faBell, faPlus, faPenToSquare, faTrashCan, faXmark, faStethoscope, faUser, faNoteSticky, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useI18nStore } from '../../i18n';
import type { EmergencyAlert } from '../../types';

const EMERGENCY_TYPES = [
  'Suicidal ideation',
  'Self-harm risk',
  'Severe panic episode',
  'Psychotic episode',
  'Trauma flashback crisis',
  'Emotional breakdown',
];

const RISK_LEVELS: EmergencyAlert['riskLevel'][] = ['low', 'medium', 'high', 'critical'];
const STATUSES: EmergencyAlert['status'][] = ['new', 'dispatched', 'resolved', 'false_alarm'];

type FormData = Omit<EmergencyAlert, 'id' | 'createdAt' | 'resolvedAt'>;

const emptyForm = (): FormData => ({
  beneficiaryId: '',
  beneficiaryName: '',
  triggeredBy: '',
  riskLevel: 'low',
  type: '',
  location: '',
  responseTeam: '',
  status: 'new',
});

export default function EmergenciesPage() {
  const { t } = useI18nStore();
  const trans = t();
  const { addToast } = useToastStore();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => service.getEmergencies({}));
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyAlert | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<EmergencyAlert | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<EmergencyAlert | null>(null);
  const [followUpText, setFollowUpText] = useState('');

  const updateStatus = (id: string, status: EmergencyAlert['status']) => {
    service.updateEmergencyStatus(id, status);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status, resolvedAt: status === 'resolved' ? new Date().toISOString().split('T')[0] : a.resolvedAt } : a));
    if (selectedAlert?.id === id) {
      setSelectedAlert(prev => prev ? { ...prev, status, resolvedAt: status === 'resolved' ? new Date().toISOString().split('T')[0] : prev.resolvedAt } : null);
    }
    addToast(`Emergency ${status === 'resolved' ? 'resolved' : status === 'dispatched' ? 'dispatched' : 'dismissed'} successfully`);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };

  const openEdit = (a: EmergencyAlert) => {
    setEditing(a);
    setForm({
      beneficiaryId: a.beneficiaryId,
      beneficiaryName: a.beneficiaryName,
      triggeredBy: a.triggeredBy,
      riskLevel: a.riskLevel,
      type: a.type,
      location: a.location,
      responseTeam: a.responseTeam,
      status: a.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      const updated = service.updateEmergency(editing.id, form);
      if (updated) {
        setAlerts(prev => prev.map(a => a.id === editing.id ? { ...a, ...form } : a));
        addToast('Emergency updated successfully');
      }
    } else {
      const newAlert: EmergencyAlert = {
        ...form,
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
        createdAt: new Date().toISOString().split('T')[0],
      };
      service.addEmergency(newAlert);
      setAlerts(prev => [newAlert, ...prev]);
      addToast('Emergency created successfully');
    }
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    service.deleteEmergency(deleteTarget.id);
    addToast('Emergency deleted successfully');
    setAlerts(prev => prev.filter(a => a.id !== deleteTarget.id));
    if (selectedAlert?.id === deleteTarget.id) setSelectedAlert(null);
    setDeleteTarget(null);
  };

  const openDetail = (a: EmergencyAlert) => {
    setSelectedAlert(a);
    setFollowUpText('');
  };

  const addFollowUp = () => {
    if (!followUpText.trim() || !selectedAlert) return;
    const notes = selectedAlert.followUpNotes
      ? selectedAlert.followUpNotes + '\n---\n' + `[${new Date().toLocaleDateString()}] ${followUpText.trim()}`
      : `[${new Date().toLocaleDateString()}] ${followUpText.trim()}`;
    service.updateEmergency(selectedAlert.id, { followUpNotes: notes });
    setAlerts(prev => prev.map(a => a.id === selectedAlert.id ? { ...a, followUpNotes: notes } : a));
    setSelectedAlert(prev => prev ? { ...prev, followUpNotes: notes } : null);
    setFollowUpText('');
    addToast('Follow-up note added');
  };

  const active = alerts.filter(a => a.status === 'new' || a.status === 'dispatched');
  const sorted = [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.emergencies.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.emergencies.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {active.length > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse shrink-0">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              {active.length} {trans.emergencies.active}
            </div>
          )}
          <Button onClick={openAdd} variant="primary" size="sm">
            <FontAwesomeIcon icon={faPlus} /> Add Emergency
          </Button>
        </div>
      </div>

      {active.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="border border-rose-200 rounded-xl p-5 flex items-center gap-4 bg-gradient-to-r from-rose-50/80 to-rose-50/20 shadow-sm">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-[20px] text-rose-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-rose-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              {active.length} {active.length === 1 ? trans.emergencies.activeAlert : trans.emergencies.activeAlerts} require{active.length === 1 ? 's' : ''} attention
            </p>
            <p className="text-xs text-rose-600 mt-0.5">{trans.emergencies.immediateResponseNeeded} {alerts.filter(a => a.riskLevel === 'critical').length} {alerts.filter(a => a.riskLevel === 'critical').length === 1 ? trans.emergencies.criticalCase : trans.emergencies.criticalCases}.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/80 px-3 py-1.5 rounded-lg border border-rose-200/60">
              <FontAwesomeIcon icon={faBell} className="text-[11px] mr-1" />{alerts.filter(a => a.status === 'new').length} new
            </span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <StatCard label={trans.emergencies.totalAlerts} value={alerts.length} />
        <StatCard label={trans.emergencies.active} value={active.length} />
        <StatCard label={trans.emergencies.resolved} value={alerts.filter(a => a.status === 'resolved').length} />
        <StatCard label={trans.emergencies.critical} value={alerts.filter(a => a.riskLevel === 'critical').length} />
      </div>

      <div className="space-y-4">
        {sorted.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.35) }}
          >
            <Card className={`${a.status === 'new' ? 'border-l-[3px] !border-l-rose-400 !border-rose-200/40' : ''} group overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}>
              <div onClick={() => openDetail(a)}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faTriangleExclamation} className={`text-[14px] shrink-0 ${a.riskLevel === 'critical' ? 'text-rose-500' : 'text-warm-500'}`} />
                      <p className="text-sm font-bold text-ink-800 truncate">{a.type}</p>
                      <Badge color={a.riskLevel === 'critical' ? 'rose' : a.riskLevel === 'high' ? 'warm' : a.riskLevel === 'medium' ? 'blue' : 'forest'}>{a.riskLevel === 'critical' ? trans.emergencies.critical : a.riskLevel === 'high' ? trans.screening.highRisk : a.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low}</Badge>
                    </div>
                    <p className="text-xs text-ink-400 truncate">{a.beneficiaryName} · {trans.emergencies.triggeredBy} {a.triggeredBy}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                    <Badge color={a.status === 'resolved' ? 'forest' : a.status === 'dispatched' ? 'brand' : a.status === 'false_alarm' ? 'slate' : 'rose'}>{a.status === 'resolved' ? trans.emergencies.resolved : a.status === 'dispatched' ? 'Dispatched' : a.status === 'false_alarm' ? 'False Alarm' : 'New'}</Badge>
                    <button onClick={() => openEdit(a)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-brand-600 hover:bg-brand-50 transition-all opacity-0 group-hover:opacity-100">
                      <FontAwesomeIcon icon={faPenToSquare} className="text-[13px]" />
                    </button>
                    <button onClick={() => setDeleteTarget(a)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-rose-600 hover:bg-rose-50 transition-all opacity-0 group-hover:opacity-100">
                      <FontAwesomeIcon icon={faTrashCan} className="text-[13px]" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-ink-400 mb-3">
                  <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faLocationDot} className="text-[12px] text-ink-300" /> {a.location}</span>
                  <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} className="text-[12px] text-ink-300" /> {a.createdAt}</span>
                  <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faUserCheck} className="text-[12px] text-ink-300" /> {a.responseTeam}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-ink-100">
                {a.status === 'new' && (
                  <>
                    <Button onClick={() => updateStatus(a.id, 'dispatched')} variant="brand-outline" size="xs">
                      <FontAwesomeIcon icon={faTruck} className="text-[11px]" /> {trans.emergencies.dispatch}
                    </Button>
                    <Button onClick={() => updateStatus(a.id, 'resolved')} variant="success" size="xs">
                      <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> {trans.emergencies.resolve}
                    </Button>
                    <Button onClick={() => updateStatus(a.id, 'false_alarm')} variant="neutral" size="xs">{trans.emergencies.dismiss}</Button>
                  </>
                )}
                {a.status === 'dispatched' && (
                  <Button onClick={() => updateStatus(a.id, 'resolved')} variant="success" size="xs">
                    <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> {trans.emergencies.markResolved}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAlert(null)}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto"
            >
              <div className={`px-6 pt-6 pb-4 ${selectedAlert.status === 'new' ? 'bg-gradient-to-r from-rose-50 to-rose-50/30' : selectedAlert.status === 'dispatched' ? 'bg-gradient-to-r from-brand-50 to-brand-50/30' : selectedAlert.status === 'resolved' ? 'bg-gradient-to-r from-forest-50 to-forest-50/30' : 'bg-gradient-to-r from-ink-50 to-ink-50/30'}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedAlert.riskLevel === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-warm-100 text-warm-600'}`}>
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-[18px]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-ink-900">{selectedAlert.type}</h3>
                      <p className="text-xs text-ink-500">ID: {selectedAlert.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedAlert(null)}
                    className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-white transition-colors shadow-sm">
                    <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge color={selectedAlert.riskLevel === 'critical' ? 'rose' : selectedAlert.riskLevel === 'high' ? 'warm' : selectedAlert.riskLevel === 'medium' ? 'blue' : 'forest'}>
                    {selectedAlert.riskLevel === 'critical' ? trans.emergencies.critical : selectedAlert.riskLevel === 'high' ? trans.screening.highRisk : selectedAlert.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low} Risk
                  </Badge>
                  <Badge color={selectedAlert.status === 'resolved' ? 'forest' : selectedAlert.status === 'dispatched' ? 'brand' : selectedAlert.status === 'false_alarm' ? 'slate' : 'rose'}>
                    {selectedAlert.status === 'resolved' ? trans.emergencies.resolved : selectedAlert.status === 'dispatched' ? 'Dispatched' : selectedAlert.status === 'false_alarm' ? 'False Alarm' : 'New'}
                  </Badge>
                </div>
              </div>

              <div className="px-6 py-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faUser} className="text-[13px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.06em]">Beneficiary</p>
                      <p className="text-sm font-semibold text-ink-800 truncate">{selectedAlert.beneficiaryName}</p>
                      <p className="text-[10px] text-ink-400">ID: {selectedAlert.beneficiaryId}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                    <span className="w-8 h-8 rounded-lg bg-warm-50 text-warm-600 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faStethoscope} className="text-[13px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.06em]">Triggered By</p>
                      <p className="text-sm font-semibold text-ink-800 truncate">{selectedAlert.triggeredBy}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                    <span className="w-8 h-8 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faLocationDot} className="text-[13px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.06em]">Location</p>
                      <p className="text-sm font-semibold text-ink-800">{selectedAlert.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                    <span className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faUserCheck} className="text-[13px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.06em]">Response Team</p>
                      <p className="text-sm font-semibold text-ink-800">{selectedAlert.responseTeam}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                    <span className="w-8 h-8 rounded-lg bg-ink-50 text-ink-500 flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faClock} className="text-[13px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.06em]">Created</p>
                      <p className="text-sm font-semibold text-ink-800">{selectedAlert.createdAt}</p>
                    </div>
                  </div>
                  {selectedAlert.resolvedAt && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                      <span className="w-8 h-8 rounded-lg bg-forest-50 text-forest-600 flex items-center justify-center shrink-0">
                        <FontAwesomeIcon icon={faCheck} className="text-[13px]" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.06em]">Resolved</p>
                        <p className="text-sm font-semibold text-ink-800">{selectedAlert.resolvedAt}</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedAlert.status !== 'resolved' && selectedAlert.status !== 'false_alarm' && (
                  <div className="p-4 rounded-xl border border-ink-100/80 bg-ink-50/30">
                    <p className="text-xs font-bold text-ink-600 mb-2">Quick Actions</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedAlert.status === 'new' && (
                        <>
                          <Button onClick={() => { updateStatus(selectedAlert.id, 'dispatched'); }} variant="brand-outline" size="xs">
                            <FontAwesomeIcon icon={faTruck} className="text-[11px]" /> Dispatch Team
                          </Button>
                          <Button onClick={() => { updateStatus(selectedAlert.id, 'resolved'); }} variant="success" size="xs">
                            <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> Resolve
                          </Button>
                          <Button onClick={() => { updateStatus(selectedAlert.id, 'false_alarm'); }} variant="neutral" size="xs">False Alarm</Button>
                        </>
                      )}
                      {selectedAlert.status === 'dispatched' && (
                        <Button onClick={() => { updateStatus(selectedAlert.id, 'resolved'); }} variant="success" size="xs">
                          <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> Mark Resolved
                        </Button>
                      )}
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl border border-ink-100/80">
                  <div className="flex items-center gap-2 mb-3">
                    <FontAwesomeIcon icon={faNoteSticky} className="text-[14px] text-ink-400" />
                    <p className="text-xs font-bold text-ink-600 uppercase tracking-[.06em]">Follow-up Notes</p>
                  </div>
                  {selectedAlert.followUpNotes ? (
                    <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
                      {selectedAlert.followUpNotes.split('\n---\n').map((note, i) => (
                        <div key={i} className="text-xs text-ink-600 bg-ink-50/50 rounded-lg p-2.5 leading-relaxed">
                          {note}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-400 mb-3 italic">No follow-up notes yet.</p>
                  )}
                  <div className="flex gap-2">
                    <input type="text" value={followUpText} onChange={e => setFollowUpText(e.target.value)}
                      placeholder="Add a follow-up note..."
                      className="flex-1 h-9 px-3 rounded-lg border border-ink-200 bg-white text-xs text-ink-800 placeholder-ink-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all"
                      onKeyDown={e => { if (e.key === 'Enter') addFollowUp(); }} />
                    <button onClick={addFollowUp} disabled={!followUpText.trim()}
                      className="h-9 px-3 rounded-lg bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5">
                      Add <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Emergency' : 'Add Emergency'} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Beneficiary Name</label>
            <input type="text" value={form.beneficiaryName} onChange={e => setForm(f => ({ ...f, beneficiaryName: e.target.value }))}
              className="w-full h-10 px-3.5 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="Full name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Triggered By</label>
            <input type="text" value={form.triggeredBy} onChange={e => setForm(f => ({ ...f, triggeredBy: e.target.value }))}
              className="w-full h-10 px-3.5 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="e.g. Teacher" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Risk Level</label>
            <select value={form.riskLevel} onChange={e => setForm(f => ({ ...f, riskLevel: e.target.value as EmergencyAlert['riskLevel'] }))}
              className="w-full h-10 px-3.5 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
              {RISK_LEVELS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full h-10 px-3.5 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
              <option value="" disabled>Select type</option>
              {EMERGENCY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Location</label>
            <input type="text" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              className="w-full h-10 px-3.5 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="e.g. Kigali" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Response Team</label>
            <input type="text" value={form.responseTeam} onChange={e => setForm(f => ({ ...f, responseTeam: e.target.value }))}
              className="w-full h-10 px-3.5 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 placeholder-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" placeholder="e.g. Crisis Team A" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as EmergencyAlert['status'] }))}
              className="w-full h-10 px-3.5 rounded-xl border border-ink-200 bg-white text-sm text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all">
              {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-ink-100">
          <Button onClick={() => setModalOpen(false)} variant="neutral">Cancel</Button>
          <Button onClick={handleSave} variant="primary">{editing ? 'Save Changes' : 'Add Emergency'}</Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Emergency"
        message={`Are you sure you want to delete the emergency for ${deleteTarget?.beneficiaryName ?? ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

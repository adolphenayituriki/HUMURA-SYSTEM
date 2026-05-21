import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faHandshake, faArrowRight, faCheck, faXmark, faHeartPulse, faClipboardList, faUserMd, faCalendarCheck, faStethoscope, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/shared/Modal';
import type { Referral, SupportPlan, Beneficiary } from '../../types';

export default function ReferralsPage() {
  const { t } = useI18nStore();
  const trans = t();
  const user = useAuthStore(s => s.user);
  const { addToast } = useToastStore();
  const [referrals, setReferrals] = useState<Referral[]>(() => service.getReferrals({}));
  const [tab, setTab] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [activePlan, setActivePlan] = useState<SupportPlan | null>(null);
  const [supportPlanOpen, setSupportPlanOpen] = useState(false);
  const [newStepNote, setNewStepNote] = useState('');
  const [beneficiaryDetail, setBeneficiaryDetail] = useState<Beneficiary | null>(null);

  const beneficiaries = service.getBeneficiaries({});

  const updateStatus = (id: string, status: Referral['status']) => {
    service.updateReferralStatus(id, status);
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    if (status === 'accepted') addToast('Referral accepted');
    else if (status === 'cancelled') addToast('Referral cancelled');
    else if (status === 'completed') addToast('Referral marked complete');
  };

  const openSupport = (r: Referral) => {
    let plan = service.getSupportPlan(r.id);
    if (!plan) {
      plan = service.openSupportPlan(r.id, user?.fullName || r.to, user?.role || r.toRole, `Support plan for ${r.beneficiaryName} — ${r.reason}`);
    }
    if (plan) {
      setActivePlan(plan);
      addToast('Support plan opened');
      setSupportPlanOpen(true);
    }
  };

  const completeStep = (stepId: string) => {
    if (!activePlan) return;
    const step = activePlan.steps.find(s => s.id === stepId);
    if (!step) return;
    const updated = service.updateSupportStep(activePlan.id, stepId, {
      status: step.status === 'done' ? 'in_progress' : 'done',
      notes: newStepNote || step.notes,
    });
    if (updated) setActivePlan({ ...updated });
  };

  const closePlan = () => {
    if (!activePlan) return;
    const updated = service.closeSupportPlan(activePlan.id);
    if (updated) { setActivePlan({ ...updated }); addToast('Support plan closed'); }
  };

  const filtered = referrals.filter(r => {
    const mt = tab === 'all' || r.status === tab;
    const ms = !search || r.beneficiaryName.toLowerCase().includes(search.toLowerCase()) || r.reason.toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });

  const stats = [
    { label: trans.referrals.totalReferrals, value: referrals.length },
    { label: trans.referrals.pending, value: referrals.filter(r => r.status === 'pending').length },
    { label: trans.referrals.accepted, value: referrals.filter(r => r.status === 'accepted').length },
    { label: trans.referrals.completed, value: referrals.filter(r => r.status === 'completed').length },
  ];

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.referrals.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.referrals.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge color="brand">{referrals.length} {trans.referrals.total}</Badge>
          <Badge color="warm">{referrals.filter(r => r.status === 'pending').length} {trans.referrals.pending}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-ink-200/60 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'pending', 'accepted', 'completed', 'cancelled'] as const).map(t => (
            <Button key={t} onClick={() => setTab(t)}
              variant={tab === t ? 'primary' : 'secondary'} size="sm"
              className={tab !== t ? '!border-ink-200/60' : ''}>
              {t === 'all' ? trans.referrals.all : t === 'pending' ? trans.referrals.pending : t === 'accepted' ? trans.referrals.accepted : t === 'completed' ? trans.referrals.completed : trans.referrals.cancelled}
            </Button>
          ))}
        </div>
        <div className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none text-[13px]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={trans.referrals.search}
            className="w-36 md:w-44 h-8 pl-8 pr-3 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 placeholder:text-ink-300 outline-none bg-white transition-all" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16">
          <FontAwesomeIcon icon={faHandshake} className="text-[22px] text-ink-300 mx-auto mb-4" />
          <p className="text-sm font-semibold text-ink-500">{trans.referrals.noResults}</p>
          <p className="text-xs text-ink-300 mt-1">No referrals match your current filters</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
          {filtered.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}
                className="cursor-pointer" onClick={() => {
                  const b = beneficiaries.find(ben => ben.fullName === r.beneficiaryName);
                  if (b) setBeneficiaryDetail(b);
                }}>
                <Card className="h-full group overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-ink-800 truncate">{r.beneficiaryName}</p>
                    <p className="text-xs text-ink-400 mt-0.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-ink-300 inline-block" />
                      {r.reason} · {r.priority}
                    </p>
                  </div>
                  <Badge color={r.status === 'completed' ? 'forest' : r.status === 'accepted' ? 'brand' : r.status === 'cancelled' ? 'rose' : 'warm'}>
                    {r.status === 'pending' ? trans.referrals.pending : r.status === 'accepted' ? trans.referrals.accepted : r.status === 'completed' ? trans.referrals.completed : r.status === 'cancelled' ? trans.referrals.cancelled : r.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-ink-400 mb-3 flex-wrap px-3 py-2 rounded-lg bg-ink-50/30 border border-ink-100/60">
                  <span className="font-medium text-ink-500">{r.from}</span>
                  <span className="text-[10px] text-ink-300">({r.fromRole})</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px] text-ink-200" />
                  <span className="font-medium text-ink-500">{r.to}</span>
                  <span className="text-[10px] text-ink-300">({r.toRole})</span>
                </div>
                <p className="text-xs text-ink-500 mb-3 line-clamp-2 leading-relaxed">{r.reason}</p>
                <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                  <span className="text-[11px] text-ink-300">{r.createdAt}</span>
                  <div className="flex gap-1.5">
                    {r.status === 'pending' && (
                      <>
                        <Button onClick={() => updateStatus(r.id, 'accepted')} variant="success" size="xs">
                          <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> {trans.referrals.accept}
                        </Button>
                        <Button onClick={() => updateStatus(r.id, 'cancelled')} variant="danger" size="xs">
                          <FontAwesomeIcon icon={faXmark} className="text-[11px]" /> {trans.referrals.cancel}
                        </Button>
                      </>
                    )}
                    {r.status === 'accepted' && (
                      <>
                        <Button onClick={() => openSupport(r)} variant="brand-outline" size="xs">
                          <FontAwesomeIcon icon={faHeartPulse} className="text-[11px]" /> Support
                        </Button>
                        <Button onClick={() => updateStatus(r.id, 'completed')} variant="success" size="xs">
                          <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> {trans.referrals.markComplete}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal open={supportPlanOpen} onClose={() => setSupportPlanOpen(false)}
        title={`Support Plan — ${activePlan?.beneficiaryName ?? ''}`} size="lg">
        {activePlan && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge color={activePlan.status === 'active' ? 'forest' : activePlan.status === 'on_hold' ? 'warm' : 'slate'}>
                  {activePlan.status}
                </Badge>
                <Badge color={activePlan.priority === 'emergency' ? 'rose' : activePlan.priority === 'urgent' ? 'warm' : 'brand'}>
                  {activePlan.priority}
                </Badge>
              </div>
              <span className="text-[11px] text-ink-400">Opened {activePlan.openedAt}</span>
            </div>

            <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200/40">
              <p className="text-xs text-ink-600 leading-relaxed">{activePlan.summary}</p>
              <div className="flex items-center gap-4 mt-3 text-[11px] text-ink-400">
                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faUserMd} className="text-[12px] text-brand-500" /> {activePlan.assignedManager}</span>
                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faClipboardList} className="text-[12px] text-brand-500" /> {activePlan.managerRole}</span>
                <span className="flex items-center gap-1"><FontAwesomeIcon icon={faStethoscope} className="text-[12px] text-brand-500" /> {activePlan.beneficiaryId}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-ink-800 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faClipboardList} className="text-[14px] text-brand-500" />
                Support Steps ({activePlan.steps.filter(s => s.status === 'done').length}/{activePlan.steps.length})
              </h3>
              <div className="space-y-2">
                {activePlan.steps.map(step => (
                  <div key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      step.status === 'done'
                        ? 'bg-forest-50/50 border-forest-200/40'
                        : 'bg-ink-50/30 border-ink-100/60'
                    }`}>
                    <button onClick={() => completeStep(step.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        step.status === 'done'
                          ? 'bg-forest-500 border-forest-500 text-white'
                          : 'border-ink-300 hover:border-brand-400'
                      }`}>
                      {step.status === 'done' && <FontAwesomeIcon icon={faCheck} className="text-[10px]" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold ${step.status === 'done' ? 'text-ink-400 line-through' : 'text-ink-800'}`}>
                        {step.action}
                      </p>
                      <p className="text-[10px] text-ink-400 mt-0.5">{step.assignedTo}</p>
                      {step.notes && <p className="text-[10px] text-ink-500 mt-1 italic">{step.notes}</p>}
                    </div>
                    <Badge color={step.status === 'done' ? 'forest' : step.status === 'in_progress' ? 'warm' : 'slate'}>
                      {step.status === 'done' ? 'Done' : step.status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <input value={newStepNote} onChange={e => setNewStepNote(e.target.value)}
                  placeholder="Add note to current step..."
                  className="flex-1 h-9 px-3 rounded-lg text-xs border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all placeholder:text-ink-300" />
                <Button onClick={() => { setNewStepNote(''); }} variant="secondary" size="xs" className="!h-9">
                  <FontAwesomeIcon icon={faNotesMedical} className="text-[11px]" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-ink-100">
              <div className="flex items-center gap-1 text-[11px] text-ink-400">
                <FontAwesomeIcon icon={faCalendarCheck} className="text-[12px]" />
                Last updated {activePlan.updatedAt}
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setSupportPlanOpen(false)} variant="secondary" size="sm">
                  Close
                </Button>
                {activePlan.status === 'active' && (
                  <Button onClick={closePlan} variant="primary" size="sm">
                    <FontAwesomeIcon icon={faCheck} className="text-[11px]" /> Close Support Plan
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!beneficiaryDetail} onClose={() => setBeneficiaryDetail(null)} title="Beneficiary Details" size="md">
        {beneficiaryDetail && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                {beneficiaryDetail.fullName.charAt(0)}
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink-800">{beneficiaryDetail.fullName}</h2>
                <p className="text-xs text-ink-400">
                  <Badge color={beneficiaryDetail.traumaLevel === 'high' ? 'rose' : beneficiaryDetail.traumaLevel === 'medium' ? 'blue' : 'forest'}>
                    {beneficiaryDetail.traumaLevel} trauma
                  </Badge>
                  <span className="ml-2">{beneficiaryDetail.category}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-ink-50/50 border border-ink-100/60">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Age</p>
                <p className="text-sm font-bold text-ink-700 mt-0.5">{beneficiaryDetail.age}</p>
              </div>
              <div className="p-4 rounded-xl bg-ink-50/50 border border-ink-100/60">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Sex</p>
                <p className="text-sm font-bold text-ink-700 mt-0.5">{beneficiaryDetail.sex}</p>
              </div>
              <div className="p-4 rounded-xl bg-ink-50/50 border border-ink-100/60">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">District</p>
                <p className="text-sm font-bold text-ink-700 mt-0.5">{beneficiaryDetail.district}</p>
              </div>
              <div className="p-4 rounded-xl bg-ink-50/50 border border-ink-100/60">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Sector</p>
                <p className="text-sm font-bold text-ink-700 mt-0.5">{beneficiaryDetail.sector}</p>
              </div>
              <div className="p-4 rounded-xl bg-ink-50/50 border border-ink-100/60">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Cell</p>
                <p className="text-sm font-bold text-ink-700 mt-0.5">{beneficiaryDetail.cell}</p>
              </div>
              <div className="p-4 rounded-xl bg-ink-50/50 border border-ink-100/60">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">Phone</p>
                <p className="text-sm font-bold text-ink-700 mt-0.5">{beneficiaryDetail.phone}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-ink-100/60">
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1">Category</p>
              <p className="text-sm font-bold text-ink-700">{beneficiaryDetail.category}</p>
            </div>

            <div className="p-4 rounded-xl border border-ink-100/60">
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1">Status</p>
              <Badge color={beneficiaryDetail.status === 'active' ? 'forest' : beneficiaryDetail.status === 'recovered' ? 'brand' : 'warm'}>
                {beneficiaryDetail.status}
              </Badge>
            </div>

            {beneficiaryDetail.notes && (
              <div className="p-4 rounded-xl border border-ink-100/60">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider mb-1">Notes</p>
                <p className="text-sm text-ink-600 leading-relaxed">{beneficiaryDetail.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

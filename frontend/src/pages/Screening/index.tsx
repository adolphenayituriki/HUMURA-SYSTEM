import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronLeft, faChevronRight, faCheck, faFilter, faStethoscope, faHeartbeat, faExclamationTriangle, faClipboardList, faUserCheck, faEnvelope, faLocationDot, faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import type { ScreeningResult, Referral, User } from '../../types';

function calcRiskLevel(phq9: number, gad7: number, pcl5: number): 'low' | 'medium' | 'high' | 'critical' {
  if (phq9 >= 15 || gad7 >= 15 || pcl5 >= 50) return 'critical';
  if (phq9 >= 10 || gad7 >= 10 || pcl5 >= 33) return 'high';
  if (phq9 >= 5 || gad7 >= 5) return 'medium';
  return 'low';
}

export default function ScreeningPage() {
  const { t } = useI18nStore();
  const trans = t();
  const { addToast } = useToastStore();

  const STEPS = [
    { key: 'info', label: trans.screening.stepInfo },
    { key: 'phq9', label: trans.screening.stepPhq9 },
    { key: 'gad7', label: trans.screening.stepGad7 },
    { key: 'pcl5', label: trans.screening.stepPcl5 },
    { key: 'review', label: trans.screening.stepReview },
  ];

  const [screenings, setScreenings] = useState<ScreeningResult[]>(() => service.getScreenings({}));
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [phq9Answers, setPhq9Answers] = useState<number[]>(Array(9).fill(0));
  const [gad7Answers, setGad7Answers] = useState<number[]>(Array(7).fill(0));
  const [pcl5Answers, setPcl5Answers] = useState<number[]>(Array(6).fill(0));

  const [editingScreening, setEditingScreening] = useState<ScreeningResult | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ beneficiaryName: '', phq9Score: 0, gad7Score: 0, pcl5Score: 0, recommendation: '' });

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filtered = riskFilter === 'all' ? screenings : screenings.filter(s => s.riskLevel === riskFilter);
  const highRisk = screenings.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;

  const totalScore = (s: ScreeningResult) => s.phq9Score + s.gad7Score + s.pcl5Score;
  const maxTotal = 27 + 21 + 80;

  const scoreColor = (s: ScreeningResult) => {
    const pct = (totalScore(s) / maxTotal) * 100;
    return pct < 30 ? 'bg-forest-400' : pct < 60 ? 'bg-warm-400' : 'bg-rose-400';
  };

  const resetForm = () => {
    setStep(0);
    setFormData({});
    setPhq9Answers(Array(9).fill(0));
    setGad7Answers(Array(7).fill(0));
    setPcl5Answers(Array(6).fill(0));
  };

  const [submittedScreening, setSubmittedScreening] = useState<ScreeningResult | null>(null);
  const [matchedSupporter, setMatchedSupporter] = useState<{ name: string; role: string; contact: string; email: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const phq9Total = phq9Answers.reduce((a, b) => a + b, 0);
  const gad7Total = gad7Answers.reduce((a, b) => a + b, 0);
  const pcl5Total = pcl5Answers.reduce((a, b) => a + b, 0);
  const combinedTotal = phq9Total + gad7Total + pcl5Total;
  const combinedPct = Math.round((combinedTotal / maxTotal) * 100);

  const getRiskLevel = useCallback((): 'low' | 'medium' | 'high' | 'critical' => {
    return calcRiskLevel(phq9Total, gad7Total, pcl5Total);
  }, [phq9Total, gad7Total, pcl5Total]);

  const findSupporter = useCallback((riskLevel: string, district: string) => {
    const users = service.getUsers();
    const supporters: User[] = [];
    const districtMatch: User[] = [];
    users.forEach(u => {
      const isSupporter = ['district_hospital', 'health_center', 'chw', 'sociotherapy_facilitator', 'youth_counselor', 'emergency_responder'].includes(u.role);
      if (isSupporter) {
        supporters.push(u);
        if (u.district === district) districtMatch.push(u);
      }
    });
    const pool = districtMatch.length > 0 ? districtMatch : supporters;

    const rolePriority: Record<string, string[]> = {
      critical: ['emergency_responder', 'district_hospital'],
      high: ['district_hospital', 'health_center'],
      medium: ['health_center', 'chw', 'sociotherapy_facilitator'],
      low: ['chw', 'youth_counselor', 'sociotherapy_facilitator'],
    };
    const preferredRoles = rolePriority[riskLevel] ?? [];
    for (const role of preferredRoles) {
      const match = pool.find(u => u.role === role);
      if (match) return match;
    }
    return pool[0] ?? null;
  }, []);

  const handleSubmitAssessment = useCallback(() => {
    const riskLevel = getRiskLevel();
    const district = formData['District'] || 'Kigali';
    const screeningId = `SCR-${String(service.getScreenings({}).length + 1).padStart(4, '0')}`;

    const newScreening: ScreeningResult = {
      id: screeningId,
      beneficiaryId: `B-${String(service.getBeneficiaries({}).length + 1).padStart(4, '0')}`,
      beneficiaryName: formData['Beneficiary Name'] || 'Unknown',
      screenedBy: formData['Screened By'] || 'Unknown',
      phq9Score: phq9Total,
      gad7Score: gad7Total,
      pcl5Score: pcl5Total,
      riskLevel,
      recommendation: riskLevel === 'critical' ? 'Immediate psychiatric referral' : riskLevel === 'high' ? 'Urgent referral to health center' : riskLevel === 'medium' ? 'Schedule follow-up counselling' : 'Community support monitoring',
      createdAt: new Date().toISOString().split('T')[0],
    };
    service.addScreening(newScreening);
    setScreenings(service.getScreenings({}));
    addToast('Screening assessment saved successfully');

    const supporter = findSupporter(riskLevel, district);
    if (supporter) {
      const referralId = `REF-${String(service.getReferrals({}).length + 1).padStart(4, '0')}`;
      const newReferral: Referral = {
        id: referralId,
        beneficiaryId: newScreening.beneficiaryId,
        beneficiaryName: newScreening.beneficiaryName,
        from: newScreening.screenedBy,
        fromRole: ['admin', 'chw', 'health_center', 'district_hospital'].includes(useAuthStore.getState().user?.role ?? '') ? useAuthStore.getState().user?.role ?? 'CHW' : 'CHW',
        to: supporter.fullName,
        toRole: supporter.role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        reason: newScreening.recommendation,
        priority: riskLevel === 'critical' ? 'emergency' : riskLevel === 'high' ? 'urgent' : 'routine',
        status: 'pending',
        createdAt: newScreening.createdAt,
        updatedAt: newScreening.createdAt,
      };
      service.addReferral(newReferral);
      setMatchedSupporter({
        name: supporter.fullName,
        role: supporter.role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        contact: supporter.facility || supporter.district || 'Rwanda',
        email: supporter.email,
      });
    }
    setSubmittedScreening(newScreening);
    setShowSuccess(true);
  }, [formData, phq9Total, gad7Total, pcl5Total, getRiskLevel, findSupporter, addToast, setShowSuccess]);

  const handleOpenEdit = useCallback((s: ScreeningResult) => {
    setEditingScreening(s);
    setEditForm({
      beneficiaryName: s.beneficiaryName,
      phq9Score: s.phq9Score,
      gad7Score: s.gad7Score,
      pcl5Score: s.pcl5Score,
      recommendation: s.recommendation,
    });
    setShowEditModal(true);
  }, [setEditingScreening, setEditForm, setShowEditModal]);

  const handleSaveEdit = useCallback(() => {
    if (!editingScreening) return;
    const riskLevel = calcRiskLevel(editForm.phq9Score, editForm.gad7Score, editForm.pcl5Score);
    service.updateScreening(editingScreening.id, {
      beneficiaryName: editForm.beneficiaryName,
      phq9Score: editForm.phq9Score,
      gad7Score: editForm.gad7Score,
      pcl5Score: editForm.pcl5Score,
      recommendation: editForm.recommendation,
      riskLevel,
    });
    setScreenings(service.getScreenings({}));
    addToast('Screening updated successfully');
    setShowEditModal(false);
    setEditingScreening(null);
  }, [editingScreening, editForm, addToast, setEditingScreening, setShowEditModal]);

  const handleOpenDelete = useCallback((id: string) => {
    setDeletingId(id);
    setShowDeleteConfirm(true);
  }, [setDeletingId, setShowDeleteConfirm]);

  const handleConfirmDelete = useCallback(() => {
    if (!deletingId) return;
    service.deleteScreening(deletingId);
    addToast('Screening deleted successfully');
    setScreenings(service.getScreenings({}));
    setShowDeleteConfirm(false);
    setDeletingId(null);
  }, [deletingId, addToast, setDeletingId, setShowDeleteConfirm]);

  const editRiskLevel = calcRiskLevel(editForm.phq9Score, editForm.gad7Score, editForm.pcl5Score);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: trans.screening.beneficiaryName, key: 'Beneficiary Name' },
              { label: trans.screening.age, key: 'Age' },
              { label: trans.screening.district, key: 'District' },
              { label: trans.screening.screenedBy, key: 'Screened By' },
            ].map(p => (
              <div key={p.key}>
                <label className="block text-xs font-semibold text-ink-400 mb-1.5">{p.label}</label>
                <input placeholder={p.label} value={formData[p.key] ?? ''}
                  onChange={e => setFormData(f => ({ ...f, [p.key]: e.target.value }))}
                  className="w-full h-10 px-4 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none placeholder:text-ink-300 bg-white" />
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-ink-600 uppercase tracking-[.06em]">{trans.screening.phq9Title}</h4>
              <span className="text-[10px] text-ink-400 border border-ink-200/60 px-2 py-0.5 rounded bg-white">{trans.screening.past2Weeks}</span>
            </div>
              <div className="space-y-1">
              {trans.screening.phq9Questions.map((q, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2.5 px-3 rounded-lg border border-transparent hover:border-ink-100/60 hover:bg-ink-50/20 transition-colors">
                  <span className="text-xs text-ink-400 w-5 font-mono shrink-0">{i + 1}.</span>
                  <span className="text-xs text-ink-700 flex-1 leading-relaxed">{q}</span>
                  <select value={phq9Answers[i]} onChange={e => {
                    const next = [...phq9Answers]; next[i] = Number(e.target.value); setPhq9Answers(next);
                  }} className="h-8 w-full sm:w-28 px-2 rounded-lg text-xs text-ink-600 border border-ink-200/70 focus:border-brand-400 appearance-none cursor-pointer outline-none bg-white">
                    {[{ v: 0, l: trans.screening.answerNotAtAll }, { v: 1, l: trans.screening.answerSeveralDays }, { v: 2, l: trans.screening.answerMoreThanHalf }, { v: 3, l: trans.screening.answerNearlyEveryDay }].map(o => (
                      <option key={o.v} value={o.v}>{o.l}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right text-xs text-ink-400">
              {trans.screening.score}: <span className="font-semibold text-ink-700">{phq9Total}/27</span>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-ink-600 uppercase tracking-[.06em]">{trans.screening.gad7Title}</h4>
              <span className="text-[10px] text-ink-400 border border-ink-200/60 px-2 py-0.5 rounded bg-white">{trans.screening.past2Weeks}</span>
            </div>
            <div className="space-y-1">
              {trans.screening.gad7Questions.map((q, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2.5 px-3 rounded-lg border border-transparent hover:border-ink-100/60 hover:bg-ink-50/20 transition-colors">
                  <span className="text-xs text-ink-400 w-5 font-mono shrink-0">{i + 1}.</span>
                  <span className="text-xs text-ink-700 flex-1 leading-relaxed">{q}</span>
                  <select value={gad7Answers[i]} onChange={e => {
                    const next = [...gad7Answers]; next[i] = Number(e.target.value); setGad7Answers(next);
                  }} className="h-8 w-full sm:w-28 px-2 rounded-lg text-xs text-ink-600 border border-ink-200/70 focus:border-brand-400 appearance-none cursor-pointer outline-none bg-white">
                    {[{ v: 0, l: trans.screening.answerNotAtAll }, { v: 1, l: trans.screening.answerSeveralDays }, { v: 2, l: trans.screening.answerMoreThanHalf }, { v: 3, l: trans.screening.answerNearlyEveryDay }].map(o => (
                      <option key={o.v} value={o.v}>{o.l}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right text-xs text-ink-400">
              {trans.screening.score}: <span className="font-semibold text-ink-700">{gad7Total}/21</span>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-ink-600 uppercase tracking-[.06em]">{trans.screening.pcl5Title}</h4>
              <span className="text-[10px] text-ink-400 border border-ink-200/60 px-2 py-0.5 rounded bg-white">{trans.screening.pastMonth}</span>
            </div>
            <div className="space-y-1">
              {trans.screening.pcl5Questions.map((q, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2.5 px-3 rounded-lg border border-transparent hover:border-ink-100/60 hover:bg-ink-50/20 transition-colors">
                  <span className="text-xs text-ink-400 w-5 font-mono shrink-0">{i + 1}.</span>
                  <span className="text-xs text-ink-700 flex-1 leading-relaxed">{q}</span>
                  <select value={pcl5Answers[i]} onChange={e => {
                    const next = [...pcl5Answers]; next[i] = Number(e.target.value); setPcl5Answers(next);
                  }} className="h-8 w-full sm:w-32 px-2 rounded-lg text-xs text-ink-600 border border-ink-200/70 focus:border-brand-400 appearance-none cursor-pointer outline-none bg-white">
                    {[{ v: 0, l: trans.screening.answerNotAtAll }, { v: 1, l: trans.screening.answerALittleBit }, { v: 2, l: trans.screening.answerModerately }, { v: 3, l: trans.screening.answerQuiteABit }, { v: 4, l: trans.screening.answerExtremely }].map(o => (
                      <option key={o.v} value={o.v}>{o.l}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right text-xs text-ink-400">
              {trans.screening.score}: <span className="font-semibold text-ink-700">{pcl5Total}/80</span>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="mb-6">
            <h4 className="text-xs font-bold text-ink-600 uppercase tracking-[.06em] mb-4">{trans.screening.assessmentSummary}</h4>
            <div className="grid sm:grid-cols-3 gap-5 md:gap-6 mb-6">
              {[
                { label: trans.screening.phq9Depression, score: phq9Total, max: 27, bar: 'bg-brand-400' },
                { label: trans.screening.gad7Anxiety, score: gad7Total, max: 21, bar: 'bg-warm-400' },
                { label: trans.screening.pcl5Ptsd, score: pcl5Total, max: 80, bar: 'bg-rose-400' },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4 text-center bg-white border border-ink-200/60">
                  <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.06em]">{s.label}</p>
                  <p className="text-2xl font-bold text-ink-900 mt-1">{s.score}<span className="text-sm font-medium text-ink-400">/{s.max}</span></p>
                  <div className="w-full h-1.5 rounded-full bg-ink-100/70 overflow-hidden mt-2">
                    <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${(s.score / s.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-ink-200/60 rounded-xl p-5 text-center bg-white">
              <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.06em] mb-1">{trans.screening.combinedScore}</p>
              <p className="text-3xl font-bold text-ink-900">{combinedTotal}/{maxTotal}</p>
              <div className="w-full max-w-xs h-2 rounded-full bg-ink-100/70 overflow-hidden mt-2 mx-auto">
                <div className={`h-full rounded-full ${combinedPct < 30 ? 'bg-forest-400' : combinedPct < 60 ? 'bg-warm-400' : 'bg-rose-400'}`}
                  style={{ width: `${combinedPct}%` }} />
              </div>
              <p className="text-xs text-ink-500 mt-2">
                {combinedPct < 30 ? trans.screening.riskLow : combinedPct < 60 ? trans.screening.riskModerate : trans.screening.riskHigh}
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.screening.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.screening.subtitle}</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); if (!showForm) resetForm(); }} variant="primary" className="shrink-0">
          <FontAwesomeIcon icon={faPlus} className="text-[14px]" /> {trans.screening.newAssessment}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <StatCard label={trans.screening.totalScreenings} value={screenings.length}
          icon={<FontAwesomeIcon icon={faClipboardList} className="text-[16px] text-brand-500 shrink-0" />} />
        <StatCard label={trans.screening.highRisk} value={highRisk}
          icon={<FontAwesomeIcon icon={faExclamationTriangle} className="text-[16px] text-warm-500 shrink-0" />} />
        <StatCard label={trans.screening.critical} value={screenings.filter(s => s.riskLevel === 'critical').length}
          icon={<FontAwesomeIcon icon={faHeartbeat} className="text-[16px] text-rose-500 shrink-0" />} />
        <StatCard label={trans.screening.avgPhq9} value={screenings.length ? (screenings.reduce((a, s) => a + s.phq9Score, 0) / screenings.length).toFixed(1) : '0'}
          icon={<FontAwesomeIcon icon={faStethoscope} className="text-[16px] text-forest-500 shrink-0" />} />
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <div className="rounded-xl border border-ink-200/60 bg-white shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-brand-50/50 to-ink-50/30 px-6 py-4 border-b border-ink-100">
                <div className="flex items-center gap-0">
                  {STEPS.map((s, i) => (
                    <div key={s.key} className="flex items-center">
                      <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-700' : 'text-ink-300'}`}>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                          i < step ? 'bg-brand-600 text-white shadow-sm' : i === step ? 'border-2 border-brand-600 text-brand-700 bg-white' : 'border border-ink-300 text-ink-400 bg-white'
                        }`}>
                          {i < step ? <FontAwesomeIcon icon={faCheck} className="text-[12px]" /> : i + 1}
                        </div>
                        <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className={`w-6 md:w-12 h-px mx-2 ${i < step ? 'bg-brand-300' : 'bg-ink-200'}`} />}
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6">

              {renderStep()}

              <div className="flex items-center justify-between pt-4 border-t border-ink-100">
                <Button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} variant="ghost" size="sm">
                  <FontAwesomeIcon icon={faChevronLeft} className="text-[14px]" /> {trans.screening.back}
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => { setShowForm(false); resetForm(); }} variant="ghost" size="sm">{trans.screening.cancel}</Button>
                  {step < STEPS.length - 1 ? (
                    <Button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} variant="primary" size="sm">
                      {trans.screening.next} <FontAwesomeIcon icon={faChevronRight} className="text-[14px]" />
                    </Button>
                  ) : (
                    <Button onClick={() => { handleSubmitAssessment(); setShowForm(false); }} variant="success" size="sm">
                      <FontAwesomeIcon icon={faCheck} className="text-[14px]" /> {trans.screening.submitAssessment}
                    </Button>
                  )}
                </div>
              </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccess && submittedScreening && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-forest-200/60 bg-gradient-to-r from-forest-50/80 to-white overflow-hidden shadow-sm">
            <div className="p-6 md:p-8">
              <div className="flex items-start gap-4">
                <FontAwesomeIcon icon={faCheck} className="text-[20px] text-forest-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-extrabold text-ink-900">Assessment Saved Successfully</h3>
                  <p className="text-xs text-ink-500 mt-1">
                    Screening {submittedScreening.id} · Risk Level: <Badge color={submittedScreening.riskLevel === 'critical' ? 'rose' : submittedScreening.riskLevel === 'high' ? 'warm' : submittedScreening.riskLevel === 'medium' ? 'blue' : 'forest'}>{submittedScreening.riskLevel}</Badge>
                  </p>

                  {matchedSupporter && (
                    <div className="mt-5 p-4 rounded-xl bg-white border border-forest-200/60">
                      <div className="flex items-center gap-2 text-xs font-semibold text-forest-700 mb-3">
                        <FontAwesomeIcon icon={faUserCheck} className="text-[14px]" />
                        Assigned Supporter
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {matchedSupporter.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ink-800">{matchedSupporter.name}</p>
                          <p className="text-xs text-brand-600 font-medium">{matchedSupporter.role}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-ink-500">
                            <span className="flex items-center gap-1"><FontAwesomeIcon icon={faLocationDot} className="text-[10px]" /> {matchedSupporter.contact}</span>
                            <span className="flex items-center gap-1"><FontAwesomeIcon icon={faEnvelope} className="text-[10px]" /> {matchedSupporter.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-5">
                    <Button onClick={() => { setShowSuccess(false); resetForm(); }} variant="primary" size="sm">
                      <FontAwesomeIcon icon={faPlus} className="text-[11px]" /> New Assessment
                    </Button>
                    <Button onClick={() => { setShowSuccess(false); resetForm(); }} variant="ghost" size="sm">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-ink-200/60 bg-white shadow-sm">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(r => (
          <Button key={r} onClick={() => setRiskFilter(r)}
            variant={riskFilter === r ? 'primary' : 'secondary'} size="sm"
            className={riskFilter !== r ? '!border-ink-200/60' : ''}>
            {r === 'all' ? trans.screening.allRiskLevels : r === 'critical' ? trans.screening.critical : r === 'high' ? trans.screening.highRisk : r === 'medium' ? trans.screening.medium : trans.screening.low}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border border-ink-200/60 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-modern">
            <thead>
              <tr>
                {[trans.screening.beneficiary, 'PHQ-9', 'GAD-7', 'PCL-5', trans.screening.total, trans.screening.riskLevel, trans.screening.recommendation, ''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100/50">
              {filtered.map((s, i) => (
                <motion.tr key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                >
                  <td className="font-medium text-ink-800 whitespace-nowrap">{s.beneficiaryName}</td>
                  <td className="font-mono text-xs text-ink-600 whitespace-nowrap">{s.phq9Score}/27</td>
                  <td className="font-mono text-xs text-ink-600 whitespace-nowrap">{s.gad7Score}/21</td>
                  <td className="font-mono text-xs text-ink-600 whitespace-nowrap">{s.pcl5Score}/80</td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-ink-100/70 overflow-hidden">
                        <div className={`h-full rounded-full ${scoreColor(s)}`} style={{ width: `${(totalScore(s) / maxTotal) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono text-ink-600">{totalScore(s)}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    <Badge color={s.riskLevel === 'critical' ? 'rose' : s.riskLevel === 'high' ? 'warm' : s.riskLevel === 'medium' ? 'blue' : 'forest'}>
                      {s.riskLevel === 'critical' ? trans.screening.critical : s.riskLevel === 'high' ? trans.screening.highRisk : s.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low}
                    </Badge>
                  </td>
                  <td className="text-xs text-ink-500 max-w-[200px] truncate">{s.recommendation}</td>
                  <td className="whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleOpenEdit(s)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-300 hover:text-brand-500 hover:bg-brand-50 transition-all">
                        <FontAwesomeIcon icon={faPenToSquare} className="text-[14px]" />
                      </button>
                      <button onClick={() => handleOpenDelete(s.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                        <FontAwesomeIcon icon={faTrashCan} className="text-[14px]" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
            {filtered.length === 0 && (
            <div className="text-center py-16">
              <FontAwesomeIcon icon={faFilter} className="text-[22px] text-ink-300 mx-auto mb-4" />
              <p className="text-sm font-semibold text-ink-500">{trans.screening.noResults}</p>
              <p className="text-xs text-ink-300 mt-1">No screenings match your selected risk filter</p>
            </div>
          )}
        </div>
      </div>

      <Modal open={showEditModal} onClose={() => { setShowEditModal(false); setEditingScreening(null); }} title={`Edit Screening - ${editingScreening?.id ?? ''}`} size="lg">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ink-400 mb-1.5">Beneficiary Name</label>
            <input value={editForm.beneficiaryName}
              onChange={e => setEditForm(f => ({ ...f, beneficiaryName: e.target.value }))}
              className="w-full h-10 px-4 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none placeholder:text-ink-300 bg-white" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-400 mb-1.5">PHQ-9 Score (0-27)</label>
              <input type="number" min={0} max={27} value={editForm.phq9Score}
                onChange={e => setEditForm(f => ({ ...f, phq9Score: Math.min(27, Math.max(0, Number(e.target.value) || 0)) }))}
                className="w-full h-10 px-4 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-400 mb-1.5">GAD-7 Score (0-21)</label>
              <input type="number" min={0} max={21} value={editForm.gad7Score}
                onChange={e => setEditForm(f => ({ ...f, gad7Score: Math.min(21, Math.max(0, Number(e.target.value) || 0)) }))}
                className="w-full h-10 px-4 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-400 mb-1.5">PCL-5 Score (0-80)</label>
              <input type="number" min={0} max={80} value={editForm.pcl5Score}
                onChange={e => setEditForm(f => ({ ...f, pcl5Score: Math.min(80, Math.max(0, Number(e.target.value) || 0)) }))}
                className="w-full h-10 px-4 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-400 mb-1.5">Recommendation</label>
            <textarea value={editForm.recommendation} rows={3}
              onChange={e => setEditForm(f => ({ ...f, recommendation: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none placeholder:text-ink-300 bg-white resize-none" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <span className="text-xs font-semibold text-ink-400">Risk Level:</span>
            <Badge color={editRiskLevel === 'critical' ? 'rose' : editRiskLevel === 'high' ? 'warm' : editRiskLevel === 'medium' ? 'blue' : 'forest'}>{editRiskLevel}</Badge>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-ink-100">
            <Button onClick={() => { setShowEditModal(false); setEditingScreening(null); }} variant="ghost" size="sm">Cancel</Button>
            <Button onClick={handleSaveEdit} variant="primary" size="sm">
              <FontAwesomeIcon icon={faCheck} className="text-[14px]" /> Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setDeletingId(null); }}
        onConfirm={handleConfirmDelete}
        title="Delete Screening"
        message={`Are you sure you want to delete this screening? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

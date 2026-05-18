import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { service } from '../../services/mockData';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import type { ScreeningResult } from '../../types';

export default function ScreeningPage() {
  const { t } = useI18nStore();
  const trans = t();

  const STEPS = [
    { key: 'info', label: trans.screening.stepInfo },
    { key: 'phq9', label: trans.screening.stepPhq9 },
    { key: 'gad7', label: trans.screening.stepGad7 },
    { key: 'pcl5', label: trans.screening.stepPcl5 },
    { key: 'review', label: trans.screening.stepReview },
  ];

  const [screenings] = useState<ScreeningResult[]>(() => service.getScreenings({}));
  const [riskFilter, setRiskFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [phq9Answers, setPhq9Answers] = useState<number[]>(Array(9).fill(0));
  const [gad7Answers, setGad7Answers] = useState<number[]>(Array(7).fill(0));
  const [pcl5Answers, setPcl5Answers] = useState<number[]>(Array(6).fill(0));

  const filtered  = riskFilter === 'all' ? screenings : screenings.filter(s => s.riskLevel === riskFilter);
  const highRisk  = screenings.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length;

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

  const phq9Total = phq9Answers.reduce((a, b) => a + b, 0);
  const gad7Total = gad7Answers.reduce((a, b) => a + b, 0);
  const pcl5Total = pcl5Answers.reduce((a, b) => a + b, 0);
  const combinedTotal = phq9Total + gad7Total + pcl5Total;
  const combinedPct = Math.round((combinedTotal / maxTotal) * 100);

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
                  className="w-full h-10 px-4 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none placeholder:text-ink-300" />
              </div>
            ))}
          </div>
        );
      case 1:
        return (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-bold text-ink-600 uppercase tracking-[.06em]">{trans.screening.phq9Title}</h4>
              <span className="text-[10px] text-ink-400 border border-ink-200/60 px-2 py-0.5 rounded">{trans.screening.past2Weeks}</span>
            </div>
              <div className="space-y-1">
              {trans.screening.phq9Questions.map((q, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 px-3 rounded-lg border border-transparent hover:border-ink-100/60 transition-colors">
                  <span className="text-xs text-ink-400 w-5 font-mono shrink-0">{i + 1}.</span>
                  <span className="text-xs text-ink-700 flex-1 leading-relaxed">{q}</span>
                  <select value={phq9Answers[i]} onChange={e => {
                    const next = [...phq9Answers]; next[i] = Number(e.target.value); setPhq9Answers(next);
                  }} className="h-8 w-full sm:w-28 px-2 rounded-lg text-xs text-ink-600 border border-ink-200/70 focus:border-brand-400 appearance-none cursor-pointer outline-none">
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
              <span className="text-[10px] text-ink-400 border border-ink-200/60 px-2 py-0.5 rounded">{trans.screening.past2Weeks}</span>
            </div>
            <div className="space-y-1">
              {trans.screening.gad7Questions.map((q, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 px-3 rounded-lg border border-transparent hover:border-ink-100/60 transition-colors">
                  <span className="text-xs text-ink-400 w-5 font-mono shrink-0">{i + 1}.</span>
                  <span className="text-xs text-ink-700 flex-1 leading-relaxed">{q}</span>
                  <select value={gad7Answers[i]} onChange={e => {
                    const next = [...gad7Answers]; next[i] = Number(e.target.value); setGad7Answers(next);
                  }} className="h-8 w-full sm:w-28 px-2 rounded-lg text-xs text-ink-600 border border-ink-200/70 focus:border-brand-400 appearance-none cursor-pointer outline-none">
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
              <span className="text-[10px] text-ink-400 border border-ink-200/60 px-2 py-0.5 rounded">{trans.screening.pastMonth}</span>
            </div>
            <div className="space-y-1">
              {trans.screening.pcl5Questions.map((q, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 px-3 rounded-lg border border-transparent hover:border-ink-100/60 transition-colors">
                  <span className="text-xs text-ink-400 w-5 font-mono shrink-0">{i + 1}.</span>
                  <span className="text-xs text-ink-700 flex-1 leading-relaxed">{q}</span>
                  <select value={pcl5Answers[i]} onChange={e => {
                    const next = [...pcl5Answers]; next[i] = Number(e.target.value); setPcl5Answers(next);
                  }} className="h-8 w-full sm:w-32 px-2 rounded-lg text-xs text-ink-600 border border-ink-200/70 focus:border-brand-400 appearance-none cursor-pointer outline-none">
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
                <div key={s.label} className="rounded-xl p-4 text-center border border-ink-200/70">
                  <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.06em]">{s.label}</p>
                  <p className="text-2xl font-bold text-ink-900 mt-1">{s.score}<span className="text-sm font-medium text-ink-400">/{s.max}</span></p>
                  <div className="w-full h-1.5 rounded-full bg-ink-100/70 overflow-hidden mt-2">
                    <div className={`h-full rounded-full ${s.bar}`} style={{ width: `${(s.score / s.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="border border-ink-200/70 rounded-xl p-5 text-center">
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
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.screening.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.screening.subtitle}</p>
        </div>
        <Button onClick={() => { setShowForm(!showForm); if (!showForm) resetForm(); }} variant="primary" className="shrink-0">
          <Plus size={14} /> {trans.screening.newAssessment}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
        <StatCard label={trans.screening.totalScreenings} value={screenings.length} />
        <StatCard label={trans.screening.highRisk} value={highRisk} />
        <StatCard label={trans.screening.critical} value={screenings.filter(s => s.riskLevel === 'critical').length} />
        <StatCard label={trans.screening.avgPhq9} value={screenings.length ? (screenings.reduce((a, s) => a + s.phq9Score, 0) / screenings.length).toFixed(1) : '0'} />
      </div>

      {/* Stepped assessment form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
            <div className="rounded-xl border border-ink-200/70 p-6 bg-surface">
              {/* Step indicator */}
              <div className="flex items-center gap-0 mb-6 border-b border-ink-100 pb-4">
                {STEPS.map((s, i) => (
                  <div key={s.key} className="flex items-center">
                    <div className={`flex items-center gap-2 ${i <= step ? 'text-brand-600' : 'text-ink-300'}`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                        i < step ? 'bg-brand-500 text-white' : i === step ? 'border-2 border-brand-500 text-brand-600' : 'border border-ink-300 text-ink-400'
                      }`}>
                        {i < step ? <Check size={12} /> : i + 1}
                      </div>
                      <span className="text-xs font-medium hidden sm:inline">{s.label}</span>
                    </div>
                    {i < STEPS.length - 1 && <div className={`w-6 md:w-10 h-px mx-2 ${i < step ? 'bg-brand-300' : 'bg-ink-200'}`} />}
                  </div>
                ))}
              </div>

              {renderStep()}

              <div className="flex items-center justify-between pt-4 border-t border-ink-100">
                <Button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0} variant="ghost" size="sm">
                  <ChevronLeft size={14} /> {trans.screening.back}
                </Button>
                <div className="flex gap-2">
                  <Button onClick={() => { setShowForm(false); resetForm(); }} variant="ghost" size="sm">{trans.screening.cancel}</Button>
                  {step < STEPS.length - 1 ? (
                    <Button onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))} variant="primary" size="sm">
                      {trans.screening.next} <ChevronRight size={14} />
                    </Button>
                  ) : (
                    <Button onClick={() => { setShowForm(false); resetForm(); }} variant="success" size="sm">
                      <Check size={14} /> {trans.screening.submitAssessment}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Risk filter chips */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'critical', 'high', 'medium', 'low'] as const).map(r => (
          <Button key={r} onClick={() => setRiskFilter(r)}
            variant={riskFilter === r ? 'primary' : 'secondary'} size="sm">
            {r === 'all' ? trans.screening.allRiskLevels : r === 'critical' ? trans.screening.critical : r === 'high' ? trans.screening.highRisk : r === 'medium' ? trans.screening.medium : trans.screening.low}
          </Button>
        ))}
      </div>

      {/* Screening table */}
      <div className="rounded-xl border border-ink-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100">
                {[trans.screening.beneficiary, 'PHQ-9', 'GAD-7', 'PCL-5', trans.screening.total, trans.screening.riskLevel, trans.screening.recommendation].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[.06em] px-6 py-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {filtered.map((s, i) => (
                <motion.tr key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                  className="hover:bg-ink-50/30 transition-colors"
                >
                  <td className="px-6 py-5 font-medium text-ink-800 whitespace-nowrap">{s.beneficiaryName}</td>
                  <td className="px-6 py-5 font-mono text-xs text-ink-600 whitespace-nowrap">{s.phq9Score}/27</td>
                  <td className="px-6 py-5 font-mono text-xs text-ink-600 whitespace-nowrap">{s.gad7Score}/21</td>
                  <td className="px-6 py-5 font-mono text-xs text-ink-600 whitespace-nowrap">{s.pcl5Score}/80</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-ink-100/70 overflow-hidden">
                        <div className={`h-full rounded-full ${scoreColor(s)}`} style={{ width: `${(totalScore(s) / maxTotal) * 100}%` }} />
                      </div>
                      <span className="text-xs font-mono text-ink-600">{totalScore(s)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <Badge color={s.riskLevel === 'critical' ? 'rose' : s.riskLevel === 'high' ? 'warm' : s.riskLevel === 'medium' ? 'warm' : 'brand'}>
                      {s.riskLevel === 'critical' ? trans.screening.critical : s.riskLevel === 'high' ? trans.screening.highRisk : s.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-xs text-ink-500 max-w-[200px] truncate">{s.recommendation}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-ink-300 text-sm">{trans.screening.noResults}</div>
          )}
        </div>
      </div>
    </div>
  );
}
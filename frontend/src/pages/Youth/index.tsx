import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import type { YouthParticipant } from '../../types';

const PROG_ACCENTS: Record<string, string> = {
  'School Counseling':   'bg-brand-400',
  'Peace Education':     'bg-forest-400',
  'Leadership Training': 'bg-warm-400',
  'Life Skills':         'bg-forest-400',
  'Dialogue Forums':     'bg-warm-400',
  'Youth Club':          'bg-brand-300',
};

const PROG_KEYS: Record<string, string> = {
  'School Counseling': 'schoolCounseling',
  'Peace Education': 'peaceEducation',
  'Leadership Training': 'leadershipTraining',
  'Life Skills': 'lifeSkills',
  'Dialogue Forums': 'dialogueForums',
  'Youth Club': 'youthClub',
};

export default function YouthPage() {
  const { t } = useI18nStore();
  const trans = t();
  const [youth] = useState<YouthParticipant[]>(() => service.getYouthParticipants({}));
  const [programFilter, setProgramFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [enrollMsg, setEnrollMsg] = useState(false);
  const programs = Array.from(new Set(youth.map(y => y.program)));
  const filtered = youth.filter(y => {
    const mp = programFilter === 'all' || y.program === programFilter;
    const ms = statusFilter === 'all'    || y.status       === statusFilter;
    return mp && ms;
  });

  const avgWellbeing = youth.length
    ? Math.round(youth.reduce((a, y) => a + y.emotionalScore, 0) / youth.length)
    : 0;

  function scoreColor(v: number) {
    return v < 50 ? 'bg-rose-500' : v < 70 ? 'bg-warm-500' : 'bg-forest-500';
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.youth.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.youth.subtitle}</p>
        </div>
        <Button variant="primary" className="shrink-0" onClick={() => { setEnrollMsg(true); setTimeout(() => setEnrollMsg(false), 2500); }}>
          <FontAwesomeIcon icon={faPlus} className="text-[14px]" /> {trans.youth.enrollYouth}
        </Button>
      </div>

      {enrollMsg && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="border border-forest-200/60 rounded-xl px-4 py-3 text-xs font-semibold text-forest-700 flex items-center gap-2 bg-forest-50/30">
          <FontAwesomeIcon icon={faCircleCheck} className="text-[14px]" /> {trans.youth.enrollSuccess}
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard label={trans.youth.active} value={youth.filter(y => y.status === 'active').length} />
        <StatCard label={trans.youth.avgWellbeing} value={`${avgWellbeing}%`} />
        <StatCard label={trans.youth.graduated} value={youth.filter(y => y.status === 'graduated').length} />
        <StatCard label={trans.youth.programs} value={programs.length} />
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4 p-5 md:p-6 rounded-xl border border-ink-200/60 bg-white">
        <input type="text" placeholder={trans.youth.searchPlaceholder}
          className="flex-1 min-w-[160px] md:min-w-[180px] h-9 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none bg-white" />
        <select value={programFilter} onChange={e => setProgramFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm text-ink-600 border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 appearance-none cursor-pointer outline-none bg-white">
          <option value="all">{trans.youth.allPrograms}</option>
          {programs.map(p => <option key={p} value={p}>{(trans.youth.programKeys as Record<string, string>)[PROG_KEYS[p]] || p}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm text-ink-600 border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 appearance-none cursor-pointer outline-none bg-white">
          <option value="all">{trans.youth.allStatus}</option>
          <option value="active">{trans.youth.active}</option>
          <option value="graduated">{trans.youth.graduated}</option>
          <option value="withdrawn">{trans.youth.withdrawn}</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {filtered.length === 0 ? (
          <Card className="col-span-full text-center py-12">
            <p className="text-ink-300 text-sm">{trans.youth.noResults}</p>
          </Card>
        ) : (
          filtered.map((y, i) => (
            <motion.div key={y.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}>
              <Card className="h-full !p-0 overflow-hidden">
                <div className={`h-1.5 ${PROG_ACCENTS[y.program] ?? 'bg-brand-400'}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-ink-800">{y.fullName}</p>
                      <p className="text-xs text-ink-400 mt-0.5">{y.school} · {y.district}</p>
                    </div>
                    <Badge color={y.status === 'active' ? 'forest' : y.status === 'graduated' ? 'brand' : 'slate'}>{y.status === 'active' ? trans.youth.active : y.status === 'graduated' ? trans.youth.graduated : trans.youth.withdrawn}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-ink-400 mb-3">
                    <span>{trans.youth.age} {y.age}</span>
                    <span className="text-ink-200">·</span>
                    <Badge color="warm">{(trans.youth.programKeys as Record<string, string>)[PROG_KEYS[y.program]] || y.program}</Badge>
                  </div>

                  <div className="pt-3 border-t border-ink-100">
                    <div className="flex items-center justify-between text-xs text-ink-400 mb-1.5">
                      <span>{trans.youth.emotionalWellbeing}</span>
                      <span className="font-mono font-semibold text-ink-600">{y.emotionalScore}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-ink-100/70 overflow-hidden">
                      <motion.div animate={{ width: `${y.emotionalScore}%` }}
                        transition={{ delay: Math.min(i * 0.06 + 0.2, 1), duration: 0.6 }}
                        className={`h-full rounded-full ${scoreColor(y.emotionalScore)}`} />
                    </div>
                    <p className="text-[10px] text-ink-300 mt-1.5">{trans.youth.enrolled} {y.enrolledAt}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

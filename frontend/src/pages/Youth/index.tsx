import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faGraduationCap, faHeart, faCalendar, faPenToSquare, faTrashCan, faArrowRight, faChartBar, faUserGraduate, faSchool } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useI18nStore } from '../../i18n';
import type { YouthParticipant } from '../../types';

const PROG_KEYS: Record<string, string> = {
  'School Counseling': 'schoolCounseling',
  'Peace Education': 'peaceEducation',
  'Leadership Training': 'leadershipTraining',
  'Life Skills': 'lifeSkills',
  'Dialogue Forums': 'dialogueForums',
  'Youth Club': 'youthClub',
};

const PROGRAMS = ['School Counseling', 'Peace Education', 'Leadership Training', 'Life Skills', 'Dialogue Forums', 'Youth Club'];

const PROGRAM_DETAILS: Record<string, { description: string; goals: string; eligibility: string; icon: typeof faGraduationCap }> = {
  'School Counseling': {
    description: 'School Counseling provides trauma-informed psychological support within school settings. Counselors work with students to address emotional distress, improve coping mechanisms, and foster a safe learning environment.',
    goals: 'Reduce emotional distress; improve school attendance; build resilience and coping skills; provide early intervention for trauma-related issues.',
    eligibility: 'Open to all primary and secondary school students enrolled in participating schools.',
    icon: faHeart,
  },
  'Peace Education': {
    description: 'Peace Education teaches conflict resolution, reconciliation, and community-building skills. Participants learn to manage disagreements constructively and promote harmony in their communities.',
    goals: 'Develop conflict resolution skills; promote inter-community dialogue; reduce violence; build sustainable peace practices.',
    eligibility: 'Open to youth aged 12–25 from all districts. No prior education required.',
    icon: faUserGraduate,
  },
  'Leadership Training': {
    description: 'Leadership Training empowers young people with the skills needed to lead community initiatives, advocate for change, and become role models in their neighborhoods.',
    goals: 'Build leadership capacity; strengthen public speaking and advocacy skills; foster community engagement; develop project management abilities.',
    eligibility: 'Youth aged 16–25 who demonstrate interest in community leadership. Previous volunteer experience preferred.',
    icon: faChartBar,
  },
  'Life Skills': {
    description: 'Life Skills equips youth with practical skills for daily living, including financial literacy, communication, decision-making, and vocational readiness.',
    goals: 'Improve financial literacy; enhance communication skills; develop decision-making abilities; prepare youth for employment.',
    eligibility: 'All youth aged 14–24. No prior qualifications needed.',
    icon: faSchool,
  },
  'Dialogue Forums': {
    description: 'Dialogue Forums bring together youth from diverse backgrounds to discuss community issues, share experiences, and collaborate on solutions in a facilitated, safe environment.',
    goals: 'Foster cross-community understanding; promote collaborative problem-solving; amplify youth voices in community decisions; build trust across groups.',
    eligibility: 'Open to youth aged 15–30 from any district or background.',
    icon: faGraduationCap,
  },
  'Youth Club': {
    description: 'Youth Clubs offer a safe recreational and social space where young people can connect, participate in group activities, and access peer support in a structured setting.',
    goals: 'Provide safe social spaces; reduce isolation; encourage positive peer relationships; offer recreational and educational activities.',
    eligibility: 'All youth aged 10–20. Parental consent required for participants under 16.',
    icon: faArrowRight,
  },
};

interface YouthForm {
  fullName: string;
  age: string;
  school: string;
  district: string;
  program: string;
  emotionalScore: string;
  status: 'active' | 'graduated' | 'withdrawn';
}

const EMPTY_FORM: YouthForm = {
  fullName: '',
  age: '',
  school: '',
  district: '',
  program: 'School Counseling',
  emotionalScore: '',
  status: 'active',
};

function toParticipant(form: YouthForm, id?: string): YouthParticipant {
  return {
    id: id || crypto.randomUUID(),
    fullName: form.fullName,
    age: Number(form.age),
    school: form.school,
    district: form.district,
    program: form.program,
    emotionalScore: Number(form.emotionalScore),
    status: form.status,
    enrolledAt: id ? '' : new Date().toLocaleDateString(),
    counselorId: 'mock-counselor',
  };
}

function fromParticipant(y: YouthParticipant): YouthForm {
  return {
    fullName: y.fullName,
    age: String(y.age),
    school: y.school,
    district: y.district,
    program: y.program,
    emotionalScore: String(y.emotionalScore),
    status: y.status,
  };
}

export default function YouthPage() {
  const { t } = useI18nStore();
  const trans = t();
  const [youth, setYouth] = useState<YouthParticipant[]>(() => service.getYouthParticipants({}));
  const [searchQuery, setSearchQuery] = useState('');
  const [programFilter, setProgramFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<YouthParticipant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<YouthParticipant | null>(null);
  const [form, setForm] = useState<YouthForm>(EMPTY_FORM);
  const { addToast } = useToastStore();
  const [programDetailTarget, setProgramDetailTarget] = useState<string | null>(null);

  const programs = Array.from(new Set(youth.map(y => y.program)));

  const query = searchQuery.toLowerCase();
  const filtered = youth.filter(y => {
    const mq = !query || y.fullName.toLowerCase().includes(query);
    const mp = programFilter === 'all' || y.program === programFilter;
    const ms = statusFilter === 'all' || y.status === statusFilter;
    return mq && mp && ms;
  });

  const avgWellbeing = youth.length
    ? Math.round(youth.reduce((a, y) => a + y.emotionalScore, 0) / youth.length)
    : 0;

  function scoreColor(v: number) {
    return v < 50 ? 'bg-brand-400' : v < 70 ? 'bg-brand-500' : 'bg-brand-600';
  }

  function openAdd() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(y: YouthParticipant) {
    setEditTarget(y);
    setForm(fromParticipant(y));
    setShowModal(true);
  }

  function handleSave() {
    if (!form.fullName || !form.age || !form.school || !form.district || !form.emotionalScore) return;
    if (editTarget) {
      const updated = service.updateYouth(editTarget.id, toParticipant(form, editTarget.id));
      if (updated) {
        setYouth(prev => prev.map(y => y.id === editTarget.id ? updated : y));
        addToast('Youth updated successfully');
      }
    } else {
      const added = service.addYouth(toParticipant(form));
      setYouth(prev => [added, ...prev]);
      addToast('Youth enrolled successfully');
    }
    setShowModal(false);
  }

  function handleDelete() {
    if (!deleteTarget) return;
    const ok = service.deleteYouth(deleteTarget.id);
    if (ok) {
      setYouth(prev => prev.filter(y => y.id !== deleteTarget.id));
      addToast('Youth deleted successfully');
    }
    setDeleteTarget(null);
  }

  function set<K extends keyof YouthForm>(key: K, value: YouthForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.youth.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.youth.subtitle}</p>
        </div>
        <Button variant="primary" className="shrink-0" onClick={openAdd}>
          <FontAwesomeIcon icon={faPlus} className="text-[14px]" /> {trans.youth.enrollYouth}
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <StatCard label={trans.youth.active} value={youth.filter(y => y.status === 'active').length}
          icon={<FontAwesomeIcon icon={faHeart} className="text-[16px] text-brand-500" />} />
        <StatCard label={trans.youth.avgWellbeing} value={`${avgWellbeing}%`}
          icon={<FontAwesomeIcon icon={faGraduationCap} className="text-[16px] text-brand-500" />} />
        <StatCard label={trans.youth.graduated} value={youth.filter(y => y.status === 'graduated').length}
          icon={<FontAwesomeIcon icon={faCalendar} className="text-[16px] text-brand-500" />} />
        <StatCard label={trans.youth.programs} value={programs.length}
          icon={<FontAwesomeIcon icon={faPlus} className="text-[16px] text-brand-500" />} />
      </div>

      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-brand-300 to-brand-500" />
          <h2 className="text-sm font-bold text-ink-700 uppercase tracking-wider">{trans.youth.programs}</h2>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {PROGRAMS.map((prog, i) => {
            const inProg = youth.filter(y => y.program === prog);
            const total = inProg.length;
            const active = inProg.filter(y => y.status === 'active').length;
            const avg = total ? Math.round(inProg.reduce((a, y) => a + y.emotionalScore, 0) / total) : 0;
            const detail = PROGRAM_DETAILS[prog];
            return (
              <motion.div key={prog} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}
                className="cursor-pointer" onClick={() => setProgramDetailTarget(prog)}>
                <Card className="h-full !p-0 overflow-hidden group hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <FontAwesomeIcon icon={detail.icon} className="text-[18px] text-brand-500" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-ink-800 truncate">{(trans.youth.programKeys as Record<string, string>)[PROG_KEYS[prog]] || prog}</p>
                        <p className="text-[10px] text-ink-400">{total} participants · {active} active</p>
                      </div>
                    </div>
                    <p className="text-xs text-ink-500 leading-relaxed line-clamp-2 mb-3">{detail.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-ink-400">
                        <span className="font-mono font-semibold text-ink-600">{avg}%</span>
                        <span>avg. wellbeing</span>
                      </div>
                      <span className="text-brand-600 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {trans.youth.viewDetails || 'View Details'} <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-5 p-5 md:p-6 rounded-xl border border-ink-200/60 bg-white shadow-sm mt-2">
        <div className="relative flex-1 min-w-[160px] md:min-w-[180px]">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none text-[13px]" />
          <input type="text" placeholder={trans.youth.searchPlaceholder} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none bg-white" />
        </div>
        <select value={programFilter} onChange={e => setProgramFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm text-ink-600 border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 appearance-none cursor-pointer outline-none bg-white transition-all">
          <option value="all">{trans.youth.allPrograms}</option>
          {programs.map(p => <option key={p} value={p}>{(trans.youth.programKeys as Record<string, string>)[PROG_KEYS[p]] || p}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 rounded-lg text-sm text-ink-600 border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 appearance-none cursor-pointer outline-none bg-white transition-all">
          <option value="all">{trans.youth.allStatus}</option>
          <option value="active">{trans.youth.active}</option>
          <option value="graduated">{trans.youth.graduated}</option>
          <option value="withdrawn">{trans.youth.withdrawn}</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
        {filtered.length === 0 ? (
          <Card className="col-span-full text-center py-16">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-ink-50 to-ink-100 border-2 border-ink-200/60 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-[22px] text-ink-300" />
            </div>
            <p className="text-sm font-semibold text-ink-500">{trans.youth.noResults}</p>
            <p className="text-xs text-ink-300 mt-1">No participants match your current filters</p>
          </Card>
        ) : (
          filtered.map((y, i) => (
            <motion.div key={y.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}>
              <Card className="h-full !p-0 overflow-hidden group">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink-800 truncate">{y.fullName}</p>
                      <p className="text-xs text-ink-400 mt-0.5 truncate">{y.school} · {y.district}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button onClick={() => openEdit(y)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-brand-600 hover:bg-brand-50 transition-all">
                        <FontAwesomeIcon icon={faPenToSquare} className="text-[12px]" />
                      </button>
                      <button onClick={() => setDeleteTarget(y)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                        <FontAwesomeIcon icon={faTrashCan} className="text-[12px]" />
                      </button>
                      <Badge color={y.status === 'active' ? 'forest' : y.status === 'graduated' ? 'blue' : 'slate'}>{y.status === 'active' ? trans.youth.active : y.status === 'graduated' ? trans.youth.graduated : trans.youth.withdrawn}</Badge>
                    </div>
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

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editTarget ? 'Edit Participant' : 'Enroll Youth'} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1">Full Name</label>
            <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)}
              className="w-full h-10 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">Age</label>
              <input type="number" min={0} max={120} value={form.age} onChange={e => set('age', e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">School</label>
              <input type="text" value={form.school} onChange={e => set('school', e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">District</label>
              <input type="text" value={form.district} onChange={e => set('district', e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">Program</label>
              <select value={form.program} onChange={e => set('program', e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all appearance-none cursor-pointer bg-white">
                {PROGRAMS.map(p => <option key={p} value={p}>{(trans.youth.programKeys as Record<string, string>)[PROG_KEYS[p]] || p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">Emotional Score (0–100)</label>
              <input type="number" min={0} max={100} value={form.emotionalScore} onChange={e => set('emotionalScore', e.target.value)}
                className="w-full h-10 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-500 mb-1">Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value as YouthForm['status'])}
                className="w-full h-10 px-3.5 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all appearance-none cursor-pointer bg-white">
                <option value="active">{trans.youth.active}</option>
                <option value="graduated">{trans.youth.graduated}</option>
                <option value="withdrawn">{trans.youth.withdrawn}</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button onClick={() => setShowModal(false)}
              className="h-10 px-5 rounded-xl text-sm font-medium text-ink-600 bg-ink-50 hover:bg-ink-100 transition-all">Cancel</button>
            <button onClick={handleSave}
              className="h-10 px-5 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all">{editTarget ? 'Save Changes' : 'Enroll'}</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!programDetailTarget} onClose={() => setProgramDetailTarget(null)} title="" size="lg">
        {programDetailTarget && (() => {
          const prog = programDetailTarget;
          const inProg = youth.filter(y => y.program === prog);
          const total = inProg.length;
          const active = inProg.filter(y => y.status === 'active').length;
          const graduated = inProg.filter(y => y.status === 'graduated').length;
          const avg = total ? Math.round(inProg.reduce((a, y) => a + y.emotionalScore, 0) / total) : 0;
          const detail = PROGRAM_DETAILS[prog];
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <FontAwesomeIcon icon={detail.icon} className="text-[28px] text-brand-500" />
                <div>
                  <h2 className="text-xl font-bold text-ink-800">{(trans.youth.programKeys as Record<string, string>)[PROG_KEYS[prog]] || prog}</h2>
                  <p className="text-xs text-ink-400">{total} participants · {active} active</p>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-200/50">
                  <p className="text-2xl font-bold text-forest-600">{total}</p>
                  <p className="text-[11px] text-ink-500 font-medium">{trans.youth.programs}</p>
                </div>
                <div className="p-4 rounded-xl bg-brand-50/50 border border-brand-200/50">
                  <p className="text-2xl font-bold text-brand-600">{active}</p>
                  <p className="text-[11px] text-ink-500 font-medium">{trans.youth.active}</p>
                </div>
                <div className="p-4 rounded-xl bg-warm-50/50 border border-warm-200/50">
                  <p className="text-2xl font-bold text-warm-600">{graduated}</p>
                  <p className="text-[11px] text-ink-500 font-medium">{trans.youth.graduated}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200/50">
                  <p className="text-2xl font-bold text-rose-600">{avg}%</p>
                  <p className="text-[11px] text-ink-500 font-medium">{trans.youth.avgWellbeing}</p>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-ink-200/60 bg-white space-y-4">
                <div>
                  <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-ink-600 leading-relaxed">{detail.description}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">Goals</p>
                  <p className="text-sm text-ink-600 leading-relaxed">{detail.goals}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-ink-500 uppercase tracking-wider mb-1">Eligibility</p>
                  <p className="text-sm text-ink-600 leading-relaxed">{detail.eligibility}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-ink-700 mb-3">Participants ({total})</h3>
                {inProg.length === 0 ? (
                  <p className="text-sm text-ink-400 py-8 text-center">No participants in this program yet</p>
                ) : (
                  <div className="divide-y divide-ink-100 border border-ink-200/60 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-5 gap-3 px-4 py-2.5 bg-ink-50/60 text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                      <span>Name</span>
                      <span>Age</span>
                      <span>School</span>
                      <span>Status</span>
                      <span className="text-right">Score</span>
                    </div>
                    {inProg.map(y => (
                      <div key={y.id} className="grid grid-cols-5 gap-3 px-4 py-3 text-sm text-ink-700">
                        <span className="truncate font-medium">{y.fullName}</span>
                        <span className="text-ink-500">{y.age}</span>
                        <span className="truncate text-ink-500">{y.school}</span>
                        <span>
                          <Badge color={y.status === 'active' ? 'forest' : y.status === 'graduated' ? 'blue' : 'slate'}>
                            {y.status === 'active' ? trans.youth.active : y.status === 'graduated' ? trans.youth.graduated : trans.youth.withdrawn}
                          </Badge>
                        </span>
                        <span className={`text-right font-mono font-semibold ${y.emotionalScore < 50 ? 'text-brand-500' : y.emotionalScore < 70 ? 'text-brand-600' : 'text-brand-700'}`}>{y.emotionalScore}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Participant"
        message={`Are you sure you want to delete ${deleteTarget?.fullName || ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

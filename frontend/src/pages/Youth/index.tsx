import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMagnifyingGlass, faGraduationCap, faHeart, faCalendar, faPenToSquare, faTrashCan, faArrowRight, faChartBar, faUserGraduate, faSchool, faPeopleArrows, faBrain, faHandHoldingHeart, faUserGroup, faShield, faXmark } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import type { YouthParticipant } from '../../types';

const YOUTH_FOCUS_AREAS = [
  {
    id: 'identity',
    title: 'Identity & Self-Understanding',
    icon: faPeopleArrows,
    color: 'brand',
    description: 'Young people aged 16–25 are in a critical stage of identity formation. This module helps youth explore who they are, understand their emotions, and build a positive self-concept independent of past trauma.',
    practices: ['Journaling prompts for self-reflection', 'Values clarification exercises', 'Strength-based personal mapping', 'Cultural identity exploration'],
  },
  {
    id: 'inheritedTrauma',
    title: 'Understanding Inherited Trauma',
    icon: faBrain,
    color: 'warm',
    description: 'The 1994 Genocide against the Tutsi left intergenerational wounds. Even youth who did not directly experience the events may carry its emotional weight. This module provides psychoeducation and coping strategies.',
    practices: ['Psychoeducation on intergenerational trauma', 'Family history storytelling', 'Normalizing emotional responses', 'Building resilience across generations'],
  },
  {
    id: 'emotionalAwareness',
    title: 'Emotional Awareness',
    icon: faHandHoldingHeart,
    color: 'rose',
    description: 'Many young people struggle to name or understand their emotions. This module builds emotional vocabulary, helps identify triggers, and teaches healthy expression of feelings.',
    practices: ['Emotion identification and naming', 'Trigger awareness and management', 'Healthy emotional expression', 'Peer support and validation'],
  },
  {
    id: 'peerPressure',
    title: 'Peer Pressure & Social Stress',
    icon: faUserGroup,
    color: 'blue',
    description: 'Academic pressure, social expectations, and peer relationships create significant stress for Rwandan youth. This module equips them with tools to navigate these challenges.',
    practices: ['Assertiveness and boundary-setting', 'Social media awareness', 'Academic stress management', 'Building healthy friendships'],
  },
];

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
  const user = useAuthStore(s => s.user);
  const canManage = user?.role !== 'community_member';
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
        {canManage && (
          <Button variant="primary" className="shrink-0" onClick={openAdd}>
            <FontAwesomeIcon icon={faPlus} className="text-[14px]" /> {trans.youth.enrollYouth}
          </Button>
        )}
      </div>

      {/* Youth Focus Areas — Identity, Inherited Trauma, Emotional Awareness, Peer Pressure */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
        {YOUTH_FOCUS_AREAS.map((area, i) => (
          <motion.div key={area.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className={`bg-white rounded-xl shadow-sm border p-5 ${
              area.color === 'brand' ? 'border-brand-200/50' :
              area.color === 'warm' ? 'border-warm-200/50' :
              area.color === 'rose' ? 'border-rose-200/50' : 'border-blue-200/50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
              area.color === 'brand' ? 'bg-brand-50 text-brand-600' :
              area.color === 'warm' ? 'bg-warm-50 text-warm-600' :
              area.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
            }`}>
              <FontAwesomeIcon icon={area.icon} className="text-[18px]" />
            </div>
            <p className="text-sm font-bold text-ink-800 mb-1">{area.title}</p>
            <p className="text-xs text-ink-500 leading-relaxed mb-3">{area.description}</p>
            <ul className="space-y-1.5">
              {area.practices.map((p, j) => (
                <li key={j} className="flex items-start gap-2 text-[11px] text-ink-600">
                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                    area.color === 'brand' ? 'bg-brand-400' :
                    area.color === 'warm' ? 'bg-warm-400' :
                    area.color === 'rose' ? 'bg-rose-400' : 'bg-blue-400'
                  }`} />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {canManage ? (
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
      ) : (
        <div className="p-6 rounded-xl bg-gradient-to-br from-brand-50 to-brand-100/40 border border-brand-200/50">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600">
              <FontAwesomeIcon icon={faHeart} className="text-[16px]" />
            </span>
            <h2 className="text-sm font-bold text-brand-800">How Youth Programs Help You</h2>
          </div>
          <p className="text-sm text-brand-700/80 leading-relaxed mb-4">
            These programs are designed to support your mental health, build life skills, and connect you with other young people in your community. Whether you're dealing with stress, want to learn new skills, or need a safe space to talk — there's a program for you.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Free counseling & support', icon: faHandHoldingHeart },
              { label: 'Build life & leadership skills', icon: faGraduationCap },
              { label: 'Connect with peers', icon: faUserGroup },
              { label: 'Safe & confidential', icon: faShield },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-brand-200/30">
                <span className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={item.icon} className="text-[13px]" />
                </span>
                <span className="text-xs font-semibold text-brand-800">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-brand-300 to-brand-500" />
          <h2 className="text-sm font-bold text-ink-700 uppercase tracking-wider">{trans.youth.programs}</h2>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
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

      {canManage ? (
        <>
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
                          {canManage && (
                            <>
                              <button onClick={() => openEdit(y)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-brand-600 hover:bg-brand-50 transition-all">
                                <FontAwesomeIcon icon={faPenToSquare} className="text-[12px]" />
                              </button>
                              <button onClick={() => setDeleteTarget(y)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-rose-600 hover:bg-rose-50 transition-all">
                                <FontAwesomeIcon icon={faTrashCan} className="text-[12px]" />
                              </button>
                            </>
                          )}
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

          <ConfirmDialog
            open={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            title="Delete Participant"
            message={`Are you sure you want to delete ${deleteTarget?.fullName || ''}? This action cannot be undone.`}
            confirmLabel="Delete"
            destructive
          />
        </>
      ) : (
        <div className="p-6 rounded-xl bg-white border border-ink-100/60">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
              <FontAwesomeIcon icon={faSchool} className="text-[16px]" />
            </span>
            <h2 className="text-sm font-bold text-ink-800">Get Involved</h2>
          </div>
          <p className="text-sm text-ink-500 leading-relaxed">
            These programs are available through local schools and community centers. If you or someone you know would like to participate, speak with a school counselor or visit your nearest youth center to learn more about enrollment and upcoming sessions.
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium">
              <FontAwesomeIcon icon={faHeart} className="text-[11px]" /> Free for all youth
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium">
              <FontAwesomeIcon icon={faUserGroup} className="text-[11px]" /> Ages 10–25
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-xs font-medium">
              <FontAwesomeIcon icon={faShield} className="text-[11px]" /> Confidential
            </span>
          </div>
        </div>
      )}

      <AnimatePresence>
        {programDetailTarget && (() => {
          const prog = programDetailTarget;
          const detail = PROGRAM_DETAILS[prog];
          const progName = (trans.youth.programKeys as Record<string, string>)[PROG_KEYS[prog]] || prog;
          return (
            <div key="program-detail-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setProgramDetailTarget(null)}
                className="absolute inset-0 bg-black/30"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              >
                <div className="flex items-start justify-between px-8 pt-8 pb-0">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-500 shrink-0">
                      <FontAwesomeIcon icon={detail.icon} className="text-[28px]" />
                    </div>
                    <div>
                      <h2 className="text-[28px] font-bold text-ink-800 leading-tight" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>{progName}</h2>
                      <p className="text-sm text-ink-400 mt-1">Youth Support Program</p>
                    </div>
                  </div>
                  <button onClick={() => setProgramDetailTarget(null)}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-300 hover:text-ink-600 hover:bg-ink-50 transition-all shrink-0 mt-1">
                    <FontAwesomeIcon icon={faXmark} className="text-[20px]" />
                  </button>
                </div>

                <div className="overflow-y-auto px-8 pb-8 pt-6 space-y-5">
                  <div className="p-6 rounded-xl bg-[#F8FAFC] space-y-2">
                    <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Description</p>
                    <p className="text-base text-ink-700 leading-relaxed">{detail.description}</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#F8FAFC] space-y-2">
                    <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Goals</p>
                    <p className="text-base text-ink-700 leading-relaxed">{detail.goals}</p>
                  </div>
                  <div className="p-6 rounded-xl bg-[#F8FAFC] space-y-2">
                    <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider">Eligibility</p>
                    <p className="text-base text-ink-700 leading-relaxed">{detail.eligibility}</p>
                  </div>

                  <button className="w-full h-12 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all cursor-pointer">
                    Learn More About This Program
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStethoscope, faArrowRight, faUser,
  faPeopleGroup, faLeaf, faPlus, faChevronRight, faPhone,
  faShield, faCheck, faBrain, faMoon, faHeadphones,
  faWind, faPlay, faPause, faLungs, faRotateRight,
  faStar, faXmark, faMessage, faClock, faGraduationCap,
  faHandHoldingHeart, faUserGroup,
  faPeopleArrows, faFire, faLightbulb, faGlobe,
  faPaperPlane, faChartLine, faHeart,
  faBookOpen, faVideo, faMusic, faPlayCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { SectionTitle } from './SectionTitle';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';

const MOOD_OPTIONS = [
  { label: 'Very Low', emoji: '😔', color: 'rose', value: 1 },
  { label: 'Low', emoji: '😐', color: 'warm', value: 2 },
  { label: 'Okay', emoji: '🙂', color: 'blue', value: 3 },
  { label: 'Good', emoji: '😊', color: 'forest', value: 4 },
  { label: 'Very Good', emoji: '😄', color: 'brand', value: 5 },
];

const YOUTH_MODULES = [
  { id: 'identity', titleKey: 'youthIdentity', icon: faPeopleArrows, color: 'brand' },
  { id: 'inheritedTrauma', titleKey: 'youthInheritedTrauma', icon: faBrain, color: 'warm' },
  { id: 'emotionalAwareness', titleKey: 'youthEmotionalAwareness', icon: faHandHoldingHeart, color: 'rose' },
  { id: 'peerPressure', titleKey: 'youthPeerPressure', icon: faUserGroup, color: 'blue' },
];

function riskBadge(level: string) {
  const color = (level === 'critical' ? 'rose' : level === 'high' ? 'warm' : level === 'medium' ? 'blue' : 'forest') as 'rose' | 'warm' | 'blue' | 'forest';
  return <Badge color={color}>{level}</Badge>;
}

export default function CommunityDashboard() {
  const navigate = useNavigate();
  const { t } = useI18nStore();
  const trans = t();
  const cd = trans.communityDashboard;
  const user = useAuthStore(s => s.user);
  const [playingMedia, setPlayingMedia] = useState<{ src: string; title: string } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const playVideo = (src: string, title: string) => {
    setPlayingMedia({ src, title });
    setTimeout(() => videoRef.current?.play(), 100);
  };

  const closeVideo = () => {
    if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
    setPlayingMedia(null);
  };
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  const screenings = service.getScreenings({})
    .filter(s => s.beneficiaryName === user?.fullName)
    .slice(0, 5);
  const counselors = service.getCounselors(user?.district);
  const counselingSessions = service.getCounselingSessions(user?.id ?? 'U-009');
  const peerGroups = service.getPeerSupportGroups(user?.district);
  const copingSessions = service.getCopingSessions();
  const dailyTip = service.getDailyTip();
  const youthResources = service.getYouthResources();
  const activeCounseling = counselingSessions.filter(s => s.status === 'active');
  const healingStories = service.getHealingStories(true);
  const healingVideos = service.getHealingVideos();
  const healingAudio = service.getHealingAudio();

  const [moodStep, setMoodStep] = useState(0);
  const [moodAnswers, setMoodAnswers] = useState<number[]>([]);
  const [showMoodResult, setShowMoodResult] = useState(false);
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathStep, setBreathStep] = useState(0);
  const [breathTimeLeft, setBreathTimeLeft] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [showAllPeerGroups, setShowAllPeerGroups] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const moodQuestions = [
    cd.moodCheckTitle,
    'How is your energy level?',
    'How well did you sleep last night?',
  ];

  const activeSession = activeCounseling[0];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages.length]);

  useEffect(() => {
    if (!isPlaying || !activeExercise) return;
    const interval = setInterval(() => {
      setBreathTimeLeft(prev => {
        if (prev <= 0) {
          setBreathStep(s => {
            const ex = BREATHING_EXERCISES.find(e => e.id === activeExercise);
            if (!ex || s >= ex.steps.length - 1) {
              setIsPlaying(false);
              return 0;
            }
            return s + 1;
          });
          const ex = BREATHING_EXERCISES.find(e => e.id === activeExercise);
          return ex ? ex.steps[breathStep + 1]?.duration ?? 0 : 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, activeExercise, breathStep]);

  function handleMoodAnswer(value: number) {
    const newAnswers = [...moodAnswers, value];
    setMoodAnswers(newAnswers);
    if (moodStep < moodQuestions.length - 1) {
      setMoodStep(prev => prev + 1);
    } else {
      setShowMoodResult(true);
    }
  }

  function resetMoodCheck() {
    setMoodStep(0);
    setMoodAnswers([]);
    setShowMoodResult(false);
  }

  function startBreathing(id: string) {
    setActiveExercise(id);
    setBreathStep(0);
    const ex = BREATHING_EXERCISES.find(e => e.id === id);
    if (ex) setBreathTimeLeft(ex.steps[0].duration);
    setIsPlaying(true);
  }

  function stopBreathing() {
    setActiveExercise(null);
    setIsPlaying(false);
    setBreathStep(0);
    setBreathTimeLeft(0);
    service.addCopingSession({
      id: `CP-${Date.now()}`,
      type: 'breathing',
      duration: 60,
      completedAt: new Date().toISOString().split('T')[0],
      moodBefore: moodAnswers.length > 0 ? moodAnswers[moodAnswers.length - 1] : 3,
      moodAfter: 4,
    });
  }

  function handleSendMessage() {
    if (!messageText.trim() || !activeSession) return;
    service.sendCounselingMessage(activeSession.id, messageText);
    setMessageText('');
  }

  const totalMood = moodAnswers.length > 0 ? moodAnswers.reduce((a, b) => a + b, 0) / moodAnswers.length : 0;
  const avgMood = totalMood;
  const streakDays = copingSessions.length;
  const BREATHING_EXERCISES = [
    {
      id: 'box',
      title: 'Box Breathing (4-4-4-4)',
      icon: faWind,
      color: 'from-brand-400 to-brand-500',
      steps: [
        { label: 'Inhale', duration: 4, icon: faLungs },
        { label: 'Hold', duration: 4, icon: faPause },
        { label: 'Exhale', duration: 4, icon: faWind },
        { label: 'Hold', duration: 4, icon: faPause },
      ],
    },
    {
      id: 'deep',
      title: '4-7-8 Breathing',
      icon: faBrain,
      color: 'from-blue-400 to-blue-500',
      steps: [
        { label: 'Inhale', duration: 4, icon: faLungs },
        { label: 'Hold', duration: 7, icon: faPause },
        { label: 'Exhale', duration: 8, icon: faWind },
      ],
    },
    {
      id: 'grounding',
      title: '5-4-3-2-1 Grounding',
      icon: faStar,
      color: 'from-rose-400 to-rose-500',
      steps: [
        { label: 'See 5 things', duration: 12, icon: faStar },
        { label: 'Touch 4 things', duration: 10, icon: faStar },
        { label: 'Hear 3 things', duration: 8, icon: faHeadphones },
        { label: 'Smell 2 things', duration: 6, icon: faStar },
        { label: 'Taste 1 thing', duration: 4, icon: faStar },
      ],
    },
  ];

  const currentExercise = BREATHING_EXERCISES.find(e => e.id === activeExercise);

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 p-6 md:p-8 lg:p-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {cd.welcomeTitle.replace('{name}', firstName)}
              </h1>
              <p className="text-white/80 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
                {cd.welcomeSubtitle}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {screenings[0] && (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10">
                    <span className={`w-2 h-2 rounded-full ${
                      screenings[0].riskLevel === 'critical' ? 'bg-rose-400' :
                      screenings[0].riskLevel === 'high' ? 'bg-warm-400' :
                      screenings[0].riskLevel === 'medium' ? 'bg-blue-400' : 'bg-green-400'
                    }`} />
                    <span className="text-white/90 text-xs font-medium">
                      {cd.lastScreening.replace('{risk}', screenings[0].riskLevel.charAt(0).toUpperCase() + screenings[0].riskLevel.slice(1))}
                    </span>
                  </div>
                )}
                {streakDays > 0 && (
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10">
                    <FontAwesomeIcon icon={faFire} className="text-[12px] text-warm-300" />
                    <span className="text-white/90 text-xs font-medium">{streakDays} {cd.days} {cd.streak?.toLowerCase()}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button
                onClick={() => navigate('/screening')}
                variant="primary"
                size="md"
                className="!bg-white !text-brand-700 !shadow-lg hover:!shadow-xl !border-0 !font-bold"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[12px]" /> {cd.startAssessment}
              </Button>
              <Button
                onClick={() => navigate('/wellness')}
                variant="secondary"
                size="md"
                className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25 !backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faLeaf} className="text-[12px]" /> {cd.breatheNow}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Crisis Helpline Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/60 p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="w-10 h-10 flex items-center justify-center text-rose-500 shrink-0">
            <FontAwesomeIcon icon={faPhone} className="text-[18px]" />
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-rose-900">{cd.crisisHelpline}</h3>
            <p className="text-xs text-rose-700/80 mt-0.5">
              {cd.crisisHelplineDesc}
            </p>
          </div>
          <a href="tel:116" className="shrink-0">
            <Button variant="danger" size="sm">
              <FontAwesomeIcon icon={faPhone} className="text-[11px]" /> {cd.callNow}
            </Button>
          </a>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6">
        {[
          { icon: faStethoscope, label: cd.assessmentsTaken, value: screenings.length, color: 'brand' },
          { icon: faLeaf, label: cd.copingSessions, value: copingSessions.length, color: 'brand' },
          { icon: faPeopleGroup, label: cd.peerGroups, value: peerGroups.filter(g => g.isJoined).length, color: 'forest' },
          { icon: faFire, label: cd.streak, value: `${streakDays} ${cd.days}`, color: 'warm' },
        ].map((stat, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl shadow-sm border border-ink-100/60 p-4"
          >
            <div className={`w-8 h-8 flex items-center justify-center text-${stat.color}-600 mb-2`}>
              <FontAwesomeIcon icon={stat.icon} className="text-[14px]" />
            </div>
            <p className="text-xl font-extrabold text-ink-900">{stat.value}</p>
            <p className="text-[11px] text-ink-400 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ========== SECTION 1: Self-Assessment & Awareness ========== */}
      <div>
        <SectionTitle icon={<FontAwesomeIcon icon={faStethoscope} className="text-[13px]" />} label={cd.sectionAssessment} />
        <p className="text-xs text-ink-400 mt-1 mb-4">{cd.sectionAssessmentDesc}</p>

        <div className="grid lg:grid-cols-5 gap-5 md:gap-6">
          {/* Mood Check-in */}
          <Card className="lg:col-span-2 !p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faHeart} className="text-[13px]" />
              </span>
              <h3 className="text-sm font-bold text-ink-800">{cd.moodCheckTitle}</h3>
            </div>
            {!showMoodResult ? (
              <div>
                <p className="text-xs font-medium text-ink-600 mb-3">{moodQuestions[moodStep]}</p>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((opt, i) => (
                    <button key={i} onClick={() => handleMoodAnswer(opt.value)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-ink-200/60 hover:border-brand-300 hover:bg-brand-50/50 transition-all"
                    >
                      <span>{opt.emoji}</span> {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 mt-4">
                  {moodQuestions.map((_, i) => (
                    <div key={i} className={`flex-1 h-1 rounded-full ${i <= moodStep ? 'bg-brand-500' : 'bg-ink-200'}`} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-3">
                <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faCheck} className="text-[18px] text-forest-600" />
                </div>
                <p className="text-sm font-bold text-ink-700">{cd.moodCheckCompleted}</p>
                <p className="text-xs text-ink-400 mt-1">{cd.moodCheckInsight}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {MOOD_OPTIONS.filter((_, i) => i < moodAnswers.length).slice(-1).map((opt, i) => (
                    <span key={i} className="text-lg">{opt.emoji}</span>
                  ))}
                  <span className="text-xs text-ink-400">
                    {avgMood >= 4 ? 'Doing great!' : avgMood >= 3 ? 'Hanging in there' : 'Consider support tools'}
                  </span>
                </div>
                <button onClick={resetMoodCheck}
                  className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faRotateRight} className="text-[9px] mr-1" /> {cd.moodCheckAgain}
                </button>
              </div>
            )}
          </Card>

          {/* Quick Assessment CTA + Screening History */}
          <Card className="lg:col-span-3 !p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faChartLine} className="text-[13px]" />
                </span>
                <h3 className="text-sm font-bold text-ink-800">{cd.screeningHistory}</h3>
              </div>
              <Button onClick={() => navigate('/screening')} variant="ghost" size="xs">
                {cd.viewHistory} <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
              </Button>
            </div>
            {screenings.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-xs text-ink-400">{cd.noScreenings}</p>
                <Button onClick={() => navigate('/screening')} variant="primary" size="sm" className="mt-3">
                  <FontAwesomeIcon icon={faStethoscope} className="text-[11px]" /> {cd.startAssessment}
                </Button>
              </div>
            ) : (
              <>
                <div className="hidden md:block overflow-hidden rounded-lg border border-ink-200/60">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-ink-50/80">
                        <th className="text-left font-semibold text-ink-500 uppercase tracking-[.04em] px-4 py-3">{cd.phq9}</th>
                        <th className="text-left font-semibold text-ink-500 uppercase tracking-[.04em] px-4 py-3">{cd.gad7}</th>
                        <th className="text-left font-semibold text-ink-500 uppercase tracking-[.04em] px-4 py-3">{cd.pcl5}</th>
                        <th className="text-left font-semibold text-ink-500 uppercase tracking-[.04em] px-4 py-3">Risk</th>
                        <th className="text-left font-semibold text-ink-500 uppercase tracking-[.04em] px-4 py-3">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink-100/50">
                      {screenings.map((s, i) => (
                        <motion.tr key={s.id}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          transition={{ delay: Math.min(i * 0.03, 0.2) }}
                          onClick={() => navigate('/screening')}
                          className="cursor-pointer hover:bg-brand-50/20 transition-colors"
                        >
                          <td className="px-4 py-3 font-medium text-ink-800">{s.phq9Score}/27</td>
                          <td className="px-4 py-3 font-medium text-ink-800">{s.gad7Score}/21</td>
                          <td className="px-4 py-3 font-medium text-ink-800">{s.pcl5Score}/80</td>
                          <td className="px-4 py-3">{riskBadge(s.riskLevel)}</td>
                          <td className="px-4 py-3 text-ink-400">{s.createdAt}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="md:hidden space-y-2 mt-2">
                  {screenings.slice(0, 3).map((s) => (
                    <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-ink-50/50">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-ink-400">{s.createdAt}</span>
                        {riskBadge(s.riskLevel)}
                      </div>
                      <span className="text-xs text-ink-500 font-mono">{s.phq9Score}/{s.gad7Score}/{s.pcl5Score}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* ========== SECTION 2: Coping & Support Tools ========== */}
      <div>
        <SectionTitle icon={<FontAwesomeIcon icon={faLeaf} className="text-[13px]" />} label={cd.sectionCoping} />
        <p className="text-xs text-ink-400 mt-1 mb-4">{cd.sectionCopingDesc}</p>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          {/* Daily Tip */}
          <Card className="!p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 flex items-center justify-center text-warm-600 shrink-0">
                <FontAwesomeIcon icon={faLightbulb} className="text-[13px]" />
              </span>
              <h3 className="text-sm font-bold text-ink-800">{cd.dailyTip}</h3>
            </div>
            <p className="text-xs font-semibold text-ink-700 mb-1">{dailyTip.title}</p>
            <p className="text-[11px] text-ink-500 leading-relaxed">{dailyTip.content}</p>
            <div className="mt-3 pt-3 border-t border-ink-100/60">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(streakDays % 7) * 14}%` }} />
                </div>
                <span className="text-[10px] text-ink-400 font-medium">{cd.practiceStreak}: {streakDays % 7}/7</span>
              </div>
            </div>
          </Card>

          {/* Breathing Quick-Launch */}
          <Card className="!p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faWind} className="text-[13px]" />
              </span>
              <h3 className="text-sm font-bold text-ink-800">{cd.breatheNow}</h3>
            </div>
            {activeExercise ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center mx-auto mb-2">
                  <div>
                    <p className="text-xl font-bold text-brand-600">{breathTimeLeft}</p>
                    <p className="text-[8px] text-brand-500 font-medium">{currentExercise?.steps[breathStep]?.label}</p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-all"
                  >
                    <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-[11px]" />
                  </button>
                  <button onClick={stopBreathing}
                    className="text-[10px] font-medium text-ink-400 hover:text-rose-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faXmark} className="mr-0.5" /> Done
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {BREATHING_EXERCISES.slice(0, 2).map((ex) => (
                  <button key={ex.id} onClick={() => startBreathing(ex.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border border-ink-100/60 hover:border-brand-200/50 hover:bg-brand-50/20 transition-all text-left"
                  >
                    <span className={`w-8 h-8 rounded-lg bg-gradient-to-br ${ex.color} flex items-center justify-center text-white shrink-0`}>
                      <FontAwesomeIcon icon={ex.icon} className="text-[13px]" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink-800">{ex.title}</p>
                      <p className="text-[10px] text-ink-400">{ex.steps.map(s => s.label).join(' · ')}</p>
                    </div>
                    <FontAwesomeIcon icon={faPlay} className="text-[10px] text-brand-500" />
                  </button>
                ))}
                <Button onClick={() => navigate('/wellness')} variant="ghost" size="xs" className="w-full !h-7 !text-[11px]">
                  {cd.copingTools} <FontAwesomeIcon icon={faArrowRight} className="text-[8px]" />
                </Button>
              </div>
            )}
          </Card>

          {/* Coping Tools Grid */}
          <Card className="!p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faBrain} className="text-[13px]" />
              </span>
              <h3 className="text-sm font-bold text-ink-800">{cd.copingTools}</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                { icon: faBrain, label: cd.stressManagement, href: '/wellness', color: 'brand' },
                { icon: faMoon, label: cd.sleepSupport, href: '/wellness', color: 'blue' },
                { icon: faHeadphones, label: cd.audioGuidance, href: '/wellness', color: 'warm' },
              ].map((tool, i) => (
                <button key={i} onClick={() => navigate(tool.href)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-ink-50/50 transition-all text-left"
                >
                  <span className={`w-7 h-7 flex items-center justify-center text-${tool.color}-600 shrink-0`}>
                    <FontAwesomeIcon icon={tool.icon} className="text-[12px]" />
                  </span>
                  <span className="text-xs font-medium text-ink-700">{tool.label}</span>
                  <FontAwesomeIcon icon={faChevronRight} className="text-[8px] text-ink-300 ml-auto" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Healing Media - Stories, Videos, Audio */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faBookOpen} className="text-[13px]" />
              </span>
              <h3 className="text-sm font-bold text-ink-800">{cd.healingMedia}</h3>
            </div>
            <Button onClick={() => navigate('/healing-media')} variant="ghost" size="xs">
              {cd.moreMedia} <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
            </Button>
          </div>
          <p className="text-xs text-ink-400 mb-4">{cd.healingMediaDesc}</p>

          <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
            {/* Featured Stories */}
            <Card className="!p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 flex items-center justify-center text-warm-600 shrink-0">
                  <FontAwesomeIcon icon={faBookOpen} className="text-[11px]" />
                </span>
                <h4 className="text-xs font-bold text-ink-800">{cd.featuredStories}</h4>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {healingStories.map((story) => (
                  <div key={story.id} className="group flex gap-3 p-2.5 rounded-xl hover:bg-brand-50/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-lg shrink-0 overflow-hidden bg-ink-100">
                      <img src={story.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-ink-800 leading-snug group-hover:text-brand-600 transition-colors line-clamp-2">{story.title}</p>
                      <p className="text-[9px] text-ink-400 mt-0.5">
                        {story.author} · {cd.storyFrom.replace('{district}', story.district)}
                      </p>
                      <p className="text-[9px] text-ink-500 mt-0.5 line-clamp-1">{story.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Guided Videos */}
            <Card className="!p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 flex items-center justify-center text-rose-500 shrink-0">
                  <FontAwesomeIcon icon={faVideo} className="text-[11px]" />
                </span>
                <h4 className="text-xs font-bold text-ink-800">{cd.guidedVideos}</h4>
              </div>
              <div className="space-y-2">
                {healingVideos.map((video) => (
                  <div key={video.id} onClick={() => playVideo(video.src || '/video auto play.mp4', video.title)} className="flex gap-3 p-2.5 rounded-xl hover:bg-rose-50/30 transition-all cursor-pointer group">
                    <div className="w-16 h-10 rounded-lg shrink-0 overflow-hidden bg-ink-100 relative">
                      <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all">
                        <FontAwesomeIcon icon={faPlayCircle} className="text-white text-[16px] drop-shadow-sm" />
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 bg-black/60 text-white text-[7px] px-1 rounded font-medium">{video.duration}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-ink-800 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">{video.title}</p>
                      <p className="text-[9px] text-ink-400 mt-0.5 line-clamp-1">{video.description}</p>
                      <span className="text-[9px] font-medium text-rose-500 inline-flex items-center gap-0.5 mt-0.5">
                        <FontAwesomeIcon icon={faPlay} className="text-[7px]" /> {cd.watchVideo}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Audio Resources */}
            <Card className="!p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 flex items-center justify-center text-blue-500 shrink-0">
                  <FontAwesomeIcon icon={faMusic} className="text-[11px]" />
                </span>
                <h4 className="text-xs font-bold text-ink-800">{cd.audioResources}</h4>
              </div>
              <div className="space-y-1">
                {healingAudio.map((audio) => {
                  const categoryLabel =
                    audio.category === 'meditation' ? cd.guidedMeditation :
                    audio.category === 'breathing' ? cd.breathingGuide :
                    audio.category === 'calming' ? cd.calmingSounds : '';
                  return (
                    <div key={audio.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/30 transition-all cursor-pointer group">
                      <span className="w-8 h-8 flex items-center justify-center text-blue-500 shrink-0 transition-all">
                        <FontAwesomeIcon icon={faHeadphones} className="text-[12px]" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-ink-800 group-hover:text-blue-600 transition-colors line-clamp-1">{audio.title}</p>
                        <div className="flex items-center gap-2 text-[9px] text-ink-400">
                          <span>{audio.duration}</span>
                          {categoryLabel && <><span>·</span><span>{categoryLabel}</span></>}
                        </div>
                      </div>
                      <FontAwesomeIcon icon={faPlay} className="text-[9px] text-ink-300 group-hover:text-blue-500 transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ========== SECTION 3: Counselling & Human Support ========== */}
      <div>
        <SectionTitle icon={<FontAwesomeIcon icon={faMessage} className="text-[13px]" />} label={cd.sectionCounseling} />
        <p className="text-xs text-ink-400 mt-1 mb-4">{cd.sectionCounselingDesc}</p>

        <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
          {/* Active Counseling Chat */}
          <Card className="lg:col-span-2 !p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faMessage} className="text-[13px]" />
                </span>
                <h3 className="text-sm font-bold text-ink-800">{cd.myCounselor}</h3>
              </div>
              {activeSession && (
                <Badge color="brand">{cd.activeConversations}: {activeCounseling.length}</Badge>
              )}
            </div>
            {activeSession ? (
              <div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-brand-50/50 border border-brand-200/40 mb-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {activeSession.counselorName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-ink-800">{activeSession.counselorName}</p>
                    <p className="text-[10px] text-ink-400">{cd.availableCounselors.replace('{district}', user?.district ?? '')}</p>
                  </div>
                  {activeSession.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {activeSession.unreadCount}
                    </span>
                  )}
                </div>
                <div className="h-40 overflow-y-auto space-y-2 mb-3 p-2 rounded-xl bg-ink-50/30">
                  {activeSession.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs ${
                        msg.from === 'user'
                          ? 'bg-brand-500 text-white rounded-br-sm'
                          : 'bg-white border border-ink-100/60 text-ink-700 rounded-bl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder={cd.messagePlaceholder}
                    className="flex-1 h-9 px-3 rounded-xl text-xs border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all"
                  />
                  <button onClick={handleSendMessage}
                    className="w-9 h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-all shrink-0"
                  >
                    <FontAwesomeIcon icon={faPaperPlane} className="text-[12px]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faMessage} className="text-[18px] text-brand-500" />
                </div>
                <p className="text-xs text-ink-400 mb-3">{cd.noActiveCounseling}</p>
                <Button onClick={() => navigate('/wellness')} variant="primary" size="sm">
                  {cd.connectToCounselor} <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </Button>
              </div>
            )}
          </Card>

          {/* Counselors & Professionals */}
          <div className="space-y-3">
            <Card className="!p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faUser} className="text-[13px]" />
                </span>
                <h3 className="text-sm font-bold text-ink-800">{cd.nearbyProfessionals}</h3>
              </div>
              <div className="space-y-2">
                {counselors.slice(0, 3).map((c) => (
                  <div key={c.id} className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-ink-50/50 transition-all">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 text-[10px] font-bold shrink-0">
                      {c.fullName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-ink-800 truncate">{c.fullName}</p>
                      <p className="text-[10px] text-ink-400 truncate">{c.specialty}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${c.available ? 'bg-forest-500' : 'bg-ink-300'}`} />
                  </div>
                ))}
              </div>
              <Button onClick={() => navigate('/wellness')} variant="ghost" size="xs" className="w-full mt-2 !h-7 !text-[11px]">
                {cd.professionalHelp} <FontAwesomeIcon icon={faArrowRight} className="text-[8px]" />
              </Button>
            </Card>

            <Card className="!p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 flex items-center justify-center text-forest-600 shrink-0">
                  <FontAwesomeIcon icon={faPeopleGroup} className="text-[13px]" />
                </span>
                <h3 className="text-sm font-bold text-ink-800">{cd.peerSupportGroups}</h3>
              </div>
              <div className="space-y-2">
                {(showAllPeerGroups ? peerGroups : peerGroups.slice(0, 2)).map((g) => (
                  <div key={g.id} className="p-2.5 rounded-xl border border-ink-100/60 hover:border-brand-200/40 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-ink-800 truncate">{g.name}</p>
                        <p className="text-[10px] text-ink-400">{g.memberCount}/{g.maxMembers} members</p>
                      </div>
                      <span className="text-[10px] text-ink-400 shrink-0">
                        <FontAwesomeIcon icon={faClock} className="text-[8px] mr-0.5" /> {g.meetingSchedule.split(',')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 rounded-full bg-ink-100 overflow-hidden">
                        <div className="h-full rounded-full bg-forest-500" style={{ width: `${(g.memberCount / g.maxMembers) * 100}%` }} />
                      </div>
                      <button
                        onClick={() => service.toggleJoinGroup(g.id)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all ${
                          g.isJoined ? 'bg-forest-50 text-forest-600 border border-forest-200' : 'bg-brand-50 text-brand-600 border border-brand-200 hover:bg-brand-100'
                        }`}
                      >
                        {g.isJoined ? cd.joined : cd.joinGroup}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {peerGroups.length > 2 && (
                <button onClick={() => setShowAllPeerGroups(!showAllPeerGroups)}
                  className="mt-2 text-[10px] font-semibold text-brand-600 hover:text-brand-700 transition-colors w-full text-center"
                >
                  {showAllPeerGroups ? 'Show less' : `${cd.viewAllGroups} (${peerGroups.length})`}
                </button>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* ========== SECTION 4: Youth-Focused Module (16-25) ========== */}
      <div>
        <SectionTitle icon={<FontAwesomeIcon icon={faGraduationCap} className="text-[13px]" />} label={cd.sectionYouth} />
        <p className="text-xs text-ink-400 mt-1 mb-4">{cd.sectionYouthDesc}</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {YOUTH_MODULES.map((mod) => {
            const resource = youthResources.find(r => r.topic === mod.id);
            return (
              <motion.div key={mod.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/youth')}
                className="bg-white rounded-xl shadow-sm border border-ink-100/60 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-brand-200/50"
              >
                <span className={`w-9 h-9 flex items-center justify-center text-${mod.color}-600 mb-3`}>
                  <FontAwesomeIcon icon={mod.icon} className="text-[16px]" />
                </span>
                <p className="text-xs font-bold text-ink-800 leading-snug mb-1">{(cd as Record<string, string>)[mod.titleKey] || mod.titleKey}</p>
                <p className="text-[10px] text-ink-400 leading-relaxed line-clamp-2">{resource?.summary ?? ''}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-brand-600">
                  {cd.youthExplore} <FontAwesomeIcon icon={faArrowRight} className="text-[8px]" />
                </div>
                {resource && (
                  <div className="mt-2 flex gap-0.5">
                    {resource.practices.slice(0, 4).map((_, pi) => (
                      <div key={pi} className="flex-1 h-0.5 rounded-full bg-brand-200" />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Kinyarwanda availability badge */}
        <div className="flex items-center gap-2 mt-3 px-4 py-2 rounded-xl bg-brand-50/50 border border-brand-200/40 w-fit">
          <FontAwesomeIcon icon={faGlobe} className="text-[11px] text-brand-600" />
          <span className="text-[11px] font-medium text-brand-700">{cd.kinyarwandaAvailable}</span>
        </div>
      </div>

      {/* ========== Getting Started Guide ========== */}
      <Card className="!p-5">
        <SectionTitle icon={<FontAwesomeIcon icon={faShield} className="text-[13px]" />} label={cd.gettingStarted} />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {[
            { step: 1, icon: faStethoscope, text: cd.step1, color: 'brand', href: '/screening' },
            { step: 2, icon: faLeaf, text: cd.step2, color: 'forest', href: '/wellness' },
            { step: 3, icon: faMessage, text: cd.step3, color: 'blue', href: '/wellness' },
          ].map((s, i) => (
            <button key={i} onClick={() => navigate(s.href)}
              className="flex items-start gap-3 p-3 rounded-xl bg-ink-50/50 hover:bg-brand-50/30 transition-all text-left"
            >
              <span className={`w-8 h-8 flex items-center justify-center text-${s.color}-600 shrink-0 text-xs font-extrabold`}>
                {s.step}
              </span>
              <div className="flex-1">
                <p className="text-xs text-ink-600 leading-relaxed">{s.text}</p>
              </div>
            </button>
          ))}
        </div>
        <Button onClick={() => navigate('/screening')} variant="primary" size="sm" className="w-full mt-4 !h-10">
          {cd.startJourney} <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" />
        </Button>
      </Card>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={closeVideo}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100/60">
                <h3 className="text-sm font-bold text-ink-800 truncate">{playingMedia.title}</h3>
                <button onClick={closeVideo} className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-600 hover:bg-ink-50 transition-all cursor-pointer">
                  <FontAwesomeIcon icon={faXmark} className="text-[18px]" />
                </button>
              </div>
              <div className="bg-black">
                <video
                  ref={videoRef}
                  src={playingMedia.src}
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  playsInline
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

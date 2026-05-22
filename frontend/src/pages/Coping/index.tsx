import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faWind, faBrain, faMoon, faHeadphones,
  faHeart, faPlay, faPause, faRotateRight, faXmark,
  faCheck, faLungs, faStar,
} from '@fortawesome/free-solid-svg-icons';
import { useI18nStore } from '../../i18n';
import { Button } from '../../components/shared/Button';
import { Card } from '../../components/shared/Card';

const EXERCISES = [
  {
    id: 'box',
    titleKey: 'boxBreathing',
    descKey: 'boxBreathingDesc',
    icon: faWind,
    color: 'from-brand-400 to-brand-500',
    steps: [
      { label: 'Inhale', duration: 4, icon: faLungs },
      { label: 'Hold', duration: 4, icon: faPause },
      { label: 'Exhale', duration: 4, icon: faWind },
      { label: 'Hold', duration: 4, icon: faPause },
    ],
    total: 16,
  },
  {
    id: 'deep',
    titleKey: 'fourSevenEight',
    descKey: 'fourSevenEightDesc',
    icon: faBrain,
    color: 'from-blue-400 to-blue-500',
    steps: [
      { label: 'Inhale', duration: 4, icon: faLungs },
      { label: 'Hold', duration: 7, icon: faPause },
      { label: 'Exhale', duration: 8, icon: faWind },
    ],
    total: 19,
  },
  {
    id: 'grounding',
    titleKey: 'fiveSenses',
    descKey: 'fiveSensesDesc',
    icon: faStar,
    color: 'from-rose-400 to-rose-500',
    steps: [
      { label: 'See 5 things', duration: 12, icon: faStar },
      { label: 'Touch 4 things', duration: 10, icon: faStar },
      { label: 'Hear 3 things', duration: 8, icon: faHeadphones },
      { label: 'Smell 2 things', duration: 6, icon: faStar },
      { label: 'Taste 1 thing', duration: 4, icon: faStar },
    ],
    total: 40,
  },
];

const TECHNIQUES = [
  {
    titleKey: 'stressManagement',
    descKey: 'stressDesc',
    icon: faBrain,
    color: 'brand',
    tips: [
      'Take 5 slow, deep breaths when feeling overwhelmed',
      'Step away for 2 minutes — stretch, walk, or look outside',
      'Name one thing you can control right now',
      'Talk to a trusted friend, CHW, or counselor',
      'Write down 3 things you are grateful for today',
    ],
  },
  {
    titleKey: 'sleepSupport',
    descKey: 'sleepDesc',
    icon: faMoon,
    color: 'blue',
    tips: [
      'Go to bed and wake up at the same time every day',
      'Avoid screens 30 minutes before sleeping',
      'Keep your bedroom cool, dark, and quiet',
      'Try the 4-7-8 breathing exercise before bed',
      'Avoid caffeine after 3 PM',
    ],
  },
  {
    titleKey: 'audioGuidance',
    descKey: 'audioDesc',
    icon: faHeadphones,
    color: 'warm',
    tips: [
      'Guided body scan meditation (available offline)',
      'Nature sounds: forest, rain, ocean waves',
      'Progressive muscle relaxation audio',
      'Kinyarwanda-language guided relaxation',
      'Breathing rhythm audio tracks',
    ],
  },
];

const SELF_CHECK = [
  { question: 'How are you feeling right now?', options: ['Very low', 'Low', 'Okay', 'Good', 'Very good'] },
  { question: 'How is your energy level?', options: ['Exhausted', 'Low', 'Moderate', 'High', 'Energetic'] },
  { question: 'How well did you sleep last night?', options: ['Very poorly', 'Poorly', 'Fair', 'Well', 'Very well'] },
];

export default function Coping() {
  const { t } = useI18nStore();
  const trans = t();
  const well = trans.wellness;
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [selfCheckIndex, setSelfCheckIndex] = useState(0);
  const [selfCheckAnswers, setSelfCheckAnswers] = useState<number[]>([]);

  const exercise = EXERCISES.find(e => e.id === activeExercise);

  function startExercise(id: string) {
    setActiveExercise(id);
    setCurrentStep(0);
    const ex = EXERCISES.find(e => e.id === id);
    if (ex) setTimeLeft(ex.steps[0].duration);
    setIsPlaying(true);
  }

  function stopExercise() {
    setActiveExercise(null);
    setIsPlaying(false);
    setCurrentStep(0);
    setTimeLeft(0);
    if (exercise && !completed.includes(exercise.id)) {
      setCompleted(prev => [...prev, exercise.id]);
    }
  }

  function tick() {
    if (!isPlaying || !exercise) return;
    if (timeLeft <= 0) {
      const nextStep = currentStep + 1;
      if (nextStep >= exercise.steps.length) {
        setIsPlaying(false);
        if (!completed.includes(exercise.id)) setCompleted(prev => [...prev, exercise.id]);
        return;
      }
      setCurrentStep(nextStep);
      setTimeLeft(exercise.steps[nextStep].duration);
    } else {
      setTimeLeft(prev => prev - 1);
    }
  }

  useState(() => {
    if (isPlaying) {
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }
  });

  const handleSelfCheckAnswer = (value: number) => {
    const newAnswers = [...selfCheckAnswers, value];
    setSelfCheckAnswers(newAnswers);
    if (selfCheckIndex < SELF_CHECK.length - 1) {
      setSelfCheckIndex(prev => prev + 1);
    }
  };

  const resetSelfCheck = () => {
    setSelfCheckIndex(0);
    setSelfCheckAnswers([]);
  };

  return (
    <div className="space-y-8 md:space-y-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{well.title}</span>
        </h1>
        <p className="text-sm text-ink-400 mt-2">{well.subtitle}</p>
      </div>

      {/* Self-Check In */}
      <Card>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
            <FontAwesomeIcon icon={faHeart} className="text-[16px]" />
          </span>
          <h2 className="text-base font-bold text-ink-800">Quick Self-Check</h2>
        </div>
        {selfCheckAnswers.length < SELF_CHECK.length ? (
          <div>
            <p className="text-sm font-medium text-ink-700 mb-4">{SELF_CHECK[selfCheckIndex].question}</p>
            <div className="flex flex-wrap gap-2">
              {SELF_CHECK[selfCheckIndex].options.map((opt, i) => (
                <button key={i} onClick={() => handleSelfCheckAnswer(i)}
                  className="px-4 py-2 rounded-xl text-sm font-medium border border-ink-200/60 hover:border-brand-300 hover:bg-brand-50/50 transition-all">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-forest-50 flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faCheck} className="text-[20px] text-forest-600" />
            </div>
            <p className="text-sm font-bold text-ink-700">Check-in complete</p>
            <p className="text-xs text-ink-400 mt-1">
              Your responses: {selfCheckAnswers.reduce((a, b) => a + b, 0) > SELF_CHECK.length * 2 ? 'You seem to be doing well today' : 'Consider trying a breathing exercise'}
            </p>
            <button onClick={resetSelfCheck}
              className="mt-3 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
              <FontAwesomeIcon icon={faRotateRight} className="text-[10px] mr-1" /> Check in again
            </button>
          </div>
        )}
      </Card>

      {/* Breathing Exercises */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-brand-300 to-brand-500" />
          <h2 className="text-sm font-bold text-ink-700 uppercase tracking-wider">{well.breathingExercises}</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {EXERCISES.map((ex) => (
            <motion.div key={ex.id} whileHover={{ y: -2 }} className="bg-white rounded-xl shadow-sm border border-ink-100/60 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ex.color} flex items-center justify-center text-white shadow-sm`}>
                  <FontAwesomeIcon icon={ex.icon} className="text-[18px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-800">{(well as any)[ex.titleKey] || ex.titleKey}</p>
                  <p className="text-xs text-ink-400">{(well as any)[ex.descKey] || ex.descKey}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-4">
                {ex.steps.map((_, i) => (
                  <div key={i} className="flex-1 h-1.5 rounded-full last:flex-none last:w-1.5" style={{
                    background: `linear-gradient(to right, var(--color-brand-200), var(--color-brand-400))`,
                    opacity: i < currentStep && activeExercise === ex.id ? 1 : 0.3
                  }} />
                ))}
              </div>
              {activeExercise === ex.id ? (
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-brand-50 border-2 border-brand-200 flex items-center justify-center mx-auto mb-3">
                    <div>
                      <p className="text-2xl font-bold text-brand-600">{timeLeft}</p>
                      <p className="text-[9px] text-brand-500 font-medium">{exercise?.steps[currentStep]?.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <button onClick={() => setIsPlaying(!isPlaying)}
                      className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-all">
                      <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} className="text-[14px]" />
                    </button>
                    <button onClick={stopExercise}
                      className="text-xs font-medium text-ink-400 hover:text-rose-600 transition-colors">
                      <FontAwesomeIcon icon={faXmark} className="mr-1" /> Stop
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => startExercise(ex.id)}
                  className="w-full h-9 rounded-xl bg-brand-500 text-white text-xs font-semibold hover:bg-brand-600 transition-all flex items-center justify-center gap-1.5">
                  <FontAwesomeIcon icon={faPlay} className="text-[10px]" /> {well.startExercise}
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Coping Techniques */}
      <div>
        <div className="flex items-center gap-3 mb-5">
          <span className="w-5 h-[2px] rounded-full bg-gradient-to-r from-brand-300 to-brand-500" />
          <h2 className="text-sm font-bold text-ink-700 uppercase tracking-wider">Coping & Support Techniques</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {TECHNIQUES.map((tech, i) => (
            <Card key={i} className="!p-0 overflow-hidden">
              <div className={`h-2 w-full bg-gradient-to-r ${
                tech.color === 'brand' ? 'from-brand-400 to-brand-500' :
                tech.color === 'blue' ? 'from-blue-400 to-blue-500' : 'from-warm-400 to-warm-500'
              }`} />
              <div className="p-5">
                <div className={`w-10 h-10 rounded-xl bg-${tech.color}-50 flex items-center justify-center text-${tech.color}-600 mb-3`}>
                  <FontAwesomeIcon icon={tech.icon} className="text-[18px]" />
                </div>
                <p className="text-sm font-bold text-ink-800 mb-1">{(well as any)[tech.titleKey] || tech.titleKey}</p>
                <p className="text-xs text-ink-400 mb-4">{(well as any)[tech.descKey] || tech.descKey}</p>
                <ul className="space-y-2">
                  {tech.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-[11px] text-ink-600">
                      <FontAwesomeIcon icon={faCheck} className="text-[10px] text-brand-500 mt-0.5 shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency Support Always Visible */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/60 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <span className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <FontAwesomeIcon icon={faHeart} className="text-[20px]" />
          </span>
          <div>
            <h3 className="text-base font-bold text-rose-900">Need immediate support?</h3>
            <p className="text-sm text-rose-700/80 mt-0.5">Call <strong>116</strong> — Available 24/7 for crisis support. Free and confidential.</p>
          </div>
          <Button onClick={() => window.open('tel:116')} variant="danger" size="sm" className="shrink-0">
            <FontAwesomeIcon icon={faHeart} className="text-[12px]" /> Call 116
          </Button>
        </div>
      </div>
    </div>
  );
}

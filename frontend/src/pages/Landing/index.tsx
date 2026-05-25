import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faShield, faHandshake, faUsers, faStethoscope,
  faBars, faXmark, faGlobe, faLocationDot, faPhone, faEnvelope,
  faGraduationCap, faHeartPulse, faCircleCheck, faQuoteLeft,
  faChevronRight, faStar, faNewspaper, faMessage, faMobile, faWind, faMoon, faHeadphones,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/shared/Button';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';
import { Link } from 'react-router-dom';
import { useI18nStore } from '../../i18n';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

export default function Landing() {
  const { t } = useI18nStore();
  const trans = t();

  const navItems = [
    { label: trans.landing.home, href: '#hero' },
    { label: trans.landing.about, href: '#about' },
    { label: trans.landing.services, href: '#services' },
    { label: trans.landing.youth, href: '#youth' },
    { label: trans.landing.community, href: '#community' },
    { label: trans.landing.contact, href: '#contact' },
  ];

  const partners: Array<{ name: string; logo?: string }> = [
    { name: 'Ministry of Health', logo: '/ministry of health.png' },
    { name: 'RBC', logo: '/rbc.png' },
    { name: 'MINUBUMWE', logo: '/MINUBUMWE.jpg' },
    { name: 'WHO', logo: '/WHO.png' },
    { name: 'Ibuka', logo: '/ibuka.jpg' },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    navItems.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-ink-700 antialiased">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <svg className="absolute top-[10%] left-0 w-full h-[60vh]" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0,300 C200,100 400,500 600,300 S800,100 1000,300 S1200,500 1440,300"
            stroke="currentColor" strokeWidth="1" strokeLinecap="round"
            className="text-brand-300/25" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.path
            d="M0,350 C200,550 400,150 600,350 S800,550 1000,350 S1200,150 1440,350"
            stroke="currentColor" strokeWidth="0.5" strokeLinecap="round"
            className="text-brand-400/15" fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>

        <svg className="absolute top-[30%] left-0 w-full h-[50vh]" viewBox="0 0 1440 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M1440,100 C1200,300 1000,50 800,200 S500,400 300,150 S100,50 0,250"
            stroke="currentColor" strokeWidth="0.8" strokeLinecap="round"
            className="text-warm-300/20" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>

        <svg className="absolute top-[55%] left-0 w-full h-[40vh]" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M0,200 C150,50 300,350 500,200 S700,50 900,200 S1100,350 1300,200 S1440,50 1440,200"
            stroke="currentColor" strokeWidth="0.6" strokeLinecap="round"
            className="text-brand-400/15" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
          <motion.path
            d="M0,250 C150,400 300,100 500,250 S700,400 900,250 S1100,100 1300,250 S1440,400 1440,250"
            stroke="currentColor" strokeWidth="0.4" strokeLinecap="round"
            className="text-ink-400/10" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
          />
        </svg>

        <svg className="absolute top-[5%] right-[5%] w-40 h-40" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.circle cx="100" cy="100" r="60"
            stroke="currentColor" strokeWidth="0.8"
            className="text-brand-300/20" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
            style={{ originX: '100px', originY: '100px' }}
          />
          <motion.circle cx="100" cy="100" r="40"
            stroke="currentColor" strokeWidth="0.5"
            className="text-brand-400/15" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, rotate: -360 }}
            transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
            style={{ originX: '100px', originY: '100px' }}
          />
        </svg>

        <svg className="absolute bottom-[15%] left-[3%] w-32 h-32" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M75,10 C110,10 140,40 140,75 C140,110 110,140 75,140 C40,140 10,110 10,75 C10,40 40,10 75,10"
            stroke="currentColor" strokeWidth="0.6" strokeLinecap="round"
            className="text-warm-300/15" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, scale: [1, 1.05, 1] }}
            transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
            style={{ originX: '75px', originY: '75px' }}
          />
        </svg>
      </div>
      <header className={`reset-margin sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,.04)]'
          : 'bg-white/95'
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20 py-3 md:py-4">
            <a href="/" className="flex items-center gap-3 group shrink-0">
              <img src="/logo.png" alt="HUMURA" className="h-9 md:h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
              <span className="text-lg md:text-xl font-bold text-ink-900 tracking-tight">HUMURA</span>
            </a>

            <nav className="reset-margin hidden lg:flex items-center gap-x-5 mx-auto">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={e => scrollTo(e, item.href)}
                  className={`relative h-10 text-[11px] font-bold uppercase tracking-[.1em] transition-all duration-300 inline-flex items-center group ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-brand-700'
                      : 'text-ink-500 hover:text-ink-900'
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-brand-500 transition-all duration-300 ${
                    activeSection === item.href.replace('#', '')
                      ? 'opacity-100 scale-x-100'
                      : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-60'
                  }`} />
                </a>
              ))}
              <a href="/media"
                className="relative h-10 text-[11px] font-bold uppercase tracking-[.1em] transition-all duration-300 inline-flex items-center gap-1.5 text-ink-500 hover:text-ink-900 group">
                <FontAwesomeIcon icon={faNewspaper} className="text-[11px]" />
                {trans.landing.media}
              </a>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher className="flex items-center" />
              <div className="w-px h-8 bg-ink-200/60" />
              <a href="/login"><Button variant="ghost" size="sm">{trans.landing.login}</Button></a>
              <a href="/register"><Button variant="primary" size="sm" className="!h-9 !px-4 !text-xs !shadow-[0_2px_8px_rgba(43,139,156,.2)] hover:!shadow-[0_4px_16px_rgba(43,139,156,.3)]">{trans.landing.getStarted} <FontAwesomeIcon icon={faArrowRight} className="text-[14px]" /></Button></a>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden relative w-9 h-9 rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">
              {mobileOpen ? <FontAwesomeIcon icon={faXmark} className="text-[18px]" /> : <FontAwesomeIcon icon={faBars} className="text-[18px]" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-ink-100/80 bg-white"
            >
              <div className="px-5 md:px-[30px] py-6 space-y-2">
                {navItems.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={e => scrollTo(e, item.href)}
                    className={`block h-10 rounded-lg px-4 text-sm font-medium transition-all flex items-center ${
                      activeSection === item.href.replace('#', '')
                        ? 'text-brand-700 bg-brand-50'
                        : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
                <a href="/media"
                  className="flex items-center gap-2 h-10 px-4 text-xs font-bold text-ink-500 uppercase tracking-[.08em] hover:text-ink-900 transition-colors">
                  <FontAwesomeIcon icon={faNewspaper} className="text-[12px]" />
                  {trans.landing.media}
                </a>
                <div className="pt-4 mt-4 border-t border-ink-100 flex flex-col gap-3">
                  <LanguageSwitcher />
                  <div className="flex items-center gap-2">
                    <a href="/login" className="flex-1"><Button variant="secondary" size="sm" className="w-full">{trans.landing.login}</Button></a>
                    <a href="/register" className="flex-1"><Button variant="primary" size="sm" className="w-full">{trans.landing.getStarted}</Button></a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="hero" className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <img src="/bg svg.avif" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-white/50 to-ink-50/30" />
        </div>
        <div className="container pt-32 pb-32 md:pt-44 md:pb-44 lg:pt-52 lg:pb-52 relative w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-6 shadow-sm">
                <FontAwesomeIcon icon={faHeartPulse} className="text-[12px]" />
                Mental Health Support
              </div>
              <h1 className="text-[40px] sm:text-[48px] lg:text-[64px] font-extrabold text-ink-900 leading-[1.08] tracking-[-.03em] mb-6">
                Accessible to All
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400">Rwandans</span>
              </h1>
              <p className="text-base lg:text-lg text-ink-500 leading-[1.8] max-w-[580px] mb-6">
                Mental health is an increasingly critical yet underserved aspect of healthcare in Rwanda. Humura is a multi-channel digital platform providing accessible, low-cost, and culturally relevant mental health support across the country.
              </p>
              <div className="flex flex-wrap gap-5">
                <a href="/register">
                  <Button variant="primary" size="lg" className="!h-13 !px-8 !text-sm !shadow-[0_4px_20px_rgba(43,139,156,.3)] hover:!shadow-[0_6px_28px_rgba(43,139,156,.4)]">
                    Join Humura <FontAwesomeIcon icon={faArrowRight} className="text-[16px]" />
                  </Button>
                </a>
                <a href="#services" onClick={e => scrollTo(e, '#services')}>
                  <Button variant="secondary" size="lg" className="!h-13 !px-8 !text-sm !shadow-sm">
                    <FontAwesomeIcon icon={faChevronRight} className="text-[16px] opacity-50" />
                    Explore Services
                  </Button>
                </a>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-ink-400">
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircleCheck} className="text-[14px] text-brand-500" /> Private &amp; Secure</span>
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircleCheck} className="text-[14px] text-brand-500" /> Culturally Relevant</span>
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircleCheck} className="text-[14px] text-brand-500" /> Community-Integrated</span>
              </div>
              <p className="text-sm text-ink-400 leading-relaxed max-w-[580px] mt-8 pt-6 border-t border-ink-100/60">
                A multi-channel digital platform combining technology, community systems, and cultural understanding to create a scalable and inclusive mental health support system for all Rwandans.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block">
              <div className="relative min-h-[450px] max-w-[600px] mx-auto w-full">
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                  <img src="/healing community.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                </div>

                <div className="absolute -top-4 -right-4 w-[calc(100%+32px)] h-[calc(100%+32px)] rounded-2xl border border-brand-200/20" />

                <div className="absolute inset-0 flex flex-col p-10">
                  <div className="self-start">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-white/80 text-[11px] font-semibold uppercase tracking-[.08em]">
                      <FontAwesomeIcon icon={faLocationDot} className="text-[12px]" />
                      Across Rwanda
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center my-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg mb-5">
                      <FontAwesomeIcon icon={faHeartPulse} className="text-[28px] text-white" />
                    </div>
                    <p className="text-white text-center font-bold text-lg leading-snug drop-shadow-sm mb-1">
                      Mental Health For All
                    </p>
                    <p className="text-white/70 text-sm text-center max-w-[260px] drop-shadow-sm">
                      Accessible care through every channel
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-white font-extrabold text-lg leading-none drop-shadow-sm">26%</p>
                      <p className="text-white/50 text-[10px] font-semibold uppercase tracking-[.06em] mt-1">PTSD Prevalence</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-extrabold text-lg leading-none drop-shadow-sm">30</p>
                      <p className="text-white/50 text-[10px] font-semibold uppercase tracking-[.06em] mt-1">Districts Covered</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-extrabold text-lg leading-none drop-shadow-sm">1M+</p>
                      <p className="text-white/50 text-[10px] font-semibold uppercase tracking-[.06em] mt-1">Expected Reach</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SELF-ASSESSMENT ═══════════════ */}
      <section id="self-assessment" className="py-16 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div {...fadeUp}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-5">
                <FontAwesomeIcon icon={faStethoscope} className="text-[11px]" />
                Self-Assessment
              </div>
              <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-5 leading-[1.15]">
                Self-Assessment &amp; Awareness
              </h2>
              <p className="text-ink-600 text-base leading-relaxed max-w-[540px] mb-8">
                Users can answer simple questions to understand their emotional state and receive explanations in Kinyarwanda. Early detection of mental health issues helps connect users to the right support.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: faCircleCheck, title: 'Emotional State Check', desc: 'Simple questions to evaluate your current wellbeing and emotional state in a private, safe environment.' },
                  { icon: faCircleCheck, title: 'Risk Assessment', desc: 'Identify potential mental health concerns early through validated screening tools and receive appropriate guidance.' },
                  { icon: faCircleCheck, title: 'Personalized Feedback', desc: 'Receive explanations and recommendations in Kinyarwanda, tailored to your responses and needs.' },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-5 rounded-xl bg-ink-50/40 border border-ink-100/60">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={item.icon} className="text-[14px]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-800">{item.title}</p>
                      <p className="text-xs text-ink-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="/light to commemorate.jpg" alt="" className="w-full h-64 lg:h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/10 backdrop-blur-sm text-white text-[11px] font-semibold">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[10px]" />
                    Private &amp; Confidential
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ YOUTH MODULE ═══════════════ */}
      <section id="youth" className="py-16 bg-ink-50/20" style={{ marginTop: '50px' }}>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warm-50 border border-warm-200/60 text-warm-700 text-xs font-semibold uppercase tracking-[.08em] mb-5">
              <FontAwesomeIcon icon={faGraduationCap} className="text-[11px]" />
              Youth Support
            </div>
            <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-4 leading-[1.15]">
              Youth-Focused Module
            </h2>
            <p className="text-ink-600 max-w-[640px] mx-auto text-base leading-relaxed">
              A dedicated section for users aged 16&ndash;25 that focuses on identity and self-understanding, inherited trauma, emotional awareness, and peer pressure &mdash; ensuring the platform is relevant to a generation that lives with the effects of history but experiences different challenges.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: faUsers, title: 'Identity & Self-Understanding', desc: 'Explore who you are beyond your circumstances and build a strong sense of self in a supportive environment.' },
              { icon: faHeartPulse, title: 'Inherited Trauma', desc: 'Understand and process the psychological legacy of past events that continue to influence younger generations.' },
              { icon: faStar, title: 'Emotional Awareness', desc: 'Learn to identify, name, and express your emotions safely through guided exercises and peer connection.' },
              { icon: faHandshake, title: 'Peer Pressure & Social Stress', desc: 'Build resilience against modern social pressures including academic stress, unemployment, and social expectations.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-white rounded-xl border border-ink-100/60 p-6 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-warm-50 flex items-center justify-center text-warm-600 mb-4">
                  <FontAwesomeIcon icon={item.icon} className="text-[16px]" />
                </div>
                <h3 className="text-sm font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COUNSELING ═══════════════ */}
      <section id="services" className="py-16 bg-white" style={{ marginTop: '50px' }}>
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img src="/healing community.png" alt="" className="w-full h-64 lg:h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-2xl" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 border border-white/10 backdrop-blur-sm text-white text-[11px] font-semibold">
                    <FontAwesomeIcon icon={faUsers} className="text-[10px]" />
                    Professional &amp; Peer Support
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeUp} className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-5">
                <FontAwesomeIcon icon={faHeartPulse} className="text-[11px]" />
                Human Support
              </div>
              <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-5 leading-[1.15]">
                Counseling &amp; Human Support
              </h2>
              <p className="text-ink-600 text-base leading-relaxed max-w-[540px] mb-8">
                Text-based counselling that is affordable and scalable, referrals to nearby mental health professionals, and peer/community support systems to ensure no one faces their struggles alone.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: faMessage, title: 'Text-Based Counselling', desc: 'Affordable, scalable, and private counselling via text &mdash; one counsellor can support many users asynchronously.' },
                  { icon: faLocationDot, title: 'Professional Referrals', desc: 'Connect with nearby mental health professionals and specialists when higher-level care is needed.' },
                  { icon: faUsers, title: 'Peer Support Networks', desc: 'Community-based support through shared experiences, group healing, and guided peer connections.' },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-3 p-5 rounded-xl bg-ink-50/40 border border-ink-100/60">
                    <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 mt-0.5">
                      <FontAwesomeIcon icon={item.icon} className="text-[14px]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-ink-800">{item.title}</p>
                      <p className="text-xs text-ink-500 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ MULTI-CHANNEL ═══════════════ */}
      <section className="py-16 bg-ink-50/20" style={{ marginTop: '50px' }}>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-5">
              <FontAwesomeIcon icon={faGlobe} className="text-[11px]" />
              Access Anywhere
            </div>
            <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-4 leading-[1.15]">
              Multi-Channel Access
            </h2>
            <p className="text-ink-600 max-w-[640px] mx-auto text-base leading-relaxed">
              To ensure accessibility across Rwanda, urban users can access the mobile app, web platform, and WhatsApp chatbot, while rural users are reached via USSD, SMS-based interaction, and offline audio content.
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-8 mb-10">
            {[
              { icon: faMobile, label: 'Mobile App' },
              { icon: faGlobe, label: 'Web Platform' },
              { icon: faPhone, label: 'USSD' },
              { icon: faEnvelope, label: 'SMS' },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex flex-col items-center gap-2 px-6 py-5 rounded-xl bg-white border border-ink-100/60 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <FontAwesomeIcon icon={item.icon} className="text-[22px]" />
                </div>
                <span className="text-sm font-bold text-ink-700">{item.label}</span>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-2xl mx-auto bg-white rounded-xl border border-ink-100/60 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faEnvelope} className="text-[16px]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink-900 mb-1">Prompted SMS System</h3>
                <p className="text-xs text-ink-500 leading-relaxed">
                  Daily check-ins asking &ldquo;How are you feeling today?&rdquo;, weekly mental health tips, and reminders for coping exercises &mdash; delivered directly to your phone, no smartphone required.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-[10px] font-semibold">Daily mood check-ins via SMS</span>
                  <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-[10px] font-semibold">Weekly mental health tips</span>
                  <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 text-[10px] font-semibold">Coping exercise reminders</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ COPING TOOLS ═══════════════ */}
      <section className="py-16 bg-white" style={{ marginTop: '50px' }}>
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-5">
              <FontAwesomeIcon icon={faHeartPulse} className="text-[11px]" />
              Wellbeing Tools
            </div>
            <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-4 leading-[1.15]">
              Coping &amp; Wellbeing Tools
            </h2>
            <p className="text-ink-600 max-w-[600px] mx-auto text-base leading-relaxed">
              Practical tools for daily mental wellness including breathing exercises, stress management techniques, sleep support, and audio guidance that works offline.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: faWind, title: 'Breathing Exercises', desc: 'Guided breathing techniques to calm your nervous system and reduce anxiety in moments of stress.' },
              { icon: faShield, title: 'Stress Management', desc: 'Practical techniques to manage daily stress effectively, built on evidence-based approaches.' },
              { icon: faMoon, title: 'Sleep Support', desc: 'Tools and audio content designed to improve sleep quality and establish healthy sleep routines.' },
              { icon: faHeadphones, title: 'Audio Guidance', desc: 'Offline-friendly guided sessions and exercises that work without an internet connection.' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-ink-50/30 rounded-xl border border-ink-100/60 p-6 shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
                  <FontAwesomeIcon icon={item.icon} className="text-[16px]" />
                </div>
                <h3 className="text-sm font-bold text-ink-900 mb-2">{item.title}</h3>
                <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PARTNERS ═══════════════ */}
      <section className="py-16 bg-ink-50/20 overflow-hidden" style={{ marginTop: '50px', marginBottom: '50px' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider text-center mb-10">
              Our Partners &amp; Collaborators
            </p>
            <div className="relative">
              <div className="flex gap-8 animate-scroll" style={{ width: 'max-content' }}>
                {[...partners, ...partners].map((p, i) => (
                  <div key={`${p.name}-${i}`}
                    className="flex items-center justify-center px-8 py-6 rounded-lg bg-white border border-ink-100/60 shadow-sm shrink-0 w-[200px] h-[90px]">
                    <img src={p.logo ?? ''} alt={p.name} className="h-12 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ COMMUNITY HEALTH WORKERS ═══════════════ */}
      <section id="community" className="py-16 bg-white">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-5">
              <FontAwesomeIcon icon={faUsers} className="text-[11px]" />
              Community Network
            </div>
            <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-4 leading-[1.15]">
              Community Health Worker Integration
            </h2>
            <p className="text-ink-600 max-w-[640px] mx-auto text-base leading-relaxed">
              In Rwanda, trust is built through people &mdash; not just technology. Community Health Workers introduce the platform, help with onboarding, and refer high-risk individuals to professional care.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { count: '640+', role: 'Community Health Workers', desc: 'Trained CHWs introducing the platform and supporting users at the community level.', icon: faHandshake },
              { count: '180+', role: 'Trained Facilitators', desc: 'Facilitators helping with onboarding, guidance, and community-based support.', icon: faUsers },
              { count: '24', role: 'Youth Programs', desc: 'Dedicated youth-focused programs operating across multiple districts nationwide.', icon: faGraduationCap },
              { count: '95+', role: 'Trained Counselors', desc: 'Professional counsellors providing support through the platform and referrals.', icon: faShield },
            ].map((item, i) => (
              <motion.div key={item.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="bg-ink-50/30 rounded-xl border border-ink-100/60 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
                <div className="w-11 h-11 mx-auto rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-3">
                  <FontAwesomeIcon icon={item.icon} className="text-[18px]" />
                </div>
                <p className="text-3xl font-extrabold text-brand-700">{item.count}</p>
                <p className="text-sm font-bold text-ink-800 mt-1.5">{item.role}</p>
                <p className="text-xs text-ink-500 mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ IMPACT / QUOTE ═══════════════ */}
      <section className="py-16 bg-ink-50/20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div {...fadeUp}>
              <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-6 leading-[1.15]">
                Our Impact<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">Breaking the Cycle of Intergenerational Trauma</span>
              </h2>
              <div className="relative bg-white rounded-xl border border-ink-100/60 p-6 shadow-sm">
                <FontAwesomeIcon icon={faQuoteLeft} className="text-lg text-brand-300 mb-3 opacity-60" />
                <p className="text-sm text-ink-600 leading-relaxed mb-4 italic">
                  &ldquo;Trauma is not only individual but intergenerational. The effects of past events continue to influence younger generations who did not directly experience them but live with their consequences. Humura bridges this gap through community healing and culturally relevant care.&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-ink-100/60">
                  <img src="/adolphe profile.jpg" alt="Adolphe" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-ink-800">Adolphe K.</p>
                    <p className="text-xs text-ink-400">Humura Initiative, Rwanda</p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="rounded-2xl p-8 text-white bg-gradient-to-br from-brand-800 to-brand-950 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Expected Impact</h3>
                <ul className="space-y-4">
                  {[
                    'Increase access to mental health support nationwide',
                    'Reduce stigma through private, digital-first access',
                    'Improve early detection of mental health issues',
                    'Support youth emotional development across 30 districts',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <FontAwesomeIcon icon={faCircleCheck} className="text-brand-300 text-sm mt-0.5 shrink-0" />
                      <span className="text-sm text-white/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" className="py-16 bg-white">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-5">
              <FontAwesomeIcon icon={faEnvelope} className="text-[11px]" />
              Get in Touch
            </div>
            <h2 className="text-[30px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-4">Contact Us</h2>
            <p className="text-ink-600 max-w-[520px] mx-auto text-base leading-relaxed">
              Have questions or want to learn more about Humura? Reach out to our team.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            <div className="lg:col-span-3">
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input type="text" placeholder="Your Name"
                    className="h-12 w-full px-4 rounded-lg text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 transition-all placeholder:text-ink-300 outline-none" />
                  <input type="email" placeholder="Your Email"
                    className="h-12 w-full px-4 rounded-lg text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 transition-all placeholder:text-ink-300 outline-none" />
                </div>
                <select className="h-12 w-full px-4 rounded-lg text-sm text-ink-500 bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 transition-all outline-none appearance-none cursor-pointer">
                  <option value="">Select a topic</option>
                  <option>Partnership Inquiry</option>
                  <option>Technical Support</option>
                  <option>Training &amp; Onboarding</option>
                  <option>General Inquiry</option>
                </select>
                <textarea placeholder="Your Message" rows={4}
                  className="w-full px-4 py-3 rounded-lg text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/15 transition-all placeholder:text-ink-300 outline-none resize-none" />
                <Button type="submit" variant="primary" size="lg" className="!h-12 !px-8">
                  <FontAwesomeIcon icon={faArrowRight} className="text-sm" /> Send Message
                </Button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-8 lg:pt-0 pt-4">
              {[
                { icon: faLocationDot, label: 'Address', value: 'KG 123 St, Kigali, Rwanda' },
                { icon: faPhone, label: 'Phone', value: '+250 788 123 456\n+250 788 789 012' },
                { icon: faEnvelope, label: 'Email', value: 'info@humura.rw\nsupport@humura.rw' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    <FontAwesomeIcon icon={c.icon} className="text-base" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-wide mb-1">{c.label}</p>
                    {c.value.split('\n').map((line, i) => (
                      <p key={i} className="text-sm text-ink-700">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="reset-margin relative overflow-hidden text-ink-400"
        style={{ background: '#0F3015' }}>
        {/* Dark overlay for depth */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,.04)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(43,139,156,.08)_0%,transparent_50%)]" />

        <div className="max-w-[1400px] mx-auto px-10 relative pt-20 pb-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-12 xl:gap-16">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative">
                    <img src="/logo.png" alt="" className="h-9 w-auto brightness-0 invert" />
                    <div className="absolute -inset-2 rounded-xl bg-brand-400/10 blur-sm -z-10" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white tracking-tight">HUMURA</span>
                    <p className="text-[10px] font-semibold text-brand-300 uppercase tracking-[.12em] leading-none mt-0.5">{trans.landing.footerBrand}</p>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-ink-400 max-w-[320px] mb-8">
                  Humura is a multi-channel digital mental health platform providing accessible, culturally relevant mental health support across Rwanda.
                </p>
                <div className="flex items-center gap-3 mb-6">
                  {[
                    { icon: faGlobe, href: '#', label: 'Website' },
                    { icon: faEnvelope, href: '#', label: 'Email' },
                  ].map((s, i) => (
                    <a key={i} href={s.href} aria-label={s.label}
                      className="w-11 h-11 rounded-xl bg-white/5 hover:bg-brand-500/20 border border-white/5 hover:border-brand-400/30 transition-all duration-300 flex items-center justify-center text-ink-400 hover:text-brand-300 group">
                      <FontAwesomeIcon icon={s.icon} className="text-[16px] group-hover:scale-110 transition-transform duration-300" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Links */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-[.14em] mb-6 flex items-center gap-2">
                  <span className="w-5 h-px bg-brand-400/40" />
                  {trans.landing.footerQuickLinks}
                </p>
                <ul className="space-y-4">
                  {['Home', 'About', 'Services', 'Youth', 'Community', 'Contact'].map(l => (
                    <li key={l}>
                      <a href={`#${l.toLowerCase()}`} onClick={e => scrollTo(e, `#${l.toLowerCase()}`)}
                        className="text-sm text-ink-400 hover:text-white transition-all duration-300 flex items-center gap-2 group">
                        <span className="w-0 h-px bg-brand-400 group-hover:w-3 transition-all duration-300" />
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Programs */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-[.14em] mb-6 flex items-center gap-2">
                  <span className="w-5 h-px bg-brand-400/40" />
                  {trans.landing.footerPrograms}
                </p>
                <ul className="space-y-4">
                  {['Self-Assessment', 'Youth Module', 'Counselling', 'Coping Tools'].map(p => (
                    <li key={p}>
                      <span className="text-sm text-ink-400 flex items-center gap-2 group cursor-default">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500/40 group-hover:bg-brand-400 transition-colors duration-300 shrink-0" />
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Partners */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-[.14em] mb-6 flex items-center gap-2">
                  <span className="w-5 h-px bg-brand-400/40" />
                  {trans.landing.footerPartners}
                </p>
                <ul className="space-y-4">
                  {partners.map(p => (
                    <li key={p.name}>
                      <span className="text-sm text-ink-400 flex items-center gap-2 group cursor-default">
                        <span className="w-5 h-px bg-ink-600 group-hover:bg-brand-400/60 transition-colors duration-300 shrink-0" />
                        {p.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Contact */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-[.14em] mb-6 flex items-center gap-2">
                  <span className="w-5 h-px bg-brand-400/40" />
                  {trans.landing.footerContact}
                </p>
                <ul className="space-y-5">
                  <li className="flex items-start gap-3 group cursor-default">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[13px] text-brand-400/60 mt-0.5 shrink-0" />
                    <span className="text-sm text-ink-400">{trans.landing.footerContactAddress}</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <FontAwesomeIcon icon={faPhone} className="text-[13px] text-brand-400/60 shrink-0" />
                    <span className="text-sm text-ink-400">{trans.landing.footerContactPhone}</span>
                  </li>
                  <li className="flex items-center gap-3 group">
                    <FontAwesomeIcon icon={faEnvelope} className="text-[13px] text-brand-400/60 shrink-0" />
                    <span className="text-sm text-ink-400">{trans.landing.footerContactEmail}</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-16 pt-8 border-t border-white/5">
            <div className="max-w-md mx-auto text-center">
              <p className="text-xs font-semibold text-white/40 uppercase tracking-[.1em] mb-4">Stay Connected</p>
              <div className="flex gap-3">
                <input type="email" placeholder="your@email.com"
                  className="h-11 flex-1 min-w-0 px-5 rounded-xl text-sm bg-white/[0.05] border border-white/10 focus:border-brand-400/50 focus:ring-2 focus:ring-brand-400/20 outline-none transition-all placeholder:text-ink-500 text-white" />
                <button className="h-11 px-6 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white text-sm font-bold transition-all duration-300 shrink-0 shadow-lg shadow-brand-600/20">
                  <FontAwesomeIcon icon={faArrowRight} className="text-[13px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/5 mt-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="max-w-[1400px] mx-auto px-10 relative py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
            <span>&copy; {new Date().getFullYear()} Humura. All rights reserved.</span>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="hover:text-brand-300 transition-colors">Privacy Policy</Link>
              <span className="w-1 h-1 rounded-full bg-ink-600" />
              <span className="flex items-center gap-1.5">Made with <FontAwesomeIcon icon={faHeartPulse} className="text-[11px] text-brand-400/60" /> for Rwanda</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

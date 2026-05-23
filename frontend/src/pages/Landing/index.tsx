import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faShield, faHandshake, faChartBar, faUsers, faStethoscope,
  faWandSparkles, faBars, faXmark, faGlobe, faLocationDot, faPhone, faEnvelope,
  faGraduationCap, faHeartPulse, faBullseye, faCircleCheck, faQuoteLeft,
  faArrowUpRightFromSquare, faHandHoldingHeart, faPaperPlane, faChevronRight, faStar,
  faVolumeUp, faNewspaper,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../../components/shared/Button';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';
import ChatWidget from '../../components/chat/ChatWidget';
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

  const testimonials = [
    { quote: trans.landing.testimonialQuotes[0], name: trans.landing.testimonialNames[0], age: 19, role: trans.landing.testimonialRoles[0] },
    { quote: trans.landing.testimonialQuotes[1], name: trans.landing.testimonialNames[1], age: null, role: trans.landing.testimonialRoles[1] },
    { quote: trans.landing.testimonialQuotes[2], name: trans.landing.testimonialNames[2], age: 34, role: trans.landing.testimonialRoles[2] },
    { quote: trans.landing.testimonialQuotes[3], name: trans.landing.testimonialNames[3], age: 41, role: trans.landing.testimonialRoles[3] },
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
      <header className={`sticky top-0 z-50 transition-all duration-500 ${
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

            <nav className="hidden lg:flex items-center gap-x-5 mx-auto">
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
        <div className="absolute -top-40 -right-20 w-[500px] h-[500px] rounded-full bg-brand-100/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-warm-100/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 left-[15%] w-2 h-2 rounded-full bg-brand-300/40 blur-[2px]" />
        <div className="absolute top-1/3 right-[20%] w-3 h-3 rounded-full bg-warm-300/30 blur-[3px]" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 rounded-full bg-brand-400/30 blur-[2px]" />

        <div className="container pt-32 pb-32 md:pt-44 md:pb-44 lg:pt-52 lg:pb-52 relative w-full">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-6 shadow-sm">
                <FontAwesomeIcon icon={faWandSparkles} className="text-[12px]" />
                {trans.landing.heroBadge}
              </div>
              <h1 className="text-[40px] sm:text-[48px] lg:text-[64px] font-extrabold text-ink-900 leading-[1.08] tracking-[-.03em] mb-6">
                {trans.landing.heroHeading1}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400">{trans.landing.heroHeading2}</span>
              </h1>
              <p className="text-base lg:text-lg text-ink-500 leading-[1.8] max-w-[580px] mb-10">
                {trans.landing.heroText}
              </p>
              <div className="flex flex-wrap gap-5">
                <a href="/register">
                  <Button variant="primary" size="lg" className="!h-13 !px-8 !text-sm !shadow-[0_4px_20px_rgba(43,139,156,.3)] hover:!shadow-[0_6px_28px_rgba(43,139,156,.4)]">
                    {trans.landing.heroCtaJoin} <FontAwesomeIcon icon={faArrowRight} className="text-[16px]" />
                  </Button>
                </a>
                <a href="#services" onClick={e => scrollTo(e, '#services')}>
                  <Button variant="secondary" size="lg" className="!h-13 !px-8 !text-sm !shadow-sm">
                    <FontAwesomeIcon icon={faChevronRight} className="text-[16px] opacity-50" />
                    {trans.landing.heroCtaExplore}
                  </Button>
                </a>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-5  text-xs text-ink-400">
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircleCheck} className="text-[14px] text-brand-500" /> {trans.landing.trustHipaa}</span>
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircleCheck} className="text-[14px] text-brand-500" /> {trans.landing.trustRbac}</span>
                <span className="flex items-center gap-1.5"><FontAwesomeIcon icon={faCircleCheck} className="text-[14px] text-brand-500" /> {trans.landing.trustAes}</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative hidden lg:block">
              <div className="relative min-h-[450px] max-w-[600px] mx-auto w-full">
                <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl">
                  <video autoPlay muted loop playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    <source src="/video auto play.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>

                <div className="absolute -top-4 -right-4 w-[calc(100%+32px)] h-[calc(100%+32px)] rounded-2xl border border-brand-200/20" />

                <div className="absolute inset-0 flex flex-col p-10">
                  <div className="self-start">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-white/80 text-[11px] font-semibold uppercase tracking-[.08em]">
                      <FontAwesomeIcon icon={faHeartPulse} className="text-[12px]" />
                      Live Impact
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col items-center justify-center my-5">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center shadow-lg mb-5">
                      <FontAwesomeIcon icon={faHandshake} className="text-[28px] text-white" />
                    </div>
                    <p className="text-white text-center font-bold text-lg leading-snug drop-shadow-sm mb-1">
                      Healing Communities
                    </p>
                    <p className="text-white/70 text-sm text-center max-w-[260px] drop-shadow-sm">
                      Connecting survivors to care across Rwanda
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                    {[
                      { val: '2,847+', label: trans.landing.statsBeneficiaries },
                      { val: '128', label: trans.landing.statsGroups },
                      { val: '97%', label: trans.landing.statsEngagement },
                    ].map(stat => (
                      <div key={stat.label} className="text-center">
                        <p className="text-white font-extrabold text-lg leading-none drop-shadow-sm">{stat.val}</p>
                        <p className="text-white/50 text-[10px] font-semibold uppercase tracking-[.06em] mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="py-24 bg-ink-50/20 mt-10">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '2,847+', label: trans.landing.statsBeneficiaries, icon: <FontAwesomeIcon icon={faUsers} className="text-[22px] text-brand-500" /> },
              { value: '128', label: trans.landing.statsGroups, icon: <FontAwesomeIcon icon={faHandshake} className="text-[22px] text-brand-500" /> },
              { value: '24', label: trans.landing.statsYouthPrograms, icon: <FontAwesomeIcon icon={faUsers} className="text-[22px] text-brand-500" /> },
              { value: '97%', label: trans.landing.statsEngagement, icon: <FontAwesomeIcon icon={faHeartPulse} className="text-[22px] text-brand-500" /> },
            ].map(s => (
              <div key={s.label} className="relative bg-white rounded-2xl border border-ink-200/60 p-8 text-center shadow-sm hover:shadow-2xl hover:-translate-y-[3px] hover:border-brand-200/50 transition-all duration-300 group overflow-hidden h-full">
                <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-all duration-300">
                  {s.icon}
                </div>
                <p className="text-4xl font-extrabold text-ink-900">{s.value}</p>
                <p className="text-sm text-ink-500 mt-1.5">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ PARTNERS CAROUSEL ═══════════════ */}
      <section className="py-24 bg-white border-b border-ink-100/60 mt-10">
        <div className="container">
           <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
             <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.12em] text-center mb-16">
               {trans.landing.partnershipLabel}
             </p>
            <div className="relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white/50 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/50 to-transparent z-10 pointer-events-none" />
              <motion.div
                className="flex gap-12 md:gap-16 items-center"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                {[...partners, ...partners].map((p, i) => (
                  <div key={`${p.name}-${i}`}
                    className="flex items-center gap-4 shrink-0 px-6 py-4 rounded-xl bg-white border border-ink-200/60 shadow-sm hover:shadow-md hover:border-brand-200/50 transition-all">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="w-12 h-12 rounded-lg object-contain" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm bg-ink-50 text-ink-500">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-sm font-bold text-ink-600 whitespace-nowrap tracking-wide">{p.name}</span>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ ABOUT ═══════════════ */}
      <section id="about" className="py-24 bg-white mt-10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-20 lg:gap-28 items-start">
            <motion.div {...fadeUp}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-8">{trans.landing.aboutBadge}</span>
              <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-10 leading-[1.1]">
                {trans.landing.aboutHeading}
              </h2>
              <p className="text-ink-600 text-base lg:text-lg leading-[1.8] max-w-[580px] mb-20">
                {trans.landing.aboutText}
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: <FontAwesomeIcon icon={faBullseye} className="text-[18px]" />, title: trans.landing.missionTitle, desc: trans.landing.missionDesc },
                  { icon: <FontAwesomeIcon icon={faShield} className="text-[18px]" />, title: trans.landing.valuesTitle, desc: trans.landing.valuesDesc },
                  { icon: <FontAwesomeIcon icon={faUsers} className="text-[18px]" />, title: trans.landing.approachTitle, desc: trans.landing.approachDesc },
                  { icon: <FontAwesomeIcon icon={faHeartPulse} className="text-[18px]" />, title: trans.landing.impactTitle, desc: trans.landing.impactDesc },
                  ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="relative rounded-xl border border-ink-200/60 p-7 hover:border-brand-200/50 hover:shadow-xl hover:-translate-y-[3px] transition-all duration-300 group overflow-hidden bg-white">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-all duration-300">{item.icon}</div>
                    <h3 className="text-sm font-bold text-ink-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] shadow-2xl"
                style={{ background: 'linear-gradient(160deg, #001814 0%, #007A64 40%, #33a38f 100%)' }}>
                <video autoPlay muted loop playsInline
                  poster="/healing community.png"
                  className="absolute right-0 top-0 h-full w-3/5 object-cover opacity-20 pointer-events-none"
                >
                  <source src="/about.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,.1)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.06)_0%,transparent_40%)]" />
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
                <div className="absolute inset-0 flex flex-col p-10">
                  {/* Top badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-white/80 text-[11px] font-semibold uppercase tracking-[.08em] self-start mb-6">
                    <FontAwesomeIcon icon={faLocationDot} className="text-[12px]" />
                    {trans.landing.communityImageLabel}
                  </div>

                  {/* Stats visualization */}
                  <div className="flex-1 flex flex-col justify-center gap-6">
                    {/* District stat */}
                    <div className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/10">
                          <FontAwesomeIcon icon={faUsers} className="text-[20px]" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg leading-none">2,847+</p>
                          <p className="text-white/50 text-[11px] font-semibold uppercase tracking-[.06em] mt-1">{trans.landing.statsBeneficiaries}</p>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-white/40"
                          initial={{ width: 0 }} whileInView={{ width: '88%' }} viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} />
                      </div>
                    </div>

                    {/* Groups stat */}
                    <div className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/10">
                          <FontAwesomeIcon icon={faHandshake} className="text-[20px]" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg leading-none">128</p>
                          <p className="text-white/50 text-[11px] font-semibold uppercase tracking-[.06em] mt-1">{trans.landing.statsGroups}</p>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-white/40"
                          initial={{ width: 0 }} whileInView={{ width: '72%' }} viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} />
                      </div>
                    </div>

                    {/* Youth stat */}
                    <div className="p-5 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-white border border-white/10">
                          <FontAwesomeIcon icon={faGraduationCap} className="text-[20px]" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-lg leading-none">24</p>
                          <p className="text-white/50 text-[11px] font-semibold uppercase tracking-[.06em] mt-1">{trans.landing.statsYouthPrograms}</p>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <motion.div className="h-full rounded-full bg-white/40"
                          initial={{ width: 0 }} whileInView={{ width: '60%' }} viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }} />
                      </div>
                    </div>
                  </div>

                  {/* Bottom tags */}
                  <div className="mt-auto pt-6 flex flex-wrap gap-2">
                    {trans.landing.tags.map(tag => (
                      <span key={tag} className="px-3.5 py-1.5 rounded-full text-[11px] font-medium text-white bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <section id="services" className="py-24 bg-ink-50/20 mt-10">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-8">{trans.landing.servicesBadge}</span>
            <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-8">
              {trans.landing.servicesHeading}
            </h2>
            <p className="text-ink-600 max-w-[600px] mx-auto text-base leading-[1.8]">
              {trans.landing.servicesText}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <FontAwesomeIcon icon={faStethoscope} className="text-[24px]" />, title: trans.landing.serviceScreening, desc: trans.landing.serviceScreeningDesc, accent: 'from-brand-400 to-brand-500' },
              { icon: <FontAwesomeIcon icon={faHandshake} className="text-[24px]" />, title: trans.landing.serviceReferral, desc: trans.landing.serviceReferralDesc, accent: 'from-warm-400 to-warm-500' },
              { icon: <FontAwesomeIcon icon={faUsers} className="text-[24px]" />, title: trans.landing.serviceSociotherapy, desc: trans.landing.serviceSociotherapyDesc, accent: 'from-brand-400 to-brand-500' },
              { icon: <FontAwesomeIcon icon={faChartBar} className="text-[24px]" />, title: trans.landing.serviceReports, desc: trans.landing.serviceReportsDesc, accent: 'from-forest-400 to-forest-500' },
              { icon: <FontAwesomeIcon icon={faShield} className="text-[24px]" />, title: trans.landing.serviceRbac, desc: trans.landing.serviceRbacDesc, accent: 'from-warm-400 to-warm-500' },
              { icon: <FontAwesomeIcon icon={faWandSparkles} className="text-[24px]" />, title: trans.landing.serviceEmergency, desc: trans.landing.serviceEmergencyDesc, accent: 'from-rose-400 to-rose-500' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.06, duration: 0.4 }}
                className="relative bg-white rounded-2xl border border-ink-200/60 shadow-sm hover:shadow-2xl hover:-translate-y-[4px] hover:border-brand-200/50 transition-all duration-300 cursor-pointer group overflow-hidden">
                <div className="px-8 pb-10 pt-8">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-105 transition-all duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-ink-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-ink-500 leading-[1.8]">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ YOUTH + TESTIMONIAL ═══════════════ */}
      <section id="youth" className="py-24 bg-white mt-10">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-warm-50 border border-warm-200/60 text-warm-700 text-xs font-semibold uppercase tracking-[.08em] mb-8">{trans.landing.youthBadge}</span>
              <h2 className="text-[34px] lg:text-[42px] font-extrabold text-ink-900 tracking-[-.02em] mb-8 leading-[1.1] pt-2">
                {trans.landing.youthHeading}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-600 to-warm-400">{trans.landing.youthHeadingAccent}</span>
              </h2>
              <p className="text-ink-600 text-base lg:text-lg leading-[1.8] max-w-[580px] mb-20">
                {trans.landing.youthText}
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { icon: <FontAwesomeIcon icon={faGraduationCap} className="text-[18px]" />, title: trans.landing.youthSchool, desc: trans.landing.youthSchoolDesc },
                  { icon: <FontAwesomeIcon icon={faHandshake} className="text-[18px]" />, title: trans.landing.youthPeace, desc: trans.landing.youthPeaceDesc },
                  { icon: <FontAwesomeIcon icon={faUsers} className="text-[18px]" />, title: trans.landing.youthClubs, desc: trans.landing.youthClubsDesc },
                  { icon: <FontAwesomeIcon icon={faWandSparkles} className="text-[18px]" />, title: trans.landing.youthLeadership, desc: trans.landing.youthLeadershipDesc },
                ].map((p, i) => (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-4 p-7 rounded-xl bg-white border border-ink-200/60 hover:border-warm-200/50 hover:shadow-md hover:-translate-y-[1px] transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">{p.icon}</div>
                    <div className="pl-2">
                      <p className="text-sm font-bold text-ink-800">{p.title}</p>
                      <p className="text-xs text-ink-500 mt-1.5">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6">
                <a href="/register"><Button variant="primary" className="!h-11 !px-7">
                  {trans.landing.youthCta} <FontAwesomeIcon icon={faArrowRight} className="text-[15px]" />
                </Button></a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative self-stretch flex flex-col justify-center">
              <div className="rounded-3xl p-10 lg:p-12 text-white overflow-hidden relative shadow-xl"
                style={{ background: 'linear-gradient(160deg, #001814 0%, #007A64 40%, #33a38f 100%)' }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,.08)_0%,transparent_50%)]" />
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <FontAwesomeIcon icon={faGraduationCap} className="text-[30px] text-white/30" />
                    <span className="text-sm font-semibold text-white/50 uppercase tracking-[.08em]">{trans.landing.youthImpactBadge}</span>
                  </div>
                  <div className="relative px-2">
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-[40px] text-white/20 absolute -top-2 -left-3" />
                    <p className="text-base lg:text-lg leading-relaxed italic relative z-10 pl-8 pr-4">
                      "The youth club gave me a place to belong. I learned that my story matters, 
                      and that I can be part of building a future where no one suffers in silence."
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-base backdrop-blur-sm border-2 border-white/20 shrink-0">M</div>
                      <div>
                        <p className="text-base font-bold">Marie, 19</p>
                        <p className="text-xs text-white/60">Youth Club Participant, Gasabo</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-4">
                      {[1,2,3,4,5].map(s => <FontAwesomeIcon key={s} icon={faStar} className="text-[13px] text-warm-300" />)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ COMMUNITY ═══════════════ */}
      <section id="community" className="py-24 bg-ink-50/20 relative overflow-hidden mt-10">
        <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-brand-50/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-warm-50/20 blur-3xl pointer-events-none" />
        <div className="container relative">
          <motion.div {...fadeUp} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-8">{trans.landing.communityBadge}</span>
            <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-8">
              {trans.landing.communityHeading}
            </h2>
            <p className="text-ink-600 max-w-[640px] mx-auto text-base leading-[1.8]">
              {trans.landing.communityText}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { label: trans.landing.photoLabels[0], icon: <FontAwesomeIcon icon={faHandshake} className="text-[26px]" />, count: '2,847+' },
              { label: trans.landing.photoLabels[1], icon: <FontAwesomeIcon icon={faUsers} className="text-[26px]" />, count: '640+' },
              { label: trans.landing.photoLabels[2], icon: <FontAwesomeIcon icon={faGraduationCap} className="text-[26px]" />, count: '180+' },
              { label: trans.landing.photoLabels[3], icon: <FontAwesomeIcon icon={faHandHoldingHeart} className="text-[26px]" />, count: '95+' },
            ].map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer shadow-lg hover:shadow-2xl hover:-translate-y-[5px] transition-all duration-500"
                style={{ backgroundImage: 'url(/healing community.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 p-6 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center text-white group-hover:bg-white/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400 backdrop-blur-sm border border-white/10 shadow-lg">
                    {p.icon}
                  </div>
                  <p className="text-sm md:text-base font-bold text-white text-center leading-tight mt-1 opacity-90 group-hover:opacity-100 transition-opacity drop-shadow-sm">
                    {p.label}
                  </p>
                  <p className="text-2xl font-extrabold text-white/90 group-hover:text-white transition-colors drop-shadow-sm">
                    {p.count}
                  </p>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/30 rounded-2xl transition-all duration-300" />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-black/10" />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { role: trans.landing.communityChws, count: '640+', desc: trans.landing.communityChwsDesc, icon: <FontAwesomeIcon icon={faHandshake} className="text-[18px]" /> },
              { role: trans.landing.communityFacilitators, count: '180+', desc: trans.landing.communityFacilitatorsDesc, icon: <FontAwesomeIcon icon={faUsers} className="text-[18px]" /> },
              { role: trans.landing.communityYouthPrograms, count: '24', desc: trans.landing.communityYouthProgramsDesc, icon: <FontAwesomeIcon icon={faGraduationCap} className="text-[18px]" /> },
              { role: trans.landing.communityCounselors, count: '95+', desc: trans.landing.communityCounselorsDesc, icon: <FontAwesomeIcon icon={faShield} className="text-[18px]" /> },
              ].map((item, i) => (
              <motion.div key={item.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                className="relative bg-white rounded-2xl border border-ink-200/60 p-8 text-center shadow-sm hover:shadow-2xl hover:-translate-y-[3px] hover:border-brand-200/50 transition-all duration-300 group overflow-hidden">
                <div className="w-11 h-11 mx-auto rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  {item.icon}
                </div>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{item.count}</p>
                <p className="text-sm font-bold text-ink-800 mt-2">{item.role}</p>
                <p className="text-xs text-ink-400 mt-2 leading-[1.8]">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-b from-transparent to-brand-200/40" />
            <div className="grid sm:grid-cols-2 gap-6">
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="relative bg-white rounded-2xl border border-ink-200/60 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-[3px] hover:border-brand-200/50 transition-all duration-300 group">
                  <FontAwesomeIcon icon={faQuoteLeft} className="text-[20px] text-brand-300 mb-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <p className="text-sm text-ink-600 leading-[1.8] mb-5 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-ink-100/60">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-ink-800">{t.name}{t.age ? `, ${t.age}` : ''}</p>
                      <p className="text-[11px] text-ink-400 truncate">{t.role}</p>
                    </div>
                    <button type="button"
                      className="w-8 h-8 rounded-full bg-ink-50 border border-ink-200/60 flex items-center justify-center text-ink-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all shrink-0"
                      title="Play audio testimonial">
                      <FontAwesomeIcon icon={faVolumeUp} className="text-[13px]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" className="py-24 bg-white mt-10">
        <div className="container">
          <motion.div {...fadeUp} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-8">{trans.landing.contactBadge}</span>
            <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-8">{trans.landing.contactHeading}</h2>
            <p className="text-ink-600 max-w-[540px] mx-auto text-base leading-[1.8]">
              {trans.landing.contactText}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            <div className="lg:col-span-3">
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-8">
                  <input type="text" placeholder={trans.landing.contactNamePlaceholder}
                    className="h-16 w-full px-8 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none" />
                  <input type="email" placeholder={trans.landing.contactEmailPlaceholder}
                    className="h-16 w-full px-8 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none" />
                </div>
                <select className="h-16 w-full px-8 rounded-xl text-sm text-ink-500 bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all outline-none appearance-none cursor-pointer">
                  <option value="">{trans.landing.contactTopicPlaceholder}</option>
                  <option>{trans.landing.contactTopicPartnership}</option>
                  <option>{trans.landing.contactTopicSupport}</option>
                  <option>{trans.landing.contactTopicTraining}</option>
                  <option>{trans.landing.contactTopicGeneral}</option>
                </select>
                <textarea placeholder={trans.landing.contactMessagePlaceholder} rows={4}
                  className="w-full px-8 py-6 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none resize-none" />
                <Button type="submit" variant="primary" size="lg" className="!h-14 !px-10 !text-base">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-[16px]" /> {trans.landing.contactSend} <FontAwesomeIcon icon={faArrowRight} className="text-[16px]" />
                </Button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-10 lg:pt-0 pt-4">
              {[
                { icon: <FontAwesomeIcon icon={faLocationDot} className="text-[18px]" />, label: trans.landing.contactAddress, value: `${trans.landing.contactAddressValue}\n${trans.landing.contactAddressSub}` },
                { icon: <FontAwesomeIcon icon={faPhone} className="text-[18px]" />, label: trans.landing.contactPhone, value: `${trans.landing.contactPhoneValue1}\n${trans.landing.contactPhoneValue2}` },
                { icon: <FontAwesomeIcon icon={faEnvelope} className="text-[18px]" />, label: trans.landing.contactEmail, value: `${trans.landing.contactEmailValue1}\n${trans.landing.contactEmailValue2}` },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4">
                  <div className="flex items-center justify-center shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-[.06em] mb-1">{c.label}</p>
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

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="relative overflow-hidden py-[100px] mt-10"
        style={{ background: 'linear-gradient(165deg, #000c0a 0%, #003128 35%, #007A64 70%, #33a38f 100%)' }}>
        {/* Decorative orbs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-400/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-brand-300/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[.03] blur-[80px]" />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 opacity-[.04]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Floating particles */}
        <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-brand-300/20 blur-sm" />
        <div className="absolute bottom-32 right-[15%] w-3 h-3 rounded-full bg-brand-200/15 blur-sm" />
        <div className="absolute top-1/3 right-[25%] w-1.5 h-1.5 rounded-full bg-white/10 blur-sm" />

        {/* Max width container */}
        <div className="max-w-[1400px] mx-auto px-10 relative">
          <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-center">
            {/* Left: text */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-xs font-semibold uppercase tracking-[.08em] border border-white/10 mb-8">
                <FontAwesomeIcon icon={faWandSparkles} className="text-[11px]" />
                {trans.landing.ctaHeading.split(' ').slice(0, 2).join(' ')}
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-[64px] font-extrabold text-white tracking-[-.02em] leading-[1.1] mb-6">
                {trans.landing.ctaHeading}
              </h2>
              <p className="text-white/50 max-w-[520px] mb-10 text-base sm:text-lg xl:text-xl leading-[1.8]">
                {trans.landing.ctaText}
              </p>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5">
                <a href="/register">
                  <Button variant="primary" size="lg" className="!h-14 !px-10 !text-sm sm:!text-base !bg-gradient-to-r !from-brand-600 !to-brand-500 hover:!from-brand-500 hover:!to-brand-400 !text-white !shadow-[0_8px_32px_rgba(0,122,100,.35)] hover:!shadow-[0_12px_40px_rgba(0,122,100,.45)] hover:!-translate-y-0.5 !transition-all !duration-300 w-full sm:w-auto !border-0">
                    {trans.landing.ctaCreateAccount} <FontAwesomeIcon icon={faArrowRight} className="text-[15px] sm:text-[17px] ml-1" />
                  </Button>
                </a>
                <a href="/login">
                  <Button variant="secondary" size="lg" className="!h-14 !px-10 !text-sm sm:!text-base !bg-white/[0.06] !text-white !border-white/[0.15] hover:!bg-white/[0.12] !backdrop-blur-md hover:!-translate-y-0.5 !transition-all !duration-300 w-full sm:w-auto">
                    {trans.landing.ctaSignIn}
                  </Button>
                </a>
              </div>
            </motion.div>

            {/* Right: stat cards */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '2,847+', label: 'Beneficiaries Served', icon: faUsers },
                  { value: '12', label: 'Districts Reached', icon: faGlobe },
                  { value: '128', label: 'Support Groups', icon: faHandshake },
                  { value: '24', label: 'Youth Clubs', icon: faGraduationCap },
                ].map((stat, i) => (
                  <motion.div key={stat.label}
                    initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}
                    className="group bg-white/[0.06] backdrop-blur-md border border-white/[0.08] rounded-3xl p-8 hover:bg-white/[0.1] hover:border-white/[0.15] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-300 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-brand-500/15 flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-500/25 transition-colors duration-300">
                      <FontAwesomeIcon icon={stat.icon} className="text-xl text-brand-400" />
                    </div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1.5">{stat.value}</p>
                    <p className="text-xs font-medium text-white/45 uppercase tracking-[.06em]">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative overflow-hidden text-ink-400"
        style={{ background: 'linear-gradient(170deg, #0f242a 0%, #132e36 30%, #1a3f49 60%, #1f525f 100%)' }}>
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
                  {trans.landing.footerDesc}
                </p>
                <div className="flex items-center gap-3 mb-6">
                  {[
                    { icon: faGlobe, href: '#', label: 'Website' },
                    { icon: faArrowUpRightFromSquare, href: '#', label: 'Portal' },
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
                  {[trans.landing.about, trans.landing.services, trans.landing.youth, trans.landing.community, trans.landing.contact].map(l => (
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
                  {[trans.landing.serviceScreening, trans.landing.serviceReferral, trans.landing.serviceSociotherapy, trans.landing.serviceEmergency].map(p => (
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
                  <FontAwesomeIcon icon={faPaperPlane} className="text-[13px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative border-t border-white/5 mt-16">
          <div className="absolute inset-0 bg-black/20" />
          <div className="max-w-[1400px] mx-auto px-10 relative py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
            <span>{trans.landing.footerCopyright.replace('{year}', String(new Date().getFullYear()))}</span>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="hover:text-brand-300 transition-colors">{trans.privacy.footer}</Link>
              <span className="w-1 h-1 rounded-full bg-ink-600" />
              <span className="flex items-center gap-1.5">{trans.landing.footerCredit} <FontAwesomeIcon icon={faHeartPulse} className="text-[11px] text-brand-400/60" /></span>
              <span className="w-1 h-1 rounded-full bg-ink-600" />
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-1.5 text-ink-500 hover:text-brand-300 transition-colors">
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-[10px]" />
                Top
              </button>
            </div>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </div>
  );
}

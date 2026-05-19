import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, HeartHandshake, BarChart3, Users, Stethoscope,
  Sparkles, Menu, X, Globe, MapPin, Phone, Mail,
  GraduationCap, Activity, Target, CheckCircle, Quote,
  ExternalLink, HandHeart, Send, Star, ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';
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
    { name: 'WHO' },
    { name: 'Ibuka', logo: '/ibuka.png' },
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
  }, []);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-ink-700 antialiased">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,.04)]'
          : 'bg-white/95'
      }`}>
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="HUMURA" className="h-7 md:h-8 w-auto group-hover:scale-105 transition-transform" />
              <span className="text-base md:text-lg font-bold text-ink-900 tracking-tight">HUMURA</span>
            </a>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={e => scrollTo(e, item.href)}
                  className={`relative h-9 px-3.5 rounded-lg text-sm font-medium transition-all inline-flex items-center ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-brand-700 bg-brand-50'
                      : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <LanguageSwitcher />
              <div className="w-px h-5 bg-ink-200/60" />
              <a href="/login"><Button variant="ghost" size="sm">{trans.landing.login}</Button></a>
              <a href="/register"><Button variant="primary" size="sm">{trans.landing.getStarted} <ArrowRight size={14} /></Button></a>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden relative w-9 h-9 rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
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
              <div className="px-10 md:px-12 py-4 space-y-1">
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
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-white to-ink-50/40 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-warm-100/30 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-2 h-2 rounded-full bg-brand-300/40 blur-[2px]" />
        <div className="absolute top-1/4 right-1/3 w-3 h-3 rounded-full bg-warm-300/30 blur-[3px]" />
        <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-brand-400/30 blur-[2px]" />

        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16 pt-24 pb-28 md:pt-32 md:pb-36 lg:pt-40 lg:pb-44 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-8 shadow-sm">
                <Sparkles size={12} />
                {trans.landing.heroBadge}
              </div>
              <h1 className="text-[40px] sm:text-[48px] lg:text-[68px] font-extrabold text-ink-900 leading-[1.05] tracking-[-.03em] mb-6">
                {trans.landing.heroHeading1}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400">{trans.landing.heroHeading2}</span>
              </h1>
              <p className="text-base lg:text-lg text-ink-500 leading-relaxed max-w-[640px] mx-auto mb-12">
                {trans.landing.heroText}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/register">
                  <Button variant="primary" size="lg" className="!h-12 !px-8 !text-sm !shadow-[0_4px_20px_rgba(43,139,156,.3)] hover:!shadow-[0_6px_28px_rgba(43,139,156,.4)]">
                    {trans.landing.heroCtaJoin} <ArrowRight size={16} />
                  </Button>
                </a>
                <a href="#services" onClick={e => scrollTo(e, '#services')}>
                  <Button variant="secondary" size="lg" className="!h-12 !px-8 !text-sm !shadow-sm">
                    <ChevronRight size={16} className="opacity-50" />
                    {trans.landing.heroCtaExplore}
                  </Button>
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-400">
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-forest-500" /> {trans.landing.trustHipaa}</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-forest-500" /> {trans.landing.trustRbac}</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={14} className="text-forest-500" /> {trans.landing.trustAes}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="border-t border-ink-100 pt-16 md:pt-24 pb-10 md:pb-14 bg-white mt-[50px]">
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '2,847+', label: trans.landing.statsBeneficiaries, icon: <Users size={22} className="text-brand-500" /> },
              { value: '128', label: trans.landing.statsGroups, icon: <HeartHandshake size={22} className="text-warm-500" /> },
              { value: '34', label: trans.landing.statsCooperatives, icon: <BarChart3 size={22} className="text-forest-500" /> },
              { value: '97%', label: trans.landing.statsEngagement, icon: <Activity size={22} className="text-brand-500" /> },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-ink-200/60 p-8 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-brand-200/50 transition-all duration-300">
                <div className="w-12 h-12 mx-auto rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center mb-4">
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
      <section className="border-y border-ink-100 bg-white/50 mt-[50px]">
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16 py-10 md:py-14">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.12em] text-center mb-8">
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
                    className="flex items-center gap-3 shrink-0 px-6 py-3 rounded-xl bg-white border border-ink-200/60 shadow-sm hover:shadow-md hover:border-brand-200/50 transition-all">
                    {p.logo ? (
                      <img src={p.logo} alt={p.name} className="w-8 h-8 rounded-lg object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-100 to-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 font-bold text-xs">
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
      <section id="about" className="py-20 md:py-32 lg:py-40 mt-[50px]">
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-6">{trans.landing.aboutBadge}</span>
              <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-5 leading-[1.1]">
                {trans.landing.aboutHeading}
              </h2>
              <p className="text-ink-500 text-base lg:text-lg leading-relaxed mb-12">
                {trans.landing.aboutText}
              </p>
              <div className="grid sm:grid-cols-2 gap-5">
                {[
                  { icon: <Target size={18} />, title: trans.landing.missionTitle, desc: trans.landing.missionDesc },
                  { icon: <Shield size={18} />, title: trans.landing.valuesTitle, desc: trans.landing.valuesDesc },
                  { icon: <Users size={18} />, title: trans.landing.approachTitle, desc: trans.landing.approachDesc },
                  { icon: <Activity size={18} />, title: trans.landing.impactTitle, desc: trans.landing.impactDesc },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="rounded-xl border border-ink-200/60 p-5 hover:border-brand-200/50 hover:shadow-md hover:-translate-y-[2px] transition-all duration-300">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 border border-brand-200/60 text-brand-600 flex items-center justify-center mb-3">{item.icon}</div>
                    <h3 className="text-sm font-bold text-ink-900 mb-1.5">{item.title}</h3>
                    <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="relative">
              <div className="relative overflow-hidden rounded-3xl aspect-[4/5] shadow-xl"
                style={{ background: 'linear-gradient(160deg, #1a3f49 0%, #2b8b9c 40%, #48b4c4 100%)' }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,.1)_0%,transparent_50%)]" />
                <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/5 blur-xl" />
                <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                    <HeartHandshake size={40} className="text-white" />
                  </div>
                  <p className="text-xl font-bold text-white">{trans.landing.communityImageLabel}</p>
                  <p className="text-sm text-white/60 mt-2 max-w-[240px] leading-relaxed">
                    {trans.landing.communityImageDesc}
                  </p>
                  <div className="mt-8 flex flex-wrap gap-2.5 justify-center">
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
      <section id="services" className="py-20 md:py-32 lg:py-40 bg-white mt-[50px]">
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16">
          <motion.div {...fadeUp} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-6">{trans.landing.servicesBadge}</span>
            <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-5">
              {trans.landing.servicesHeading}
            </h2>
            <p className="text-ink-500 max-w-[600px] mx-auto text-base leading-relaxed">
              {trans.landing.servicesText}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: <Stethoscope size={24} />, title: trans.landing.serviceScreening, desc: trans.landing.serviceScreeningDesc, gradient: 'from-brand-50 to-white' },
              { icon: <HeartHandshake size={24} />, title: trans.landing.serviceReferral, desc: trans.landing.serviceReferralDesc, gradient: 'from-warm-50 to-white' },
              { icon: <Users size={24} />, title: trans.landing.serviceSociotherapy, desc: trans.landing.serviceSociotherapyDesc, gradient: 'from-brand-50 to-white' },
              { icon: <BarChart3 size={24} />, title: trans.landing.serviceReports, desc: trans.landing.serviceReportsDesc, gradient: 'from-forest-50 to-white' },
              { icon: <Shield size={24} />, title: trans.landing.serviceRbac, desc: trans.landing.serviceRbacDesc, gradient: 'from-warm-50 to-white' },
              { icon: <Sparkles size={24} />, title: trans.landing.serviceEmergency, desc: trans.landing.serviceEmergencyDesc, gradient: 'from-rose-50 to-white' },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.06, duration: 0.4 }}
                className={`bg-gradient-to-br ${f.gradient} rounded-2xl border border-ink-200/60 hover:shadow-xl hover:-translate-y-[3px] hover:border-brand-200/50 transition-all duration-300`}>
                <div className="p-8">
                  <div className="w-12 h-12 rounded-xl bg-white border border-brand-200/60 text-brand-600 flex items-center justify-center mb-5 shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-ink-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ YOUTH + TESTIMONIAL ═══════════════ */}
      <section id="youth" className="py-20 md:py-32 lg:py-40 mt-[50px]">
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-warm-50 border border-warm-200/60 text-warm-700 text-xs font-semibold uppercase tracking-[.08em] mb-6">{trans.landing.youthBadge}</span>
              <h2 className="text-[34px] lg:text-[42px] font-extrabold text-ink-900 tracking-[-.02em] mb-5 leading-[1.1]">
                {trans.landing.youthHeading}<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-warm-600 to-warm-400">{trans.landing.youthHeadingAccent}</span>
              </h2>
              <p className="text-ink-500 text-base lg:text-lg leading-relaxed mb-12">
                {trans.landing.youthText}
              </p>
              <div className="space-y-5">
                {[
                  { icon: <GraduationCap size={18} />, title: trans.landing.youthSchool, desc: trans.landing.youthSchoolDesc },
                  { icon: <HeartHandshake size={18} />, title: trans.landing.youthPeace, desc: trans.landing.youthPeaceDesc },
                  { icon: <Users size={18} />, title: trans.landing.youthClubs, desc: trans.landing.youthClubsDesc },
                  { icon: <Sparkles size={18} />, title: trans.landing.youthLeadership, desc: trans.landing.youthLeadershipDesc },
                ].map((p, i) => (
                  <motion.div key={p.title} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-4 p-5 rounded-xl bg-white border border-ink-200/60 hover:border-warm-200/50 hover:shadow-md hover:-translate-y-[1px] transition-all duration-300">
                    <div className="w-10 h-10 rounded-lg bg-warm-50 border border-warm-200/60 text-warm-600 flex items-center justify-center shrink-0">{p.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-ink-800">{p.title}</p>
                      <p className="text-xs text-ink-500 mt-1">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10">
                <a href="/register"><Button variant="primary" className="!h-11 !px-7">
                  {trans.landing.youthCta} <ArrowRight size={15} />
                </Button></a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative">
              <div className="rounded-3xl p-10 lg:p-12 text-white overflow-hidden relative shadow-xl"
                style={{ background: 'linear-gradient(160deg, #1a3f49 0%, #2b8b9c 40%, #48b4c4 100%)' }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,.08)_0%,transparent_50%)]" />
                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8">
                    <GraduationCap size={30} className="text-white/30" />
                    <span className="text-sm font-semibold text-white/50 uppercase tracking-[.08em]">{trans.landing.youthImpactBadge}</span>
                  </div>
                  <div className="relative">
                    <Quote size={40} className="text-white/20 absolute -top-2 -left-1" />
                    <p className="text-base lg:text-lg leading-relaxed italic relative z-10 pl-6">
                      "The youth club gave me a place to belong. I learned that my story matters, 
                      and that I can be part of building a future where no one suffers in silence."
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-4 pt-6 border-t border-white/20">
                    <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-base backdrop-blur-sm border border-white/10">M</div>
                    <div>
                      <p className="text-base font-bold">Marie, 19</p>
                      <p className="text-xs text-white/60">Youth Club Participant, Gasabo</p>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} className="text-warm-300 fill-warm-300" />)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ COMMUNITY ═══════════════ */}
      <section id="community" className="py-20 md:py-32 lg:py-40 bg-white relative overflow-hidden mt-[50px]">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-200/40 to-transparent" />
        <div className="absolute -top-20 left-1/4 w-80 h-80 rounded-full bg-brand-50/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 rounded-full bg-warm-50/20 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16 relative">
          <motion.div {...fadeUp} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-6">{trans.landing.communityBadge}</span>
            <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-5">
              {trans.landing.communityHeading}
            </h2>
            <p className="text-ink-500 max-w-[640px] mx-auto text-base leading-relaxed">
              {trans.landing.communityText}
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
            {[
              { label: trans.landing.photoLabels[0], gradient: 'from-brand-500 to-brand-800', icon: <HeartHandshake size={26} />, count: '2,847+', pattern: 'bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,.15)_0%,transparent_50%)]' },
              { label: trans.landing.photoLabels[1], gradient: 'from-warm-500 to-warm-800', icon: <Users size={26} />, count: '640+', pattern: 'bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.15)_0%,transparent_50%)]' },
              { label: trans.landing.photoLabels[2], gradient: 'from-forest-500 to-forest-800', icon: <GraduationCap size={26} />, count: '180+', pattern: 'bg-[radial-gradient(circle_at_50%_60%,rgba(255,255,255,.12)_0%,transparent_50%)]' },
              { label: trans.landing.photoLabels[3], gradient: 'from-brand-600 to-brand-900', icon: <HandHeart size={26} />, count: '95+', pattern: 'bg-[radial-gradient(circle_at_40%_30%,rgba(255,255,255,.12)_0%,transparent_50%)]' },
            ].map((p, i) => (
              <motion.div key={p.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer bg-gradient-to-br ${p.gradient} shadow-lg hover:shadow-2xl hover:-translate-y-[5px] transition-all duration-500`}>
                <div className={`absolute inset-0 ${p.pattern} transition-transform duration-700 group-hover:scale-110`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[.04] to-transparent group-hover:opacity-0 transition-opacity duration-500" />
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
                <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-t from-black/30 via-black/10 to-transparent rounded-b-2xl" />
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,.08)_0%,transparent_60%)]" />
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
            {[
              { role: trans.landing.communityChws, count: '640+', desc: trans.landing.communityChwsDesc, icon: <HeartHandshake size={18} /> },
              { role: trans.landing.communityFacilitators, count: '180+', desc: trans.landing.communityFacilitatorsDesc, icon: <Users size={18} /> },
              { role: trans.landing.communityCooperatives, count: '34', desc: trans.landing.communityCooperativesDesc, icon: <BarChart3 size={18} /> },
              { role: trans.landing.communityCounselors, count: '95+', desc: trans.landing.communityCounselorsDesc, icon: <Shield size={18} /> },
            ].map((item, i) => (
              <motion.div key={item.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                className="bg-white rounded-2xl border border-ink-200/60 p-7 text-center hover:border-brand-200/50 hover:shadow-xl hover:-translate-y-[2px] transition-all duration-300 group">
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 mb-4 group-hover:scale-110 group-hover:bg-brand-100 transition-all duration-300">
                  {item.icon}
                </div>
                <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{item.count}</p>
                <p className="text-sm font-bold text-ink-800 mt-2">{item.role}</p>
                <p className="text-xs text-ink-400 mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gradient-to-b from-transparent to-brand-200/40" />
            <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
              {testimonials.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                  className="bg-white rounded-2xl border border-ink-200/60 p-7 hover:shadow-lg hover:-translate-y-[2px] hover:border-brand-200/50 transition-all duration-300 relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-400 via-warm-400 to-forest-400 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Quote size={20} className="text-brand-300 mb-4" />
                  <p className="text-sm text-ink-600 leading-relaxed mb-5 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-ink-100/60">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink-800">{t.name}{t.age ? `, ${t.age}` : ''}</p>
                      <p className="text-[11px] text-ink-400 truncate">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT ═══════════════ */}
      <section id="contact" className="py-20 md:py-32 lg:py-40 mt-[50px]">
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16">
          <motion.div {...fadeUp} className="text-center mb-20">
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-6">{trans.landing.contactBadge}</span>
            <h2 className="text-[34px] lg:text-[44px] font-extrabold text-ink-900 tracking-[-.02em] mb-5">{trans.landing.contactHeading}</h2>
            <p className="text-ink-500 max-w-[540px] mx-auto text-base leading-relaxed">
              {trans.landing.contactText}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            <div className="lg:col-span-3">
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-6">
                  <input type="text" placeholder={trans.landing.contactNamePlaceholder}
                    className="h-12 w-full px-5 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none" />
                  <input type="email" placeholder={trans.landing.contactEmailPlaceholder}
                    className="h-12 w-full px-5 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none" />
                </div>
                <select className="h-12 w-full px-5 rounded-xl text-sm text-ink-500 bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all outline-none appearance-none cursor-pointer">
                  <option value="">{trans.landing.contactTopicPlaceholder}</option>
                  <option>{trans.landing.contactTopicPartnership}</option>
                  <option>{trans.landing.contactTopicSupport}</option>
                  <option>{trans.landing.contactTopicTraining}</option>
                  <option>{trans.landing.contactTopicGeneral}</option>
                </select>
                <textarea placeholder={trans.landing.contactMessagePlaceholder} rows={4}
                  className="w-full px-5 py-3.5 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none resize-none" />
                <Button type="submit" variant="primary" size="lg" className="!h-12 !px-8">
                  <Send size={15} /> {trans.landing.contactSend} <ArrowRight size={15} />
                </Button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-8 lg:pt-0 pt-4">
              {[
                { icon: <MapPin size={18} />, label: trans.landing.contactAddress, value: `${trans.landing.contactAddressValue}\n${trans.landing.contactAddressSub}` },
                { icon: <Phone size={18} />, label: trans.landing.contactPhone, value: `${trans.landing.contactPhoneValue1}\n${trans.landing.contactPhoneValue2}` },
                { icon: <Mail size={18} />, label: trans.landing.contactEmail, value: `${trans.landing.contactEmailValue1}\n${trans.landing.contactEmailValue2}` },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-200/60 text-brand-600 flex items-center justify-center shrink-0">{c.icon}</div>
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
      <section className="relative overflow-hidden py-24 md:py-36 lg:py-44 text-center mt-[50px]"
        style={{ background: 'linear-gradient(160deg, #1a3f49 0%, #2b8b9c 40%, #48b4c4 100%)' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,.08)_0%,transparent_60%)]" />
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-4 h-4 rounded-full bg-white/10 blur-sm" />
        <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-white/10 blur-sm" />
        <div className="mx-auto max-w-7xl px-10 md:px-12 lg:px-16 relative">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-[.08em] border border-white/10 mb-8">
              {trans.landing.ctaHeading.split(' ').slice(0,2).join(' ')}
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-[-.02em] mb-4 leading-[1.1]">
              {trans.landing.ctaHeading}
            </h2>
            <p className="text-white/70 max-w-[540px] mx-auto mb-12 text-base lg:text-lg leading-relaxed">
              {trans.landing.ctaText}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/register">
                <Button variant="primary" size="lg" className="!h-13 !px-9 !text-base !bg-white !text-brand-700 hover:!bg-brand-50 !shadow-[0_4px_20px_rgba(0,0,0,.15)] hover:!shadow-[0_8px_28px_rgba(0,0,0,.2)]">
                  {trans.landing.ctaCreateAccount} <ArrowRight size={17} />
                </Button>
              </a>
              <a href="/login">
                <Button variant="secondary" size="lg" className="!h-13 !px-9 !text-base !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 !backdrop-blur-sm">
                  {trans.landing.ctaSignIn}
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-ink-950 text-ink-400">
        <div className="px-10 md:px-12 lg:px-16 py-16 md:py-20 lg:py-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-14">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <img src="/logo.png" alt="" className="h-8 w-auto brightness-0 invert" />
                <span className="text-base font-bold text-white">HUMURA</span>
              </div>
              <p className="text-sm leading-relaxed text-ink-500 max-w-[280px] mb-6">
                {trans.landing.footerDesc}
              </p>
              <div className="flex items-center gap-3">
                {[Globe, ExternalLink, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-ink-500 hover:text-white">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-[.12em] mb-6">{trans.landing.footerQuickLinks}</p>
              <ul className="space-y-4">
                {[trans.landing.about, trans.landing.services, trans.landing.youth, trans.landing.community, trans.landing.contact].map(l => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} onClick={e => scrollTo(e, `#${l.toLowerCase()}`)}
                      className="text-sm text-ink-500 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-[.12em] mb-6">{trans.landing.footerPrograms}</p>
              <ul className="space-y-4">
                <li><span className="text-sm text-ink-500">{trans.landing.serviceScreening}</span></li>
                <li><span className="text-sm text-ink-500">{trans.landing.serviceReferral}</span></li>
                <li><span className="text-sm text-ink-500">{trans.landing.serviceSociotherapy}</span></li>
                <li><span className="text-sm text-ink-500">{trans.landing.serviceEmergency}</span></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-[.12em] mb-6">{trans.landing.footerPartners}</p>
              <ul className="space-y-4">
                {partners.map(p => (
                  <li key={p.name}><span className="text-sm text-ink-500">{p.name}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-[.12em] mb-6">{trans.landing.footerContact}</p>
              <ul className="space-y-4">
                <li><span className="text-sm text-ink-500">{trans.landing.footerContactAddress}</span></li>
                <li><span className="text-sm text-ink-500">{trans.landing.footerContactPhone}</span></li>
                <li><span className="text-sm text-ink-500">{trans.landing.footerContactEmail}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/5">
          <div className="px-10 md:px-12 lg:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-ink-600">
            <span>{trans.landing.footerCopyright.replace('{year}', String(new Date().getFullYear()))}</span>
            <span>{trans.landing.footerCredit}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

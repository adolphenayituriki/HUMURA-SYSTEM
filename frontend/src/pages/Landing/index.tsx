import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Shield, HeartHandshake, BarChart3, Users, Stethoscope,
  Sparkles, Menu, X, Globe, MapPin, Phone, Mail,
  GraduationCap, Activity, Target, CheckCircle, Quote,
  ExternalLink, HandHeart,
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

  const partners = ['Ministry of Health', 'RBC', 'MINUBUMWE', 'WHO', 'Ibuka'];

  const testimonials = [
    { quote: trans.landing.testimonialQuotes[0], name: trans.landing.testimonialNames[0], age: 19, role: trans.landing.testimonialRoles[0] },
    { quote: trans.landing.testimonialQuotes[1], name: trans.landing.testimonialNames[1], age: null, role: trans.landing.testimonialRoles[1] },
    { quote: trans.landing.testimonialQuotes[2], name: trans.landing.testimonialNames[2], age: 34, role: trans.landing.testimonialRoles[2] },
    { quote: trans.landing.testimonialQuotes[3], name: trans.landing.testimonialNames[3], age: 41, role: trans.landing.testimonialRoles[3] },
  ];

  const PHOTO_CARDS = [
    { label: trans.landing.photoLabels[0], gradient: 'from-brand-400 to-brand-600', icon: <HeartHandshake size={28} />, pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,.08) 0%, transparent 50%)' },
    { label: trans.landing.photoLabels[1], gradient: 'from-warm-400 to-warm-600', icon: <Users size={28} />, pattern: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,.08) 0%, transparent 50%)' },
    { label: trans.landing.photoLabels[2], gradient: 'from-forest-400 to-forest-600', icon: <GraduationCap size={28} />, pattern: 'radial-gradient(circle at 40% 60%, rgba(255,255,255,.08) 0%, transparent 50%)' },
    { label: trans.landing.photoLabels[3], gradient: 'from-brand-500 to-brand-700', icon: <HandHeart size={28} />, pattern: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,.08) 0%, transparent 50%)' },
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
      {/* ══════════════ NAV ══════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,.04)]'
          : 'bg-surface/95'
      }`}>
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20 border-b border-transparent">
            <a href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="HUMURA" className="h-7 md:h-8 w-auto group-hover:scale-105 transition-transform" />
              <span className="text-base md:text-lg font-bold text-ink-900 tracking-tight">HUMURA</span>
            </a>

            <nav className="hidden lg:flex items-center gap-2">
              {navItems.map(item => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={e => scrollTo(e, item.href)}
                  className={`relative h-9 px-3.5 rounded-lg text-sm font-medium transition-all inline-flex items-center ${
                    activeSection === item.href.replace('#', '')
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                  }`}
                >
                  {item.label}
                  {activeSection === item.href.replace('#', '') && (
                    <motion.div layoutId="nav-pill" className="absolute inset-0 rounded-lg bg-brand-50 -z-10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                  )}
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
              className="lg:hidden overflow-hidden border-t border-ink-100/80 bg-surface"
            >
              <div className="px-4 md:px-10 py-4 space-y-1">
                {navItems.map(item => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={e => scrollTo(e, item.href)}
                    className={`block h-10 rounded-lg px-4 text-sm font-medium transition-all flex items-center ${
                      activeSection === item.href.replace('#', '')
                        ? 'text-brand-600 bg-brand-50'
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

      {/* ══════════════ HERO ══════════════ */}
      <section id="hero" className="relative">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16 pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-200/60 text-brand-600 text-xs font-semibold uppercase tracking-[.08em] mb-6">
                <Sparkles size={12} />
                {trans.landing.heroBadge}
              </div>
              <h1 className="text-[32px] sm:text-[40px] lg:text-[60px] font-extrabold text-ink-900 leading-[1.08] tracking-[-.03em] mb-6">
                {trans.landing.heroHeading1}
                <br />
                <span className="text-brand-500">{trans.landing.heroHeading2}</span>
              </h1>
              <p className="text-base lg:text-lg text-ink-500 leading-relaxed max-w-[600px] mx-auto mb-10">
                {trans.landing.heroText}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a href="/register"><Button variant="primary" size="lg">{trans.landing.heroCtaJoin} <ArrowRight size={15} /></Button></a>
                <a href="#services" onClick={e => scrollTo(e, '#services')}>
                  <Button variant="secondary" size="lg">{trans.landing.heroCtaExplore}</Button>
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-5 text-xs text-ink-400">
                <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-forest-500" /> {trans.landing.trustHipaa}</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-forest-500" /> {trans.landing.trustRbac}</span>
                <span className="flex items-center gap-1.5"><CheckCircle size={13} className="text-forest-500" /> {trans.landing.trustAes}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section className="border-t border-ink-100 py-14 md:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '2,847+', label: trans.landing.statsBeneficiaries },
              { value: '128', label: trans.landing.statsGroups },
              { value: '34', label: trans.landing.statsCooperatives },
              { value: '97%', label: trans.landing.statsEngagement },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-ink-200/70 p-7 text-center shadow-[0_2px_8px_rgba(0,0,0,.02)] hover:border-brand-200/60 hover:shadow-[0_8px_24px_rgba(0,0,0,.06)] transition-all">
                <p className="text-3xl font-extrabold text-ink-900">{s.value}</p>
                <p className="text-sm text-ink-500 mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs">
            <span className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.08em]">{trans.landing.partnershipLabel}</span>
            {partners.map(p => (
              <span key={p} className="text-sm font-bold text-ink-500">{p}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════ ABOUT ══════════════ */}
      <section id="about" className="py-14 md:py-24 lg:py-32 border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Text side */}
            <div className="lg:col-span-3">
              <motion.div {...fadeUp}>
                <span className="inline-block px-3 py-1 rounded-full border border-brand-200/60 text-brand-600 text-xs font-semibold uppercase tracking-[.08em] mb-5">{trans.landing.aboutBadge}</span>
                <h2 className="text-[32px] lg:text-[42px] font-extrabold text-ink-900 tracking-[-.02em] mb-4">
                  {trans.landing.aboutHeading}
                </h2>
                <p className="text-ink-500 text-base lg:text-lg leading-relaxed max-w-[650px] mb-10">
                  {trans.landing.aboutText}
                </p>
              </motion.div>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: <Target size={20} />, title: trans.landing.missionTitle, desc: trans.landing.missionDesc },
                  { icon: <Shield size={20} />, title: trans.landing.valuesTitle, desc: trans.landing.valuesDesc },
                  { icon: <Users size={20} />, title: trans.landing.approachTitle, desc: trans.landing.approachDesc },
                  { icon: <Activity size={20} />, title: trans.landing.impactTitle, desc: trans.landing.impactDesc },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                    className="rounded-2xl border border-ink-200/70 p-6 hover:border-brand-200/60 hover:shadow-[0_8px_24px_rgba(0,0,0,.06)] transition-all">
                    <div className="w-10 h-10 rounded-xl border border-brand-200/60 text-brand-500 flex items-center justify-center mb-3">{item.icon}</div>
                    <h3 className="text-sm font-bold text-ink-900 mb-1">{item.title}</h3>
                    <p className="text-xs text-ink-500 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
            {/* Image side */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="lg:col-span-2 relative">
              <div className="relative overflow-hidden rounded-2xl border border-ink-200/60 aspect-[4/5]"
                style={{ background: 'linear-gradient(160deg, #1a3a44 0%, #2f778d 40%, #3a8ba3 100%)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
                    <HeartHandshake size={36} className="text-brand-200" />
                  </div>
                  <p className="text-lg font-bold text-white">{trans.landing.communityImageLabel}</p>
                  <p className="text-sm text-brand-200/70 mt-1.5 max-w-[220px] leading-relaxed">
                    {trans.landing.communityImageDesc}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {trans.landing.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full text-[11px] font-medium text-brand-100 bg-white/10 border border-white/10">
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

      {/* ══════════════ SERVICES ══════════════ */}
      <section id="services" className="py-14 md:py-24 lg:py-32 border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full border border-brand-200/60 text-brand-600 text-xs font-semibold uppercase tracking-[.08em] mb-5">{trans.landing.servicesBadge}</span>
            <h2 className="text-[32px] lg:text-[42px] font-extrabold text-ink-900 tracking-[-.02em] mb-4">
              {trans.landing.servicesHeading}
            </h2>
            <p className="text-ink-500 max-w-[560px] mx-auto text-base">
              {trans.landing.servicesText}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { icon: <Stethoscope size={22} />, title: trans.landing.serviceScreening, desc: trans.landing.serviceScreeningDesc },
              { icon: <HeartHandshake size={22} />, title: trans.landing.serviceReferral, desc: trans.landing.serviceReferralDesc },
              { icon: <Users size={22} />, title: trans.landing.serviceSociotherapy, desc: trans.landing.serviceSociotherapyDesc },
              { icon: <BarChart3 size={22} />, title: trans.landing.serviceReports, desc: trans.landing.serviceReportsDesc },
              { icon: <Shield size={22} />, title: trans.landing.serviceRbac, desc: trans.landing.serviceRbacDesc },
              { icon: <Sparkles size={22} />, title: trans.landing.serviceEmergency, desc: trans.landing.serviceEmergencyDesc },
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: i * 0.06, duration: 0.4 }}
                className="bg-white rounded-2xl border border-ink-200/70 hover:shadow-[0_12px_32px_rgba(0,0,0,.08)] hover:border-brand-200/60 transition-all">
                <div className="p-7">
                  <div className="w-11 h-11 rounded-xl border border-brand-200/60 text-brand-500 flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-bold text-ink-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ YOUTH ══════════════ */}
      <section id="youth" className="py-14 md:py-24 lg:py-32 border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block px-3 py-1 rounded-full border border-warm-200/60 text-warm-600 text-xs font-semibold uppercase tracking-[.08em] mb-5">{trans.landing.youthBadge}</span>
              <h2 className="text-[32px] lg:text-[40px] font-extrabold text-ink-900 tracking-[-.02em] mb-4 leading-[1.1]">
                {trans.landing.youthHeading}<br />
                <span className="text-brand-500">{trans.landing.youthHeadingAccent}</span>
              </h2>
              <p className="text-ink-500 text-base lg:text-lg leading-relaxed mb-10">
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
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-ink-50/50 transition-colors">
                    <div className="w-9 h-9 rounded-lg border border-brand-200/60 text-brand-500 flex items-center justify-center shrink-0">{p.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-ink-800">{p.title}</p>
                      <p className="text-xs text-ink-500">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10">
                <a href="/register"><Button variant="primary">{trans.landing.youthCta} <ArrowRight size={14} /></Button></a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="rounded-2xl p-8 lg:p-10 text-white"
              style={{ background: 'linear-gradient(160deg, #1a3a44 0%, #2f778d 40%, #3a8ba3 100%)' }}>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap size={28} className="text-white/30" />
                <span className="text-sm font-semibold text-white/50 uppercase tracking-[.08em]">{trans.landing.youthImpactBadge}</span>
              </div>
              <p className="text-base lg:text-lg leading-relaxed italic">
                "The youth club gave me a place to belong. I learned that my story matters, 
                and that I can be part of building a future where no one suffers in silence."
              </p>
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/20">
                <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-bold text-sm">M</div>
                <div>
                  <p className="text-sm font-bold">Marie, 19</p>
                  <p className="text-xs text-white/60">Youth Club Participant, Gasabo</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════ COMMUNITY ══════════════ */}
      <section id="community" className="py-14 md:py-24 lg:py-32 border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full border border-brand-200/60 text-brand-600 text-xs font-semibold uppercase tracking-[.08em] mb-5">{trans.landing.communityBadge}</span>
            <h2 className="text-[32px] lg:text-[42px] font-extrabold text-ink-900 tracking-[-.02em] mb-4">
              {trans.landing.communityHeading}
            </h2>
            <p className="text-ink-500 max-w-[600px] mx-auto text-base">
              {trans.landing.communityText}
            </p>
          </motion.div>

          {/* Photo grid */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 mb-14">
            {PHOTO_CARDS.map(p => (
              <div key={p.label}
                className="relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${p.gradient.replace('from-', '').replace('to-', '').split(' ').join(', ')})` }}>
                <div className="absolute inset-0" style={{ background: p.pattern }} />
                <div className="absolute inset-0 bg-gradient-to-br from-white/[.04] to-transparent group-hover:opacity-0 transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-white group-hover:bg-white/25 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                    {p.icon}
                  </div>
                  <p className="text-xs md:text-sm font-bold text-white text-center leading-tight mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    {p.label}
                  </p>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 rounded-2xl transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-14">
            {[
              { role: trans.landing.communityChws, count: '640+', desc: trans.landing.communityChwsDesc },
              { role: trans.landing.communityFacilitators, count: '180+', desc: trans.landing.communityFacilitatorsDesc },
              { role: trans.landing.communityCooperatives, count: '34', desc: trans.landing.communityCooperativesDesc },
              { role: trans.landing.communityCounselors, count: '95+', desc: trans.landing.communityCounselorsDesc },
            ].map((item, i) => (
              <motion.div key={item.role} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                className="bg-white rounded-2xl border border-ink-200/70 p-7 text-center hover:border-brand-200/60 hover:shadow-[0_8px_24px_rgba(0,0,0,.06)] transition-all">
                <p className="text-3xl font-extrabold text-brand-500">{item.count}</p>
                <p className="text-sm font-bold text-ink-800 mt-1">{item.role}</p>
                <p className="text-xs text-ink-400 mt-1 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Testimonials Grid */}
          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.35 }}
                className="bg-white rounded-2xl border border-ink-200/70 p-6 hover:shadow-[0_8px_24px_rgba(0,0,0,.06)] transition-all">
                <Quote size={18} className="text-brand-300 mb-3" />
                <p className="text-sm text-ink-600 leading-relaxed mb-4 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-3 border-t border-ink-100/60">
                  <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center text-brand-600 font-bold text-xs shrink-0">
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
      </section>

      {/* ══════════════ CONTACT ══════════════ */}
      <section id="contact" className="py-14 md:py-24 lg:py-32 border-t border-ink-100">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <motion.div {...fadeUp} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full border border-brand-200/60 text-brand-600 text-xs font-semibold uppercase tracking-[.08em] mb-5">{trans.landing.contactBadge}</span>
            <h2 className="text-[32px] lg:text-[42px] font-extrabold text-ink-900 tracking-[-.02em] mb-4">{trans.landing.contactHeading}</h2>
            <p className="text-ink-500 max-w-[500px] mx-auto text-base">
              {trans.landing.contactText}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            <div className="lg:col-span-3">
              <form className="space-y-5" onSubmit={e => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-5">
                  <input type="text" placeholder={trans.landing.contactNamePlaceholder}
                    className="h-12 w-full px-4 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none" />
                  <input type="email" placeholder={trans.landing.contactEmailPlaceholder}
                    className="h-12 w-full px-4 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none" />
                </div>
                <select className="h-12 w-full px-4 rounded-xl text-sm text-ink-500 bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all outline-none appearance-none cursor-pointer">
                  <option value="">{trans.landing.contactTopicPlaceholder}</option>
                  <option>{trans.landing.contactTopicPartnership}</option>
                  <option>{trans.landing.contactTopicSupport}</option>
                  <option>{trans.landing.contactTopicTraining}</option>
                  <option>{trans.landing.contactTopicGeneral}</option>
                </select>
                <textarea placeholder={trans.landing.contactMessagePlaceholder} rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 transition-all placeholder:text-ink-300 outline-none resize-none" />
                <Button type="submit" variant="primary" size="lg">
                  {trans.landing.contactSend} <ArrowRight size={14} />
                </Button>
              </form>
            </div>
            <div className="lg:col-span-2 space-y-6 lg:pt-0 pt-4">
              {[
                { icon: <MapPin size={18} />, label: trans.landing.contactAddress, value: `${trans.landing.contactAddressValue}\n${trans.landing.contactAddressSub}` },
                { icon: <Phone size={18} />, label: trans.landing.contactPhone, value: `${trans.landing.contactPhoneValue1}\n${trans.landing.contactPhoneValue2}` },
                { icon: <Mail size={18} />, label: trans.landing.contactEmail, value: `${trans.landing.contactEmailValue1}\n${trans.landing.contactEmailValue2}` },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl border border-brand-200/60 text-brand-500 flex items-center justify-center shrink-0">{c.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-ink-400 uppercase tracking-[.06em]">{c.label}</p>
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

      {/* ══════════════ CTA ══════════════ */}
      <section className="py-14 md:py-24 lg:py-32 border-t border-ink-100 text-center">
        <div className="mx-auto max-w-7xl px-5 md:px-12 lg:px-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-ink-900 tracking-[-.02em] mb-3">
              {trans.landing.ctaHeading}
            </h2>
            <p className="text-ink-500 max-w-[500px] mx-auto mb-10 text-sm lg:text-base">
              {trans.landing.ctaText}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/register"><Button variant="primary" size="lg">{trans.landing.ctaCreateAccount} <ArrowRight size={16} /></Button></a>
              <a href="/login"><Button variant="secondary" size="lg">{trans.landing.ctaSignIn}</Button></a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="bg-brand-900 text-brand-200/70">
        <div className="px-4 md:px-10 py-12 md:py-16 lg:py-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <img src="/logo.png" alt="" className="h-8 w-auto brightness-0 invert" />
                <span className="text-base font-bold text-white">{trans.landing.footerBrand}</span>
              </div>
              <p className="text-sm leading-relaxed text-brand-300/70 max-w-[260px] mb-5">
                {trans.landing.footerDesc}
              </p>
              <div className="flex items-center gap-3">
                {[Globe, ExternalLink, Mail].map((Icon, i) => (
                  <a key={i} href="#" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-brand-300/50 hover:text-brand-200">
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-[.12em] mb-5">{trans.landing.footerQuickLinks}</p>
              <ul className="space-y-3">
                {[trans.landing.about, trans.landing.services, trans.landing.youth, trans.landing.community, trans.landing.contact].map(l => (
                  <li key={l}>
                    <a href={`#${l.toLowerCase()}`} onClick={e => scrollTo(e, `#${l.toLowerCase()}`)}
                      className="text-sm text-brand-300/70 hover:text-white transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-[.12em] mb-5">{trans.landing.footerPrograms}</p>
              <ul className="space-y-3">
                <li><span className="text-sm text-brand-300/70">{trans.landing.serviceScreening}</span></li>
                <li><span className="text-sm text-brand-300/70">{trans.landing.serviceReferral}</span></li>
                <li><span className="text-sm text-brand-300/70">{trans.landing.serviceSociotherapy}</span></li>
                <li><span className="text-sm text-brand-300/70">{trans.landing.serviceEmergency}</span></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-[.12em] mb-5">{trans.landing.footerPartners}</p>
              <ul className="space-y-3">
                {partners.map(p => (
                  <li key={p}><span className="text-sm text-brand-300/70">{p}</span></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold text-white/80 uppercase tracking-[.12em] mb-5">{trans.landing.footerContact}</p>
              <ul className="space-y-3">
                <li><span className="text-sm text-brand-300/70">{trans.landing.footerContactAddress}</span></li>
                <li><span className="text-sm text-brand-300/70">{trans.landing.footerContactPhone}</span></li>
                <li><span className="text-sm text-brand-300/70">{trans.landing.footerContactEmail}</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="px-4 md:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-300/50">
            <span>{trans.landing.footerCopyright.replace('{year}', String(new Date().getFullYear()))}</span>
            <span>{trans.landing.footerCredit}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

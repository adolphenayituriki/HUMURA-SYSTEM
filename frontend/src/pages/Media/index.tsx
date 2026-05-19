import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper, faVideo, faMicrophone, faImage, faArrowLeft, faSearch,
  faCalendarDays, faClock, faPlay, faHeadphones, faEye,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

const categories = [
  { key: 'all', label: 'All' },
  { key: 'news', label: 'News', icon: faNewspaper },
  { key: 'videos', label: 'Videos', icon: faVideo },
  { key: 'audios', label: 'Audios', icon: faMicrophone },
  { key: 'images', label: 'Images', icon: faImage },
];

const mediaItems = [
  { type: 'news', title: 'HUMURA Expands Mental Health Services to Three New Districts', date: 'May 15, 2026', readTime: '4 min read', image: '/healing community.png' },
  { type: 'news', title: 'Community Health Workers Complete Advanced Trauma Screening Training', date: 'May 8, 2026', readTime: '3 min read', image: '/light to commemorate.jpg' },
  { type: 'news', title: 'Annual Report Shows 40% Increase in Beneficiary Recovery Rates', date: 'April 28, 2026', readTime: '5 min read', image: '/Rwanda development.jpg' },
  { type: 'videos', title: 'Healing in Community — A Documentary', date: 'May 10, 2026', duration: '24:15', image: '/healing community.png' },
  { type: 'videos', title: 'Understanding the Six-Phase Sociotherapy Model', date: 'April 22, 2026', duration: '15:30', image: '/light to commemorate.jpg' },
  { type: 'videos', title: 'Youth Leaders Share Their Recovery Stories', date: 'April 5, 2026', duration: '18:45', image: '/Rwanda development.jpg' },
  { type: 'audios', title: 'Trauma Recovery Podcast: Episode 12 — Finding Strength', date: 'May 12, 2026', duration: '32:10', image: '/healing community.png' },
  { type: 'audios', title: 'Guided Breathing Exercise for Anxiety Relief', date: 'May 1, 2026', duration: '10:00', image: '/light to commemorate.jpg' },
  { type: 'audios', title: 'Community Elder Shares Wisdom on Healing', date: 'April 18, 2026', duration: '28:35', image: '/Rwanda development.jpg' },
  { type: 'images', title: 'Group Healing Session — Gasabo District', date: 'May 14, 2026', count: '12 photos', image: '/healing community.png' },
  { type: 'images', title: 'Youth Leadership Forum — Kigali', date: 'May 6, 2026', count: '8 photos', image: '/light to commemorate.jpg' },
  { type: 'images', title: 'Cooperative Meeting — Rubavu District', date: 'April 25, 2026', count: '15 photos', image: '/Rwanda development.jpg' },
];

export default function Media() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const filteredItems = (activeCategory === 'all' ? mediaItems : mediaItems.filter(item => item.type === activeCategory))
    .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-surface font-sans text-ink-700 antialiased">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl shadow-[0_1px_0_rgba(0,0,0,.04)]">
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/" className="flex items-center gap-3 group">
              <FontAwesomeIcon icon={faArrowLeft} className="text-[14px] text-ink-400 group-hover:text-brand-600 transition-colors" />
              <img src="/logo.png" alt="HUMURA" className="h-8 md:h-9 w-auto group-hover:scale-105 transition-transform duration-300" />
              <span className="text-lg md:text-xl font-bold text-ink-900 tracking-tight">HUMURA</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden py-20 lg:py-24">
        <div className="absolute inset-0">
          <img src="/bg svg.avif" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/60 via-white/50 to-ink-50/30" />
        </div>
        <div className="container relative">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-semibold uppercase tracking-[.08em] mb-6 shadow-sm">
              <FontAwesomeIcon icon={faNewspaper} className="text-[12px]" />
              Media Center
            </span>
            <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] font-extrabold text-ink-900 tracking-[-.03em] leading-[1.1] mb-4">
              News, Stories & Resources
            </h1>
            <p className="text-base lg:text-lg text-ink-500 leading-[1.8] max-w-[640px]">
              Stay connected with the latest updates, healing stories, documentaries, and educational resources from the HUMURA community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── CATEGORY TABS ─── */}
      <section className="sticky top-16 md:top-20 z-40 bg-white border-b border-ink-100">
        <div className="container">
          <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {categories.map(cat => (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-bold uppercase tracking-[.08em] whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'text-brand-700 bg-brand-50'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50'
                }`}>
                {cat.icon && <FontAwesomeIcon icon={cat.icon} className="text-[11px]" />}
                {cat.label}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <div className="w-px h-6 bg-ink-200/60" />
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search media..."
                    className="h-9 w-44 px-3 rounded-lg text-xs bg-ink-50 border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 outline-none transition-all placeholder:text-ink-300"
                    autoFocus />
                  <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">
                    Clear
                  </button>
                </div>
              ) : (
                <button onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 h-9 px-4 rounded-lg text-xs font-medium text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">
                  <FontAwesomeIcon icon={faSearch} className="text-[12px]" />
                  Search
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MEDIA GRID ─── */}
      <section className="py-16 lg:py-20">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, i) => (
              <motion.div key={i} {...fadeUp} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.05 }}
                className="group bg-white rounded-2xl border border-ink-100/60 overflow-hidden hover:shadow-lg hover:border-ink-200/60 transition-all duration-300 cursor-pointer">
                <div className="relative aspect-[16/9] overflow-hidden bg-ink-100">
                  <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {(item.type === 'videos' || item.type === 'audios') && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
                        <FontAwesomeIcon icon={item.type === 'videos' ? faPlay : faHeadphones} className="text-[16px] text-brand-700 ml-0.5" />
                      </div>
                    </div>
                  )}
                  {item.type === 'images' && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[10px] font-semibold uppercase tracking-[.06em] backdrop-blur-sm">
                      {item.count}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.08em] text-brand-600">
                      <FontAwesomeIcon icon={
                        item.type === 'news' ? faNewspaper : item.type === 'videos' ? faVideo : item.type === 'audios' ? faMicrophone : faImage
                      } className="text-[10px]" />
                      {item.type}
                    </span>
                    {item.duration && (
                      <span className="flex items-center gap-1 text-[10px] text-ink-400">
                        <FontAwesomeIcon icon={faClock} className="text-[9px]" />
                        {item.duration}
                      </span>
                    )}
                    {item.readTime && (
                      <span className="flex items-center gap-1 text-[10px] text-ink-400">
                        <FontAwesomeIcon icon={faEye} className="text-[9px]" />
                        {item.readTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-ink-900 leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 transition-colors">
                    {item.title}
                  </h3>
                  <span className="flex items-center gap-1.5 text-[11px] text-ink-400">
                    <FontAwesomeIcon icon={faCalendarDays} className="text-[10px]" />
                    {item.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-ink-950 text-ink-400">
        <div className="container py-12 sm:py-16 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-white transition-colors">
            <FontAwesomeIcon icon={faArrowLeft} className="text-[12px]" />
            Back to Home
          </a>
        </div>
      </footer>
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faMessage, faRobot, faHeadset, faXmark, faChevronRight, faClock } from '@fortawesome/free-solid-svg-icons';
import { useI18nStore } from '../../i18n';

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  avatar: string;
  role: string;
}

const mockConversations: Conversation[] = [
  { id: '1', name: 'Muhire Claude', lastMessage: 'Muraho, nifuza ubufasha kubyerekeye ibizamini bya PHQ-9 njye nakoze kera', timestamp: '2m ago', unread: 2, online: true, avatar: '/adolphe profile.jpg', role: 'CHW' },
  { id: '2', name: 'Dr. Eric Ndayisenga', lastMessage: 'The referral for patient B-0042 has been reviewed and accepted at Musanze Hospital', timestamp: '15m ago', unread: 0, online: true, avatar: '/adolphe profile.jpg', role: 'District Hospital' },
  { id: '3', name: 'Ineza Jeannette', lastMessage: 'Groupe ya sociotherapy iri gukora neza, twageze mu cyiciro cya Trust', timestamp: '1h ago', unread: 1, online: false, avatar: '/adolphe profile.jpg', role: 'Facilitator' },
  { id: '4', name: 'Support Team', lastMessage: 'Your request for youth program enrollment has been processed.', timestamp: '3h ago', unread: 0, online: true, avatar: '/adolphe profile.jpg', role: 'Support' },
  { id: '5', name: 'Mukamana Angelique', lastMessage: 'Kooperative yacu yabonye inkunga nshya yo gukora agacuruzi', timestamp: 'Yesterday', unread: 0, online: false, avatar: '/adolphe profile.jpg', role: 'Cooperative Leader' },
];

const faqItems = [
  { q: 'How do I complete a trauma screening?', a: 'Navigate to Trauma Screening in the sidebar, fill in the beneficiary details, then complete the PHQ-9, GAD-7, and PCL-5 assessments step by step.' },
  { q: 'How do I create a referral?', a: 'From the Screening page, submit an assessment. High-risk cases automatically generate referrals. You can also create manual referrals from the Referrals page.' },
  { q: 'How does the youth program work?', a: 'Youth aged 16-25 can enroll in programs like School Counseling, Peace Education, and Leadership Training through the Youth Programs page.' },
  { q: 'How do I join a sociotherapy group?', a: 'Contact a Sociotherapy Facilitator in your district or ask your CHW to refer you to the nearest active healing circle.' },
  { q: 'How do I reset my password?', a: 'Click "Forgot Password" on the login screen and enter your registered email to receive a reset link.' },
  { q: 'What should I do in an emergency?', a: 'Call emergency services immediately. You can also trigger an Emergency Alert from the platform for coordinated response.' },
];

const supportChannels = [
  { name: 'Emergency Hotline', desc: '24/7 crisis support', contact: '+250 788 123 456', icon: faHeadset, urgent: true },
  { name: 'HUMURA Support', desc: 'Platform assistance', contact: 'support@humura.rw', icon: faMessage, urgent: false },
  { name: 'CHW Helpline', desc: 'Community Health Worker', contact: '*811#', icon: faHeadset, urgent: false },
  { name: 'Youth Counselor', desc: 'Youth-specific support', contact: 'youth@humura.rw', icon: faRobot, urgent: false },
];

export default function ChatWidget() {
  const { t } = useI18nStore();
  const trans = t();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'chat' | 'faq' | 'support'>('chat');
  const [search, setSearch] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filteredConvs = mockConversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  const filteredFaq = faqItems.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-6 z-[150] flex flex-col items-end gap-3" ref={chatRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-[360px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-140px)] bg-white rounded-2xl shadow-[0_12px_48px_rgba(0,0,0,.12)] border border-ink-200/60 flex flex-col overflow-hidden"
          >
            <div className="shrink-0 px-5 py-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <FontAwesomeIcon icon={faComments} className="text-[14px]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight">HUMURA Chat</p>
                  <p className="text-[10px] text-white/70 leading-tight mt-0.5">Online — Typically replies instantly</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0 cursor-pointer">
                <FontAwesomeIcon icon={faXmark} className="text-[15px]" />
              </button>
            </div>

            <div className="shrink-0 px-4 py-3 border-b border-ink-100/60">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations, FAQs..."
                className="w-full h-9 px-3 rounded-xl border border-ink-200 bg-ink-50/50 text-xs text-ink-800 placeholder-ink-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin overscroll-contain">
              {tab === 'chat' && (
                <div className="divide-y divide-ink-100/60">
                  {filteredConvs.length === 0 ? (
                    <p className="text-xs text-ink-400 text-center py-8">{trans.common.noData}</p>
                  ) : filteredConvs.map(c => (
                    <button key={c.id} className="w-full flex items-start gap-3 px-5 py-3.5 hover:bg-ink-50/70 transition-colors text-left cursor-pointer group">
                      <div className="relative shrink-0">
                        <img src={c.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-ink-800 truncate">{c.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <FontAwesomeIcon icon={faClock} className="text-[9px] text-ink-300" />
                            <span className="text-[10px] text-ink-400">{c.timestamp}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-ink-500 mt-0.5 truncate">{c.lastMessage}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-ink-300 font-medium">{c.role}</span>
                          {c.unread > 0 && (
                            <span className="ml-auto w-4 h-4 rounded-full bg-brand-500 text-white text-[8px] font-bold flex items-center justify-center">{c.unread}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {tab === 'faq' && (
                <div className="divide-y divide-ink-100/60">
                  {filteredFaq.length === 0 ? (
                    <p className="text-xs text-ink-400 text-center py-8">{trans.common.noData}</p>
                  ) : filteredFaq.map((f, i) => (
                    <details key={i} className="group">
                      <summary className="flex items-center gap-3 px-5 py-3.5 hover:bg-ink-50/70 transition-colors cursor-pointer list-none">
                        <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-ink-300 shrink-0 transition-transform group-open:rotate-90" />
                        <span className="text-xs font-medium text-ink-700">{f.q}</span>
                      </summary>
                      <div className="px-5 pb-3.5 pl-[38px]">
                        <p className="text-[11px] text-ink-500 leading-relaxed">{f.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              )}

              {tab === 'support' && (
                <div className="p-4 space-y-3">
                  {supportChannels.map((ch, i) => (
                    <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${ch.urgent ? 'border-rose-200/60 bg-rose-50/30' : 'border-ink-200/60 bg-ink-50/20'}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${ch.urgent ? 'bg-rose-100 text-rose-600' : 'bg-brand-50 text-brand-600'}`}>
                        <FontAwesomeIcon icon={ch.icon} className="text-[15px]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-ink-800">{ch.name}</p>
                        <p className="text-[10px] text-ink-400 mt-0.5">{ch.desc}</p>
                        <p className="text-xs font-semibold text-brand-600 mt-1.5">{ch.contact}</p>
                      </div>
                      {ch.urgent && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[8px] font-bold uppercase tracking-wide">24/7</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="shrink-0 flex border-t border-ink-100/60 bg-white">
              {[
                { k: 'chat' as const, icon: faMessage, label: 'Live Chat' },
                { k: 'faq' as const, icon: faRobot, label: 'FAQ' },
                { k: 'support' as const, icon: faHeadset, label: 'Support' },
              ].map(t => (
                <button key={t.k} onClick={() => { setTab(t.k); setSearch(''); }}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-semibold transition-colors cursor-pointer ${tab === t.k ? 'text-brand-600' : 'text-ink-400 hover:text-ink-600'}`}>
                  <FontAwesomeIcon icon={t.icon} className="text-[16px]" />
                  {t.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-pointer shrink-0">
        <FontAwesomeIcon icon={faComments} className="text-[22px]" />
      </button>
    </div>
  );
}
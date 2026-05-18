import { useEffect, useState, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Stethoscope, HeartHandshake,
  Wallet, AlertTriangle, BarChart3, Settings, LogOut,
  ChevronLeft, UserCircle, Search,
  Bell, ChevronDown, Menu, X, Check,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';
import { useNotificationStore } from '../../store/notificationStore';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import { useI18nStore } from '../../i18n';
import clsx from 'clsx';
import type { UserRole } from '../../types';

const DENY: Record<UserRole, string[]> = {
  admin:                  [],
  district_hospital:      ['cooperatives'],
  health_center:          ['cooperatives', 'emergencies'],
  chw:                    ['cooperatives', 'emergencies', 'reports'],
  sociotherapy_facilitator:['cooperatives', 'emergencies'],
  cooperative_leader:     ['referrals', 'emergencies', 'reports'],
  youth_counselor:        ['cooperatives', 'emergencies', 'referrals'],
  emergency_responder:    ['cooperatives', 'reports', 'cooperatives'],
  community_member:       ['cooperatives', 'emergencies', 'reports', 'youth', 'admin', 'referrals'],
};

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'National Administrator', district_hospital: 'District Hospital',
  health_center: 'Health Center', chw: 'Community Health Worker',
  sociotherapy_facilitator: 'Sociotherapy Facilitator',
  cooperative_leader: 'Cooperative Leader', youth_counselor: 'Youth Counselor',
  emergency_responder: 'Emergency Responder', community_member: 'Community Member',
};

const NAV_ICONS: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard size={18} strokeWidth={1.75}/>,
  beneficiaries: <Users size={18} strokeWidth={1.75}/>,
  screening: <Stethoscope size={18} strokeWidth={1.75}/>,
  referrals: <HeartHandshake size={18} strokeWidth={1.75}/>,
  sociotherapy: <Users size={18} strokeWidth={1.75}/>,
  cooperatives: <Wallet size={18} strokeWidth={1.75}/>,
  emergencies: <AlertTriangle size={18} strokeWidth={1.75}/>,
  youth: <UserCircle size={18} strokeWidth={1.75}/>,
  reports: <BarChart3 size={18} strokeWidth={1.75}/>,
  admin: <Settings size={18} strokeWidth={1.75}/>,
};

export default function DashboardLayout() {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useSidebarStore();
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18nStore();
  const trans = t();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia('(max-width: 767px)').matches
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navTrans = trans.nav;

  const NAV: Array<{ to: string; label: string; icon: React.ReactNode; key: string }> = [
    { to: '/dashboard',    label: navTrans.dashboard,      icon: NAV_ICONS.dashboard,     key: 'dashboard'      },
    { to: '/beneficiaries',label: navTrans.beneficiaries,   icon: NAV_ICONS.beneficiaries, key: 'beneficiaries'  },
    { to: '/screening',    label: navTrans.screening,       icon: NAV_ICONS.screening,     key: 'screening'      },
    { to: '/referrals',    label: navTrans.referrals,       icon: NAV_ICONS.referrals,     key: 'referrals'      },
    { to: '/sociotherapy', label: navTrans.sociotherapy,    icon: NAV_ICONS.sociotherapy,  key: 'sociotherapy'   },
    { to: '/cooperatives', label: navTrans.cooperatives,    icon: NAV_ICONS.cooperatives,  key: 'cooperatives'   },
    { to: '/emergencies',  label: navTrans.emergencies,     icon: NAV_ICONS.emergencies,   key: 'emergencies'    },
    { to: '/youth',        label: navTrans.youth,            icon: NAV_ICONS.youth,         key: 'youth'          },
    { to: '/reports',      label: navTrans.reports,         icon: NAV_ICONS.reports,       key: 'reports'        },
    { to: '/admin',        label: navTrans.admin,           icon: NAV_ICONS.admin,         key: 'admin'          },
  ];

  const denied = new Set(user ? DENY[user.role] ?? [] : []);
  const items   = NAV.filter(n => !denied.has(n.key));

  const initials = user?.fullName
    ?.split(' ').map(w => w[0]).slice(0, 2).join('') ?? '??';

  const currentPage = navTrans[location.pathname.split('/')[1] as keyof typeof navTrans] ?? navTrans.dashboard;

  const sidebarExpanded = sidebarOpen && !isMobile;

  const notifTypeColor = (type: string) => {
    switch (type) {
      case 'alert': return 'bg-rose-500';
      case 'referral': return 'bg-brand-500';
      case 'screening': return 'bg-warm-500';
      default: return 'bg-ink-400';
    }
  };

  return (
    <div className="min-h-screen flex bg-ink-50/30">
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40"
          />
        )}
      </AnimatePresence>

      {/* ════ SIDEBAR ════ */}
      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (mobileOpen ? 280 : 0) : (sidebarOpen ? 256 : 68),
        }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className={clsx(
          'flex flex-col shrink-0 h-screen sticky top-0 z-50 bg-[#121212] overflow-hidden',
          isMobile && !mobileOpen && 'border-0 min-w-0',
          isMobile && mobileOpen && 'shadow-2xl',
        )}
      >
        {/* Logo header */}
        <div className={clsx(
          'h-16 flex items-center border-b border-white/[.06] shrink-0',
          sidebarExpanded ? 'gap-2.5 px-5 justify-between' : 'px-0 justify-center',
        )}>
          {sidebarExpanded ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <img src="/logo.png" alt="HUMURA" className="h-7 w-auto brightness-0 invert shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold tracking-wide leading-none">HUMURA</p>
                  <p className="text-white/20 text-[9px] font-medium leading-none mt-0.5 tracking-[.12em] uppercase">{trans.layout.traumaRecovery}</p>
                </div>
              </div>
              <button onClick={() => { if (isMobile) setMobileOpen(false); else toggleSidebar(); }}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[.06] transition-all shrink-0">
                <ChevronLeft size={13} />
              </button>
            </>
          ) : !isMobile ? (
            <>
              <img src="/logo.png" alt="HUMURA" className="h-7 w-auto brightness-0 invert shrink-0" />
              <button onClick={toggleSidebar}
                className="absolute -right-3 top-4 w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[.06] transition-all bg-[#121212]">
                <Menu size={13} />
              </button>
            </>
          ) : mobileOpen && (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <img src="/logo.png" alt="HUMURA" className="h-7 w-auto brightness-0 invert shrink-0" />
                <div className="min-w-0">
                  <p className="text-white text-sm font-bold tracking-wide leading-none">HUMURA</p>
                  <p className="text-white/20 text-[9px] font-medium leading-none mt-0.5 tracking-[.12em] uppercase">{trans.layout.traumaRecovery}</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}
                className="w-6 h-6 rounded-md flex items-center justify-center text-white/20 hover:text-white/50 hover:bg-white/[.06] transition-all shrink-0">
                <X size={13} />
              </button>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-0.5 overscroll-contain">
          {items.map(({ to, label, icon }) => {
            const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
            return (
              <NavLink key={to} to={to} onClick={() => { if (isMobile) setMobileOpen(false); }} className="group relative block">
                <div className={clsx(
                  'flex items-center rounded-xl text-sm font-medium transition-all cursor-pointer select-none',
                  sidebarExpanded ? 'gap-3 px-3 py-[9px]' : 'gap-0 px-0 py-2 justify-center',
                  isActive
                    ? 'bg-brand-600/20 text-brand-200'
                    : 'text-white/35 hover:text-white/70 hover:bg-white/[.04]'
                )}>
                  <div className={clsx(
                    'flex items-center justify-center',
                    sidebarExpanded ? 'w-5 h-5' : 'w-9 h-9 rounded-lg',
                    !sidebarExpanded && isActive && 'bg-brand-600/20'
                  )}>
                    <span className={clsx(isActive ? 'text-brand-300' : '')}>{icon}</span>
                  </div>
                  {sidebarExpanded && (
                    <>
                      <span className="truncate">{label}</span>
                      {isActive && (
                        <motion.div layoutId="sidebar-active" className="ml-auto w-1 h-4 rounded-full bg-brand-400" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                      )}
                    </>
                  )}
                </div>
                {!sidebarExpanded && !isMobile && (
                  <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-[#1e1e1e] text-white/90 text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[60] shadow-xl border border-white/[.06]">
                    {label}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User + sign out */}
        <div className="border-t border-white/[.06] p-2.5">
          <div className={clsx(
            'flex items-center rounded-xl transition-colors',
            sidebarExpanded ? 'gap-2.5 p-2' : 'gap-0 p-1 justify-center'
          )}>
            <div className={clsx(
              'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
              user?.role === 'chw' ? 'bg-warm-500/30 text-warm-200' : 'bg-brand-600/30 text-brand-200'
            )}>
              {initials}
            </div>
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-semibold truncate leading-tight">{user?.fullName}</p>
                  <p className="text-white/20 text-[10px] truncate leading-tight mt-0.5">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={logout}
            className={clsx(
              'flex items-center gap-2 w-full rounded-lg text-xs font-medium transition-all mt-0.5',
              sidebarExpanded ? 'px-3 py-2 justify-start text-white/20 hover:text-rose-400 hover:bg-rose-500/10' : 'px-0 py-2 justify-center text-white/15 hover:text-rose-300'
            )}>
            <LogOut size={13} />
            {sidebarExpanded && <span>{trans.common.signOut}</span>}
          </button>
        </div>
      </motion.aside>

      {/* ════ MAIN ════ */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-14 md:h-16 flex items-center gap-2 md:gap-3 px-3 md:px-8 shrink-0 border-b border-ink-100/70 bg-white sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)}
            className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all -ml-1">
            <Menu size={17} />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm md:text-base font-bold text-ink-800 truncate">{currentPage}</h1>
          </div>

          <div className="relative hidden md:block">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
            <input type="search" placeholder={trans.layout.search}
              className="w-36 lg:w-48 xl:w-56 h-8 pl-8 pr-8 rounded-lg text-xs placeholder:text-ink-300 bg-ink-50/70 border border-ink-200/70 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 transition-all outline-none" />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-medium text-ink-300 bg-ink-100/60 px-1.5 py-0.5 rounded pointer-events-none hidden xl:block">⌘K</kbd>
          </div>

          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>

          {/* Notification bell */}
          <div ref={notifRef} className="relative">
            <button onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-8 h-8 rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] flex items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ring-[2px] ring-white px-[3px]">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute top-full mt-1.5 right-0 w-80 rounded-xl border border-ink-200/70 bg-white shadow-lg overflow-hidden z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-ink-100/70">
                  <p className="text-xs font-bold text-ink-800">Notifications</p>
                  {unreadCount > 0 && (
                    <button onClick={() => { markAllRead(); }} className="text-[10px] font-semibold text-brand-500 hover:text-brand-600 transition-colors">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-ink-300 text-center py-8">No notifications</p>
                  ) : (
                    notifications.map(n => (
                      <button key={n.id} onClick={() => { markRead(n.id); if (n.link) navigate(n.link); setNotifOpen(false); }}
                        className={clsx(
                          'w-full text-left px-4 py-3 border-b border-ink-100/40 hover:bg-ink-50/50 transition-colors flex items-start gap-3',
                          !n.read && 'bg-brand-50/30'
                        )}>
                        <span className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', notifTypeColor(n.type))} />
                        <div className="min-w-0 flex-1">
                          <p className={clsx('text-xs leading-tight', !n.read ? 'font-bold text-ink-800' : 'font-medium text-ink-600')}>{n.title}</p>
                          <p className="text-[11px] text-ink-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-ink-300 mt-1">{n.createdAt}</p>
                        </div>
                        {!n.read && <Check size={12} className="text-brand-500 shrink-0 mt-1" />}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div ref={profileRef} className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 pl-2 md:pl-3 border-l border-ink-100/60 cursor-pointer">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-[10px] md:text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block min-w-0 text-left">
                <p className="text-xs font-semibold text-ink-700 leading-tight truncate max-w-[100px] lg:max-w-[180px]">{user?.fullName}</p>
                <p className="text-[10px] text-ink-400 leading-tight truncate">{ROLE_LABEL[user?.role ?? 'community_member']}</p>
              </div>
              <ChevronDown size={11} className={clsx('text-ink-300 hidden sm:block shrink-0 transition-transform', profileOpen && 'rotate-180')} />
            </button>

            {profileOpen && (
              <div className="absolute top-full mt-1.5 right-0 w-56 rounded-xl border border-ink-200/70 bg-white shadow-lg overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-ink-100/70">
                  <p className="text-sm font-bold text-ink-800 truncate">{user?.fullName}</p>
                  <p className="text-xs text-ink-400 truncate">{user?.email}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold text-brand-600 bg-brand-50 border border-brand-200/60">
                    {ROLE_LABEL[user?.role ?? 'community_member']}
                  </span>
                </div>
                <div className="py-1">
                  <button onClick={() => { navigate('/admin'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-ink-600 hover:text-ink-800 hover:bg-ink-50/70 transition-colors">
                    <Settings size={14} /> {trans.nav.admin}
                  </button>
                  <button onClick={() => { logout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 transition-colors">
                    <LogOut size={14} /> {trans.common.signOut}
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="px-6 md:px-12 lg:px-16 py-6 md:py-10 lg:py-12 xl:max-w-[1440px] xl:mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

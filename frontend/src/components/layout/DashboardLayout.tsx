import { useEffect, useState, useRef } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie, faUsers, faStethoscope, faHandshake,
  faWallet, faTriangleExclamation, faChartBar, faUser, faCamera, faGear, faRightFromBracket,
  faChevronLeft, faChevronRight, faCircleUser, faMagnifyingGlass,
  faBell, faChevronDown, faBars, faXmark, faCheck, faShield,
  faPlus, faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { useAuthStore } from '../../store/authStore';
import { useSidebarStore } from '../../store/sidebarStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useToastStore } from '../../store/toastStore';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';
import ChatWidget from '../chat/ChatWidget';
import { ToastContainer } from '../shared/ToastContainer';
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

const ROLE_BADGE_COLORS: Record<string, string> = {
  admin: 'from-brand-500 to-brand-600', district_hospital: 'from-brand-500 to-brand-600',
  health_center: 'from-forest-500 to-forest-600', chw: 'from-warm-500 to-warm-600',
  sociotherapy_facilitator: 'from-brand-500 to-brand-600',
  cooperative_leader: 'from-forest-500 to-forest-600', youth_counselor: 'from-warm-500 to-warm-600',
  emergency_responder: 'from-rose-500 to-rose-600', community_member: 'from-ink-500 to-ink-600',
};

const NAV_ICONS: Record<string, React.ReactNode> = {
  dashboard: <FontAwesomeIcon icon={faChartPie} className="text-[16px]" />,
  beneficiaries: <FontAwesomeIcon icon={faUsers} className="text-[16px]" />,
  screening: <FontAwesomeIcon icon={faStethoscope} className="text-[16px]" />,
  referrals: <FontAwesomeIcon icon={faHandshake} className="text-[16px]" />,
  sociotherapy: <FontAwesomeIcon icon={faUsers} className="text-[16px]" />,
  cooperatives: <FontAwesomeIcon icon={faWallet} className="text-[16px]" />,
  emergencies: <FontAwesomeIcon icon={faTriangleExclamation} className="text-[16px]" />,
  youth: <FontAwesomeIcon icon={faCircleUser} className="text-[16px]" />,
  reports: <FontAwesomeIcon icon={faChartBar} className="text-[16px]" />,
  admin: <FontAwesomeIcon icon={faGear} className="text-[16px]" />,
};

export default function DashboardLayout() {
  const { user, logout, updateProfile } = useAuthStore();
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPicture, setEditPicture] = useState<string | null>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addToast = useToastStore((s) => s.addToast);

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
  const items = NAV.filter(n => !denied.has(n.key));

  const initials = user?.fullName
    ?.split(' ').map(w => w[0]).slice(0, 2).join('') ?? '??';

  const renderAvatar = (className?: string) =>
    user?.avatar
      ? <img src={user.avatar} alt="" className={clsx('object-cover', className)} />
      : <span className={clsx('font-bold text-white')}>{initials}</span>;

  const handleEditPicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditPicture(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    if (editName) updateProfile({ fullName: editName });
    if (editPicture) updateProfile({ avatar: editPicture });
    addToast('Profile updated successfully', 'success');
    setProfileEditOpen(false);
    setEditPicture(null);
  };

  const sidebarExpanded = sidebarOpen && !isMobile;
  const showLabels = sidebarExpanded || mobileOpen;

  const pathParts = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathParts.map((part, i) => ({
    label: navTrans[part as keyof typeof navTrans] ?? part,
    href: '/' + pathParts.slice(0, i + 1).join('/'),
  }));

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          width: isMobile ? (mobileOpen ? 280 : 0) : (sidebarOpen ? 240 : 64),
        }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className={clsx(
          'flex flex-col shrink-0 h-screen sticky top-0 z-50 overflow-hidden',
          'bg-white border-r border-ink-200/60',
          isMobile && !mobileOpen && 'border-0 min-w-0',
          isMobile && mobileOpen && 'shadow-2xl',
          !isMobile && 'shadow-sm',
        )}
      >
        <div className={clsx(
          'h-16 flex items-center shrink-0 border-b border-ink-100/60',
          showLabels ? 'gap-2.5 px-4 justify-between' : 'px-0 justify-center',
        )}>
          {sidebarExpanded ? (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <img src="/logo.png" alt="HUMURA" className="h-8 w-auto shrink-0" />
                <div className="min-w-0">
                  <p className="text-ink-900 text-sm font-bold tracking-wide leading-none">HUMURA</p>
                  <p className="text-ink-400 text-[9px] font-medium leading-none mt-0.5 tracking-[.12em] uppercase">Trauma Recovery</p>
                </div>
              </div>
              <button onClick={() => { if (isMobile) setMobileOpen(false); else toggleSidebar(); }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-400 hover:text-brand-600 hover:bg-brand-50 border border-transparent hover:border-brand-200 transition-all shrink-0">
                <FontAwesomeIcon icon={faChevronLeft} className="text-[11px]" />
              </button>
            </>
          ) : !isMobile ? (
            <>
              <div className="flex items-center justify-center w-full h-full">
                <img src="/logo.png" alt="HUMURA" className="h-7 w-auto" />
              </div>
              <button onClick={toggleSidebar}
                className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-brand-600 hover:text-brand-700 hover:bg-brand-100 bg-white border-2 border-brand-200 shadow-sm transition-all z-10">
                <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
              </button>
            </>
          ) : mobileOpen && (
            <>
              <div className="flex items-center gap-3 min-w-0">
                <img src="/logo.png" alt="HUMURA" className="h-8 w-auto shrink-0" />
                <div className="min-w-0">
                  <p className="text-ink-900 text-sm font-bold tracking-wide leading-none">HUMURA</p>
                  <p className="text-ink-400 text-[9px] font-medium leading-none mt-0.5 tracking-[.12em] uppercase">Trauma Recovery</p>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all shrink-0">
                <FontAwesomeIcon icon={faXmark} className="text-[13px]" />
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-5 overscroll-contain scrollbar-thin">
          <div className={showLabels ? 'px-3 space-y-1.5' : 'px-2 space-y-1'}>
          {items.map(({ to, label, icon }) => {
            const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
            return (
              <NavLink key={to} to={to} onClick={() => { if (isMobile) setMobileOpen(false); }} className="group relative block">
                <div className={clsx(
                  'flex items-center text-sm font-medium transition-all duration-150 cursor-pointer select-none',
                  showLabels ? 'gap-3 px-3 py-[9px] rounded-xl' : 'gap-0 px-0 py-2.5 justify-center',
                  isActive && showLabels && 'bg-brand-50 border-l-2 border-l-forest-500 rounded-none rounded-r-xl ml-0 pl-[9px]',
                  isActive && !showLabels && 'bg-brand-500/10 rounded-xl',
                  isActive ? 'text-brand-700' : 'text-ink-500 hover:text-ink-800 hover:bg-ink-50'
                )}>
                  <div className={clsx(
                    'flex items-center justify-center w-9 h-9 rounded-xl shrink-0',
                    isActive && 'bg-brand-500/10',
                    !isActive && 'group-hover:bg-ink-50'
                  )}>
                    <span className={clsx(isActive ? 'text-brand-500' : 'text-ink-400')}>{icon}</span>
                  </div>
                  {showLabels && (
                    <>
                      <span className="truncate">{label}</span>
                    </>
                  )}
                </div>
                {!showLabels && !isMobile && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-white text-ink-800 text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[60] border border-ink-200/60 shadow-lg">
                    {label}
                  </div>
                )}
              </NavLink>
            );
          })}
          </div>
        </nav>

        {showLabels && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/60">
            <div className="flex items-center gap-2 mb-1">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-[12px] text-rose-500" />
              <p className="text-[11px] font-bold text-rose-700">Need Help?</p>
            </div>
            <p className="text-[10px] text-rose-600/80 leading-relaxed">Emergency Support 24/7 Available</p>
            <p className="text-[10px] font-semibold text-rose-700 mt-1 tracking-wide">116 — Toll Free</p>
          </div>
        )}

        <div className="border-t border-ink-100/60">
          <div className={clsx(
            'flex items-center rounded-xl transition-colors',
            showLabels ? 'gap-2.5 p-3' : 'gap-0 py-3 justify-center relative group'
          )}>
            {user?.avatar ? renderAvatar(clsx(
                'shrink-0',
                showLabels ? 'w-8 h-8 rounded-full' : 'w-9 h-9 rounded-xl'
              )) : (
              <div className={clsx(
                'flex items-center justify-center font-bold shrink-0 text-white',
                showLabels ? 'w-8 h-8 rounded-full text-xs' : 'w-9 h-9 rounded-xl text-sm',
                'bg-gradient-to-br from-brand-400 to-brand-600 shadow-sm'
              )}>
                {initials}
              </div>
            )}
            <AnimatePresence>
              {showLabels && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                  <p className="text-ink-800 text-xs font-semibold truncate leading-tight">{user?.fullName}</p>
                  <p className="text-ink-400 text-[10px] truncate leading-tight mt-0.5">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
            {!showLabels && !isMobile && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg bg-white text-ink-800 text-xs font-medium whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[60] border border-ink-200/60 shadow-lg">
                {user?.fullName}
              </div>
            )}
          </div>
          <div className="px-2 pb-3">
            <button onClick={logout}
              className={clsx(
                'flex items-center gap-2 w-full rounded-lg text-xs font-medium transition-all',
                showLabels ? 'px-3 py-2 justify-start text-ink-400 hover:text-rose-600 hover:bg-rose-50' : 'mx-auto w-9 h-9 justify-center text-ink-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl'
              )}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-[13px]" />
              {showLabels && <span>{trans.common.signOut}</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden md:pl-[32px]">
        <header className="h-16 flex items-center gap-3 md:gap-4 px-5 md:px-6 xl:px-8 shrink-0 border-b border-ink-100/60 bg-white/90 backdrop-blur-lg sticky top-0 z-30">
          <button onClick={() => { if (isMobile) setMobileOpen(true); else toggleSidebar(); }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-ink-500 hover:text-brand-600 hover:bg-brand-50 transition-all shrink-0">
            <FontAwesomeIcon icon={faBars} className="text-[17px]" />
          </button>

          <div className="hidden sm:flex items-center gap-2.5 text-xs text-ink-400 min-w-0 flex-1 overflow-hidden ml-1">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5 shrink-0">
                {i > 0 && <span className="text-ink-200">/</span>}
                <span className={i === breadcrumbs.length - 1 ? 'font-semibold text-ink-800 truncate max-w-[140px]' : 'text-ink-400 truncate max-w-[80px]'}>{crumb.label}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-auto">
            <div className={clsx(
              'relative transition-all duration-200',
              searchFocused ? 'w-52 md:w-64' : 'w-36 md:w-44 xl:w-56',
            )}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className={clsx(
                'text-[14px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors',
                searchFocused ? 'text-brand-500' : 'text-ink-300',
              )} />
              <input type="search" placeholder="Search..."
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={clsx(
                  'w-full h-10 pl-10 pr-4 rounded-xl text-xs placeholder:text-ink-300 bg-ink-50/80 border transition-all outline-none',
                  searchFocused
                    ? 'bg-white border-brand-400 ring-2 ring-brand-200/30'
                    : 'border-ink-200/60 hover:border-ink-300',
                )} />
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/screening')}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all whitespace-nowrap shrink-0">
              <FontAwesomeIcon icon={faPlus} className="text-[11px]" /> <span className="hidden xs:inline">New</span> Assessment
            </motion.button>

            <div className="shrink-0">
              <LanguageSwitcher />
            </div>

            <div ref={notifRef} className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">
                <FontAwesomeIcon icon={faBell} className="text-[16px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white ring-[2px] ring-white px-[4px]">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute top-full mt-2 right-0 sm:right-auto w-[calc(100vw-32px)] sm:w-80 rounded-2xl border border-ink-200/60 bg-white shadow-[0_10px_40px_rgba(0,0,0,.08)] overflow-hidden z-50">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100/60">
                    <p className="text-sm font-bold text-ink-800">Notifications</p>
                    {unreadCount > 0 && (
                      <button onClick={() => { markAllRead(); }}
                        className="text-[10px] font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-ink-300 text-center py-10">No notifications</p>
                    ) : (
                      notifications.map(n => (
                        <button key={n.id} onClick={() => { markRead(n.id); if (n.link) navigate(n.link); setNotifOpen(false); }}
                          className={clsx(
                            'w-full text-left px-5 py-3.5 border-b border-ink-100/40 hover:bg-ink-50/50 transition-colors flex items-start gap-3',
                            !n.read && 'bg-brand-50/20'
                          )}>
                          <span className={clsx('w-2 h-2 rounded-full mt-1.5 shrink-0', {
                            'bg-rose-500': n.type === 'alert',
                            'bg-brand-500': n.type === 'referral',
                            'bg-warm-500': n.type === 'screening',
                            'bg-ink-400': !['alert', 'referral', 'screening'].includes(n.type),
                          })} />
                          <div className="min-w-0 flex-1">
                            <p className={clsx('text-xs leading-tight', !n.read ? 'font-bold text-ink-800' : 'font-medium text-ink-600')}>{n.title}</p>
                            <p className="text-[11px] text-ink-400 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-ink-300 mt-1">{n.createdAt}</p>
                          </div>
                          {!n.read && <FontAwesomeIcon icon={faCheck} className="text-[12px] text-brand-500 shrink-0 mt-1" />}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div ref={profileRef} className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-3 border-l border-ink-100/60 cursor-pointer hover:opacity-80 transition-opacity">
                {user?.avatar ? renderAvatar('w-8 h-8 rounded-full shrink-0 shadow-sm') : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0 shadow-sm">
                    {initials}
                  </div>
                )}
                <div className="hidden md:block min-w-0 text-left">
                  <p className="text-xs font-semibold text-ink-700 leading-tight truncate max-w-[120px]">{user?.fullName}</p>
                  <span className="inline-block px-1.5 py-[3px] rounded-md text-[9px] font-bold uppercase tracking-[.04em] text-forest-700 bg-forest-50 border border-forest-200/60 leading-none">
                    {ROLE_LABEL[user?.role ?? 'community_member'].split(' ').pop()}
                  </span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={clsx('text-[11px] text-ink-300 hidden md:block shrink-0 transition-transform', profileOpen && 'rotate-180')} />
              </button>

              {profileOpen && (
                <div className="absolute top-full mt-2 right-0 sm:right-auto w-[calc(100vw-32px)] sm:w-64 rounded-2xl border border-ink-200/60 bg-white shadow-[0_10px_40px_rgba(0,0,0,.08)] overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-ink-100/60">
                    <div className="flex items-center gap-3 mb-3">
                      {user?.avatar ? renderAvatar('w-10 h-10 rounded-full shrink-0') : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink-800 truncate">{user?.fullName}</p>
                        <p className="text-xs text-ink-400 truncate">{user?.email}</p>
                      </div>
                    </div>
                    <span className={clsx(
                      'inline-block px-2.5 py-1 rounded-lg text-[10px] font-semibold text-white bg-gradient-to-r',
                      ROLE_BADGE_COLORS[user?.role ?? 'community_member']
                    )}>
                      {ROLE_LABEL[user?.role ?? 'community_member']}
                    </span>
                  </div>
                  <div className="py-1.5 px-1.5">
                    <button onClick={() => { setProfileEditOpen(true); setEditName(user?.fullName ?? ''); setEditPicture(null); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-ink-600 hover:text-ink-800 hover:bg-ink-50/70 transition-colors">
                      <FontAwesomeIcon icon={faUser} className="text-[14px] text-ink-400" /> Edit Profile
                    </button>
                    <button onClick={() => { navigate('/admin'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-ink-600 hover:text-ink-800 hover:bg-ink-50/70 transition-colors">
                      <FontAwesomeIcon icon={faGear} className="text-[14px] text-ink-400" /> {trans.nav.admin}
                    </button>
                    <button onClick={() => { window.open('/privacy', '_self'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-ink-600 hover:text-ink-800 hover:bg-ink-50/70 transition-colors">
                      <FontAwesomeIcon icon={faShield} className="text-[14px] text-ink-400" /> {trans.privacy.nav}
                    </button>
                    <button onClick={() => { logout(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 transition-colors">
                      <FontAwesomeIcon icon={faRightFromBracket} className="text-[14px]" /> {trans.common.signOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto px-5 md:px-6 xl:px-8 py-6 md:py-8 lg:py-10">
            <Outlet />
          </div>
        </main>
      </div>
      <ChatWidget />
      {profileEditOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setProfileEditOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100/60">
              <h3 className="text-base font-bold text-ink-800">Edit Profile</h3>
              <button onClick={() => setProfileEditOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-lg text-ink-400 hover:text-ink-600 hover:bg-ink-50 transition-colors cursor-pointer">
                <FontAwesomeIcon icon={faXmark} className="text-[16px]" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  {editPicture || user?.avatar ? (
                    <img src={editPicture || user?.avatar || ''} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-ink-100" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-bold border-2 border-ink-100">
                      {initials}
                    </div>
                  )}
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-[12px] border-2 border-white shadow-sm hover:bg-brand-600 transition-colors cursor-pointer">
                    <FontAwesomeIcon icon={faCamera} />
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleEditPicture} className="hidden" />
                <label className="block text-center w-full">
                  <span className="text-xs text-ink-500">Profile Picture</span>
                  <span className="block text-[10px] text-ink-400 mt-0.5">Click the camera icon to change</span>
                </label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-600 mb-1.5">Full Name</label>
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-ink-200/80 bg-white text-sm text-ink-800 placeholder-ink-300 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-600 mb-1.5">Email</label>
                <input type="email" value={user?.email ?? ''} disabled
                  className="w-full h-10 px-3.5 rounded-xl border border-ink-200/80 bg-ink-50/50 text-sm text-ink-400 outline-none cursor-not-allowed" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-ink-100/60 bg-ink-50/30">
              <button onClick={() => setProfileEditOpen(false)} className="px-4 h-9 rounded-xl text-xs font-semibold text-ink-600 hover:bg-ink-100 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSaveProfile} className="px-4 h-9 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-colors cursor-pointer">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

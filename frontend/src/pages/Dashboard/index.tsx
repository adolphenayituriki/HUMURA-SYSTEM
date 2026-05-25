import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStethoscope, faHandshake, faArrowRight,
  faChartBar, faUser, faUsers,
  faHeartPulse, faPeopleGroup, faPlus,
  faArrowUpRightDots, faClock,
  faLocationDot, faTriangleExclamation, faCircleCheck,
  faClipboardList, faShield, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { SectionTitle } from './SectionTitle';
import CommunityDashboard from './CommunityDashboard';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import type { Referral, EmergencyAlert, SociotherapyGroup } from '../../types';

const KPI_CONFIG: Array<{
  key: string; label: string; href: string; icon: React.ReactNode;
}> = [
  { key: 'totalBeneficiaries', label: 'totalBeneficiaries', href: '/beneficiaries',
    icon: <FontAwesomeIcon icon={faUsers} className="text-[16px]" /> },
  { key: 'screeningsDone',     label: 'screeningsDone',     href: '/screening',
    icon: <FontAwesomeIcon icon={faStethoscope} className="text-[16px]" /> },
  { key: 'activeGroups',       label: 'activeGroups',       href: '/sociotherapy',
    icon: <FontAwesomeIcon icon={faPeopleGroup} className="text-[16px]" /> },
  { key: 'emergencyCases',     label: 'emergencyCases',     href: '/emergencies',
    icon: <FontAwesomeIcon icon={faHeartPulse} className="text-[16px]" /> },
];

const monthlyTrend = [
  { month: 'Jan', screenings: 12, referrals: 3, recoveries: 2 },
  { month: 'Feb', screenings: 15, referrals: 4, recoveries: 3 },
  { month: 'Mar', screenings: 23, referrals: 6, recoveries: 4 },
  { month: 'Apr', screenings: 18, referrals: 7, recoveries: 5 },
  { month: 'May', screenings: 27, referrals: 5, recoveries: 6 },
  { month: 'Jun', screenings: 30, referrals: 8, recoveries: 7 },
];

const riskDistribution = [
  { name: 'Low', value: 38, fill: '#2D963C' },
  { name: 'Medium', value: 24, fill: '#F97316' },
  { name: 'High', value: 14, fill: '#EF4444' },
  { name: 'Critical', value: 5, fill: '#dc2626' },
];

const recentActivities = [
  { time: '2 min ago', text: 'New screening completed for Aline Uwimana', type: 'screening' },
  { time: '15 min ago', text: 'Urgent referral created for Muhire Claude', type: 'referral' },
  { time: '1 hr ago', text: 'Emergency alert dispatched to Gasabo sector', type: 'alert' },
  { time: '3 hrs ago', text: 'Healing Circle 3 session completed - 12 attended', type: 'group' },
  { time: '5 hrs ago', text: 'New beneficiary registered in Musanze district', type: 'beneficiary' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useI18nStore();
  const trans = t();
  const dash = trans.dashboard;
  const user = useAuthStore(s => s.user);
  const [data] = useState<{
    referrals: Referral[]; emergencies: EmergencyAlert[]; groups: SociotherapyGroup[];
  }>(() => ({
    referrals: service.getReferrals({}),
    emergencies: service.getEmergencies({}),
    groups: service.getSociotherapyGroups(),
  }));

  const rawStats = service.getStats();
  const recentRefs = data.referrals.slice(0, 5);
  const activeErgs = data.emergencies.filter(e => e.status === 'new' || e.status === 'dispatched');
  const activeGrps = data.groups.filter(g => g.status === 'active');
  const urgentCases = data.emergencies.filter(e => e.riskLevel === 'critical');
  const pendingRefs = data.referrals.filter(r => r.status === 'pending');
  const screenings = service.getScreenings({}).slice(0, 5);
  const myBeneficiaries = service.getBeneficiariesByRole(user?.role ?? 'admin').slice(0, 5);
  const activePlans = service.getSupportPlans().filter(p => p.status === 'active');
  const acceptedRefs = data.referrals.filter(r => r.status === 'accepted').length;
  const firstName = user?.fullName?.split(' ')[0] ?? 'there';

  if (user?.role === 'community_member') {
    return <CommunityDashboard />;
  }

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Wellness Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-6 md:p-8 lg:p-10"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white/90 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  System Live
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
                Good morning, {firstName}
              </h1>
              <p className="text-white/80 text-sm md:text-base mt-2 max-w-xl leading-relaxed">
                Your emotional wellness matters. Here is your mental wellness overview for today.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10">
                  <span className="w-2 h-2 rounded-full bg-warm-400" />
                  <span className="text-white/90 text-xs font-medium">Last Screening: Moderate Risk</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10">
                  <FontAwesomeIcon icon={faClipboardList} className="text-[12px] text-white/70" />
                  <span className="text-white/90 text-xs font-medium">2 screenings this month</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Button
                onClick={() => navigate('/screening')}
                variant="primary"
                size="md"
                className="!bg-gradient-to-r !from-brand-600 !to-brand-500 !text-white !shadow-lg hover:!shadow-xl !border-0 !font-bold !h-10 !px-5"
              >
                <FontAwesomeIcon icon={faPlus} className="text-[12px]" /> New Assessment
              </Button>
              <Button
                onClick={() => navigate('/emergencies')}
                variant="secondary"
                size="md"
                className="!bg-white/15 !text-white !border-white/20 hover:!bg-white/25 !backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faShield} className="text-[12px]" /> Find Support
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Emergency Alert Banner - only if urgent */}
      {urgentCases.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex items-start gap-3 p-4 md:p-5 rounded-2xl bg-rose-50 border border-rose-200/60"
        >
          <span className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[18px]" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-rose-800">
              {urgentCases.length} urgent case{urgentCases.length > 1 ? 's' : ''} require immediate attention
            </p>
            <p className="text-xs text-rose-600/80 mt-0.5">Emergency response teams have been notified</p>
            <button
              onClick={() => navigate('/emergencies')}
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors"
            >
              View emergencies <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Action Cards */}
      <div>
        <h2 className="text-base font-bold text-ink-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Trauma Screening', href: '/screening', icon: faStethoscope, desc: 'PHQ-9 & GAD-7 assessment', color: 'brand' },
            { label: 'Create Referral', href: '/referrals', icon: faHandshake, desc: 'Refer to specialist care', color: 'brand' },
            { label: 'Emergency Help', href: '/emergencies', icon: faHeartPulse, desc: '24/7 crisis support', color: 'rose' },
            { label: 'View Reports', href: '/reports', icon: faChartBar, desc: 'Analytics & outcomes', color: 'brand' },
          ].map((a) => (
            <motion.button
              key={a.label}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(a.href)}
              className={`flex flex-col items-start gap-3 p-4 md:p-5 rounded-xl transition-all duration-200 text-left ${
                a.color === 'rose'
                  ? 'bg-rose-50 border border-rose-200/60 hover:bg-rose-100/70 hover:border-rose-300/60'
                  : 'bg-white shadow-sm border border-ink-100/60 hover:border-brand-200/50 hover:shadow-md'
              }`}
            >
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                a.color === 'rose'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-brand-50 text-brand-600'
              }`}>
                <FontAwesomeIcon icon={a.icon} className="text-[18px]" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink-800">{a.label}</p>
                <p className="text-xs text-ink-400 mt-0.5 leading-relaxed">{a.desc}</p>
              </div>
              <span className={`text-[11px] font-semibold inline-flex items-center gap-1 ${
                a.color === 'rose' ? 'text-rose-600' : 'text-brand-600'
              }`}>
                {a.color === 'rose' ? 'Get help' : 'Start'} <FontAwesomeIcon icon={faArrowRight} className="text-[9px]" />
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* KPI Stats Row */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
        {KPI_CONFIG.map((kpi) => {
          const val = rawStats[kpi.key as keyof typeof rawStats];
          return (
            <motion.div key={kpi.key}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => navigate(kpi.href)}
              className="bg-white rounded-xl shadow-sm p-5 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md hover:border-brand-200/50 border border-ink-100/60 h-full group"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-[.05em]">{dash[kpi.label as keyof typeof dash] ?? kpi.label}</p>
                <span className="text-brand-500/70 shrink-0">{kpi.icon}</span>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-ink-900 tracking-[-.02em]">{String(val)}</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {dash.view} <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <SectionTitle icon={<FontAwesomeIcon icon={faChartBar} className="text-[13px]" />} label="Monthly Activity Overview" />
              <div className="flex items-center gap-3 text-[11px] text-ink-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-brand-500" /> Screenings</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warm-500" /> Referrals</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-forest-500" /> Recoveries</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTrend} barCategoryGap="16%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.06)' }} />
              <Bar dataKey="screenings" fill="#2D963C" radius={[4, 4, 0, 0]} />
              <Bar dataKey="referrals" fill="#F97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recoveries" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="space-y-6">
          <Card className="!p-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faTriangleExclamation} className="text-[13px]" />} label="Risk Distribution" />
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {riskDistribution.map((_, i) => <Cell key={i} fill={riskDistribution[i].fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {riskDistribution.map(r => (
                <div key={r.name} className="flex items-center gap-2 text-[11px] text-ink-500">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.fill }} />
                  {r.name}: {r.value}
                </div>
              ))}
            </div>
          </Card>

          <Card className="!p-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faArrowUpRightDots} className="text-[13px]" />} label="Quick Insights" />
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faHandshake} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{pendingRefs.length} pending referrals</p>
                  <p className="text-[11px] text-ink-400">{pendingRefs.length > 0 ? 'Requires your attention' : 'All clear'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/50">
                <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{urgentCases.length} urgent cases</p>
                  <p className="text-[11px] text-ink-400">Immediate response needed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faPeopleGroup} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{activeGrps.length} active therapy groups</p>
                  <p className="text-[11px] text-ink-400">Across {new Set(activeGrps.map(g => g.location)).size} locations</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Referrals + Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faHandshake} className="text-[13px]" />} label={dash.recentReferrals} />
            <Button onClick={() => navigate('/referrals')} variant="ghost" size="xs">
              {dash.view} all <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Button>
          </div>
          {recentRefs.length === 0 ? (
            <p className="text-xs text-ink-300 text-center py-6">No referrals yet.</p>
          ) : (
            <div className="space-y-2">
              {recentRefs.map((r, i) => (
                <motion.div key={r.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => navigate('/referrals')}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-ink-50/30 hover:bg-brand-50/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 text-[11px] font-bold shrink-0">
                      {r.beneficiaryName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-800 truncate">{r.beneficiaryName}</p>
                      <p className="text-[11px] text-ink-400 truncate">{r.reason} &middot; {r.priority}</p>
                    </div>
                  </div>
                  <Badge color={r.status === 'completed' ? 'forest' : r.status === 'accepted' ? 'brand' : r.status === 'cancelled' ? 'rose' : 'warm'}>
                    {r.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <SectionTitle icon={<FontAwesomeIcon icon={faClock} className="text-[13px]" />} label="Activity Feed" />
          <div className="space-y-0 mt-5">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-ink-100/50 last:border-b-0">
                <span className={clsx(
                  'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[12px]',
                  a.type === 'alert' ? 'bg-rose-50 text-rose-500' :
                  a.type === 'referral' ? 'bg-warm-50 text-warm-500' :
                  a.type === 'screening' ? 'bg-brand-50 text-brand-500' :
                  'bg-ink-50 text-ink-500'
                )}>
                  <FontAwesomeIcon icon={
                    a.type === 'alert' ? faTriangleExclamation :
                    a.type === 'referral' ? faHandshake :
                    a.type === 'screening' ? faStethoscope :
                    a.type === 'group' ? faUsers : faUser
                  } className="text-[11px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-ink-600 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-ink-300 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Screening Table - Improved */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon={<FontAwesomeIcon icon={faStethoscope} className="text-[13px]" />} label={trans.screening.title} />
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/screening')} variant="ghost" size="xs">
              Export <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Button>
            <Button onClick={() => navigate('/screening')} variant="primary" size="xs">
              + New
            </Button>
          </div>
        </div>

        {screenings.length === 0 ? (
          <p className="text-xs text-ink-300 text-center py-6">No screenings yet.</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-ink-100/60 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-navy-800">
                    <th className="text-left text-xs font-semibold text-white/80 uppercase tracking-[.05em] px-5 py-4">Beneficiary</th>
                    <th className="text-left text-xs font-semibold text-white/80 uppercase tracking-[.05em] px-5 py-4">PHQ-9</th>
                    <th className="text-left text-xs font-semibold text-white/80 uppercase tracking-[.05em] px-5 py-4">GAD-7</th>
                    <th className="text-left text-xs font-semibold text-white/80 uppercase tracking-[.05em] px-5 py-4">PCL-5</th>
                    <th className="text-left text-xs font-semibold text-white/80 uppercase tracking-[.05em] px-5 py-4">Progress</th>
                    <th className="text-left text-xs font-semibold text-white/80 uppercase tracking-[.05em] px-5 py-4">Risk Level</th>
                    <th className="text-left text-xs font-semibold text-white/80 uppercase tracking-[.05em] px-5 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100/50">
                  {screenings.map((s, i) => {
                    const severityColor = s.riskLevel === 'critical' ? 'rose' : s.riskLevel === 'high' ? 'warm' : s.riskLevel === 'medium' ? 'blue' : 'forest';
                    const severityLabel = s.riskLevel === 'critical' ? trans.screening.critical : s.riskLevel === 'high' ? trans.screening.highRisk : s.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low;
                    const totalScore = (s.phq9Score || 0) + (s.gad7Score || 0);
                    const maxScore = 27 + 21; // PHQ-9 max 27, GAD-7 max 21
                    const pct = Math.min(Math.round((totalScore / maxScore) * 100), 100);
                    const barColor = pct > 66 ? 'bg-rose-500' : pct > 33 ? 'bg-warm-500' : 'bg-forest-500';
                    return (
                      <motion.tr key={s.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(i * 0.03, 0.2) }}
                        onClick={() => navigate(`/screening?id=${s.id}`)}
                        className="cursor-pointer hover:bg-brand-50/20 transition-colors"
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 text-[11px] font-bold shrink-0">
                              {s.beneficiaryName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </span>
                            <span className="text-sm font-medium text-ink-800">{s.beneficiaryName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-sm text-ink-600 font-medium">{s.phq9Score}</td>
                        <td className="py-4 px-5 text-sm text-ink-600 font-medium">{s.gad7Score}</td>
                        <td className="py-4 px-5 text-sm text-ink-600 font-medium">{s.pcl5Score}</td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-ink-100 overflow-hidden">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-[11px] text-ink-400 font-medium">{pct}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-5"><Badge color={severityColor}>{severityLabel}</Badge></td>
                        <td className="py-4 px-5 text-sm text-ink-400">{s.createdAt}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {screenings.map((s) => {
                const severityColor = s.riskLevel === 'critical' ? 'rose' : s.riskLevel === 'high' ? 'warm' : s.riskLevel === 'medium' ? 'blue' : 'forest';
                const severityLabel = s.riskLevel === 'critical' ? trans.screening.critical : s.riskLevel === 'high' ? trans.screening.highRisk : s.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low;
                return (
                  <div
                    key={s.id}
                    onClick={() => navigate(`/screening?id=${s.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-ink-100/60 p-4 cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 text-[10px] font-bold shrink-0">
                          {s.beneficiaryName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </span>
                        <span className="text-sm font-semibold text-ink-800">{s.beneficiaryName}</span>
                      </div>
                      <Badge color={severityColor}>{severityLabel}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 rounded-lg bg-ink-50/50">
                        <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wide">PHQ-9</p>
                        <p className="text-base font-bold text-ink-800">{s.phq9Score}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-ink-50/50">
                        <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wide">GAD-7</p>
                        <p className="text-base font-bold text-ink-800">{s.gad7Score}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-ink-50/50">
                        <p className="text-[10px] text-ink-400 font-medium uppercase tracking-wide">PCL-5</p>
                        <p className="text-base font-bold text-ink-800">{s.pcl5Score}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-ink-400">{s.createdAt}</span>
                      <span className="text-xs font-medium text-brand-600 inline-flex items-center gap-1">
                        View Details <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex items-center justify-between pt-4 mt-4">
          <p className="text-xs text-ink-400">Showing 1&ndash;{screenings.length} of {screenings.length}</p>
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-xs text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">&lsaquo;</button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold text-white bg-brand-500">1</button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-xs text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">&rsaquo;</button>
          </div>
        </div>
      </div>

      {/* Emergency Help Panel */}
      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/60 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
          <span className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-[24px]" />
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-rose-900">Need Immediate Help?</h3>
            <p className="text-sm text-rose-700/80 mt-1">Call <strong className="text-rose-900">116</strong> &mdash; Available 24/7 for crisis support. Free and confidential.</p>
          </div>
          <Button onClick={() => navigate('/emergencies')} variant="danger" size="md" className="!h-11 !px-6 shrink-0">
            <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" /> Get Support Now
          </Button>
        </div>
      </div>

      {/* Referral Summary + Beneficiaries */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faUsers} className="text-[13px]" />} label={`${trans.beneficiaries.title} (${service.getBeneficiariesByRole(user?.role ?? 'admin').length})`} />
            <Button onClick={() => navigate('/beneficiaries')} variant="ghost" size="xs">
              {dash.view} all <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-ink-200/60 bg-white">
            <table className="w-full text-sm table-modern">
              <thead>
                <tr>
                  <th>{trans.beneficiaries.name}</th>
                  <th>{trans.beneficiaries.id}</th>
                  <th>{trans.beneficiaries.age}</th>
                  <th>{trans.beneficiaries.district}</th>
                  <th>{trans.beneficiaries.category}</th>
                  <th>{trans.screening.riskLevel}</th>
                  <th>{trans.beneficiaries.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100/50">
                {myBeneficiaries.map((b, i) => (
                  <motion.tr key={b.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                    onClick={() => navigate('/beneficiaries')}
                    className="cursor-pointer"
                  >
                    <td className="font-medium text-ink-800">{b.fullName}</td>
                    <td className="text-ink-400 text-xs font-mono">{b.id}</td>
                    <td className="text-ink-600">{b.age}</td>
                    <td className="text-ink-600">{b.district}</td>
                    <td className="text-ink-600 text-xs">{b.category}</td>
                    <td>
                      <Badge color={b.traumaLevel === 'high' ? 'rose' : b.traumaLevel === 'medium' ? 'blue' : 'forest'}>
                        {b.traumaLevel}
                      </Badge>
                    </td>
                    <td>
                      <Badge color={b.status === 'active' ? 'forest' : b.status === 'recovered' ? 'brand' : b.status === 'in_treatment' ? 'warm' : 'slate'}>
                        {b.status === 'active' ? trans.beneficiaries.statusActive : b.status === 'recovered' ? trans.beneficiaries.statusRecovered : b.status === 'in_treatment' ? trans.beneficiaries.statusInTreatment : b.status}
                      </Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <SectionTitle icon={<FontAwesomeIcon icon={faClipboardList} className="text-[13px]" />} label="Referral Summary" />
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faHandshake} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{acceptedRefs} Accepted</p>
                  <p className="text-[11px] text-ink-400">Awaiting support plan</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{activePlans.length} Active Plans</p>
                  <p className="text-[11px] text-ink-400">Beneficiaries in care</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/50">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faClipboardList} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{pendingRefs.length} Pending</p>
                  <p className="text-[11px] text-ink-400">Referrals to review</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle icon={<FontAwesomeIcon icon={faHeartPulse} className="text-[13px]" />} label={dash.activeEmergencyAlerts} />
            {activeErgs.length === 0 ? (
              <div className="py-6 text-center mt-4">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faCircleCheck} className="text-[20px] text-brand-500" />
                </div>
                <p className="text-sm font-bold text-ink-700">{dash.allClear}</p>
                <p className="text-xs text-ink-400 mt-0.5">{dash.noActiveAlerts}</p>
              </div>
            ) : (
              <div className="space-y-2 mt-4">
                {activeErgs.map((e) => (
                  <div key={e.id}
                    className="flex items-center justify-between py-3 px-4 rounded-xl bg-ink-50/30 hover:bg-rose-50/30 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="text-[14px]" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-ink-800 truncate">{e.type}</p>
                        <p className="text-[11px] text-ink-400 truncate flex items-center gap-1">
                          <FontAwesomeIcon icon={faLocationDot} className="text-[8px]" /> {e.location}
                        </p>
                      </div>
                    </div>
                    <Badge color={e.riskLevel === 'critical' ? 'rose' : e.riskLevel === 'high' ? 'warm' : e.riskLevel === 'medium' ? 'blue' : 'forest'}>
                      {e.riskLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Active Support Plans */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <SectionTitle icon={<FontAwesomeIcon icon={faHeartPulse} className="text-[13px]" />} label={`Active Support Plans (${activePlans.length})`} />
          <Button onClick={() => navigate('/referrals?tab=accepted')} variant="ghost" size="xs">
            {dash.view} all <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </Button>
        </div>
        {activePlans.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-ink-50/30">
            <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center text-ink-400 shrink-0">
              <FontAwesomeIcon icon={faClipboardList} className="text-[16px]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-ink-600">No active support plans</p>
              <p className="text-[11px] text-ink-400">Accept referrals to start support plans</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {activePlans.slice(0, 5).map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate('/referrals')}
                className="flex items-center justify-between py-3 px-4 rounded-xl bg-ink-50/30 hover:bg-brand-50/20 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                    <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink-800 truncate">{p.beneficiaryName}</p>
                    <p className="text-[11px] text-ink-400 truncate">
                      {p.assignedManager} &middot; {p.steps.filter(s => s.status === 'done').length}/{p.steps.length} steps done
                    </p>
                  </div>
                </div>
                <Badge color={p.priority === 'emergency' ? 'rose' : p.priority === 'urgent' ? 'warm' : 'brand'}>
                  {p.priority}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

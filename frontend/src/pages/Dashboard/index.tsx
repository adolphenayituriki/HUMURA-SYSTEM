import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStethoscope, faHandshake, faArrowRight,
  faChartBar, faUser, faUsers,
  faHeartPulse, faPeopleGroup, faPlus,
  faArrowUpRightDots, faClock,
  faLocationDot, faTriangleExclamation, faCircleCheck,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Sparkline } from '../../components/shared/Sparkline';
import { SectionTitle } from './SectionTitle';
import CommunityDashboard from './CommunityDashboard';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import type { Referral, EmergencyAlert, SociotherapyGroup, ScreeningResult } from '../../types';

const SPARK_COLORS: Record<string, string> = {
  totalBeneficiaries: '#007A64',
  screeningsDone:     '#007A64',
  activeGroups:       '#007A64',
  cooperativesActive: '#007A64',
  emergencyCases:     '#EF4444',
  treatmentComplete:  '#22c55e',
};

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
  { name: 'Low', value: 38, fill: '#22c55e' },
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

const QUICK_ACTIONS = [
  { label: 'New Screening', href: '/screening', icon: faStethoscope, desc: 'PHQ-9 & GAD-7 assessment', color: 'from-brand-400 to-brand-600' },
  { label: 'Create Referral', href: '/referrals', icon: faHandshake, desc: 'Refer to specialist care', color: 'from-brand-400 to-brand-600' },
  { label: 'View Reports', href: '/reports', icon: faChartBar, desc: 'Analytics & outcomes', color: 'from-brand-400 to-brand-600' },
  { label: 'Manage Users', href: '/admin', icon: faUsers, desc: 'Roles & permissions', color: 'from-brand-400 to-brand-600' },
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
  const myBeneficiaries = service.getBeneficiariesByRole(user!.role).slice(0, 5);
  const activePlans = service.getSupportPlans().filter(p => p.status === 'active');
  const acceptedRefs = data.referrals.filter(r => r.status === 'accepted').length;

  if (user?.role === 'community_member') {
    return <CommunityDashboard />;
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-[32px] font-extrabold tracking-[-.02em]">
            <span className="gradient-text">
              {dash.welcome.split('.')[0]}.
            </span>
          </h1>
          <p className="text-sm text-ink-400 mt-1.5">{dash.welcome}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200/60 text-forest-700 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse" />
            System Live
          </div>
          <Button onClick={() => navigate('/screening')} variant="primary" size="sm">
            <FontAwesomeIcon icon={faPlus} className="text-[11px]" /> New Assessment
          </Button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5"
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.04 } } }}>
        {KPI_CONFIG.map((kpi) => {
          const val = rawStats[kpi.key as keyof typeof rawStats];
          return (
            <motion.div key={kpi.key}
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              onClick={() => navigate(kpi.href)}
              className="relative bg-white rounded-2xl border border-ink-200/50 p-5 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,.06)] hover:border-brand-200/50 h-full group overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-[.05em]">{dash[kpi.label as keyof typeof dash] ?? kpi.label}</p>
                <span className="text-brand-500 shrink-0">{kpi.icon}</span>
              </div>
              <p className="text-xl md:text-2xl font-extrabold text-ink-900 tracking-[-.02em]">{String(val)}</p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  {dash.view} <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </div>
                <Sparkline data={SPARKLINE_DATA[kpi.key] ?? []} color={SPARK_COLORS[kpi.key] ?? '#007A64'} />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">
              <span className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faChartBar} className="text-[13px]" />
              </span>
              Monthly Activity Overview
            </h2>
            <div className="flex items-center gap-3 text-[10px] text-ink-400">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#007A64]" /> Screenings</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F97316]" /> Referrals</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Recoveries</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyTrend} barCategoryGap="16%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} axisLine={{ stroke: '#f1f5f9' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e2e8f0', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,.06)' }} />
              <Bar dataKey="screenings" fill="#007A64" radius={[4, 4, 0, 0]} />
              <Bar dataKey="referrals" fill="#F97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recoveries" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <div className="space-y-6">
          <Card className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">
                <span className="w-7 h-7 rounded-lg bg-ink-50 border border-ink-200/60 flex items-center justify-center text-ink-500 shrink-0">
                  <FontAwesomeIcon icon={faTriangleExclamation} className="text-[13px]" />
                </span>
                Risk Distribution
              </h2>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {riskDistribution.map((_, i) => <Cell key={i} fill={riskDistribution[i].fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {riskDistribution.map(r => (
                <div key={r.name} className="flex items-center gap-2 text-[10px] text-ink-500">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: r.fill }} />
                  {r.name}: {r.value}
                </div>
              ))}
            </div>
          </Card>

          <Card className="!p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">
                <span className="w-7 h-7 rounded-lg bg-ink-50 border border-ink-200/60 flex items-center justify-center text-ink-500 shrink-0">
                  <FontAwesomeIcon icon={faArrowUpRightDots} className="text-[13px]" />
                </span>
                Quick Insights
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faHandshake} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{pendingRefs.length} pending referrals</p>
                  <p className="text-[10px] text-ink-400">{pendingRefs.length > 0 ? 'Requires your attention' : 'All clear'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-50/50 border border-rose-200/40">
                <span className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                  <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{urgentCases.length} urgent cases</p>
                  <p className="text-[10px] text-ink-400">Immediate response needed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faPeopleGroup} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">{activeGrps.length} active therapy groups</p>
                  <p className="text-[10px] text-ink-400">Across {new Set(activeGrps.map(g => g.location)).size} locations</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

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
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-ink-50/30 border border-ink-100/60 hover:bg-brand-50/20 hover:border-brand-200/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/60 flex items-center justify-center text-brand-600 text-[11px] font-bold shrink-0">
                      {r.beneficiaryName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-800 truncate">{r.beneficiaryName}</p>
                      <p className="text-[10px] text-ink-400 truncate">{r.reason} · {r.priority}</p>
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
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faClock} className="text-[13px]" />} label="Activity Feed" />
          </div>
          <div className="space-y-0">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-3 border-b border-ink-100/50 last:border-b-0">
                <span className={clsx(
                  'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[12px]',
                  a.type === 'alert' ? 'bg-rose-50 text-rose-500 border border-rose-200/60' :
                  a.type === 'referral' ? 'bg-warm-50 text-warm-500 border border-warm-200/60' :
                  a.type === 'screening' ? 'bg-brand-50 text-brand-500 border border-brand-200/60' :
                  'bg-ink-50 text-ink-500 border border-ink-200/60'
                )}>
                  <FontAwesomeIcon icon={
                    a.type === 'alert' ? faTriangleExclamation :
                    a.type === 'referral' ? faHandshake :
                    a.type === 'screening' ? faStethoscope :
                    a.type === 'group' ? faUsers : faUser
                  } className="text-[11px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-ink-600 leading-snug">{a.text}</p>
                  <p className="text-[10px] text-ink-300 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-12">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
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
          <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-ink-100/60">
            {['All Levels', 'Critical', 'High', 'Medium', 'Low'].map((l) => {
              const active = false;
              const colorMap: Record<string, string> = {
                Critical: 'bg-rose-100 text-rose-700 border-rose-200/60',
                High: 'bg-warm-100 text-warm-700 border-warm-200/60',
                Medium: 'bg-blue-100 text-blue-700 border-blue-200/60',
                Low: 'bg-forest-50 text-forest-700 border-forest-200/60',
                'All Levels': 'bg-ink-100 text-ink-700 border-ink-200/60',
              };
              return (
                <button key={l}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${active ? 'bg-brand-500 text-white border-brand-500' : colorMap[l] ?? 'bg-ink-50 text-ink-500 border-ink-200/60 hover:bg-ink-100'}`}>
                  {l}
                </button>
              );
            })}
          </div>
          {screenings.length === 0 ? (
            <p className="text-xs text-ink-300 text-center py-6">No screenings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-semibold text-ink-400 uppercase tracking-[.06em] border-b border-ink-100">
                    <th className="text-left py-3 px-2">ID</th>
                    <th className="text-left py-3 px-2">Beneficiary</th>
                    <th className="text-left py-3 px-2">PHQ-9</th>
                    <th className="text-left py-3 px-2">GAD-7</th>
                    <th className="text-left py-3 px-2">PCL-5</th>
                    <th className="text-left py-3 px-2">Risk Level</th>
                    <th className="text-left py-3 px-2">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100/50">
                  {screenings.map((s, i) => {
                    const severityColor = s.riskLevel === 'critical' ? 'rose' : s.riskLevel === 'high' ? 'warm' : s.riskLevel === 'medium' ? 'blue' : 'forest';
                    const severityLabel = s.riskLevel === 'critical' ? trans.screening.critical : s.riskLevel === 'high' ? trans.screening.highRisk : s.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low;
                    return (
                      <motion.tr key={s.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(i * 0.03, 0.2) }}
                        onClick={() => navigate(`/screening?id=${s.id}`)}
                        className="cursor-pointer hover:bg-brand-50/20 transition-colors"
                      >
                        <td className="py-3 px-2 text-[11px] font-mono text-ink-400">{s.id}</td>
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2.5">
                            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/60 flex items-center justify-center text-brand-600 text-[10px] font-bold shrink-0">
                              {s.beneficiaryName.split(' ').map(w => w[0]).slice(0, 2).join('')}
                            </span>
                            <span className="text-xs font-medium text-ink-800">{s.beneficiaryName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-2 text-xs text-ink-600">{s.phq9Score}</td>
                        <td className="py-3 px-2 text-xs text-ink-600">{s.gad7Score}</td>
                        <td className="py-3 px-2 text-xs text-ink-600">{s.pcl5Score}</td>
                        <td className="py-3 px-2"><Badge color={severityColor}>{severityLabel}</Badge></td>
                        <td className="py-3 px-2 text-[11px] text-ink-400">{s.createdAt}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-ink-100/60">
            <p className="text-[11px] text-ink-400">Showing 1–{screenings.length} of {screenings.length}</p>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">&lsaquo;</button>
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-semibold text-white bg-brand-500">1</button>
              <button className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] text-ink-400 hover:text-ink-700 hover:bg-ink-50 transition-all">&rsaquo;</button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faUsers} className="text-[13px]" />} label={`${trans.beneficiaries.title} (${service.getBeneficiariesByRole(user!.role).length})`} />
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
                    <td className="text-ink-600 text-[11px]">{b.category}</td>
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
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faHeartPulse} className="text-[13px]" />} label={`Active Support Plans (${activePlans.length})`} />
            <Button onClick={() => navigate('/referrals?tab=accepted')} variant="ghost" size="xs">
              {dash.view} all <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Button>
          </div>
          {activePlans.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <div className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center text-ink-400 shrink-0">
                <FontAwesomeIcon icon={faClipboardList} className="text-[16px]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-ink-600">No active support plans</p>
                <p className="text-[10px] text-ink-400">Accept referrals to start support plans</p>
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
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-ink-50/30 border border-ink-100/60 hover:bg-brand-50/20 hover:border-brand-200/50 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200/60 flex items-center justify-center text-brand-600 shrink-0">
                      <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-ink-800 truncate">{p.beneficiaryName}</p>
                      <p className="text-[10px] text-ink-400 truncate">
                        {p.assignedManager} · {p.steps.filter(s => s.status === 'done').length}/{p.steps.length} steps done
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
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle icon={<FontAwesomeIcon icon={faClipboardList} className="text-[13px]" />} label="Referral Summary" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faHandshake} className="text-[14px]" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-800">{acceptedRefs} Accepted</p>
                <p className="text-[10px] text-ink-400">Awaiting support plan</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-800">{activePlans.length} Active Plans</p>
                <p className="text-[10px] text-ink-400">Beneficiaries in care</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faClipboardList} className="text-[14px]" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-800">{pendingRefs.length} Pending</p>
                <p className="text-[10px] text-ink-400">Referrals to review</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-2 lg:col-start-3">
          <h2 className="section-title mb-5">
            <span className="w-7 h-7 rounded-lg bg-brand-50 border border-brand-200/60 flex items-center justify-center text-brand-600 shrink-0">
              <FontAwesomeIcon icon={faPlus} className="text-[13px]" />
            </span>
            {dash.quickActions}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(a => (
              <motion.button key={a.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(a.href)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-ink-100/60 hover:border-brand-200/50 hover:bg-brand-50/20 transition-all duration-200 text-center"
              >
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center text-white shadow-sm`}>
                  <FontAwesomeIcon icon={a.icon} className="text-[16px]" />
                </span>
                <div>
                  <p className="text-[11px] font-bold text-ink-800">{a.label}</p>
                  <p className="text-[9px] text-ink-400 mt-0.5">{a.desc}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2 lg:col-start-1 lg:row-start-1">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faHeartPulse} className="text-[13px]" />} label={dash.activeEmergencyAlerts} />
            {activeErgs.length > 0 && (
              <Badge color="rose"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block mr-1 animate-pulse" />{activeErgs.length} active</Badge>
            )}
          </div>
          {activeErgs.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-50 to-brand-100 border-2 border-brand-200/60 flex items-center justify-center mx-auto mb-3 shadow-sm">
                <FontAwesomeIcon icon={faCircleCheck} className="text-[22px] text-brand-500" />
              </div>
              <p className="text-sm font-bold text-ink-700">{dash.allClear}</p>
              <p className="text-xs text-ink-400 mt-0.5">{dash.noActiveAlerts}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeErgs.map((e, i) => (
                <motion.div key={e.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-ink-50/30 border border-ink-100/60 hover:bg-rose-50/30 hover:border-rose-200/50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                    <span className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-500 shrink-0">
                      <FontAwesomeIcon icon={faTriangleExclamation} className="text-[14px]" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-ink-800 truncate">{e.type}</p>
                      <p className="text-[10px] text-ink-400 truncate flex items-center gap-1">
                        <FontAwesomeIcon icon={faLocationDot} className="text-[8px]" /> {e.location}
                      </p>
                    </div>
                  </div>
                  <Badge color={e.riskLevel === 'critical' ? 'rose' : e.riskLevel === 'high' ? 'warm' : e.riskLevel === 'medium' ? 'blue' : 'forest'}>
                    {e.riskLevel}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function clsx(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

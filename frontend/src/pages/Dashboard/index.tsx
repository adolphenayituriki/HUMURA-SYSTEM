import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope, HeartHandshake, Sparkles, ArrowRight,
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';
import type { Referral, EmergencyAlert, SociotherapyGroup } from '../../types';

const KPI_CONFIG: Array<{
  key: string; label: string; href: string; accent: string;
}> = [
  { key: 'totalBeneficiaries', label: 'totalBeneficiaries', href: '/beneficiaries', accent: 'brand' },
  { key: 'screeningsDone',     label: 'screeningsDone',     href: '/screening',      accent: 'warm' },
  { key: 'activeGroups',       label: 'activeGroups',       href: '/sociotherapy',   accent: 'forest' },
  { key: 'cooperativesActive', label: 'cooperativesActive', href: '/cooperatives',   accent: 'brand' },
  { key: 'emergencyCases',     label: 'emergencyCases',     href: '/emergencies',    accent: 'rose' },
  { key: 'treatmentComplete',  label: 'treatmentComplete',  href: '/reports',        accent: 'forest' },
];

const MONTHS = [
  { m: 'Jan', v: 12 }, { m: 'Feb', v: 15 }, { m: 'Mar', v: 23 },
  { m: 'Apr', v: 18 }, { m: 'May', v: 27 }, { m: 'Jun', v: 30 },
];
const BAR_MAX = Math.max(...MONTHS.map(d => d.v));

function MiniBar({ h, label, index }: { h: number; label: string; index: number }) {
  const pct = (h / BAR_MAX) * 100;
  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: `${pct}%` }}
        transition={{ delay: 0.1 + index * 0.06, duration: 0.5, ease: 'easeOut' }}
        className="w-full rounded-t-sm"
        style={{
          height: `${pct}%`,
          background: `linear-gradient(180deg, #2f778d 0%, ${index % 2 === 0 ? '#5fa6bf' : '#f07a4b'} 100%)`,
          minHeight: 8,
        }}
      />
      <span className="text-[10px] text-ink-400 font-medium">{label}</span>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: 'New Screening', href: '/screening', icon: <Stethoscope size={16} />, desc: 'PHQ-9 & GAD-7 assessment' },
  { label: 'Create Referral', href: '/referrals', icon: <HeartHandshake size={16} />, desc: 'Refer to specialist care' },
  { label: 'View Reports', href: '/reports', icon: <BarChart3 size={16} />, desc: 'Analytics & outcomes' },
  { label: 'Manage Users', href: '/admin', icon: <Settings size={16} />, desc: 'Roles & permissions' },
];

function BarChart3({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  );
}

function Settings({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size ?? 16} height={size ?? 16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useI18nStore();
  const trans = t();
  const dash = trans.dashboard;
  const [data] = useState<{
    referrals: Referral[]; emergencies: EmergencyAlert[]; groups: SociotherapyGroup[];
  }>(() => ({
    referrals:   service.getReferrals({}),
    emergencies: service.getEmergencies({}),
    groups:      service.getSociotherapyGroups(),
  }));

  const rawStats = service.getStats();
  const recentRefs  = data.referrals.slice(0, 5);
  const activeErgs  = data.emergencies.filter(e => e.status === 'new' || e.status === 'dispatched');
  const activeGrps  = data.groups.filter(g => g.status === 'active');

  return (
    <div className="space-y-10 md:space-y-12">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-ink-900 tracking-[-.02em]">{dash.welcome.split('.')[0]}.</h1>
          <p className="text-sm text-ink-400 mt-2">{dash.welcome}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-forest-200/60 text-forest-600 text-xs font-medium shrink-0 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-400" />
          {dash.live}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-6 md:gap-8">
        {KPI_CONFIG.map((kpi, i) => {
          const val = rawStats[kpi.key as keyof typeof rawStats];
          return (
            <motion.div key={kpi.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() => navigate(kpi.href)}
              className="relative bg-white rounded-xl border border-ink-200/70 p-5 md:p-6 cursor-pointer group transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,.06)]"
            >
              <p className="text-[10px] md:text-[11px] font-semibold text-ink-400 uppercase tracking-[.06em] mb-1.5">{dash[kpi.label as keyof typeof dash] ?? kpi.label}</p>
              <p className="text-xl md:text-2xl font-bold text-ink-900 tracking-[-.02em]">{String(val)}</p>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {dash.view} <ArrowRight size={11} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Activity Trend + Recent Referrals + Groups */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Activity Trend */}
        <Card className="lg:col-span-1" elevated>
          <h2 className="text-sm font-bold text-ink-800 mb-5">{dash.activityTrend}</h2>
          <div className="flex items-end justify-between h-40 gap-1.5 md:gap-2">
            {MONTHS.map((d, i) => (
              <MiniBar key={d.m} h={d.v} label={d.m} index={i} />
            ))}
          </div>
        </Card>

        {/* Recent Referrals */}
        <Card className="lg:col-span-1" elevated>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-800">{dash.recentReferrals}</h2>
            <Button onClick={() => navigate('/referrals')} variant="ghost" size="xs">
              {dash.view} all <ArrowRight size={11} />
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
                  className="flex items-center justify-between py-2 px-3 rounded-lg border border-ink-100/60"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-semibold text-ink-800 truncate">{r.beneficiaryName}</p>
                    <p className="text-[10px] text-ink-400 truncate">{r.reason} · {r.priority}</p>
                  </div>
                  <Badge color={r.status === 'completed' ? 'forest' : r.status === 'accepted' ? 'brand' : r.status === 'cancelled' ? 'rose' : 'warm'}>
                    {r.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Sociotherapy Groups */}
        <Card className="lg:col-span-1" elevated>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-800">{dash.sociotherapyGroups}</h2>
            <Badge color="warm">{activeGrps.length} {trans.common.active}</Badge>
          </div>
          {activeGrps.length === 0 ? (
            <p className="text-xs text-ink-300 text-center py-6">No active groups.</p>
          ) : (
            <div className="space-y-2">
              {activeGrps.map((g, i) => (
                <motion.div key={g.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="py-2 px-3 rounded-lg border border-ink-100/60"
                >
                  <p className="text-xs font-semibold text-ink-800">{g.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-ink-400">{g.phase}</span>
                    <span className="text-[10px] text-ink-300">·</span>
                    <span className="text-[10px] text-ink-400">{g.memberCount}/{g.maxMembers}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Emergency Alerts + Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2" elevated>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-800">{dash.activeEmergencyAlerts}</h2>
            {activeErgs.length > 0 && (
              <Badge color="rose">{activeErgs.length} {trans.common.active}</Badge>
            )}
          </div>
          {activeErgs.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full border border-forest-200/60 text-forest-500 flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} />
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
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-ink-100/60"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-bold text-ink-800 truncate">{e.type}</p>
                    <p className="text-[10px] text-ink-400 truncate">{e.location}</p>
                  </div>
                  <Badge color={e.riskLevel === 'critical' ? 'rose' : e.riskLevel === 'high' ? 'warm' : 'warm'}>
                    {e.riskLevel}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card elevated>
          <h2 className="text-sm font-bold text-ink-800 mb-4">{dash.quickActions}</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(a => (
              <Button
                key={a.label}
                onClick={() => navigate(a.href)}
                variant="ghost"
                size="md"
                className="w-full !justify-start !px-4 !py-3 !h-auto border border-ink-100/60 hover:border-ink-200 hover:bg-ink-50/50"
              >
                <span className="w-8 h-8 rounded-lg border border-ink-200/60 flex items-center justify-center text-ink-500 shrink-0 mr-3">
                  {a.icon}
                </span>
                <div className="text-left">
                  <p className="text-xs font-semibold text-ink-800">{a.label}</p>
                  <p className="text-[10px] text-ink-400">{a.desc}</p>
                </div>
              </Button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
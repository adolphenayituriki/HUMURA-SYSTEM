import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStethoscope, faHandshake, faWandSparkles, faArrowRight, faChartBar, faGear } from '@fortawesome/free-solid-svg-icons';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';
import type { Referral, EmergencyAlert, SociotherapyGroup } from '../../types';

const KPI_CONFIG: Array<{
  key: string; label: string; href: string;
}> = [
  { key: 'totalBeneficiaries', label: 'totalBeneficiaries', href: '/beneficiaries' },
  { key: 'screeningsDone',     label: 'screeningsDone',     href: '/screening' },
  { key: 'activeGroups',       label: 'activeGroups',       href: '/sociotherapy' },
  { key: 'cooperativesActive', label: 'cooperativesActive', href: '/cooperatives' },
  { key: 'emergencyCases',     label: 'emergencyCases',     href: '/emergencies' },
  { key: 'treatmentComplete',  label: 'treatmentComplete',  href: '/reports' },
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
          background: `linear-gradient(180deg, #2b8b9c 0%, ${index % 2 === 0 ? '#48b4c4' : '#f07a4b'} 100%)`,
          minHeight: 8,
        }}
      />
      <span className="text-[10px] text-ink-400 font-medium">{label}</span>
    </div>
  );
}

const QUICK_ACTIONS = [
  { label: 'New Screening', href: '/screening', icon: <FontAwesomeIcon icon={faStethoscope} className="text-[16px]" />, desc: 'PHQ-9 & GAD-7 assessment' },
  { label: 'Create Referral', href: '/referrals', icon: <FontAwesomeIcon icon={faHandshake} className="text-[16px]" />, desc: 'Refer to specialist care' },
  { label: 'View Reports', href: '/reports', icon: <FontAwesomeIcon icon={faChartBar} className="text-[16px]" />, desc: 'Analytics & outcomes' },
  { label: 'Manage Users', href: '/admin', icon: <FontAwesomeIcon icon={faGear} className="text-[16px]" />, desc: 'Roles & permissions' },
];

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
    <div className="space-y-8 md:space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{dash.welcome.split('.')[0]}.</h1>
          <p className="text-sm text-ink-400 mt-2">{dash.welcome}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 border border-forest-200/60 text-forest-700 text-xs font-medium shrink-0 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500" />
          {dash.live}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-5 md:gap-6">
        {KPI_CONFIG.map((kpi, i) => {
          const val = rawStats[kpi.key as keyof typeof rawStats];
          return (
            <motion.div key={kpi.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() => navigate(kpi.href)}
              className="relative bg-white rounded-xl border border-ink-200/60 p-5 md:p-6 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-md hover:border-brand-200/50 h-full"
            >
              <p className="text-[10px] md:text-[11px] font-semibold text-ink-400 uppercase tracking-[.04em] mb-1.5">{dash[kpi.label as keyof typeof dash] ?? kpi.label}</p>
              <p className="text-xl md:text-2xl font-semibold text-ink-900 tracking-[-.02em]">{String(val)}</p>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {dash.view} <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <Card className="lg:col-span-1">
          <h2 className="text-sm font-bold text-ink-800 mb-5">{dash.activityTrend}</h2>
          <div className="flex items-end justify-between h-40 gap-1.5 md:gap-2">
            {MONTHS.map((d, i) => (
              <MiniBar key={d.m} h={d.v} label={d.m} index={i} />
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-800">{dash.recentReferrals}</h2>
            <Button onClick={() => navigate('/referrals')} variant="ghost" size="xs">
              {dash.view} all <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" />
            </Button>
          </div>
          {recentRefs.length === 0 ? (
            <p className="text-xs text-ink-300 text-center py-6">No referrals yet.</p>
          ) : (
            <div className="space-y-3">
              {recentRefs.map((r, i) => (
                <motion.div key={r.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-ink-50/30 border border-ink-100/60"
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

        <Card className="lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-800">{dash.sociotherapyGroups}</h2>
            <Badge color="warm">{activeGrps.length} {trans.common.active}</Badge>
          </div>
          {activeGrps.length === 0 ? (
            <p className="text-xs text-ink-300 text-center py-6">No active groups.</p>
          ) : (
            <div className="space-y-3">
              {activeGrps.map((g, i) => (
                <motion.div key={g.id}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="py-2.5 px-3 rounded-lg bg-ink-50/30 border border-ink-100/60"
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        <Card className="lg:col-span-2 min-h-[200px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-ink-800">{dash.activeEmergencyAlerts}</h2>
            {activeErgs.length > 0 && (
              <Badge color="rose">{activeErgs.length} {trans.common.active}</Badge>
            )}
          </div>
          {activeErgs.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-200/60 text-forest-600 flex items-center justify-center mx-auto mb-3">
                <FontAwesomeIcon icon={faWandSparkles} className="text-[20px]" />
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
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-ink-50/30 border border-ink-100/60"
                >
                  <div className="min-w-0 flex-1 mr-2">
                    <p className="text-xs font-bold text-ink-800 truncate">{e.type}</p>
                    <p className="text-[10px] text-ink-400 truncate">{e.location}</p>
                  </div>
                  <Badge color={e.riskLevel === 'critical' ? 'rose' : 'warm'}>
                    {e.riskLevel}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </Card>

        <Card>
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
                <span className="w-8 h-8 rounded-lg bg-ink-50 border border-ink-200/60 flex items-center justify-center text-ink-500 shrink-0 mr-3">
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

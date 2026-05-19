import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { service } from '../../services/mockData';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';

export default function SociotherapyPage() {
  const { t } = useI18nStore();
  const trans = t();

  const PHASES = ['Safety', 'Trust', 'Care', 'Respect', 'New Orientation', 'Memory and Reconciliation'];
  const PHASE_LABELS: Record<string, string> = {
    'Safety': trans.sociotherapy.phases.safety,
    'Trust': trans.sociotherapy.phases.trust,
    'Care': trans.sociotherapy.phases.care,
    'Respect': trans.sociotherapy.phases.respect,
    'New Orientation': trans.sociotherapy.phases.newOrientation,
    'Memory and Reconciliation': trans.sociotherapy.phases.memoryReconciliation,
  };

  const [groups] = useState(service.getSociotherapyGroups());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [sessions] = useState(service.getSessions());

  const filtered = phaseFilter === 'all' ? groups : groups.filter(g => g.phase === phaseFilter);
  const active = groups.filter(g => g.status === 'active');

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.sociotherapy.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.sociotherapy.subtitle}</p>
        </div>
        <Badge color="warm" className="shrink-0">{active.length} {trans.common.active}</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard label={trans.sociotherapy.totalGroups} value={groups.length} />
        <StatCard label={trans.sociotherapy.active} value={active.length} />
        <StatCard label={trans.sociotherapy.totalMembers} value={groups.reduce((a, g) => a + g.memberCount, 0)} />
        <StatCard label={trans.sociotherapy.avgCapacity} value={groups.length ? Math.round(groups.reduce((a, g) => a + (g.memberCount / g.maxMembers) * 100, 0) / groups.length) + '%' : '0%'} />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setPhaseFilter('all')}
          variant={phaseFilter === 'all' ? 'primary' : 'secondary'} size="sm">
          {trans.sociotherapy.allPhases}
        </Button>
        {PHASES.map(p => (
          <Button key={p} onClick={() => setPhaseFilter(p)}
            variant={phaseFilter === p ? 'primary' : 'secondary'} size="sm">
            {PHASE_LABELS[p]}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {filtered.map((g, i) => {
          const pct = Math.round((g.memberCount / g.maxMembers) * 100);
          const fillColor = pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-warm-500' : 'bg-brand-500';
          const groupSessions = sessions.filter(s => s.groupId === g.id);
          return (
            <motion.div key={g.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.35) }}
            >
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-ink-800">{g.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{g.location} · {g.facilitatorName}</p>
                  </div>
                  <Badge color={g.status === 'active' ? 'forest' : g.status === 'completed' ? 'brand' : 'slate'}>{g.status === 'active' ? trans.sociotherapy.active : g.status === 'completed' ? trans.referrals.completed : g.status}</Badge>
                </div>

                <div className="mb-3">
                  <Badge color={
                    g.phase === 'Memory and Reconciliation' ? 'rose' :
                    g.phase === 'New Orientation' ? 'warm' :
                    g.phase === 'Respect' ? 'warm' :
                    g.phase === 'Care' ? 'forest' :
                    'brand'
                  }>{PHASE_LABELS[g.phase] || g.phase}</Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-ink-400 mb-3">
                  <span className="flex items-center gap-1"><Users size={12} /> {g.memberCount}/{g.maxMembers}</span>
                  <span>{trans.sociotherapy.sessions} {groupSessions.length}</span>
                </div>

                <div className="w-full h-2 rounded-full bg-ink-100/70 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: Math.min(i * 0.06 + 0.15, 1), duration: 0.6, ease: 'easeOut' }}
                    className={`h-full rounded-full ${fillColor}`}
                  />
                </div>
                <p className="text-[10px] text-ink-300 mt-1 text-right">{pct}% {trans.sociotherapy.capacity}</p>

                <Button onClick={() => setExpanded(expanded === g.id ? null : g.id)} variant="ghost" size="xs" className="w-full mt-3">
                  {expanded === g.id ? <><ChevronUp size={13} /> {trans.sociotherapy.hideSessions}</> : <><ChevronDown size={13} /> {trans.sociotherapy.viewSessions}</>}
                </Button>

                {expanded === g.id && groupSessions.length > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-ink-100 space-y-2">
                    <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.08em]">{trans.sociotherapy.sessionHistory}</p>
                    <div className="space-y-1.5">
                      {groupSessions.map((s) => (
                        <div key={s.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-ink-50/30 border border-ink-100/60">
                          <span className="text-xs text-ink-600">{s.theme}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-ink-400">{s.date}</span>
                            <span className="text-[10px] text-ink-400">{s.attendance}/{g.memberCount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

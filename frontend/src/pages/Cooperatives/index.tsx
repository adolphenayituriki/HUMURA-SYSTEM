import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { service } from '../../services/mockData';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { useI18nStore } from '../../i18n';

export default function CooperativesPage() {
  const { t } = useI18nStore();
  const trans = t();
  const [cooperatives] = useState(service.getCooperatives());

  const totalCapital = cooperatives.reduce((a, c) => a + c.totalCapital, 0);
  const totalMembers = cooperatives.reduce((a, c) => a + c.memberCount, 0);
  const active = cooperatives.filter(c => c.status === 'active');
  const totalFemale = cooperatives.reduce((a, c) => a + c.femaleMembers, 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.cooperatives.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.cooperatives.subtitle}</p>
        </div>
        <Badge color="brand" className="shrink-0">{cooperatives.length} {trans.cooperatives.cooperatives}</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard label={trans.cooperatives.active} value={active.length} />
        <StatCard label={trans.cooperatives.totalMembers} value={totalMembers} />
        <StatCard label={trans.cooperatives.totalCapital} value={`${(totalCapital / 1000000).toFixed(1)}M RWF`} />
        <StatCard label={trans.cooperatives.femaleMembers} value={totalFemale} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {cooperatives.map((c, i) => {
          const femalePct = c.memberCount > 0 ? Math.round((c.femaleMembers / c.memberCount) * 100) : 0;
          const malePct = 100 - femalePct;
          return (
            <motion.div key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.35) }}
            >
              <Card>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-ink-800">{c.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5 flex items-center gap-1"><MapPin size={11} /> {c.district}</p>
                  </div>
                  <Badge color={
                    c.type === 'SACCO' ? 'brand' :
                    c.type === 'Agribusiness' || c.type === 'Livestock' ? 'forest' :
                    c.type === 'Tailoring' ? 'warm' :
                    'slate'
                  }>{c.type}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg p-3 bg-ink-50/30 border border-ink-100/60">
                    <p className="text-xs text-ink-400">{trans.cooperatives.members}</p>
                    <p className="text-lg font-bold text-ink-900">{c.memberCount}</p>
                  </div>
                  <div className="rounded-lg p-3 bg-ink-50/30 border border-ink-100/60">
                    <p className="text-xs text-ink-400">{trans.cooperatives.capital}</p>
                    <p className="text-lg font-bold text-ink-900">{(c.totalCapital / 1000000).toFixed(1)}M RWF</p>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs text-ink-400 mb-1.5">
                    <span>{trans.cooperatives.genderRatio}</span>
                    <span>{malePct}% M · {femalePct}% F</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-ink-100/70 overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${malePct}%` }}
                      transition={{ delay: Math.min(i * 0.06 + 0.15, 1), duration: 0.5 }}
                      className="h-full bg-brand-400 rounded-l-full"
                    />
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${femalePct}%` }}
                      transition={{ delay: Math.min(i * 0.06 + 0.25, 1), duration: 0.5 }}
                      className="h-full bg-warm-400 rounded-r-full"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-ink-400 pt-3 border-t border-ink-100">
                  <span>{trans.cooperatives.reg} {c.registeredAt}</span>
                  <Badge color={c.status === 'active' ? 'forest' : c.status === 'forming' ? 'warm' : 'slate'}>{c.status}</Badge>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

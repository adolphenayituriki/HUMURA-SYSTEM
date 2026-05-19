import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import type { Referral } from '../../types';

export default function ReferralsPage() {
  const { t } = useI18nStore();
  const trans = t();
  const [referrals, setReferrals] = useState<Referral[]>(() => service.getReferrals({}));
  const [tab, setTab] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');

  const updateStatus = (id: string, status: Referral['status']) => {
    service.updateReferralStatus(id, status);
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const filtered = referrals.filter(r => {
    const mt = tab === 'all' || r.status === tab;
    const ms = !search || r.beneficiaryName.toLowerCase().includes(search.toLowerCase()) || r.reason.toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });

  const stats = [
    { label: trans.referrals.totalReferrals, value: referrals.length },
    { label: trans.referrals.pending, value: referrals.filter(r => r.status === 'pending').length },
    { label: trans.referrals.accepted, value: referrals.filter(r => r.status === 'accepted').length },
    { label: trans.referrals.completed, value: referrals.filter(r => r.status === 'completed').length },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.referrals.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.referrals.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge color="brand">{referrals.length} {trans.referrals.total}</Badge>
          <Badge color="warm">{referrals.filter(r => r.status === 'pending').length} {trans.referrals.pending}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="flex flex-wrap items-center gap-3 md:gap-4">
        {(['all', 'pending', 'accepted', 'completed', 'cancelled'] as const).map(t => (
          <Button key={t} onClick={() => setTab(t)}
            variant={tab === t ? 'primary' : 'secondary'} size="sm">
            {t === 'all' ? trans.referrals.all : t === 'pending' ? trans.referrals.pending : t === 'accepted' ? trans.referrals.accepted : t === 'completed' ? trans.referrals.completed : trans.referrals.cancelled}
          </Button>
        ))}
        <div className="relative ml-auto">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none text-[13px]" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={trans.referrals.search}
            className="w-36 md:w-44 h-8 pl-8 pr-3 rounded-lg text-sm border border-ink-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/40 placeholder:text-ink-300 outline-none bg-white" />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {filtered.length === 0 ? (
          <Card className="md:col-span-2 text-center py-14">
            <p className="text-ink-300 text-sm">{trans.referrals.noResults}</p>
          </Card>
        ) : (
          filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}>
              <Card className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-ink-800">{r.beneficiaryName}</p>
                    <p className="text-xs text-ink-400 mt-0.5">{r.reason} · {r.priority}</p>
                  </div>
                  <Badge color={r.status === 'completed' ? 'forest' : r.status === 'accepted' ? 'brand' : r.status === 'cancelled' ? 'rose' : 'warm'}>
                    {r.status === 'pending' ? trans.referrals.pending : r.status === 'accepted' ? trans.referrals.accepted : r.status === 'completed' ? trans.referrals.completed : r.status === 'cancelled' ? trans.referrals.cancelled : r.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-ink-400 mb-3 flex-wrap">
                  <span>{trans.referrals.from} {r.from} ({r.fromRole})</span>
                  <span className="text-ink-200">→</span>
                  <span>{r.to} ({r.toRole})</span>
                </div>
                <p className="text-xs text-ink-500 mb-3 line-clamp-2">{r.reason}</p>
                <div className="flex items-center justify-between pt-3 border-t border-ink-100">
                  <span className="text-[11px] text-ink-300">{r.createdAt}</span>
                  <div className="flex gap-1.5">
                    {r.status === 'pending' && (
                      <>
                        <Button onClick={() => updateStatus(r.id, 'accepted')} variant="success" size="xs">{trans.referrals.accept}</Button>
                        <Button onClick={() => updateStatus(r.id, 'cancelled')} variant="danger" size="xs">{trans.referrals.cancel}</Button>
                      </>
                    )}
                    {r.status === 'accepted' && (
                      <Button onClick={() => updateStatus(r.id, 'completed')} variant="brand-outline" size="xs">{trans.referrals.markComplete}</Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

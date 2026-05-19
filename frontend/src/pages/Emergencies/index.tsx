import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, MapPin, UserCheck } from 'lucide-react';
import { service } from '../../services/mockData';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import type { EmergencyAlert } from '../../types';

export default function EmergenciesPage() {
  const { t } = useI18nStore();
  const trans = t();
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => service.getEmergencies({}));

  const updateStatus = (id: string, status: EmergencyAlert['status']) => {
    service.updateEmergencyStatus(id, status);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const active = alerts.filter(a => a.status === 'new' || a.status === 'dispatched');
  const sorted = [...alerts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.emergencies.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.emergencies.subtitle}</p>
        </div>
        {active.length > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse shrink-0">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            {active.length} {trans.emergencies.active}
          </div>
        )}
      </div>

      {active.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="border border-rose-200 rounded-xl p-4 flex items-center gap-3 bg-rose-50/30">
          <div className="w-9 h-9 rounded-full bg-rose-100 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-rose-800">{active.length} {active.length === 1 ? trans.emergencies.activeAlert : trans.emergencies.activeAlerts} require{active.length === 1 ? 's' : ''} attention</p>
            <p className="text-xs text-rose-600 mt-0.5">{trans.emergencies.immediateResponseNeeded} {alerts.filter(a => a.riskLevel === 'critical').length} {alerts.filter(a => a.riskLevel === 'critical').length === 1 ? trans.emergencies.criticalCase : trans.emergencies.criticalCases}.</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard label={trans.emergencies.totalAlerts} value={alerts.length} />
        <StatCard label={trans.emergencies.active} value={active.length} />
        <StatCard label={trans.emergencies.resolved} value={alerts.filter(a => a.status === 'resolved').length} />
        <StatCard label={trans.emergencies.critical} value={alerts.filter(a => a.riskLevel === 'critical').length} />
      </div>

      <div className="space-y-4">
        {sorted.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.03, 0.35) }}
          >
            <Card className={`${a.status === 'new' ? 'border-rose-200' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-ink-800">{a.type}</p>
                    <Badge color={a.riskLevel === 'critical' ? 'rose' : a.riskLevel === 'high' ? 'warm' : a.riskLevel === 'medium' ? 'warm' : 'brand'}>{a.riskLevel === 'critical' ? trans.emergencies.critical : a.riskLevel === 'high' ? trans.screening.highRisk : a.riskLevel === 'medium' ? trans.screening.medium : trans.screening.low}</Badge>
                  </div>
                  <p className="text-xs text-ink-400">{a.beneficiaryName} · {trans.emergencies.triggeredBy} {a.triggeredBy}</p>
                </div>
                <Badge color={a.status === 'resolved' ? 'forest' : a.status === 'dispatched' ? 'brand' : a.status === 'false_alarm' ? 'slate' : 'rose'}>{a.status === 'resolved' ? trans.emergencies.resolved : a.status === 'dispatched' ? 'Dispatched' : a.status === 'false_alarm' ? 'False Alarm' : 'New'}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-ink-400 mb-3">
                <span className="flex items-center gap-1"><MapPin size={12} /> {a.location}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {a.createdAt}</span>
                <span className="flex items-center gap-1"><UserCheck size={12} /> {a.responseTeam}</span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-ink-100">
                {a.status === 'new' && (
                  <>
                    <Button onClick={() => updateStatus(a.id, 'dispatched')} variant="brand-outline" size="xs">{trans.emergencies.dispatch}</Button>
                    <Button onClick={() => updateStatus(a.id, 'resolved')} variant="success" size="xs">{trans.emergencies.resolve}</Button>
                    <Button onClick={() => updateStatus(a.id, 'false_alarm')} variant="neutral" size="xs">{trans.emergencies.dismiss}</Button>
                  </>
                )}
                {a.status === 'dispatched' && (
                  <Button onClick={() => updateStatus(a.id, 'resolved')} variant="success" size="xs">{trans.emergencies.markResolved}</Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

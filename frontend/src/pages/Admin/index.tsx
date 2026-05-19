import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, UserPlus, Trash2, Edit3 } from 'lucide-react';
import { service } from '../../services/mockData';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';

const roleColor: Record<string, 'brand' | 'forest' | 'warm' | 'rose' | 'slate'> = {
  admin:                    'brand',
  district_hospital:        'brand',
  health_center:            'forest',
  chw:                      'warm',
  sociotherapy_facilitator: 'brand',
  cooperative_leader:       'forest',
  youth_counselor:          'warm',
  emergency_responder:      'rose',
  community_member:         'slate',
};

export default function AdminPage() {
  const { t } = useI18nStore();
  const trans = t();

  const roleLabel: Record<string, string> = {
    admin:                    trans.admin.roles.nationalAdmin,
    district_hospital:        trans.admin.roles.districtHospital,
    health_center:            trans.admin.roles.healthCenter,
    chw:                      trans.admin.roles.communityHealthWorker,
    sociotherapy_facilitator: trans.admin.roles.sociotherapyFacilitator,
    cooperative_leader:       trans.admin.roles.cooperativeLeader,
    youth_counselor:          trans.admin.roles.youthCounselor,
    emergency_responder:      trans.admin.roles.emergencyResponder,
    community_member:         trans.admin.roles.communityMember,
  };

  const [activeTab, setActiveTab] = useState<'users' | 'settings'>('users');
  const [users] = useState(service.getUsers());

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.admin.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.admin.subtitle}</p>
        </div>
        <Badge color="brand" className="shrink-0">{users.length} {trans.admin.users}</Badge>
      </div>

      <div className="flex gap-1.5 pb-3 border-b border-ink-100 overflow-x-auto">
        {[
          { k: 'users' as const,   label: trans.admin.platformUsers,    badge: `${users.length}` },
          { k: 'settings' as const,  label: trans.admin.platformSettings, badge: '' },
        ].map(tab => (
          <Button key={tab.k} onClick={() => setActiveTab(tab.k)} variant={activeTab === tab.k ? 'primary' : 'secondary'} size="sm" className="shrink-0">
            {tab.label}
            {tab.badge && <span className="ml-1.5 text-[10px] opacity-70">({tab.badge})</span>}
          </Button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <Card className="!p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-ink-800">{trans.admin.platformUsers}</p>
              <p className="text-xs text-ink-300 mt-0.5">{users.length} {trans.admin.registeredUsers}</p>
            </div>
            <Button variant="brand-outline" size="md"
              onClick={() => alert('User creation form would open here (demo).')}>
              <UserPlus size={14} /> {trans.admin.addUser}
            </Button>
          </Card>

          <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
            {users.map((u, i) => {
              const initials = u.fullName.split(' ').map(w => w[0]).slice(0, 2).join('');
              return (
                <motion.div key={u.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }}>
                  <Card className="!p-0 overflow-hidden">
                    <div className="h-1 bg-gradient-to-r from-brand-300 via-warm-400 to-rose-300" />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-full bg-ink-50 border border-ink-200 text-ink-500 flex items-center justify-center text-sm font-bold">
                            {initials}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-ink-800">{u.fullName}</p>
                            <p className="text-xs text-ink-400">{u.email}</p>
                          </div>
                        </div>
                        <Badge color={roleColor[u.role] ?? 'slate'}>{roleLabel[u.role]}</Badge>
                      </div>
                      <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
                        <span className="text-xs text-ink-400">{u.facility || u.district || trans.admin.fallbackEmpty}</span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="!text-ink-300 hover:!text-ink-600"><Edit3 size={13} /></Button>
                          <Button variant="ghost" size="icon" className="!text-ink-300 hover:!text-rose-500"><Trash2 size={13} /></Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid lg:grid-cols-2 gap-5 md:gap-6">
          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <Shield size={15} className="text-brand-500" />
              {trans.admin.platformSettings}
            </h3>
            <div className="space-y-0">
              {[
                [trans.admin.platformName,   'HUMURA'],
                [trans.admin.defaultLanguage,'Kinyarwanda · English · Français'],
                [trans.admin.smsProvider,    'SMS Africa Rwanda'],
                [trans.admin.cloudBackup,    'AWS S3 — AES-256 (Enabled)'],
                [trans.admin.dataRetention,  '7 Years — Rwanda Health Records Act'],
                [trans.admin.hostingRegion,  'AWS East Africa (Nairobi)'],
                [trans.admin.apiVersion,     'v2.3.0 (REST + GraphQL)'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-2.5 border-b border-ink-100 last:border-b-0">
                  <span className="text-xs text-ink-500">{label}</span>
                  <span className="text-xs font-semibold text-ink-800">{value}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-ink-800 mb-4 flex items-center gap-2">
              <Shield size={15} className="text-forest-500" />
              {trans.admin.securityTitle}
            </h3>
            <div className="space-y-2">
              {trans.admin.securityItems.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl border border-forest-200/60 bg-forest-50/20">
                  <span className="text-forest-600 mt-0.5 shrink-0 font-bold">✓</span>
                  <span className="text-xs text-ink-700">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStethoscope, faHandshake, faArrowRight,
  faUser, faUsers,
  faHeartPulse, faPeopleGroup, faShield, faPlus,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { SectionTitle } from './SectionTitle';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';

function riskBadge(level: string) {
  const color = (level === 'critical' ? 'rose' : level === 'high' ? 'warm' : level === 'medium' ? 'blue' : 'forest') as 'rose' | 'warm' | 'blue' | 'forest';
  return <Badge color={color}>{level}</Badge>;
}

const SERVICE_CARDS = [
  { label: 'Trauma Screening', href: '/screening', icon: faStethoscope, desc: 'Free & confidential for all citizens' },
  { label: 'Support Groups', href: '/sociotherapy', icon: faPeopleGroup, desc: 'Healing circles open to everyone' },
  { label: 'My Referrals', href: '/referrals', icon: faHandshake, desc: 'Track your care & appointments' },
  { label: 'Emergency Help', href: '/emergencies', icon: faHeartPulse, desc: '24/7 crisis support for anyone' },
];

export default function CommunityDashboard() {
  const navigate = useNavigate();
  const { t } = useI18nStore();
  const trans = t();
  const dash = trans.dashboard;
  const user = useAuthStore(s => s.user);
  const screenings = service.getScreenings({}).slice(0, 5);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-[32px] font-extrabold tracking-[-.02em]">
            <span className="gradient-text">
              {trans.auth.welcomeBack}, {user?.fullName?.split(' ')[0] ?? dash.welcome.split('.')[0]}.
            </span>
          </h1>
          <p className="text-sm text-ink-400 mt-1.5">{dash.welcome}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button onClick={() => navigate('/screening')} variant="primary" size="sm">
            <FontAwesomeIcon icon={faPlus} className="text-[11px]" /> New Assessment
          </Button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
        initial="hidden" animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
        {SERVICE_CARDS.map((item) => (
          <motion.div key={item.label}
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            onClick={() => navigate(item.href)}
            className="relative bg-white rounded-2xl border border-ink-200/50 p-5 md:p-6 cursor-pointer transition-all duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(0,0,0,.06)] hover:border-brand-200/50 h-full group overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-[.05em]">{item.label}</p>
              <FontAwesomeIcon icon={item.icon} className="text-[16px] text-brand-500 shrink-0" />
            </div>
            <p className="text-xs text-ink-500 leading-relaxed mt-1">{item.desc}</p>
            <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
              {dash.view} <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faStethoscope} className="text-[13px]" />} label={trans.screening.title} />
            <Button onClick={() => navigate('/screening')} variant="ghost" size="xs">
              {dash.view} all <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Button>
          </div>
          <div className="overflow-x-auto rounded-xl border border-ink-200/60 bg-white">
            <table className="w-full text-sm table-modern">
              <thead>
                <tr>
                  <th>{trans.screening.beneficiary}</th>
                  <th>PHQ-9</th>
                  <th>GAD-7</th>
                  <th>PCL-5</th>
                  <th>{trans.screening.riskLevel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100/50">
                {screenings.map((s, i) => (
                  <motion.tr key={s.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.03, 0.2) }}
                    onClick={() => navigate(`/screening?id=${s.id}`)}
                    className="cursor-pointer"
                  >
                    <td className="font-medium text-ink-800">{s.beneficiaryName}</td>
                    <td className="text-ink-600">{s.phq9Score}</td>
                    <td className="text-ink-600">{s.gad7Score}</td>
                    <td className="text-ink-600">{s.pcl5Score}</td>
                    <td>{riskBadge(s.riskLevel)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faShield} className="text-[13px]" />} label="Mental Health Support" />
          </div>
          <div className="space-y-4">
            <p className="text-[11px] text-ink-500 leading-relaxed">
              Mental health support is for <strong>every citizen</strong> — no referral needed. If you or someone you know is struggling, help is available 24/7.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faHeartPulse} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">Crisis Helpline</p>
                  <p className="text-[10px] text-ink-400">Toll-free: 116 &middot; Available 24/7</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faUsers} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">Healing Circles</p>
                  <p className="text-[10px] text-ink-400">Find a support group near you</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
                <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                  <FontAwesomeIcon icon={faHandshake} className="text-[14px]" />
                </span>
                <div>
                  <p className="text-xs font-bold text-ink-800">Counseling Services</p>
                  <p className="text-[10px] text-ink-400">Book a session with a counselor</p>
                </div>
              </div>
            </div>
            <Button onClick={() => navigate('/sociotherapy')} variant="secondary" size="sm" className="w-full !h-10 !text-xs">
              Find Support <FontAwesomeIcon icon={faArrowRight} className="text-[11px]" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <SectionTitle icon={<FontAwesomeIcon icon={faUser} className="text-[13px]" />} label="My Information" />
            <Button onClick={() => navigate('/beneficiaries')} variant="ghost" size="xs">
              {dash.view} profile <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-[.06em] mb-1">{trans.beneficiaries.name}</p>
              <p className="text-sm font-bold text-ink-800">{user?.fullName}</p>
            </div>
            <div className="p-4 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-[.06em] mb-1">{trans.beneficiaries.id}</p>
              <p className="text-sm font-bold text-ink-800">{user?.id}</p>
            </div>
            <div className="p-4 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-[.06em] mb-1">{trans.screening.district}</p>
              <p className="text-sm font-bold text-ink-800">{user?.district ?? '—'}</p>
            </div>
            <div className="p-4 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <p className="text-[10px] font-semibold text-ink-400 uppercase tracking-[.06em] mb-1">Email</p>
              <p className="text-sm font-bold text-ink-800 truncate">{user?.email}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle icon={<FontAwesomeIcon icon={faChartBar} className="text-[13px]" />} label="My Activity" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faStethoscope} className="text-[14px]" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-800">{service.getScreenings({}).length} Total Screenings</p>
                <p className="text-[10px] text-ink-400">Your screening history</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faHandshake} className="text-[14px]" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-800">{service.getReferrals({}).length} Referrals</p>
                <p className="text-[10px] text-ink-400">Track your referrals</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-50/30 border border-ink-100/60">
              <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                <FontAwesomeIcon icon={faPeopleGroup} className="text-[14px]" />
              </span>
              <div>
                <p className="text-xs font-bold text-ink-800">{service.getSociotherapyGroups().length} Support Groups</p>
                <p className="text-[10px] text-ink-400">Available healing circles</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

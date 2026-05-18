import { useState } from 'react';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { service } from '../../services/mockData';
import { useI18nStore } from '../../i18n';

const TEAL = '#2f778d';
const SAGE = '#22c55e';
const WARN = '#f07a4b';
const ROSE = '#e84c5e';
const UMBRA = '#ccc7bb';

const monthly = [
  { month: 'Jan', screenings: 12, referrals: 3, completed: 2 },
  { month: 'Feb', screenings: 15, referrals: 4, completed: 3 },
  { month: 'Mar', screenings: 23, referrals: 6, completed: 4 },
  { month: 'Apr', screenings: 18, referrals: 7, completed: 5 },
  { month: 'May', screenings: 27, referrals: 5, completed: 6 },
  { month: 'Jun', screenings: 30, referrals: 8, completed: 7 },
  { month: 'Jul', screenings: 24, referrals: 6, completed: 5 },
  { month: 'Aug', screenings: 29, referrals: 7, completed: 6 },
  { month: 'Sep', screenings: 31, referrals: 9, completed: 8 },
  { month: 'Oct', screenings: 26, referrals: 5, completed: 6 },
  { month: 'Nov', screenings: 22, referrals: 4, completed: 5 },
  { month: 'Dec', screenings: 21, referrals: 3, completed: 4 },
];

const RISK_PIE_RAW = [
  { name: 'Low',       value: 38, fill: SAGE  },
  { name: 'Medium',    value: 24, fill: WARN  },
  { name: 'High',      value: 14, fill: ROSE  },
  { name: 'Critical',  value:  5, fill: '#7c3aed' },
];

const byDistrict = [
  { name: 'Gasabo',   value: 234 },
  { name: 'Kicukiro', value: 189 },
  { name: 'Musanze',  value: 156 },
  { name: 'Rubavu',   value: 143 },
  { name: 'Huye',     value: 128 },
  { name: 'Muhanga',  value:  97 },
  { name: 'Nyagatare',value:  84 },
  { name: 'Other',    value:  73 },
];

const recovery = [
  { month: 'Jan', recovered: 2, relapsed: 1 },
  { month: 'Feb', recovered: 3, relapsed: 0 },
  { month: 'Mar', recovered: 4, relapsed: 1 },
  { month: 'Apr', recovered: 5, relapsed: 0 },
  { month: 'May', recovered: 6, relapsed: 0 },
  { month: 'Jun', recovered: 7, relapsed: 1 },
  { month: 'Jul', recovered: 5, relapsed: 1 },
  { month: 'Aug', recovered: 6, relapsed: 0 },
  { month: 'Sep', recovered: 8, relapsed: 0 },
  { month: 'Oct', recovered: 6, relapsed: 1 },
  { month: 'Nov', recovered: 5, relapsed: 0 },
  { month: 'Dec', recovered: 4, relapsed: 1 },
];

export default function ReportsPage() {
  const { t } = useI18nStore();
  const trans = t();
  const rawStats = service.getStats();
  const statLabels: Record<string, string> = {
    totalBeneficiaries: trans.dashboard.totalBeneficiaries, screeningsDone: trans.dashboard.screeningsDone,
    activeGroups: trans.dashboard.activeGroups, cooperativesActive: trans.dashboard.cooperativesActive,
    emergencyCases: trans.dashboard.emergencyCases, treatmentComplete: trans.dashboard.treatmentComplete,
  };
  const stats = Object.fromEntries(
    Object.entries(rawStats)
      .filter(([k]) => k in statLabels)
      .map(([k, v]) => [k, { label: statLabels[k], value: String(v) }])
  );
  const [range, setRange] = useState<'month' | 'quarter' | 'year'>('month');
  const riskPie = RISK_PIE_RAW.map(r => ({ ...r, name: r.name === 'Low' ? trans.screening.low : r.name === 'Medium' ? trans.screening.medium : r.name === 'High' ? trans.screening.highRisk : trans.screening.critical }));

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.reports.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.reports.subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          {(['month', 'quarter', 'year'] as const).map((t) => (
            <Button key={t} onClick={() => setRange(t)}
              variant={range === t ? 'primary' : 'secondary'} size="xs">
              {t === 'month' ? 'Month' : t === 'quarter' ? 'Quarter' : 'Year'}
            </Button>
          ))}
          <Button variant="secondary" size="xs" className="hidden sm:flex">
            <Download size={12} /> Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-7">
        {Object.entries(stats).map(([k, s]) => (
          <div key={k} className="relative rounded-xl border border-ink-200/70 p-5 md:p-6 overflow-hidden group transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(0,0,0,.06)]">
            <p className="text-[10px] font-bold text-ink-400 uppercase tracking-[.08em]">{k.replace(/([A-Z])/g, ' $1').trim()}</p>
            <p className="text-xl font-bold text-ink-900 mt-1.5">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2" elevated>
          <h2 className="text-sm font-bold text-ink-800 mb-5 flex items-center gap-2">
            <BarChart3 size={14} className="text-brand-500" />
            Monthly Activity Trend
          </h2>
          <ResponsiveContainer width="100%" height={290}>
            <BarChart data={monthly} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeea" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11.5 }} stroke={UMBRA} />
              <YAxis tick={{ fontSize: 11 }} stroke={UMBRA} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff' }} />
              <Legend />
              <Bar dataKey="screenings" name="Screenings" fill={TEAL} radius={[4, 4, 0, 0]} />
              <Bar dataKey="referrals"  name={trans.referrals.title} fill={WARN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed"  name={trans.referrals.completed} fill={SAGE} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card elevated>
          <h2 className="text-sm font-bold text-ink-800 mb-5">Screening Risk Distribution</h2>
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie data={riskPie} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value"
                label={({ name, value }) => `${name} ${value}`}>
                {riskPie.map((_, i) => <Cell key={i} fill={[SAGE, WARN, ROSE, '#7c3aed'][i]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <Card className="lg:col-span-2" elevated>
          <h2 className="text-sm font-bold text-ink-800 mb-5 flex items-center gap-2">
            <TrendingUp size={14} className="text-forest-500" />
            Treatment Outcomes — Recovered vs Relapsed
          </h2>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={recovery}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeea" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11.5 }} stroke={UMBRA} />
              <YAxis tick={{ fontSize: 11 }} stroke={UMBRA} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff' }} />
              <Legend />
              <Line type="monotone" dataKey="recovered" name="Recovered" stroke={SAGE} strokeWidth={2.5} dot={{ r: 3.5, fill: SAGE }} />
              <Line type="monotone" dataKey="relapsed"   name="Relapsed"   stroke={ROSE}  strokeWidth={2.5} dot={{ r: 3.5, fill: ROSE }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card elevated>
          <h2 className="text-sm font-bold text-ink-800 mb-5">Beneficiaries by District</h2>
          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={byDistrict} layout="vertical" barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0eeea" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke={UMBRA} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke={UMBRA} width={70} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff' }} />
              <Bar dataKey="value" name={trans.beneficiaries.title} fill={TEAL} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card elevated>
        <h2 className="text-sm font-bold text-ink-800 mb-5">Healing Group Progress — Phase Distribution</h2>
        <div className="grid md:grid-cols-2 gap-6 items-center">
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie data={[
                  { name: trans.sociotherapy.phases.safety, value: 12, fill: '#2f778d' },
                  { name: trans.sociotherapy.phases.trust, value: 18, fill: '#5fa6bf' },
                  { name: trans.sociotherapy.phases.care, value: 22, fill: '#22c55e' },
                  { name: trans.sociotherapy.phases.respect, value: 15, fill: '#f07a4b' },
                  { name: trans.sociotherapy.phases.newOrientation, value: 9, fill: '#e84c5e' },
                  { name: trans.sociotherapy.phases.memoryReconciliation, value: 14, fill: '#1e4c5c' },
                ]} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value"
                label={({ name, value }) => `${name} (${value})`}>
                {['#2f778d', '#5fa6bf', '#22c55e', '#f07a4b', '#e84c5e', '#1e4c5c'].map((fill, i) => (
                  <Cell key={i} fill={fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 12, border: '1px solid #e5e7eb', background: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {[
              { name: trans.sociotherapy.phases.safety, value: 12, fill: '#2f778d' },
              { name: trans.sociotherapy.phases.trust, value: 18, fill: '#5fa6bf' },
              { name: trans.sociotherapy.phases.care, value: 22, fill: '#22c55e' },
              { name: trans.sociotherapy.phases.respect, value: 15, fill: '#f07a4b' },
              { name: trans.sociotherapy.phases.newOrientation, value: 9, fill: '#e84c5e' },
              { name: trans.sociotherapy.phases.memoryReconciliation, value: 14, fill: '#1e4c5c' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-3.5 h-3.5 rounded-sm shrink-0" style={{ background: p.fill }} />
                <span className="text-xs text-ink-600 w-36">{p.name}</span>
                <div className="flex-1 h-1.5 rounded-full bg-ink-100/70 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(p.value / 90) * 100}%`, background: p.fill }} />
                </div>
                <span className="text-xs text-ink-400 font-mono w-6 text-right">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
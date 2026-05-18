import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import { service } from '../../services/mockData';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import type { Beneficiary } from '../../types';

const PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 7;

function getPageWindow(current: number, total: number): number[] {
  if (total <= MAX_VISIBLE_PAGES) return Array.from({ length: total }, (_, i) => i);
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);
  let start = Math.max(0, current - half);
  const end = Math.min(total - 1, start + MAX_VISIBLE_PAGES - 1);
  if (end - start + 1 < MAX_VISIBLE_PAGES) start = Math.max(0, end - MAX_VISIBLE_PAGES + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export default function BeneficiariesPage() {
  const { t } = useI18nStore();
  const trans = t();
  const [beneficiaries] = useState<Beneficiary[]>(() => service.getBeneficiaries({}));
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);

  const districts = Array.from(new Set(beneficiaries.map(b => b.district)));
  const filtered = beneficiaries.filter(b => {
    const m1 = !search || b.fullName.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const m2 = district === 'all' || b.district === district;
    const m3 = status === 'all' || b.status === status;
    return m1 && m2 && m3;
  });

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const paged = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);
  const pageWindow = getPageWindow(safePage, pages);

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-ink-900 tracking-[-.02em]">{trans.beneficiaries.title}</h1>
          <p className="text-sm text-ink-400 mt-2">{trans.beneficiaries.subtitle}</p>
        </div>
        <Badge color="brand" creative className="shrink-0">{beneficiaries.length} {trans.common.total}</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-5">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder={trans.beneficiaries.searchPlaceholder}
            className="w-full h-10 pl-9 pr-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none placeholder:text-ink-300" />
        </div>
        <select value={district} onChange={e => { setDistrict(e.target.value); setPage(0); }}
          className="h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none">
          <option value="all">{trans.beneficiaries.allDistricts}</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}
          className="h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none">
          <option value="all">{trans.beneficiaries.allStatus}</option>
          <option value="active">{trans.beneficiaries.statusActive}</option>
          <option value="referred">{trans.beneficiaries.statusReferred}</option>
          <option value="in_treatment">{trans.beneficiaries.statusInTreatment}</option>
          <option value="recovered">{trans.beneficiaries.statusRecovered}</option>
        </select>
        <div className="flex items-center gap-1.5 text-xs text-ink-400 whitespace-nowrap">
          <Filter size={12} />
          <span>{filtered.length} {trans.beneficiaries.results}</span>
        </div>
      </div>

      <div className="rounded-xl border border-ink-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-100">
                {[trans.beneficiaries.name, trans.beneficiaries.id, trans.beneficiaries.age, trans.beneficiaries.sex, trans.beneficiaries.district, trans.beneficiaries.category, trans.beneficiaries.traumaLevel, trans.beneficiaries.status].map(h => (
                  <th key={h} className="text-left text-[10px] font-semibold text-ink-400 uppercase tracking-[.06em] px-6 py-5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {paged.map((b, i) => (
                <motion.tr key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                  className="hover:bg-ink-50/30 transition-colors"
                >
                  <td className="px-6 py-5 font-medium text-ink-800 whitespace-nowrap">{b.fullName}</td>
                  <td className="px-6 py-5 text-ink-400 text-xs font-mono whitespace-nowrap">{b.id}</td>
                  <td className="px-6 py-5 text-ink-600">{b.age}</td>
                  <td className="px-6 py-5">
                    <Badge color={b.sex === 'Male' ? 'brand' : 'rose'}>{b.sex === 'Male' ? trans.beneficiaries.male : trans.beneficiaries.female}</Badge>
                  </td>
                  <td className="px-6 py-5 text-ink-600 whitespace-nowrap">{b.district}</td>
                  <td className="px-6 py-5 text-xs text-ink-500 max-w-[120px] truncate">{b.category}</td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <Badge color={b.traumaLevel === 'high' ? 'rose' : b.traumaLevel === 'medium' ? 'warm' : 'brand'}>{b.traumaLevel}</Badge>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <Badge color={b.status === 'active' ? 'forest' : b.status === 'recovered' ? 'brand' : b.status === 'in_treatment' ? 'warm' : 'slate'}>{b.status === 'active' ? trans.beneficiaries.statusActive : b.status === 'referred' ? trans.beneficiaries.statusReferred : b.status === 'in_treatment' ? trans.beneficiaries.statusInTreatment : b.status === 'recovered' ? trans.beneficiaries.statusRecovered : b.status}</Badge>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {paged.length === 0 && (
            <div className="text-center py-12 text-ink-300 text-sm">{trans.beneficiaries.noResults}</div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs text-ink-400">{trans.beneficiaries.page} {safePage + 1} {trans.beneficiaries.of} {pages}</span>
        <div className="flex gap-1">
          <Button disabled={safePage === 0} onClick={() => setPage(p => p - 1)} variant="secondary" size="icon">
            <ChevronLeft size={14} />
          </Button>
          {pageWindow[0] > 0 && (
            <>
              <Button onClick={() => setPage(0)} variant={0 === safePage ? 'primary' : 'secondary'} size="icon">1</Button>
              {pageWindow[0] > 1 && <span className="flex items-center px-1 text-xs text-ink-300">...</span>}
            </>
          )}
          {pageWindow.map(i => (
            <Button key={i} onClick={() => setPage(i)}
              variant={i === safePage ? 'primary' : 'secondary'} size="icon">
              {i + 1}
            </Button>
          ))}
          {pageWindow[pageWindow.length - 1] < pages - 1 && (
            <>
              {pageWindow[pageWindow.length - 1] < pages - 2 && <span className="flex items-center px-1 text-xs text-ink-300">...</span>}
              <Button onClick={() => setPage(pages - 1)} variant={pages - 1 === safePage ? 'primary' : 'secondary'} size="icon">{pages}</Button>
            </>
          )}
          <Button disabled={safePage === pages - 1} onClick={() => setPage(p => p + 1)} variant="secondary" size="icon">
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
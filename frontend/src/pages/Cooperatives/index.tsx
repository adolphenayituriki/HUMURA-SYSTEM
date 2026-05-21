import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faUsers, faCoins, faFemale, faPlus, faPenToSquare, faTrashCan, faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { StatCard } from '../../components/shared/StatCard';
import { Button } from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { useI18nStore } from '../../i18n';
import type { Cooperative } from '../../types';

type CooperativeType = Cooperative['type'];
type CooperativeStatus = Cooperative['status'];

const TYPES: CooperativeType[] = ['SACCO', 'Agribusiness', 'Livestock', 'Tailoring', 'Retail', 'Other'];
const STATUSES: CooperativeStatus[] = ['active', 'forming', 'dormant'];

function emptyForm(): Omit<Cooperative, 'id'> {
  return {
    name: '',
    type: 'SACCO',
    district: '',
    leaderName: '',
    memberCount: 0,
    femaleMembers: 0,
    totalCapital: 0,
    status: 'active',
    registeredAt: new Date().toISOString().slice(0, 10),
    leaderId: '',
  };
}

export default function CooperativesPage() {
  const { t } = useI18nStore();
  const trans = t();
  const { addToast } = useToastStore();
  const [cooperatives, setCooperatives] = useState(service.getCooperatives());
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let data = [...cooperatives];
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(c => c.name.toLowerCase().includes(q));
    }
    if (districtFilter) {
      const q = districtFilter.toLowerCase();
      data = data.filter(c => c.district.toLowerCase().includes(q));
    }
    if (statusFilter) data = data.filter(c => c.status === statusFilter);
    if (typeFilter) data = data.filter(c => c.type === typeFilter);
    return data;
  }, [cooperatives, search, districtFilter, statusFilter, typeFilter]);

  const districts = useMemo(() => {
    const s = new Set(cooperatives.map(c => c.district));
    return Array.from(s).sort();
  }, [cooperatives]);

  const totalCapital = cooperatives.reduce((a, c) => a + c.totalCapital, 0);
  const totalMembers = cooperatives.reduce((a, c) => a + c.memberCount, 0);
  const active = cooperatives.filter(c => c.status === 'active');
  const totalFemale = cooperatives.reduce((a, c) => a + c.femaleMembers, 0);

  function openAdd() {
    setForm(emptyForm());
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(c: Cooperative) {
    setForm({
      name: c.name,
      type: c.type,
      district: c.district,
      leaderName: c.leaderName,
      memberCount: c.memberCount,
      femaleMembers: c.femaleMembers,
      totalCapital: c.totalCapital,
      status: c.status,
      registeredAt: c.registeredAt,
      leaderId: c.leaderId,
    });
    setEditingId(c.id);
    setModalOpen(true);
  }

  function handleSave() {
    if (editingId) {
      const updated = service.updateCooperative(editingId, form);
      if (updated) {
        setCooperatives(cooperatives.map(c => c.id === editingId ? updated : c));
        addToast('Cooperative updated successfully');
      }
    } else {
      const created = service.addCooperative({
        id: crypto.randomUUID(),
        ...form,
      });
      setCooperatives([...cooperatives, created]);
      addToast('Cooperative created successfully');
    }
    setModalOpen(false);
  }

  function handleDelete() {
    if (deleteId) {
      service.deleteCooperative(deleteId);
      addToast('Cooperative deleted successfully');
      setCooperatives(cooperatives.filter(c => c.id !== deleteId));
      setDeleteId(null);
    }
  }

  function setField<K extends keyof Omit<Cooperative, 'id'>>(key: K, value: Cooperative[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.cooperatives.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.cooperatives.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge color="brand" className="shrink-0">{cooperatives.length} {trans.cooperatives.cooperatives}</Badge>
          <Button onClick={openAdd} size="sm" variant="primary">
            <FontAwesomeIcon icon={faPlus} className="text-[13px]" />
            {trans.cooperatives.add || 'Add Cooperative'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        <StatCard label={trans.cooperatives.active} value={active.length}
          icon={<FontAwesomeIcon icon={faUsers} className="text-[16px] text-forest-500 shrink-0" />} />
        <StatCard label={trans.cooperatives.totalMembers} value={totalMembers}
          icon={<FontAwesomeIcon icon={faUsers} className="text-[16px] text-brand-500 shrink-0" />} />
        <StatCard label={trans.cooperatives.totalCapital} value={`${(totalCapital / 1000000).toFixed(1)}M RWF`}
          icon={<FontAwesomeIcon icon={faCoins} className="text-[16px] text-warm-500 shrink-0" />} />
        <StatCard label={trans.cooperatives.femaleMembers} value={totalFemale}
          icon={<FontAwesomeIcon icon={faFemale} className="text-[16px] text-rose-500 shrink-0" />} />
      </div>

      <div className="flex flex-wrap items-center gap-3 p-3 rounded-xl border border-ink-200/60 bg-white shadow-sm">
        <div className="relative flex-1 min-w-[160px] max-w-xs">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 text-[13px]" />
          <input
            type="text" placeholder="Search cooperatives..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs rounded-lg border border-ink-200/60 bg-ink-50/30 text-ink-800 placeholder:text-ink-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-300 hover:text-ink-500">
              <FontAwesomeIcon icon={faXmark} className="text-[14px]" />
            </button>
          )}
        </div>
        <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-ink-200/60 bg-white text-ink-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
          <option value="">All Districts</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-ink-200/60 bg-white text-ink-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="h-9 px-3 text-xs rounded-lg border border-ink-200/60 bg-white text-ink-600 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
          <option value="">All Types</option>
          {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid sm:grid-cols-2 gap-5 md:gap-6">
        {filtered.map((c, i) => {
          const femalePct = c.memberCount > 0 ? Math.round((c.femaleMembers / c.memberCount) * 100) : 0;
          const malePct = 100 - femalePct;
          return (
            <motion.div key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.04, 0.35) }}
            >
              <Card className="group overflow-hidden">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-ink-800">{c.name}</p>
                    <p className="text-xs text-ink-400 mt-0.5 flex items-center gap-1"><FontAwesomeIcon icon={faLocationDot} className="text-[11px]" /> {c.district}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge color={
                      c.type === 'SACCO' ? 'brand' :
                      c.type === 'Agribusiness' || c.type === 'Livestock' ? 'forest' :
                      c.type === 'Tailoring' ? 'warm' :
                      'slate'
                    }>{c.type}</Badge>
                    <button onClick={() => openEdit(c)} className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-brand-500 hover:bg-brand-50 transition-all" title="Edit">
                      <FontAwesomeIcon icon={faPenToSquare} className="text-[13px]" />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-300 hover:text-rose-500 hover:bg-rose-50 transition-all" title="Delete">
                      <FontAwesomeIcon icon={faTrashCan} className="text-[13px]" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? 'Edit Cooperative' : 'Add Cooperative'} size="lg">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-ink-600 mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setField('name', e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Type</label>
            <select value={form.type} onChange={e => setField('type', e.target.value as CooperativeType)}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">District</label>
            <input type="text" value={form.district} onChange={e => setField('district', e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Leader Name</label>
            <input type="text" value={form.leaderName} onChange={e => setField('leaderName', e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Registered At</label>
            <input type="date" value={form.registeredAt} onChange={e => setField('registeredAt', e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Member Count</label>
            <input type="number" min={0} value={form.memberCount} onChange={e => setField('memberCount', Number(e.target.value))}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Female Members</label>
            <input type="number" min={0} value={form.femaleMembers} onChange={e => setField('femaleMembers', Number(e.target.value))}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Total Capital (RWF)</label>
            <input type="number" min={0} step={1000} value={form.totalCapital} onChange={e => setField('totalCapital', Number(e.target.value))}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-600 mb-1">Status</label>
            <select value={form.status} onChange={e => setField('status', e.target.value as CooperativeStatus)}
              className="w-full h-10 px-3 text-sm rounded-xl border border-ink-200/60 bg-ink-50/30 text-ink-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-ink-100/60">
          <Button onClick={() => setModalOpen(false)} variant="secondary" size="sm">Cancel</Button>
          <Button onClick={handleSave} variant="primary" size="sm">
            {editingId ? 'Update' : 'Save'}
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Cooperative"
        message="Are you sure you want to delete this cooperative? This action cannot be undone."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

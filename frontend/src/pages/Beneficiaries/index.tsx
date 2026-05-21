import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChevronLeft, faChevronRight, faFilter, faUsers, faPlus, faPenToSquare, faTrashCan, faEye } from '@fortawesome/free-solid-svg-icons';
import { service } from '../../services/mockData';
import { useToastStore } from '../../store/toastStore';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { useI18nStore } from '../../i18n';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/shared/Modal';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import type { Beneficiary, UserRole } from '../../types';

const CAN_MANAGE_BENEFICIARIES: UserRole[] = ['admin', 'district_hospital', 'health_center', 'chw'];

const PAGE_SIZE = 10;
const MAX_VISIBLE_PAGES = 7;

const CATEGORIES: Beneficiary['category'][] = ['Genocide Survivor', 'Widow', 'Orphan', 'Former Perpetrator', 'Vulnerable Youth', 'Other'];
const STATUSES: Beneficiary['status'][] = ['active', 'referred', 'in_treatment', 'recovered'];
const TRAUMA_LEVELS: Beneficiary['traumaLevel'][] = ['low', 'medium', 'high'];
const DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Musanze', 'Rubavu', 'Huye', 'Muhanga', 'Nyagatare'];

const emptyForm: Partial<Beneficiary> = {
  fullName: '',
  age: 0,
  sex: 'Male',
  district: 'Gasabo',
  sector: '',
  cell: '',
  phone: '',
  category: 'Other',
  chwName: '',
  status: 'active',
  traumaLevel: 'low',
  notes: '',
};

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
  const user = useAuthStore(s => s.user);
  const { addToast } = useToastStore();
  const canManage = user ? CAN_MANAGE_BENEFICIARIES.includes(user.role) : false;
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const all = service.getBeneficiaries({});
    if (canManage) return all;
    return service.getBeneficiariesByRole(user!.role);
  });
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Beneficiary>>({ ...emptyForm });

  const [deleteTarget, setDeleteTarget] = useState<Beneficiary | null>(null);

  const districtOptions = DISTRICTS;
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

  function openAdd() {
    setEditId(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  }

  function openEdit(b: Beneficiary) {
    setEditId(b.id);
    setForm({ ...b });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
  }

  function handleSave() {
    if (!form.fullName || !form.age || !form.sector || !form.cell || !form.phone || !form.chwName) return;
    const payload: Beneficiary = {
      id: editId || `B-${String(Date.now()).slice(-6)}`,
      fullName: form.fullName,
      age: form.age,
      sex: form.sex as Beneficiary['sex'],
      district: form.district!,
      sector: form.sector,
      cell: form.cell,
      phone: form.phone,
      category: form.category as Beneficiary['category'],
      chwId: editId ? (beneficiaries.find(b => b.id === editId)?.chwId || '') : '',
      chwName: form.chwName,
      registeredAt: editId ? (beneficiaries.find(b => b.id === editId)?.registeredAt || new Date().toISOString().split('T')[0]) : new Date().toISOString().split('T')[0],
      status: form.status as Beneficiary['status'],
      traumaLevel: form.traumaLevel as Beneficiary['traumaLevel'],
      notes: form.notes || '',
    };
    if (editId) {
      service.updateBeneficiary(editId, payload);
      addToast('Beneficiary updated successfully');
    } else {
      service.addBeneficiary(payload);
      addToast('Beneficiary added successfully');
    }
    setBeneficiaries(service.getBeneficiaries({}));
    closeModal();
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    service.deleteBeneficiary(deleteTarget.id);
    addToast('Beneficiary deleted successfully');
    setBeneficiaries(service.getBeneficiaries({}));
    setDeleteTarget(null);
    if (safePage >= Math.ceil(filtered.length / PAGE_SIZE) && safePage > 0) {
      setPage(safePage - 1);
    }
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-.02em]">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">{trans.beneficiaries.title}</span>
          </h1>
          <p className="text-sm text-ink-400 mt-2">{trans.beneficiaries.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Badge color="brand">{beneficiaries.length} {trans.common.total}</Badge>
          {canManage && (
            <Button variant="primary" size="sm" onClick={openAdd}>
              <FontAwesomeIcon icon={faPlus} className="text-[12px]" />
              <span>{trans.beneficiaries.addBeneficiary || 'Add Beneficiary'}</span>
            </Button>
          )}
        </div>
      </div>

      <div className="p-5 rounded-xl border border-ink-200/60 bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-4 md:gap-5">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none text-[14px]" />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder={trans.beneficiaries.searchPlaceholder}
              className="w-full h-10 pl-9 pr-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none placeholder:text-ink-300 bg-white transition-all" />
          </div>
          <select value={district} onChange={e => { setDistrict(e.target.value); setPage(0); }}
            className="h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none bg-white transition-all">
            <option value="all">{trans.beneficiaries.allDistricts}</option>
            {districtOptions.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}
            className="h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none bg-white transition-all">
            <option value="all">{trans.beneficiaries.allStatus}</option>
            <option value="active">{trans.beneficiaries.statusActive}</option>
            <option value="referred">{trans.beneficiaries.statusReferred}</option>
            <option value="in_treatment">{trans.beneficiaries.statusInTreatment}</option>
            <option value="recovered">{trans.beneficiaries.statusRecovered}</option>
          </select>
          <div className="flex items-center gap-1.5 text-xs text-ink-400 whitespace-nowrap ml-auto">
            <FontAwesomeIcon icon={faFilter} className="text-[11px] text-brand-500" />
            <span>{filtered.length} {trans.beneficiaries.results}</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-ink-200/60 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm table-modern">
            <thead>
              <tr>
                {[trans.beneficiaries.name, trans.beneficiaries.id, trans.beneficiaries.age, trans.beneficiaries.sex, trans.beneficiaries.district, trans.beneficiaries.category, trans.beneficiaries.traumaLevel, trans.beneficiaries.status, ''].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100/50">
              {paged.map((b, i) => (
                <motion.tr key={b.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.2) }}
                >
                  <td className="font-medium text-ink-800 whitespace-nowrap">{b.fullName}</td>
                  <td className="text-ink-400 text-xs font-mono whitespace-nowrap">{b.id}</td>
                  <td className="text-ink-600">{b.age}</td>
                  <td>
                    <Badge color={b.sex === 'Male' ? 'brand' : 'rose'}>{b.sex === 'Male' ? trans.beneficiaries.male : trans.beneficiaries.female}</Badge>
                  </td>
                  <td className="text-ink-600 whitespace-nowrap">{b.district}</td>
                  <td className="text-xs text-ink-500 max-w-[120px] truncate">{b.category}</td>
                  <td className="whitespace-nowrap">
                    <Badge color={b.traumaLevel === 'high' ? 'rose' : b.traumaLevel === 'medium' ? 'blue' : 'forest'}>{b.traumaLevel}</Badge>
                  </td>
                  <td className="whitespace-nowrap">
                    <Badge color={b.status === 'active' ? 'forest' : b.status === 'recovered' ? 'brand' : b.status === 'in_treatment' ? 'warm' : 'slate'}>{b.status === 'active' ? trans.beneficiaries.statusActive : b.status === 'referred' ? trans.beneficiaries.statusReferred : b.status === 'in_treatment' ? trans.beneficiaries.statusInTreatment : b.status === 'recovered' ? trans.beneficiaries.statusRecovered : b.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap">
                    {canManage ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(b)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-300 hover:text-brand-500 hover:bg-brand-50 transition-all">
                          <FontAwesomeIcon icon={faPenToSquare} className="text-[14px]" />
                        </button>
                        <button onClick={() => setDeleteTarget(b)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                          <FontAwesomeIcon icon={faTrashCan} className="text-[14px]" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => openEdit(b)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-300 hover:text-brand-500 hover:bg-brand-50 transition-all">
                        <FontAwesomeIcon icon={faEye} className="text-[14px]" />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {paged.length === 0 && (
            <div className="text-center py-16">
              <FontAwesomeIcon icon={faUsers} className="text-[22px] text-ink-300 mx-auto mb-4" />
              <p className="text-sm font-semibold text-ink-500">{trans.beneficiaries.noResults}</p>
              <p className="text-xs text-ink-300 mt-1">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
        <span className="text-xs text-ink-400">{trans.beneficiaries.page} {safePage + 1} {trans.beneficiaries.of} {pages} · {filtered.length} {trans.beneficiaries.results}</span>
        <div className="flex gap-1">
          <Button disabled={safePage === 0} onClick={() => setPage(p => p - 1)} variant="secondary" size="icon"
            className="!border-ink-200/60 hover:!border-ink-300">
            <FontAwesomeIcon icon={faChevronLeft} className="text-[14px]" />
          </Button>
          {pageWindow[0] > 0 && (
            <>
              <Button onClick={() => setPage(0)} variant={0 === safePage ? 'primary' : 'secondary'} size="icon"
                className={0 !== safePage ? '!border-ink-200/60' : ''}>1</Button>
              {pageWindow[0] > 1 && <span className="flex items-center px-1 text-xs text-ink-300 select-none">…</span>}
            </>
          )}
          {pageWindow.map(i => (
            <Button key={i} onClick={() => setPage(i)}
              variant={i === safePage ? 'primary' : 'secondary'} size="icon"
              className={i !== safePage ? '!border-ink-200/60' : ''}>
              {i + 1}
            </Button>
          ))}
          {pageWindow[pageWindow.length - 1] < pages - 1 && (
            <>
              {pageWindow[pageWindow.length - 1] < pages - 2 && <span className="flex items-center px-1 text-xs text-ink-300 select-none">…</span>}
              <Button onClick={() => setPage(pages - 1)} variant={pages - 1 === safePage ? 'primary' : 'secondary'} size="icon"
                className={pages - 1 !== safePage ? '!border-ink-200/60' : ''}>{pages}</Button>
            </>
          )}
          <Button disabled={safePage === pages - 1} onClick={() => setPage(p => p + 1)} variant="secondary" size="icon"
            className="!border-ink-200/60 hover:!border-ink-300">
            <FontAwesomeIcon icon={faChevronRight} className="text-[14px]" />
          </Button>
        </div>
      </div>

      <Modal open={modalOpen} onClose={closeModal}
        title={!canManage ? 'Beneficiary Details' : editId ? 'Edit Beneficiary' : 'Add Beneficiary'} size="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Full Name</label>
            <input value={form.fullName || ''} onChange={e => canManage && setForm(f => ({ ...f, fullName: e.target.value }))}
              readOnly={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all read-only:bg-ink-50/50 read-only:cursor-default" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Age</label>
            <input type="number" value={form.age || ''} onChange={e => canManage && setForm(f => ({ ...f, age: Number(e.target.value) }))}
              readOnly={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all read-only:bg-ink-50/50 read-only:cursor-default" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Sex</label>
            <select value={form.sex || 'Male'} onChange={e => canManage && setForm(f => ({ ...f, sex: e.target.value as Beneficiary['sex'] }))}
              disabled={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none bg-white transition-all disabled:bg-ink-50/50 disabled:cursor-default disabled:opacity-70">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">District</label>
            <select value={form.district || 'Gasabo'} onChange={e => canManage && setForm(f => ({ ...f, district: e.target.value }))}
              disabled={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none bg-white transition-all disabled:bg-ink-50/50 disabled:cursor-default disabled:opacity-70">
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Sector</label>
            <input value={form.sector || ''} onChange={e => canManage && setForm(f => ({ ...f, sector: e.target.value }))}
              readOnly={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all read-only:bg-ink-50/50 read-only:cursor-default" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Cell</label>
            <input value={form.cell || ''} onChange={e => canManage && setForm(f => ({ ...f, cell: e.target.value }))}
              readOnly={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all read-only:bg-ink-50/50 read-only:cursor-default" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Phone</label>
            <input value={form.phone || ''} onChange={e => canManage && setForm(f => ({ ...f, phone: e.target.value }))}
              readOnly={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all read-only:bg-ink-50/50 read-only:cursor-default" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Category</label>
            <select value={form.category || 'Other'} onChange={e => canManage && setForm(f => ({ ...f, category: e.target.value as Beneficiary['category'] }))}
              disabled={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none bg-white transition-all disabled:bg-ink-50/50 disabled:cursor-default disabled:opacity-70">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">CHW Name</label>
            <input value={form.chwName || ''} onChange={e => canManage && setForm(f => ({ ...f, chwName: e.target.value }))}
              readOnly={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all read-only:bg-ink-50/50 read-only:cursor-default" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Status</label>
            <select value={form.status || 'active'} onChange={e => canManage && setForm(f => ({ ...f, status: e.target.value as Beneficiary['status'] }))}
              disabled={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none bg-white transition-all disabled:bg-ink-50/50 disabled:cursor-default disabled:opacity-70">
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Trauma Level</label>
            <select value={form.traumaLevel || 'low'} onChange={e => canManage && setForm(f => ({ ...f, traumaLevel: e.target.value as Beneficiary['traumaLevel'] }))}
              disabled={!canManage}
              className="w-full h-10 px-3 rounded-lg text-sm text-ink-600 border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 appearance-none cursor-pointer outline-none bg-white transition-all disabled:bg-ink-50/50 disabled:cursor-default disabled:opacity-70">
              {TRAUMA_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-ink-500 mb-1.5">Notes</label>
            <textarea value={form.notes || ''} onChange={e => canManage && setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
              readOnly={!canManage}
              className="w-full px-3 py-2 rounded-lg text-sm border border-ink-200/70 focus:border-brand-400 focus:ring-2 focus:ring-brand-200/30 outline-none bg-white transition-all resize-none read-only:bg-ink-50/50 read-only:cursor-default" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-ink-100/60">
          <button onClick={closeModal}
            className="h-10 px-5 rounded-xl text-sm font-medium text-ink-600 bg-ink-50 hover:bg-ink-100 transition-all">
            Cancel
          </button>
          {canManage && (
            <button onClick={handleSave}
              className="h-10 px-5 rounded-xl text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 transition-all">
              {editId ? 'Update' : 'Save'}
            </button>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Beneficiary"
        message={`Are you sure you want to delete ${deleteTarget?.fullName || ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}

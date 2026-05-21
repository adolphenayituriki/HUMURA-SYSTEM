import type {
  Beneficiary,
  ScreeningResult,
  Referral,
  SociotherapyGroup,
  SociotherapySession,
  Cooperative,
  EmergencyAlert,
  YouthParticipant,
  User,
  UserRole,
  SupportPlan,
  SupportStep,
} from '../types';
import { CATEGORY_TO_ROLES } from '../types';

const NAMES = [
  'Aline Uwimana', 'Muhire Claude', 'Ineza Jeannette', 'Habimana Eric',
  'Nyiraneza Claire', 'Ndayisenga Jean', 'Uwibuteye Esperance', 'Bizimungu Fidele',
  'Mukamana Angelique', 'Hategekimana Olivier', 'Kamanzi Didier', 'Uwimana Tharcisse',
  'Ingabire Immaculee', 'Nsengimana Valens', 'Mugisha Patrick', 'Uwineza Sonia',
];
const DISTRICTS = ['Gasabo', 'Kicukiro', 'Nyarugenge', 'Musanze', 'Rubavu', 'Huye', 'Muhanga', 'Nyagatare'];
const SECTORS: string[] = [];
DISTRICTS.forEach((d) => SECTORS.push(...Array.from({ length: 5 }, (_, i) => `${d}_Sector_${i + 1}`)));
const PHQ9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27];
const STATUSES = ['active', 'referred', 'in_treatment', 'recovered'];
const CATEGORIES = ['Genocide Survivor', 'Widow', 'Orphan', 'Former Perpetrator', 'Vulnerable Youth', 'Other'];
const REFERRAL_REASONS = [
  'Suspected PTSD symptoms', 'Severe depression', 'Anxiety disorder', 
  'Trauma crisis episode', 'Post-partum depression', 'Youth emotional distress',
  'Substance abuse', 'Domestic conflict', 'Grief counselling', 'Chronic trauma',
];
const EMERGENCY_TYPES = [
  'Suicidal ideation', 'Self-harm risk', 'Severe panic episode',
  'Psychotic episode', 'Trauma flashback crisis', 'Emotional breakdown',
];
const COOP_TYPES = ['SACCO', 'Agribusiness', 'Livestock', 'Tailoring', 'Retail', 'Other'];
const PHASES = ['Safety', 'Trust', 'Care', 'Respect', 'New Orientation', 'Memory and Reconciliation'] satisfies SociotherapyGroup['phase'][];
const YOUTH_PROGRAMS = ['School Counseling', 'Peace Education', 'Leadership Training', 'Life Skills', 'Dialogue Forums', 'Youth Club'];

function rnd<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function date(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
}

export const mockBeneficiaries: Beneficiary[] = Array.from({ length: 48 }, (_, i) => {
  const category = rnd(CATEGORIES) as Beneficiary['category'];
  return {
    id: `B-${String(i + 1).padStart(4, '0')}`,
    fullName: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${i + 1}` : ''),
    age: rndInt(14, 78),
    sex: Math.random() > 0.5 ? 'Female' : 'Male',
    district: rnd(DISTRICTS),
    sector: rnd(SECTORS),
    cell: `Cell_${rndInt(1, 15)}`,
    phone: `+250 78${String(rndInt(1000000, 9999999))}`,
    category,
    managedByRole: CATEGORY_TO_ROLES[category],
    chwId: `CHW-${String(rndInt(1, 10)).padStart(3, '0')}`,
    chwName: NAMES[rndInt(0, NAMES.length - 1)],
    registeredAt: date(rndInt(5, 730)),
    status: rnd(STATUSES) as Beneficiary['status'],
    traumaLevel: rnd(['low', 'medium', 'high'] as const),
    notes: '',
  };
});

export const mockScreenings: ScreeningResult[] = Array.from({ length: 30 }, (_, i) => {
  const phq9 = rnd(PHQ9), gad7 = rnd(PHQ9), pcl5 = rndInt(0, 80);
  let risk: 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (phq9 >= 15 || gad7 >= 15 || pcl5 >= 50) risk = 'critical';
  else if (phq9 >= 10 || gad7 >= 10 || pcl5 >= 33) risk = 'high';
  else if (phq9 >= 5 || gad7 >= 5) risk = 'medium';
  return {
    id: `SCR-${String(i + 1).padStart(4, '0')}`,
    beneficiaryId: mockBeneficiaries[i % mockBeneficiaries.length].id,
    beneficiaryName: mockBeneficiaries[i % mockBeneficiaries.length].fullName,
    screenedBy: NAMES[rndInt(0, NAMES.length - 1)],
    phq9Score: phq9,
    gad7Score: gad7,
    pcl5Score: pcl5,
    riskLevel: risk,
    recommendation: risk === 'critical' ? 'Immediate psychiatric referral' : risk === 'high' ? 'Urgent referral to health center' : risk === 'medium' ? 'Schedule follow-up counselling' : 'Community support monitoring',
    createdAt: date(rndInt(1, 180)),
  };
});

export const mockReferrals: Referral[] = Array.from({ length: 20 }, (_, i) => ({
  id: `REF-${String(i + 1).padStart(4, '0')}`,
  beneficiaryId: mockBeneficiaries[i % mockBeneficiaries.length].id,
  beneficiaryName: mockBeneficiaries[i % mockBeneficiaries.length].fullName,
  from: NAMES[rndInt(0, NAMES.length - 1)],
  fromRole: rnd(['CHW', 'Health Center', 'Community']),
  to: NAMES[rndInt(0, NAMES.length - 1)],
  toRole: rnd(['District Hospital', 'Health Center', 'Mobile Clinic', 'Specialist']),
  reason: rnd(REFERRAL_REASONS),
  priority: rnd(['routine', 'urgent', 'emergency'] as const),
  status: rnd(['pending', 'accepted', 'completed', 'cancelled'] as const),
  createdAt: date(rndInt(1, 60)),
  updatedAt: date(rndInt(0, 30)),
}));

export const mockSupportPlans: SupportPlan[] = Array.from({ length: 6 }, (_, i) => {
  const ref = mockReferrals[i % mockReferrals.length];
  return {
    id: `SP-${String(i + 1).padStart(4, '0')}`,
    referralId: ref.id,
    beneficiaryId: ref.beneficiaryId,
    beneficiaryName: ref.beneficiaryName,
    openedAt: date(rndInt(1, 30)),
    updatedAt: date(rndInt(0, 15)),
    assignedManager: NAMES[rndInt(0, NAMES.length - 1)],
    managerRole: rnd(['sociotherapy_facilitator', 'district_hospital', 'health_center', 'chw']),
    priority: ref.priority,
    status: rnd(['active', 'active', 'on_hold', 'closed'] as const),
    summary: rnd(REFERRAL_REASONS),
    steps: [
      { id: `${ref.id}-s1`, action: 'Initial assessment & intake', assignedTo: NAMES[rndInt(0, NAMES.length - 1)], status: rnd(['completed', 'in_progress', 'pending'] as const) },
      { id: `${ref.id}-s2`, action: 'Develop personalized care plan', assignedTo: NAMES[rndInt(0, NAMES.length - 1)], status: rnd(['completed', 'in_progress', 'pending'] as const) },
      { id: `${ref.id}-s3`, action: 'Schedule first follow-up session', assignedTo: NAMES[rndInt(0, NAMES.length - 1)], status: rnd(['in_progress', 'pending'] as const) },
      { id: `${ref.id}-s4`, action: 'Connect to relevant support services', assignedTo: NAMES[rndInt(0, NAMES.length - 1)], status: rnd(['pending'] as const) },
      { id: `${ref.id}-s5`, action: 'Monthly progress review', assignedTo: NAMES[rndInt(0, NAMES.length - 1)], status: rnd(['pending'] as const) },
    ],
  };
});

export const mockSociotherapyGroups: SociotherapyGroup[] = Array.from({ length: 12 }, (_, i) => ({
  id: `SG-${String(i + 1).padStart(3, '0')}`,
  name: `Healing Circle ${i + 1}`,
  phase: PHASES[i % PHASES.length],
  facilitatorId: `FAC-${String(i + 1).padStart(3, '0')}`,
  facilitatorName: NAMES[rndInt(0, NAMES.length - 1)],
  location: `${rnd(DISTRICTS)} / ${rnd(SECTORS)}`,
  memberCount: rndInt(6, 15),
  maxMembers: 15,
  status: rndInt(0, 12) > 3 ? 'active' : rndInt(0, 1) ? 'completed' : 'paused',
  startedAt: date(rndInt(30, 500)),
}));

export const mockSessions: SociotherapySession[] = mockSociotherapyGroups.flatMap((g) =>
  Array.from({ length: rndInt(2, 6) }, (_, j) => ({
    id: `SES-${g.id}-${j + 1}`,
    groupId: g.id,
    groupName: g.name,
    date: date(rndInt(1, 60)),
    theme: `Weekly ${g.phase} session`,
    phase: g.phase,
    facilitator: g.facilitatorName,
    attendance: rndInt(g.memberCount - 3, g.memberCount),
    notes: '',
  }))
);

export const mockCooperatives: Cooperative[] = Array.from({ length: 10 }, (_, i) => ({
  id: `COOP-${String(i + 1).padStart(3, '0')}`,
  name: `Unity Cooperative ${i + 1}`,
  type: rnd(COOP_TYPES) as Cooperative['type'],
  district: rnd(DISTRICTS),
  leaderId: `LD-${String(i + 1).padStart(3, '0')}`,
  leaderName: NAMES[rndInt(0, NAMES.length - 1)],
  memberCount: rndInt(12, 50),
  femaleMembers: rndInt(8, 30),
  totalCapital: rndInt(300000, 5000000),
  status: rnd(['active', 'forming', 'dormant'] as const),
  registeredAt: date(rndInt(60, 1000)),
}));

export const mockEmergencies: EmergencyAlert[] = Array.from({ length: 18 }, (_, i) => ({
  id: `EMG-${String(i + 1).padStart(4, '0')}`,
  beneficiaryId: mockBeneficiaries[i % mockBeneficiaries.length].id,
  beneficiaryName: mockBeneficiaries[i % mockBeneficiaries.length].fullName,
  triggeredBy: NAMES[rndInt(0, NAMES.length - 1)],
  riskLevel: rnd(['high', 'critical', 'critical'] as const),
  type: rnd(EMERGENCY_TYPES),
  location: `${rnd(DISTRICTS)} / ${rnd(SECTORS)}`,
  responseTeam: `Emergency Response Team ${rndInt(1, 4)}`,
  status: rnd(['new', 'dispatched', 'resolved', 'false_alarm'] as const),
  createdAt: date(rndInt(1, 60)),
  resolvedAt: Math.random() > 0.4 ? date(rndInt(0, 5)) : undefined,
}));

export const mockYouth: YouthParticipant[] = Array.from({ length: 40 }, (_, i) => ({
  id: `YTH-${String(i + 1).padStart(4, '0')}`,
  fullName: NAMES[rndInt(0, NAMES.length - 1)] + (i >= NAMES.length ? ` ${i + 1}` : ''),
  age: rndInt(13, 24),
  school: `School ${rndInt(1, 25)} - ${rnd(DISTRICTS)}`,
  district: rnd(DISTRICTS),
  program: rnd(YOUTH_PROGRAMS),
  enrolledAt: date(rndInt(30, 500)),
  status: rnd(['active', 'active', 'active', 'graduated', 'withdrawn'] as const),
  emotionalScore: rndInt(25, 95),
  counselorId: `CNS-${String(rndInt(1, 6)).padStart(3, '0')}`,
}));

export const mockUsers: Array<{ id: string; role: UserRole; fullName: string; email: string; facility?: string; district?: string; avatar?: string }> = [
  { id: 'U-001', role: 'admin', fullName: 'Dr. Alice Mugabo', email: 'alice@humura.gov.rw', avatar: '/adolphe profile.jpg' },
  { id: 'U-002', role: 'district_hospital', fullName: 'Dr. Eric Ndayisenga', email: 'eric@hospital.gov.rw', facility: 'Musanze District Hospital', district: 'Musanze', avatar: '/adolphe profile.jpg' },
  { id: 'U-003', role: 'health_center', fullName: 'Nurse Esperance Uwibuteye', email: 'esperance@hc.gov.rw', facility: 'Gasabo Health Center', district: 'Gasabo', avatar: '/adolphe profile.jpg' },
  { id: 'U-004', role: 'chw', fullName: 'Muhire Claude', email: 'claude@chw.gov.rw', facility: 'Kicukiro Health Center', district: 'Kicukiro', avatar: '/adolphe profile.jpg' },
  { id: 'U-005', role: 'sociotherapy_facilitator', fullName: 'Ineza Jeannette', email: 'jeannette@humura.gov.rw', district: 'Huye', avatar: '/adolphe profile.jpg' },
  { id: 'U-006', role: 'cooperative_leader', fullName: 'Mukamana Angelique', email: 'angelique@coop.gov.rw', district: 'Rubavu', avatar: '/adolphe profile.jpg' },
  { id: 'U-007', role: 'youth_counselor', fullName: 'Kamanzi Didier', email: 'didier@youth.gov.rw', district: 'Nyagatare', avatar: '/adolphe profile.jpg' },
  { id: 'U-008', role: 'emergency_responder', fullName: 'Response Team Lead', email: 'emergency@humura.gov.rw', facility: 'Mobile Emergency Unit', district: 'Nyarugenge', avatar: '/adolphe profile.jpg' },
  { id: 'U-009', role: 'community_member', fullName: 'Habimana Eric', email: 'eric@humura.gov.rw', district: 'Muhanga', avatar: '/adolphe profile.jpg' },
];

export const service = {
  getBeneficiaries: (filters?: { district?: string; status?: string }) => {
    let data = [...mockBeneficiaries];
    if (filters?.district) data = data.filter((b) => b.district === filters.district);
    if (filters?.status) data = data.filter((b) => b.status === filters.status);
    return data;
  },
  getBeneficiary: (id: string) => mockBeneficiaries.find((b) => b.id === id) ?? null,
  addBeneficiary: (b: Beneficiary) => { mockBeneficiaries.unshift({ ...b, managedByRole: CATEGORY_TO_ROLES[b.category] }); return b; },
  getBeneficiariesByRole: (role: UserRole) => mockBeneficiaries.filter((b) => b.managedByRole.includes(role)),
  updateBeneficiary(id: string, data: Partial<Beneficiary>) {
    const b = mockBeneficiaries.find((b) => b.id === id);
    if (b) Object.assign(b, data);
    return b;
  },
  deleteBeneficiary(id: string) {
    const idx = mockBeneficiaries.findIndex((b) => b.id === id);
    if (idx !== -1) mockBeneficiaries.splice(idx, 1);
    return idx !== -1;
  },
  getScreenings: (filters?: { risk?: string; beneficiaryId?: string }) => {
    let data = [...mockScreenings];
    if (filters?.risk) data = data.filter((s) => s.riskLevel === filters.risk);
    if (filters?.beneficiaryId) data = data.filter((s) => s.beneficiaryId === filters.beneficiaryId);
    return data;
  },
  addScreening(s: ScreeningResult) { mockScreenings.unshift(s); return s; },
  updateScreening(id: string, data: Partial<ScreeningResult>) {
    const s = mockScreenings.find((s) => s.id === id);
    if (s) Object.assign(s, data);
    return s;
  },
  deleteScreening(id: string) {
    const idx = mockScreenings.findIndex((s) => s.id === id);
    if (idx !== -1) mockScreenings.splice(idx, 1);
    return idx !== -1;
  },
  getReferrals: (filters?: { status?: string; priority?: string }) => {
    let data = [...mockReferrals];
    if (filters?.status) data = data.filter((r) => r.status === filters.status);
    if (filters?.priority) data = data.filter((r) => r.priority === filters.priority);
    return data;
  },
  addReferral(r: Referral) { mockReferrals.unshift(r); return r; },
  updateReferral(id: string, data: Partial<Referral>) {
    const ref = mockReferrals.find((r) => r.id === id);
    if (ref) { Object.assign(ref, data); ref.updatedAt = date(0); }
    return ref;
  },
  updateReferralStatus(id: string, status: Referral['status']) {
    const ref = mockReferrals.find((r) => r.id === id);
    if (ref) { ref.status = status; ref.updatedAt = date(0); }
    return ref;
  },
  deleteReferral(id: string) {
    const idx = mockReferrals.findIndex((r) => r.id === id);
    if (idx !== -1) mockReferrals.splice(idx, 1);
    return idx !== -1;
  },
  getSupportPlans: () => mockSupportPlans,
  getSupportPlan: (referralId: string) => mockSupportPlans.find(p => p.referralId === referralId) ?? null,
  openSupportPlan: (referralId: string, manager: string, managerRole: string, summary: string) => {
    const ref = mockReferrals.find(r => r.id === referralId);
    if (!ref) return null;
    const plan: SupportPlan = {
      id: `SP-${String(mockSupportPlans.length + 1).padStart(4, '0')}`,
      referralId,
      beneficiaryId: ref.beneficiaryId,
      beneficiaryName: ref.beneficiaryName,
      openedAt: date(0),
      updatedAt: date(0),
      assignedManager: manager,
      managerRole,
      priority: ref.priority,
      status: 'active',
      summary,
      steps: [
        { id: `${referralId}-s1`, action: 'Initial assessment & intake', assignedTo: manager, status: 'pending' },
        { id: `${referralId}-s2`, action: 'Develop personalized care plan', assignedTo: manager, status: 'pending' },
        { id: `${referralId}-s3`, action: 'Schedule first follow-up session', assignedTo: manager, status: 'pending' },
        { id: `${referralId}-s4`, action: 'Connect to relevant support services', assignedTo: manager, status: 'pending' },
        { id: `${referralId}-s5`, action: 'Monthly progress review', assignedTo: manager, status: 'pending' },
      ],
    };
    mockSupportPlans.push(plan);
    return plan;
  },
  updateSupportStep: (planId: string, stepId: string, data: Partial<SupportStep>) => {
    const plan = mockSupportPlans.find(p => p.id === planId);
    if (!plan) return null;
    const step = plan.steps.find(s => s.id === stepId);
    if (step) Object.assign(step, data);
    plan.updatedAt = date(0);
    return plan;
  },
  closeSupportPlan: (planId: string) => {
    const plan = mockSupportPlans.find(p => p.id === planId);
    if (!plan) return null;
    plan.status = 'closed';
    plan.updatedAt = date(0);
    return plan;
  },
  getSociotherapyGroups: () => mockSociotherapyGroups,
  addGroup(g: SociotherapyGroup) { mockSociotherapyGroups.push(g); return g; },
  updateGroup(id: string, data: Partial<SociotherapyGroup>) {
    const g = mockSociotherapyGroups.find((g) => g.id === id);
    if (g) Object.assign(g, data);
    return g;
  },
  deleteGroup(id: string) {
    const idx = mockSociotherapyGroups.findIndex((g) => g.id === id);
    if (idx !== -1) mockSociotherapyGroups.splice(idx, 1);
    return idx !== -1;
  },
  getSessions: (groupId?: string) => groupId ? mockSessions.filter(s => s.groupId === groupId) : mockSessions,
  addSession(s: SociotherapySession) { mockSessions.unshift(s); return s; },
  updateSession(id: string, data: Partial<SociotherapySession>) {
    const s = mockSessions.find((s) => s.id === id);
    if (s) Object.assign(s, data);
    return s;
  },
  deleteSession(id: string) {
    const idx = mockSessions.findIndex((s) => s.id === id);
    if (idx !== -1) mockSessions.splice(idx, 1);
    return idx !== -1;
  },
  getCooperatives: () => mockCooperatives,
  addCooperative(c: Cooperative) { mockCooperatives.push(c); return c; },
  updateCooperative(id: string, data: Partial<Cooperative>) {
    const c = mockCooperatives.find((c) => c.id === id);
    if (c) Object.assign(c, data);
    return c;
  },
  deleteCooperative(id: string) {
    const idx = mockCooperatives.findIndex((c) => c.id === id);
    if (idx !== -1) mockCooperatives.splice(idx, 1);
    return idx !== -1;
  },
  getEmergencies: (filters?: { status?: string }) => {
    let data = [...mockEmergencies];
    if (filters?.status) data = data.filter((e) => e.status === filters.status);
    return data;
  },
  addEmergency(e: EmergencyAlert) { mockEmergencies.unshift(e); return e; },
  updateEmergency(id: string, data: Partial<EmergencyAlert>) {
    const e = mockEmergencies.find((e) => e.id === id);
    if (e) { Object.assign(e, data); if (data.status === 'resolved') e.resolvedAt = date(0); }
    return e;
  },
  updateEmergencyStatus(id: string, status: EmergencyAlert['status']) {
    const e = mockEmergencies.find((e) => e.id === id);
    if (e) { e.status = status; if (status === 'resolved') e.resolvedAt = date(0); }
    return e;
  },
  deleteEmergency(id: string) {
    const idx = mockEmergencies.findIndex((e) => e.id === id);
    if (idx !== -1) mockEmergencies.splice(idx, 1);
    return idx !== -1;
  },
  getYouthParticipants: (filters?: { district?: string; status?: string }) => {
    let data = [...mockYouth];
    if (filters?.district) data = data.filter((y) => y.district === filters.district);
    if (filters?.status) data = data.filter((y) => y.status === filters.status);
    return data;
  },
  addYouth(y: YouthParticipant) { mockYouth.unshift(y); return y; },
  updateYouth(id: string, data: Partial<YouthParticipant>) {
    const y = mockYouth.find((y) => y.id === id);
    if (y) Object.assign(y, data);
    return y;
  },
  deleteYouth(id: string) {
    const idx = mockYouth.findIndex((y) => y.id === id);
    if (idx !== -1) mockYouth.splice(idx, 1);
    return idx !== -1;
  },
  getUsers: () => mockUsers,
  addUser(u: User) { mockUsers.unshift(u); return u; },
  updateUser(id: string, data: Partial<User>) {
    const u = mockUsers.find((u) => u.id === id);
    if (u) Object.assign(u, data);
    return u;
  },
  deleteUser(id: string) {
    const idx = mockUsers.findIndex((u) => u.id === id);
    if (idx !== -1) mockUsers.splice(idx, 1);
    return idx !== -1;
  },
  getStats: () => ({
    totalBeneficiaries: mockBeneficiaries.length,
    screeningsDone: mockScreenings.length,
    activeGroups: mockSociotherapyGroups.filter(g => g.status === 'active').length,
    cooperativesActive: mockCooperatives.filter(c => c.status === 'active').length,
    emergencyCases: mockEmergencies.filter(e => e.status !== 'resolved' && e.status !== 'false_alarm').length,
    treatmentComplete: mockBeneficiaries.filter(b => b.status === 'recovered').length,
    totalCHWs: 10,
    totalSurveyedBy: NAMES.length,
    activeEmergencies: mockEmergencies.filter(e => e.status === 'new' || e.status === 'dispatched').length,
  }),
};

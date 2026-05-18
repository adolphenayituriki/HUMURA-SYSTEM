import type {
  Beneficiary,
  ScreeningResult,
  Referral,
  SociotherapyGroup,
  SociotherapySession,
  Cooperative,
  EmergencyAlert,
  YouthParticipant,
  UserRole,
} from '../types';

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

export const mockBeneficiaries: Beneficiary[] = Array.from({ length: 48 }, (_, i) => ({
  id: `B-${String(i + 1).padStart(4, '0')}`,
  fullName: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ${i + 1}` : ''),
  age: rndInt(14, 78),
  sex: Math.random() > 0.5 ? 'Female' : 'Male',
  district: rnd(DISTRICTS),
  sector: rnd(SECTORS),
  cell: `Cell_${rndInt(1, 15)}`,
  phone: `+250 78${String(rndInt(1000000, 9999999))}`,
  category: rnd(CATEGORIES) as Beneficiary['category'],
  chwId: `CHW-${String(rndInt(1, 10)).padStart(3, '0')}`,
  chwName: NAMES[rndInt(0, NAMES.length - 1)],
  registeredAt: date(rndInt(5, 730)),
  status: rnd(STATUSES) as Beneficiary['status'],
  traumaLevel: rnd(['low', 'medium', 'high'] as const),
  notes: '',
}));

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

export const mockUsers: Array<{ id: string; role: UserRole; fullName: string; email: string; facility?: string; district?: string }> = [
  { id: 'U-001', role: 'admin', fullName: 'Dr. Alice Mugabo', email: 'alice@humura.gov.rw' },
  { id: 'U-002', role: 'district_hospital', fullName: 'Dr. Eric Ndayisenga', email: 'eric@hospital.gov.rw', facility: 'Musanze District Hospital', district: 'Musanze' },
  { id: 'U-003', role: 'health_center', fullName: 'Nurse Esperance Uwibuteye', email: 'esperance@hc.gov.rw', facility: 'Gasabo Health Center', district: 'Gasabo' },
  { id: 'U-004', role: 'chw', fullName: 'Muhire Claude', email: 'claude@chw.gov.rw', facility: 'Kicukiro Health Center', district: 'Kicukiro' },
  { id: 'U-005', role: 'sociotherapy_facilitator', fullName: 'Ineza Jeannette', email: 'jeannette@humura.gov.rw', district: 'Huye' },
  { id: 'U-006', role: 'cooperative_leader', fullName: 'Mukamana Angelique', email: 'angelique@coop.gov.rw', district: 'Rubavu' },
  { id: 'U-007', role: 'youth_counselor', fullName: 'Kamanzi Didier', email: 'didier@youth.gov.rw', district: 'Nyagatare' },
  { id: 'U-008', role: 'emergency_responder', fullName: 'Response Team Lead', email: 'emergency@humura.gov.rw', facility: 'Mobile Emergency Unit', district: 'Nyarugenge' },
  { id: 'U-009', role: 'community_member', fullName: 'Habimana Eric', email: 'eric@humura.gov.rw', district: 'Muhanga' },
];

export const service = {
  getBeneficiaries: (filters?: { district?: string; status?: string }) => {
    let data = [...mockBeneficiaries];
    if (filters?.district) data = data.filter((b) => b.district === filters.district);
    if (filters?.status) data = data.filter((b) => b.status === filters.status);
    return data;
  },
  getBeneficiary: (id: string) => mockBeneficiaries.find((b) => b.id === id) ?? null,
  addBeneficiary: (b: Beneficiary) => { mockBeneficiaries.unshift(b); return b; },
  getScreenings: (filters?: { risk?: string; beneficiaryId?: string }) => {
    let data = [...mockScreenings];
    if (filters?.risk) data = data.filter((s) => s.riskLevel === filters.risk);
    if (filters?.beneficiaryId) data = data.filter((s) => s.beneficiaryId === filters.beneficiaryId);
    return data;
  },
  addScreening(s: ScreeningResult) { mockScreenings.unshift(s); return s; },
  getReferrals: (filters?: { status?: string; priority?: string }) => {
    let data = [...mockReferrals];
    if (filters?.status) data = data.filter((r) => r.status === filters.status);
    if (filters?.priority) data = data.filter((r) => r.priority === filters.priority);
    return data;
  },
  addReferral(r: Referral) { mockReferrals.unshift(r); return r; },
  updateReferralStatus(id: string, status: Referral['status']) {
    const ref = mockReferrals.find((r) => r.id === id);
    if (ref) { ref.status = status; ref.updatedAt = date(0); }
    return ref;
  },
  getSociotherapyGroups: () => mockSociotherapyGroups,
  getSessions: (groupId?: string) => groupId ? mockSessions.filter(s => s.groupId === groupId) : mockSessions,
  addGroup(g: SociotherapyGroup) { mockSociotherapyGroups.push(g); return g; },
  getCooperatives: () => mockCooperatives,
  addCooperative(c: Cooperative) { mockCooperatives.push(c); return c; },
  getEmergencies: (filters?: { status?: string }) => {
    let data = [...mockEmergencies];
    if (filters?.status) data = data.filter((e) => e.status === filters.status);
    return data;
  },
  updateEmergencyStatus(id: string, status: EmergencyAlert['status']) {
    const e = mockEmergencies.find((e) => e.id === id);
    if (e) { e.status = status; if (status === 'resolved') e.resolvedAt = date(0); }
    return e;
  },
  getYouthParticipants: (filters?: { district?: string; status?: string }) => {
    let data = [...mockYouth];
    if (filters?.district) data = data.filter((y) => y.district === filters.district);
    if (filters?.status) data = data.filter((y) => y.status === filters.status);
    return data;
  },
  getUsers: () => mockUsers,
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

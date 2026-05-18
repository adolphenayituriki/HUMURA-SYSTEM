export type UserRole =
  | 'admin'
  | 'district_hospital'
  | 'health_center'
  | 'chw'
  | 'sociotherapy_facilitator'
  | 'cooperative_leader'
  | 'youth_counselor'
  | 'emergency_responder'
  | 'community_member';

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  facility?: string;
  district?: string;
  avatar?: string;
}

export interface Beneficiary {
  id: string;
  fullName: string;
  age: number;
  sex: 'Male' | 'Female';
  district: string;
  sector: string;
  cell: string;
  phone: string;
  category: 'Genocide Survivor' | 'Widow' | 'Orphan' | 'Former Perpetrator' | 'Vulnerable Youth' | 'Other';
  chwId: string;
  chwName: string;
  registeredAt: string;
  status: 'active' | 'referred' | 'in_treatment' | 'recovered';
  traumaLevel: 'low' | 'medium' | 'high';
  notes: string;
}

export interface ScreeningResult {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  screenedBy: string;
  phq9Score: number;
  gad7Score: number;
  pcl5Score: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
  createdAt: string;
}

export interface Referral {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  from: string;
  fromRole: string;
  to: string;
  toRole: string;
  reason: string;
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface SociotherapyGroup {
  id: string;
  name: string;
  phase: 'Safety' | 'Trust' | 'Care' | 'Respect' | 'New Orientation' | 'Memory and Reconciliation';
  facilitatorId: string;
  facilitatorName: string;
  location: string;
  memberCount: number;
  maxMembers: number;
  status: 'active' | 'completed' | 'paused';
  startedAt: string;
}

export interface SociotherapySession {
  id: string;
  groupId: string;
  groupName: string;
  date: string;
  theme: string;
  phase: string;
  facilitator: string;
  attendance: number;
  notes: string;
}

export interface Cooperative {
  id: string;
  name: string;
  type: 'SACCO' | 'Agribusiness' | 'Livestock' | 'Tailoring' | 'Retail' | 'Other';
  district: string;
  leaderId: string;
  leaderName: string;
  memberCount: number;
  femaleMembers: number;
  totalCapital: number;
  status: 'active' | 'forming' | 'dormant';
  registeredAt: string;
}

export interface EmergencyAlert {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  triggeredBy: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  location: string;
  responseTeam: string;
  status: 'new' | 'dispatched' | 'resolved' | 'false_alarm';
  createdAt: string;
  resolvedAt?: string;
}

export interface YouthParticipant {
  id: string;
  fullName: string;
  age: number;
  school: string;
  district: string;
  program: string;
  enrolledAt: string;
  status: 'active' | 'graduated' | 'withdrawn';
  emotionalScore: number;
  counselorId: string;
}

export interface ReportData {
  totalBeneficiaries: number;
  screeningsDone: number;
  activeGroups: number;
  cooperativesActive: number;
  emergencyCases: number;
  treatmentComplete: number;
}

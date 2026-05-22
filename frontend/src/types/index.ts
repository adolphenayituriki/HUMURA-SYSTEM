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

export const CATEGORY_TO_ROLES: Record<Beneficiary['category'], UserRole[]> = {
  'Genocide Survivor': ['sociotherapy_facilitator', 'district_hospital'],
  'Widow': ['health_center', 'chw'],
  'Orphan': ['youth_counselor', 'chw'],
  'Former Perpetrator': ['sociotherapy_facilitator'],
  'Vulnerable Youth': ['youth_counselor', 'chw'],
  'Other': ['health_center', 'chw', 'district_hospital', 'sociotherapy_facilitator'],
};

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
  managedByRole: UserRole[];
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

export interface SupportStep {
  id: string;
  action: string;
  assignedTo: string;
  status: 'pending' | 'in_progress' | 'done';
  dueDate?: string;
  notes?: string;
}

export interface SupportPlan {
  id: string;
  referralId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  openedAt: string;
  updatedAt: string;
  assignedManager: string;
  managerRole: string;
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'active' | 'on_hold' | 'closed';
  steps: SupportStep[];
  summary: string;
  followUpNotes?: string;
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
  followUpNotes?: string;
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
  emergencyCases: number;
  treatmentComplete: number;
}

export interface Counselor {
  id: string;
  fullName: string;
  title: string;
  specialty: string;
  district: string;
  available: boolean;
  rating: number;
  sessionCount: number;
  languages: string[];
  avatar?: string;
}

export interface CounselingSession {
  id: string;
  counselorId: string;
  counselorName: string;
  userId: string;
  lastMessage: string;
  lastMessageAt: string;
  status: 'active' | 'resolved' | 'pending';
  unreadCount: number;
  messages: Array<{
    id: string;
    from: 'user' | 'counselor';
    text: string;
    sentAt: string;
  }>;
}

export interface PeerSupportGroup {
  id: string;
  name: string;
  description: string;
  topic: string;
  memberCount: number;
  maxMembers: number;
  meetingSchedule: string;
  district: string;
  facilitatorName: string;
  isJoined: boolean;
}

export interface CopingSession {
  id: string;
  type: 'breathing' | 'meditation' | 'grounding' | 'journaling';
  duration: number;
  completedAt: string;
  moodBefore?: number;
  moodAfter?: number;
}

export interface HealingStory {
  id: string;
  title: string;
  author: string;
  age: number;
  district: string;
  excerpt: string;
  content: string;
  image: string;
  tags: string[];
  featured: boolean;
}

export interface HealingVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  src?: string;
  category: 'guided' | 'story' | 'educational';
}

export interface HealingAudio {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: 'meditation' | 'breathing' | 'calming' | 'guidance';
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: 'coping' | 'mindfulness' | 'gratitude' | 'resilience';
}

export interface SupportRequest {
  id: string;
  userId: string;
  userName: string;
  district: string;
  supportType: 'counseling' | 'sociotherapy' | 'youth' | 'emergency' | 'other';
  message: string;
  preferredContact: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
  assignedTo?: string;
  assignedToRole?: string;
}

export interface YouthResource {
  id: string;
  topic: 'identity' | 'inheritedTrauma' | 'emotionalAwareness' | 'peerPressure';
  title: string;
  summary: string;
  icon: string;
  color: string;
  practices: string[];
}

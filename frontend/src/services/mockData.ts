import type {
  Beneficiary,
  ScreeningResult,
  Referral,
  SociotherapyGroup,
  SociotherapySession,
  EmergencyAlert,
  YouthParticipant,
  User,
  UserRole,
  SupportPlan,
  SupportStep,
  Counselor,
  CounselingSession,
  PeerSupportGroup,
  CopingSession,
  DailyTip,
  YouthResource,
  HealingStory,
  HealingVideo,
  HealingAudio,
  SupportRequest,
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
      { id: `${ref.id}-s1`, action: 'Initial assessment & intake', assignedTo: NAMES[rndInt(0, NAMES.length - 1)], status: rnd(['done', 'in_progress', 'pending'] as const) },
      { id: `${ref.id}-s2`, action: 'Develop personalized care plan', assignedTo: NAMES[rndInt(0, NAMES.length - 1)], status: rnd(['done', 'in_progress', 'pending'] as const) },
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

export const mockCounselors: Counselor[] = [
  { id: 'C-001', fullName: 'Marie Uwimana', title: 'Licensed Counselor', specialty: 'Trauma & Grief', district: 'Gasabo', available: true, rating: 4.8, sessionCount: 127, languages: ['English', 'Kinyarwanda'] },
  { id: 'C-002', fullName: 'Jean-Pierre Habimana', title: 'Clinical Psychologist', specialty: 'Anxiety & Depression', district: 'Kicukiro', available: true, rating: 4.9, sessionCount: 203, languages: ['English', 'French', 'Kinyarwanda'] },
  { id: 'C-003', fullName: 'Claudine Nyiraneza', title: 'Youth Counselor', specialty: 'Adolescent Mental Health', district: 'Nyarugenge', available: false, rating: 4.7, sessionCount: 89, languages: ['English', 'Kinyarwanda'] },
  { id: 'C-004', fullName: 'Emmanuel Ndayisenga', title: 'Sociotherapy Facilitator', specialty: 'Group Therapy & Reconciliation', district: 'Musanze', available: true, rating: 4.6, sessionCount: 156, languages: ['Kinyarwanda'] },
  { id: 'C-005', fullName: 'Alice Mugabo', title: 'Trauma Specialist', specialty: 'PTSD & Crisis Intervention', district: 'Huye', available: true, rating: 4.9, sessionCount: 211, languages: ['English', 'French', 'Kinyarwanda'] },
  { id: 'C-006', fullName: 'David Hakizimana', title: 'Peer Support Coach', specialty: 'Substance Abuse & Recovery', district: 'Rubavu', available: true, rating: 4.5, sessionCount: 73, languages: ['Kinyarwanda'] },
];
export const mockCounselingSessions: CounselingSession[] = [
  {
    id: 'CS-001', counselorId: 'C-001', counselorName: 'Marie Uwimana', userId: 'U-009',
    lastMessage: 'I have been practicing the breathing exercises you recommended', lastMessageAt: date(0),
    status: 'active', unreadCount: 2,
    messages: [
      { id: 'm1', from: 'counselor', text: 'Hello! How are you feeling today?', sentAt: date(2) },
      { id: 'm2', from: 'user', text: 'A bit anxious, but better than yesterday.', sentAt: date(2) },
      { id: 'm3', from: 'counselor', text: 'That is good progress. Have you tried the grounding exercise?', sentAt: date(1) },
      { id: 'm4', from: 'user', text: 'I have been practicing the breathing exercises you recommended', sentAt: date(0) },
    ],
  },
  {
    id: 'CS-002', counselorId: 'C-003', counselorName: 'Claudine Nyiraneza', userId: 'U-009',
    lastMessage: 'Your next session is scheduled for Friday at 3 PM', lastMessageAt: date(1),
    status: 'active', unreadCount: 0,
    messages: [
      { id: 'm5', from: 'counselor', text: 'Your next session is scheduled for Friday at 3 PM', sentAt: date(1) },
    ],
  },
  {
    id: 'CS-003', counselorId: 'C-004', counselorName: 'Emmanuel Ndayisenga', userId: 'U-009',
    lastMessage: 'Thank you for sharing your story in group today', lastMessageAt: date(3),
    status: 'resolved', unreadCount: 0,
    messages: [
      { id: 'm6', from: 'counselor', text: 'Thank you for sharing your story in group today', sentAt: date(3) },
      { id: 'm7', from: 'user', text: 'It was difficult but I feel better now', sentAt: date(3) },
    ],
  },
];
export const mockPeerSupportGroups: PeerSupportGroup[] = [
  { id: 'PSG-001', name: 'Young Mothers Circle', description: 'A safe space for young mothers to share experiences and support each other', topic: 'Parenting & Emotional Support', memberCount: 12, maxMembers: 20, meetingSchedule: 'Saturdays, 10 AM', district: 'Gasabo', facilitatorName: 'Marie Uwimana', isJoined: true },
  { id: 'PSG-002', name: 'Men\'s Healing Group', description: 'Open discussion for men navigating trauma, work stress, and family relationships', topic: 'Men\'s Mental Health', memberCount: 8, maxMembers: 15, meetingSchedule: 'Wednesdays, 5 PM', district: 'Kicukiro', facilitatorName: 'Jean-Pierre Habimana', isJoined: false },
  { id: 'PSG-003', name: 'Youth Resilience Network', description: 'Peer-led group for young people (16-25) building coping skills and community', topic: 'Youth Empowerment', memberCount: 18, maxMembers: 25, meetingSchedule: 'Tuesdays & Thursdays, 4 PM', district: 'Nyarugenge', facilitatorName: 'Claudine Nyiraneza', isJoined: false },
  { id: 'PSG-004', name: 'Grief & Loss Support', description: 'Compassionate peer support for those processing loss and bereavement', topic: 'Grief Support', memberCount: 9, maxMembers: 15, meetingSchedule: 'Mondays, 6 PM', district: 'Musanze', facilitatorName: 'Emmanuel Ndayisenga', isJoined: true },
  { id: 'PSG-005', name: 'Healing Through Art', description: 'Express yourself through art, music, and creative writing in a supportive group', topic: 'Creative Healing', memberCount: 14, maxMembers: 20, meetingSchedule: 'Fridays, 3 PM', district: 'Huye', facilitatorName: 'Alice Mugabo', isJoined: false },
  { id: 'PSG-006', name: 'Substance Recovery Circle', description: 'Peer support for individuals on a recovery journey from substance use', topic: 'Recovery Support', memberCount: 7, maxMembers: 12, meetingSchedule: 'Daily, 7 PM (Online)', district: 'Rubavu', facilitatorName: 'David Hakizimana', isJoined: false },
];
export const mockCopingSessions: CopingSession[] = [
  { id: 'CP-001', type: 'breathing', duration: 16, completedAt: date(0), moodBefore: 3, moodAfter: 4 },
  { id: 'CP-002', type: 'meditation', duration: 300, completedAt: date(1), moodBefore: 2, moodAfter: 4 },
  { id: 'CP-003', type: 'grounding', duration: 40, completedAt: date(2), moodBefore: 3, moodAfter: 5 },
  { id: 'CP-004', type: 'breathing', duration: 16, completedAt: date(3), moodBefore: 2, moodAfter: 3 },
  { id: 'CP-005', type: 'journaling', duration: 600, completedAt: date(4), moodBefore: 3, moodAfter: 4 },
  { id: 'CP-006', type: 'breathing', duration: 16, completedAt: date(5), moodBefore: 4, moodAfter: 4 },
  { id: 'CP-007', type: 'meditation', duration: 600, completedAt: date(6), moodBefore: 2, moodAfter: 5 },
  { id: 'CP-008', type: 'breathing', duration: 16, completedAt: date(7), moodBefore: 3, moodAfter: 4 },
  { id: 'CP-009', type: 'grounding', duration: 40, completedAt: date(8), moodBefore: 1, moodAfter: 3 },
  { id: 'CP-010', type: 'breathing', duration: 16, completedAt: date(9), moodBefore: 3, moodAfter: 5 },
];
export const mockDailyTips: DailyTip[] = [
  { id: 'DT-001', title: 'Take a Breathing Break', content: 'Pause for 60 seconds. Inhale deeply for 4 counts, hold for 4, exhale for 4. Notice how your body feels afterward.', category: 'coping' },
  { id: 'DT-002', title: 'Name Your Emotions', content: 'Identify what you are feeling right now. Is it sadness, anxiety, anger, or something else? Naming emotions reduces their intensity.', category: 'mindfulness' },
  { id: 'DT-003', title: 'One Thing You Are Grateful For', content: 'Write down one thing that went well today, no matter how small. Gratitude rewires the brain for positivity.', category: 'gratitude' },
  { id: 'DT-004', title: 'You Have Overcome Before', content: 'Think of a difficult moment you got through in the past. That strength is still within you. You are more resilient than you know.', category: 'resilience' },
  { id: 'DT-005', title: 'Ground Yourself', content: 'Look around and name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.', category: 'mindfulness' },
  { id: 'DT-006', title: 'Reach Out', content: 'You are not alone. Send a message to a friend, family member, or counselor. Connection is a powerful medicine.', category: 'resilience' },
  { id: 'DT-007', title: 'Rest is Productive', content: 'Your brain needs rest to process emotions. Taking a break is not laziness — it is self-care.', category: 'coping' },
];
export const mockYouthResources: YouthResource[] = [
  { id: 'YR-001', topic: 'identity', title: 'Who Am I?', summary: 'Explore your identity, values, and what makes you unique.', icon: 'faPeopleArrows', color: 'brand', practices: ['Journaling prompts for self-reflection', 'Values clarification exercises', 'Strength-based personal mapping', 'Cultural identity exploration'] },
  { id: 'YR-002', topic: 'inheritedTrauma', title: 'Understanding Inherited Trauma', summary: 'Learn how past experiences can affect us across generations.', icon: 'faBrain', color: 'warm', practices: ['Psychoeducation on intergenerational trauma', 'Family history storytelling', 'Normalizing emotional responses', 'Building resilience across generations'] },
  { id: 'YR-003', topic: 'emotionalAwareness', title: 'Emotional Awareness', summary: 'Build your emotional vocabulary and learn to express feelings healthily.', icon: 'faHandHoldingHeart', color: 'rose', practices: ['Emotion identification and naming', 'Trigger awareness and management', 'Healthy emotional expression', 'Peer support and validation'] },
  { id: 'YR-004', topic: 'peerPressure', title: 'Peer Pressure & Social Stress', summary: 'Tools to navigate social expectations, peer pressure, and relationship challenges.', icon: 'faUserGroup', color: 'blue', practices: ['Assertiveness and boundary-setting', 'Social media awareness', 'Academic stress management', 'Building healthy friendships'] },
];

export const mockHealingStories: HealingStory[] = [
  { id: 'HS-001', title: 'Finding Peace After Loss', author: 'Jeannette I.', age: 34, district: 'Gasabo', excerpt: 'After losing my husband in the genocide, I carried the weight alone for years. Humura helped me find a community that understood my pain.', content: '', image: '/healing community.png', tags: ['grief', 'community', 'resilience'], featured: true },
  { id: 'HS-002', title: 'A Young Mans Journey to Healing', author: 'Olivier H.', age: 22, district: 'Musanze', excerpt: 'I used to think asking for help was a sign of weakness. The youth program taught me that true strength is in reaching out.', content: '', image: '/light to commemorate.jpg', tags: ['youth', 'courage', 'growth'], featured: true },
  { id: 'HS-003', title: 'From Silence to Speaking Out', author: 'Claire N.', age: 45, district: 'Kicukiro', excerpt: 'For decades I kept my trauma hidden. Through the healing circles, I found my voice again. Now I help other women do the same.', content: '', image: '/Rwanda development.jpg', tags: ['women', 'healing circles', 'empowerment'], featured: false },
  { id: 'HS-004', title: 'Rebuilding Trust in Community', author: 'Fidele B.', age: 52, district: 'Huye', excerpt: 'The sociotherapy groups taught me that healing happens together. I learned to trust again — not just others, but myself.', content: '', image: '/MINUBUMWE.jpg', tags: ['trust', 'sociotherapy', 'reconciliation'], featured: true },
  { id: 'HS-005', title: 'Learning to Breathe Again', author: 'Sonia U.', age: 28, district: 'Nyarugenge', excerpt: 'The breathing exercises and coping tools saved me during my darkest moments. Now I practice them every morning.', content: '', image: '/ibuka.jpg', tags: ['coping', 'daily practice', 'anxiety'], featured: false },
];
export const mockHealingVideos: HealingVideo[] = [
  { id: 'HV-001', title: 'Guided Breathing for Anxiety', description: 'A 10-minute guided breathing exercise to calm your nervous system', duration: '10:00', thumbnail: '/healing community.png', category: 'guided' },
  { id: 'HV-002', title: 'Body Scan Meditation', description: 'Relax every part of your body with this guided meditation', duration: '15:00', thumbnail: '/light to commemorate.jpg', category: 'guided' },
  { id: 'HV-003', title: 'Community Healing Documentary', description: 'Stories of healing and resilience from across Rwanda', duration: '24:15', thumbnail: '/Rwanda development.jpg', src: '/video auto play.mp4', category: 'story' },
  { id: 'HV-004', title: 'Understanding Your Emotions', description: 'Learn to identify and name your emotions in Kinyarwanda', duration: '8:30', thumbnail: '/ibuka.jpg', category: 'educational' },
];
export const mockHealingAudio: HealingAudio[] = [
  { id: 'HA-001', title: 'Calm Morning Meditation', description: 'Start your day with peace and clarity', duration: '12:00', category: 'meditation' },
  { id: 'HA-002', title: 'Ocean Waves for Sleep', description: 'Soothing ocean sounds to help you fall asleep', duration: '30:00', category: 'calming' },
  { id: 'HA-003', title: 'Forest Rain Relaxation', description: 'The sound of gentle rain in a Rwandan forest', duration: '20:00', category: 'calming' },
  { id: 'HA-004', title: 'Box Breathing Guide', description: 'Step-by-step guided box breathing exercise', duration: '5:00', category: 'breathing' },
  { id: 'HA-005', title: 'Gratitude Meditation', description: 'A guided meditation focusing on gratitude and hope', duration: '10:00', category: 'meditation' },
];

export const mockUsers: Array<{ id: string; role: UserRole; fullName: string; email: string; facility?: string; district?: string; avatar?: string }> = [
  { id: 'U-001', role: 'admin', fullName: 'Dr. Alice Mugabo', email: 'alice@humura.gov.rw', avatar: '/adolphe profile.jpg' },
  { id: 'U-002', role: 'district_hospital', fullName: 'Dr. Eric Ndayisenga', email: 'eric@hospital.gov.rw', facility: 'Musanze District Hospital', district: 'Musanze', avatar: '/adolphe profile.jpg' },
  { id: 'U-003', role: 'health_center', fullName: 'Nurse Esperance Uwibuteye', email: 'esperance@hc.gov.rw', facility: 'Gasabo Health Center', district: 'Gasabo', avatar: '/adolphe profile.jpg' },
  { id: 'U-004', role: 'chw', fullName: 'Muhire Claude', email: 'claude@chw.gov.rw', facility: 'Kicukiro Health Center', district: 'Kicukiro', avatar: '/adolphe profile.jpg' },
  { id: 'U-005', role: 'sociotherapy_facilitator', fullName: 'Ineza Jeannette', email: 'jeannette@humura.gov.rw', district: 'Huye', avatar: '/adolphe profile.jpg' },
  { id: 'U-007', role: 'youth_counselor', fullName: 'Kamanzi Didier', email: 'didier@youth.gov.rw', district: 'Nyagatare', avatar: '/adolphe profile.jpg' },
  { id: 'U-008', role: 'emergency_responder', fullName: 'Response Team Lead', email: 'emergency@humura.gov.rw', facility: 'Mobile Emergency Unit', district: 'Nyarugenge', avatar: '/adolphe profile.jpg' },
  { id: 'U-009', role: 'community_member', fullName: 'Habimana Eric', email: 'eric@humura.gov.rw', district: 'Muhanga', avatar: '/adolphe profile.jpg' },
];

export const mockSupportRequests: SupportRequest[] = [];

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
  updateSupportPlan: (planId: string, data: Partial<SupportPlan>) => {
    const plan = mockSupportPlans.find(p => p.id === planId);
    if (!plan) return null;
    Object.assign(plan, data);
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
  getCounselors: (district?: string) => district ? mockCounselors.filter(c => c.district === district) : mockCounselors,
  getCounselingSessions: (userId: string) => mockCounselingSessions.filter(s => s.userId === userId),
  sendCounselingMessage: (sessionId: string, text: string) => {
    const session = mockCounselingSessions.find(s => s.id === sessionId);
    if (session) {
      session.messages.push({ id: `m${Date.now()}`, from: 'user', text, sentAt: date(0) });
      session.lastMessage = text;
      session.lastMessageAt = date(0);
    }
    return session;
  },
  getPeerSupportGroups: (district?: string) => district ? mockPeerSupportGroups.filter(g => g.district === district) : mockPeerSupportGroups,
  toggleJoinGroup: (id: string) => {
    const group = mockPeerSupportGroups.find(g => g.id === id);
    if (group) { group.isJoined = !group.isJoined; group.memberCount += group.isJoined ? 1 : -1; }
    return group;
  },
  getCopingSessions: (userId?: string) => userId ? mockCopingSessions : mockCopingSessions,
  addCopingSession: (s: CopingSession) => { mockCopingSessions.unshift(s); return s; },
  getDailyTip: () => mockDailyTips[Math.floor(Math.random() * mockDailyTips.length)],
  getYouthResources: () => mockYouthResources,
  getHealingStories: (featuredOnly?: boolean) => featuredOnly ? mockHealingStories.filter(s => s.featured) : mockHealingStories,
  getHealingVideos: (category?: string) => category ? mockHealingVideos.filter(v => v.category === category) : mockHealingVideos,
  getHealingAudio: (category?: string) => category ? mockHealingAudio.filter(a => a.category === category) : mockHealingAudio,
  getStats: () => ({
    totalBeneficiaries: mockBeneficiaries.length,
    screeningsDone: mockScreenings.length,
    activeGroups: mockSociotherapyGroups.filter(g => g.status === 'active').length,
    emergencyCases: mockEmergencies.filter(e => e.status !== 'resolved' && e.status !== 'false_alarm').length,
    treatmentComplete: mockBeneficiaries.filter(b => b.status === 'recovered').length,
    totalCHWs: 10,
    totalSurveyedBy: NAMES.length,
    activeEmergencies: mockEmergencies.filter(e => e.status === 'new' || e.status === 'dispatched').length,
  }),
  getSupportRequests: () => mockSupportRequests,
  addSupportRequest: (r: SupportRequest) => { mockSupportRequests.unshift(r); return r; },
  updateSupportRequest: (id: string, data: Partial<SupportRequest>) => {
    const r = mockSupportRequests.find(s => s.id === id);
    if (r) Object.assign(r, data);
    return r;
  },
};

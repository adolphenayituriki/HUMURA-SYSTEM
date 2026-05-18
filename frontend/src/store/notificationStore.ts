import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'alert' | 'referral' | 'screening' | 'info';
  read: boolean;
  createdAt: string;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Notification) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Critical Alert', message: 'Suicidal ideation reported in Gasabo', type: 'alert', read: false, createdAt: '2026-05-18', link: '/emergencies' },
  { id: 'n2', title: 'New Referral', message: 'Aline Uwimana referred to Musanze Hospital', type: 'referral', read: false, createdAt: '2026-05-18', link: '/referrals' },
  { id: 'n3', title: 'Screening Complete', message: 'PHQ-9 score 14 for Muhire Claude', type: 'screening', read: false, createdAt: '2026-05-17', link: '/screening' },
  { id: 'n4', title: 'Youth Enrolled', message: 'New participant in Peace Education program', type: 'info', read: true, createdAt: '2026-05-17', link: '/youth' },
  { id: 'n5', title: 'Group Session', message: 'Healing Circle 3 completed Trust phase', type: 'info', read: false, createdAt: '2026-05-16', link: '/sociotherapy' },
];

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: MOCK_NOTIFICATIONS,
  unreadCount: MOCK_NOTIFICATIONS.filter(n => !n.read).length,
  addNotification: (n) => set((s) => ({
    notifications: [n, ...s.notifications],
    unreadCount: s.unreadCount + (n.read ? 0 : 1),
  })),
  markRead: (id) => set((s) => {
    const n = s.notifications.find(n => n.id === id);
    if (!n || n.read) return s;
    n.read = true;
    return { notifications: [...s.notifications], unreadCount: s.unreadCount - 1 };
  }),
  markAllRead: () => set((s) => ({
    notifications: s.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
}));

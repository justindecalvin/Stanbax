import { UserEphemeralStatus } from '../types';

export const INITIAL_EPHEMERAL_STATUSES: UserEphemeralStatus[] = [
  {
    id: 'status-1',
    userId: 'admin-1',
    userName: 'School Administrator',
    userRole: 'admin',
    text: 'Official 2026/2027 Academic Session Resumption details published on the bulletin.',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
    views: [],
    backgroundColor: '#0F172A'
  }
];

export function cleanExpiredStatuses(statuses: UserEphemeralStatus[]): UserEphemeralStatus[] {
  const now = new Date().getTime();
  return statuses.filter(s => new Date(s.expiresAt).getTime() > now);
}

export function create16HourStatus(
  statusData: Omit<UserEphemeralStatus, 'id' | 'createdAt' | 'expiresAt' | 'views'>
): UserEphemeralStatus {
  const now = Date.now();
  return {
    ...statusData,
    id: `status-${now}-${Math.random().toString(36).substr(2, 5)}`,
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + 16 * 60 * 60 * 1000).toISOString(),
    views: []
  };
}

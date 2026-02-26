import { create } from "zustand";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

function authHeaders(): Record<string, string> {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return {};
    const { token } = JSON.parse(raw) as { token: string };
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export type NotificationRecord = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

interface NotificationStore {
  notifications: NotificationRecord[];
  unreadCount: number;
  
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const res = await fetch(`${API_BASE}/api/notifications`, {
        headers: authHeaders(),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.data) {
        set({
          notifications: data.data.notifications,
          unreadCount: data.data.unreadCount,
        });
      }
    } catch { /* silent */ }
  },

  markAsRead: async (id: string) => {
    // Optimistic update
    const previous = get().notifications;
    const prevCount = get().unreadCount;

    set((state) => {
      const target = state.notifications.find(n => n.id === id);
      if (!target || target.read) return state;

      return {
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };
    });

    try {
      const res = await fetch(`${API_BASE}/api/notifications/${id}/read`, {
        method: "PUT",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to mark as read");
    } catch {
      set({ notifications: previous, unreadCount: prevCount });
    }
  },

  markAllAsRead: async () => {
    const previous = get().notifications;
    const prevCount = get().unreadCount;

    if (prevCount === 0) return;

    set({
      notifications: previous.map(n => ({ ...n, read: true })),
      unreadCount: 0
    });

    try {
      const res = await fetch(`${API_BASE}/api/notifications/read-all`, {
        method: "PUT",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Failed to mark all as read");
    } catch {
      set({ notifications: previous, unreadCount: prevCount });
    }
  }
}));

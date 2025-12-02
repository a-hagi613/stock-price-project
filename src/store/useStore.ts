import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Alert,
  Notification,
  StockGroup,
  Preferences,
  StoreState,
} from '../types';
import {
  sampleNotifications,
  getStockById,
} from '../data/mockData';

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      alerts: [],
      notifications: [],
      groups: [],
      preferences: {
        quietHours: {
          enabled: false,
          start: '19:00',
          end: '07:00',
        },
        globalMute: false,
        aiEnabled: false,
        locationBased: false,
        aggregator: false,
        newsSources: [],
        aggregatorInterval: 'daily',
      },
      addAlert: (alert: Alert) => {
        set((state) => ({
          alerts: [...state.alerts, alert],
        }));
      },

      updateAlert: (id: string, updates: Partial<Alert>) => {
        set((state) => ({
          alerts: state.alerts.map((alert) =>
            alert.id === id ? { ...alert, ...updates } : alert
          ),
        }));
      },

      deleteAlert: (id: string) => {
        set((state) => ({
          alerts: state.alerts.filter((alert) => alert.id !== id),
        }));
      },

      testAlert: (alertId: string) => {
        const state = get();
        const alert = state.alerts.find((a) => a.id === alertId);

        if (!alert) return;

        const timestamp = new Date();
        const sampleNotification = sampleNotifications[alertId];
        const groupMeta = state.groups.find((g) => g.id === alert.group);
        const stock = getStockById(alert.stockId);

        const fallback: Notification = {
          id: `generated-${alert.stockId}`,
          stockId: alert.stockId,
          stockName: stock?.name ?? alert.stockId,
          title:
            alert.type === 'news'
              ? 'News Alert'
              : alert.type === 'volume'
              ? 'Volume Alert Triggered'
              : 'Price Alert Triggered',
          message: '',
          aiSummary: alert.aiEnabled
            ? `${stock?.name ?? alert.stockId} update generated for quick testing.`
            : undefined,
          timestamp,
          type:
            alert.type === 'news'
              ? 'negative'
              : alert.type === 'price'
              ? 'positive'
              : 'neutral',
          group: groupMeta?.name ?? alert.group ?? 'Alerts',
          groupColor: groupMeta?.color ?? alert.groupColor,
          read: false,
        };

        const baseNotification = sampleNotification ?? fallback;

        const newNotification: Notification = {
          ...baseNotification,
          id: `${alertId}-${Date.now()}`,
          timestamp,
          read: false,
        };

        state.addNotification(newNotification);
      },

      addNotification: (notification: Notification) => {
        set((state) => {
          const newNotifications = [notification, ...state.notifications];
          if (newNotifications.length > 3) {
            newNotifications.pop();
          }
          return { notifications: newNotifications };
        });
      },

      dismissNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      addGroup: (group: StockGroup) => {
        set((state) => ({
          groups: [...state.groups, group],
        }));
      },

      deleteGroup: (id: string) => {
        set((state) => ({
          groups: state.groups.filter((group) => group.id !== id),
        }));
      },

      addStockToGroup: (groupId: string, stockId: string) => {
        if (!groupId || !stockId) return;
        set((state) => ({
          groups: state.groups.map((group) =>
            group.id === groupId && !group.stockIds.includes(stockId)
              ? { ...group, stockIds: [...group.stockIds, stockId] }
              : group
          ),
        }));
      },

      updatePreferences: (prefs: Partial<Preferences>) => {
        set((state) => ({
          preferences: {
            ...state.preferences,
            ...prefs,
          },
        }));
      },

      resetAll: () => {
        set({
          alerts: [],
          groups: [],
          preferences: {
            quietHours: {
              enabled: false,
              start: '19:00',
              end: '07:00',
            },
            globalMute: false,
            aiEnabled: false,
            locationBased: false,
            aggregator: false,
            newsSources: [],
            aggregatorInterval: 'daily',
          },
        });
      },
    }),
    {
      name: 'stock-alerts-storage',
      partialize: (state) => ({
        alerts: state.alerts,
        groups: state.groups,
        preferences: state.preferences,
      }),
    }
  )
);

export default useStore;

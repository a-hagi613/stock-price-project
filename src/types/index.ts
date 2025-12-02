export interface Stock {
  id: string;
  name: string;
  price: number;
  change: number;
}

export type AlertType = 'price' | 'volume' | 'news';
export type AlertCondition = 'above' | 'below';

export interface Alert {
  id: string;
  stockId: string;
  type: AlertType;
  threshold?: number;
  condition?: AlertCondition;
  group?: string;
  groupColor?: string;
  aiEnabled: boolean;
  enabled: boolean;
  createdAt: Date;
}

export type NotificationType = 'positive' | 'negative' | 'neutral';

export interface Notification {
  id: string;
  stockId: string;
  stockName: string;
  title: string;
  message: string;
  aiSummary?: string;
  timestamp: Date;
  type: NotificationType;
  group?: string;
  groupColor?: string;
  read: boolean;
}

export interface StockGroup {
  id: string;
  name: string;
  color: string;
  stockIds: string[];
}

export type AggregatorInterval = 'daily' | 'weekly' | 'monthly';

export interface Preferences {
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  globalMute: boolean;
  aiEnabled: boolean;
  locationBased: boolean;
  aggregator: boolean;
  newsSources: string[];
  aggregatorInterval: AggregatorInterval;
}

export interface StoreState {
  alerts: Alert[];
  notifications: Notification[];
  groups: StockGroup[];
  preferences: Preferences;
  addAlert: (alert: Alert) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  deleteAlert: (id: string) => void;
  testAlert: (alertId: string) => void;
  addNotification: (notification: Notification) => void;
  dismissNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  addGroup: (group: StockGroup) => void;
  deleteGroup: (id: string) => void;
  addStockToGroup: (groupId: string, stockId: string) => void;
  updatePreferences: (prefs: Partial<Preferences>) => void;
  resetAll: () => void;
}

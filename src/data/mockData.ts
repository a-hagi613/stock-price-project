import { Stock, Alert, StockGroup, Notification } from '../types';

// 5 hardcoded stocks with realistic data
export const STOCKS: Stock[] = [
  {
    id: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 152.34,
    change: 4.2, // +4.2%
  },
  {
    id: 'TSLA',
    name: 'Tesla, Inc.',
    price: 242.84,
    change: -2.1, // -2.1%
  },
  {
    id: 'AAPL',
    name: 'Apple Inc.',
    price: 165.30,
    change: 0.0, // 0.0% - stable
  },
  {
    id: 'MSFT',
    name: 'Microsoft Corporation',
    price: 378.91,
    change: 0.5, // +0.5%
  },
  {
    id: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 145.63,
    change: 3.7, // +3.7%
  },
];

// 2 pre-configured alerts (NVDA price, TSLA news)
export const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    stockId: 'NVDA',
    type: 'price',
    threshold: 150,
    condition: 'above',
    group: 'group-tech',
    groupColor: '#3B82F6',
    aiEnabled: true,
    enabled: true,
    createdAt: new Date('2025-01-15T10:00:00'),
  },
  {
    id: 'alert-2',
    stockId: 'TSLA',
    type: 'news',
    group: 'group-tech',
    groupColor: '#3B82F6',
    aiEnabled: true,
    enabled: true,
    createdAt: new Date('2025-01-15T10:05:00'),
  },
];

// 1 initial group (Tech, blue)
export const initialGroups: StockGroup[] = [
  {
    id: 'group-tech',
    name: 'Tech',
    color: '#3B82F6', // Primary Blue
    stockIds: ['NVDA', 'TSLA'],
  },
];

// 3 sample notifications for testing (NVDA positive, TSLA negative, AAPL positive)
export const sampleNotifications: Record<string, Notification> = {
  'alert-1': {
    id: 'notif-nvda',
    stockId: 'NVDA',
    stockName: 'NVIDIA',
    title: 'Price Alert Triggered',
    message: '',
    aiSummary: 'NVIDIA stock surged 4.2% today following strong earnings guidance and increased demand for AI chips.',
    timestamp: new Date(),
    type: 'positive',
    group: 'Tech',
    groupColor: '#3B82F6',
    read: false,
  },
  'alert-2': {
    id: 'notif-tsla',
    stockId: 'TSLA',
    stockName: 'Tesla',
    title: 'News Alert',
    message: '',
    aiSummary: 'Tesla shares declined 2.1% after reports of temporary production slowdowns at the Shanghai facility. The company cited supply chain adjustments and routine maintenance. Despite short-term headwinds, analysts remain optimistic about Q2 delivery targets and upcoming model launches.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    type: 'negative',
    group: 'Tech',
    groupColor: '#3B82F6',
    read: false,
  },
  'aapl-test': {
    id: 'notif-aapl',
    stockId: 'AAPL',
    stockName: 'Apple',
    title: 'Price Alert Triggered',
    message: '',
    aiSummary: 'Apple shares gained 2.1% following positive reviews of the latest iPhone lineup and strong services revenue growth. The company\'s ecosystem expansion and wearables segment continue to drive diversified revenue streams. Institutional investors increased positions citing stable cash flow and shareholder returns.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    type: 'positive',
    group: 'Growth',
    groupColor: '#10B981', // Success Green
    read: false,
  },
};

// Helper function to get stock by ID
export const getStockById = (id: string): Stock | undefined => {
  return STOCKS.find(stock => stock.id === id);
};

// Helper function to get stock name by ID
export const getStockName = (id: string): string => {
  const stock = getStockById(id);
  return stock ? stock.name : id;
};

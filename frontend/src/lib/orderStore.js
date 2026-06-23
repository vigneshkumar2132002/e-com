'use client';

const ORDER_STORAGE_KEY = 'bapuji_live_dashboard_orders';
const ORDER_UPDATE_EVENT = 'bapuji-live-dashboard-orders-updated';

export const DEFAULT_LIVE_ORDERS = {
  oem: [],
  b2b: [],
  b2c: []
};

const canUseBrowserStorage = () => typeof window !== 'undefined' && window.localStorage;

const sanitizeOrders = (orders) => ({
  oem: Array.isArray(orders?.oem) ? orders.oem : [],
  b2b: Array.isArray(orders?.b2b) ? orders.b2b : [],
  b2c: Array.isArray(orders?.b2c) ? orders.b2c : []
});

export const getLiveOrders = () => {
  if (!canUseBrowserStorage()) return DEFAULT_LIVE_ORDERS;

  try {
    const stored = window.localStorage.getItem(ORDER_STORAGE_KEY);
    return stored ? sanitizeOrders(JSON.parse(stored)) : DEFAULT_LIVE_ORDERS;
  } catch (error) {
    console.warn('Unable to read dashboard orders from localStorage', error);
    return DEFAULT_LIVE_ORDERS;
  }
};

export const saveLiveOrders = (orders) => {
  const nextOrders = sanitizeOrders(orders);

  if (!canUseBrowserStorage()) return nextOrders;

  try {
    window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrders));
    window.dispatchEvent(new CustomEvent(ORDER_UPDATE_EVENT, { detail: nextOrders }));
  } catch (error) {
    console.warn('Unable to save dashboard orders to localStorage', error);
  }

  return nextOrders;
};

export const addLiveOrder = (type, order) => {
  const orderType = ['oem', 'b2b', 'b2c'].includes(type) ? type : 'b2c';
  const currentOrders = getLiveOrders();
  const nextOrder = {
    ...order,
    id: order?.id || createDashboardOrderId(orderType),
    liveSynced: true,
    receivedAt: new Date().toISOString()
  };

  const existingIds = new Set(currentOrders[orderType].map((item) => item.id));
  const nextTypeOrders = existingIds.has(nextOrder.id)
    ? currentOrders[orderType].map((item) => (item.id === nextOrder.id ? { ...item, ...nextOrder } : item))
    : [nextOrder, ...currentOrders[orderType]];

  saveLiveOrders({
    ...currentOrders,
    [orderType]: nextTypeOrders
  });

  return nextOrder;
};

export const subscribeLiveOrders = (callback) => {
  if (typeof window === 'undefined') return () => {};

  const handleCustomUpdate = (event) => {
    callback(sanitizeOrders(event.detail));
  };

  const handleStorageUpdate = (event) => {
    if (event.key === ORDER_STORAGE_KEY) {
      callback(getLiveOrders());
    }
  };

  window.addEventListener(ORDER_UPDATE_EVENT, handleCustomUpdate);
  window.addEventListener('storage', handleStorageUpdate);

  return () => {
    window.removeEventListener(ORDER_UPDATE_EVENT, handleCustomUpdate);
    window.removeEventListener('storage', handleStorageUpdate);
  };
};

export const createDashboardOrderId = (type) => {
  const prefixMap = {
    oem: 'OEM',
    b2b: 'ORD-B2B',
    b2c: 'ORD-B2C'
  };
  const suffix = `${Date.now()}`.slice(-6);
  return `${prefixMap[type] || prefixMap.b2c}-${suffix}`;
};

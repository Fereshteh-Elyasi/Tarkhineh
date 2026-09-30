// src/context/OrdersContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const OrdersContext = createContext(null);
const STORAGE_KEY = "orders";

// سفارش‌های واقعاً ثبت‌شده توسط کاربر (از PaymentPage، لحظه‌ی تایید پرداخت) اینجا ذخیره می‌شن
// تا در تب «پیگیری سفارشات» پروفایل نمایش داده بشن. چون بک‌اند واقعی نداریم، localStorage
// نقش دیتابیس سفارش‌ها رو بازی می‌کنه؛ هروقت بک‌اند وصل شد کافیه این Provider با فچ واقعی جایگزین بشه.
export function OrdersProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // order = { branchName, branchAddress, deliveryType, items, subtotal, discountTotal, shippingCost }
  const addOrder = (order) => {
    const newOrder = {
      id: `ord-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "جاری",
      ...order,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const cancelOrder = (id) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "لغو شده" } : o)));
  };

  const value = { orders, addOrder, cancelOrder };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export const useOrders = () => useContext(OrdersContext);

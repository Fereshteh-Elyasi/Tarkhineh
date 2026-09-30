// src/context/AddressContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AddressContext = createContext(null);
const STORAGE_KEY = "addresses";

// آدرس‌های کاربر یک‌بار اینجا نگه داشته می‌شن و هم در صفحه‌ی پروفایل و هم در مرحله‌ی
// «اطلاعات ارسال» چک‌اوت استفاده می‌شن؛ این‌طوری آدرسی که کاربر در پروفایل ثبت می‌کنه
// همون‌جاست که موقع سفارش هم می‌بینه.
export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }, [addresses]);

  const addAddress = (address) => {
    setAddresses((prev) => {
      // اولین آدرسی که کاربر ثبت می‌کنه به‌صورت خودکار پیش‌فرض می‌شه
      const isFirst = prev.length === 0;
      return [...prev, { ...address, isDefault: isFirst }];
    });
  };

  const updateAddress = (id, updates) => {
    setAddresses((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const removeAddress = (id) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // اگه آدرس پیش‌فرض حذف شد، اولین آدرس باقی‌مونده پیش‌فرض بشه
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const value = { addresses, addAddress, updateAddress, removeAddress, setDefaultAddress };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export const useAddresses = () => useContext(AddressContext);

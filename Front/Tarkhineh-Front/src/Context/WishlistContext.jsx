// src/context/WishlistContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "wishlist";

// آیتم‌های علاقه‌مندی‌ها هم مثل سبد خرید به‌صورت { [id]: {...دیتای کامل آیتم} } نگه داشته می‌شن
// تا هم در MenuPage/DishCard (برای وضعیت قلب) و هم در ProfilePage (برای نمایش کارت کامل) قابل استفاده باشن.
export function WishlistProvider({ children }) {
  const [itemsById, setItemsById] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsById));
  }, [itemsById]);

  const isWished = (id) => Boolean(itemsById[id]);

  const toggleWish = (item) => {
    setItemsById((prev) => {
      if (prev[item.id]) {
        const next = { ...prev };
        delete next[item.id];
        return next;
      }
      return { ...prev, [item.id]: item };
    });
  };

  const removeWish = (id) => {
    setItemsById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const wishlistItems = useMemo(() => Object.values(itemsById), [itemsById]);

  const value = { wishlistItems, isWished, toggleWish, removeWish };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);

import { createContext, useContext, useState, useMemo } from "react";
import { parsePrice } from "../utils/format";

const CartContext = createContext(null);

// آیتم‌های سبد به‌صورت { [id]: { ...دیتای کامل آیتم, qty } } نگه داشته می‌شن
// (نه فقط id)، چون کاربر ممکنه از صفحه منو خارج بشه و بعداً به صفحه سبد خرید بره؛
// پس باید عکس/عنوان/قیمت هر آیتم همراه خودش ذخیره بشه.
export function CartProvider({ children }) {
  const [itemsById, setItemsById] = useState({});

  const addItem = (item) => {
    setItemsById((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: existing ? { ...existing, qty: existing.qty + 1 } : { ...item, qty: 1 },
      };
    });
  };

  const removeItem = (id) => {
    setItemsById((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const setQty = (id, qty) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItemsById((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], qty } } : prev));
  };

  const clearCart = () => setItemsById({});

  const cartItems = useMemo(() => Object.values(itemsById), [itemsById]);

  const totalCount = useMemo(() => cartItems.reduce((sum, i) => sum + i.qty, 0), [cartItems]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, i) => sum + parsePrice(i.price) * i.qty, 0),
    [cartItems]
  );

  const discountTotal = useMemo(
    () =>
      cartItems.reduce((sum, i) => {
        if (i.discountPercent > 0 && i.oldPrice) {
          return sum + (parsePrice(i.oldPrice) - parsePrice(i.price)) * i.qty;
        }
        return sum;
      }, 0),
    [cartItems]
  );

  const value = {
    cartItems,
    totalCount,
    subtotal,
    discountTotal,
    addItem,
    removeItem,
    setQty,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  const refresh = useCallback(async () => {
    if (!user) return setItems([]);
    const { data } = await api.get("/cart");
    setItems(data);
  }, [user]);

  useEffect(() => { refresh().catch(() => {}); }, [refresh]);

  const add = async (productId, quantity = 1) => setItems((await api.post("/cart", { productId, quantity })).data);
  const update = async (productId, quantity) => setItems((await api.put(`/cart/${productId}`, { quantity })).data);
  const remove = async (productId) => setItems((await api.delete(`/cart/${productId}`)).data);

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + i.quantity * i.product.price, 0);

  return (
    <CartContext.Provider value={{ items, count, total, add, update, remove, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

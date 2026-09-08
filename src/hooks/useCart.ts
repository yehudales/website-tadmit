import { useState, useEffect, useCallback, useMemo } from 'react';
import { MenuItem, CartItem } from '../types';

const CART_STORAGE_KEY = 'yehudales_cart_items';
const MAX_ITEM_QUANTITY = 100;

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading cart from storage:', e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<{ item: CartItem; timestamp: number } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to storage:', e);
    }
  }, [items]);

  const addItem = useCallback((menuItem: MenuItem, quantityToAdd = 1) => {
    if (menuItem.availability === 'out_of_stock' || menuItem.availability === 'hidden') {
      return;
    }

    const price = menuItem.price || 0;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.id === menuItem.id);
      let updatedItems: CartItem[];

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity;
        const newQty = Math.min(currentQty + quantityToAdd, MAX_ITEM_QUANTITY);
        updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: newQty,
        };
      } else {
        const newItem: CartItem = {
          id: menuItem.id,
          name: menuItem.name,
          price,
          quantity: Math.min(Math.max(quantityToAdd, 1), MAX_ITEM_QUANTITY),
          category: menuItem.category,
          kashrutNote: menuItem.kashrutNote,
        };
        updatedItems = [...prevItems, newItem];
      }

      const added = updatedItems.find((i) => i.id === menuItem.id);
      if (added) {
        setLastAddedItem({ item: added, timestamp: Date.now() });
      }

      return updatedItems;
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    setItems((prevItems) => {
      if (newQuantity <= 0) {
        return prevItems.filter((i) => i.id !== itemId);
      }
      return prevItems.map((i) =>
        i.id === itemId
          ? { ...i, quantity: Math.min(newQuantity, MAX_ITEM_QUANTITY) }
          : i
      );
    });
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (itemId: string) => {
      const found = items.find((i) => i.id === itemId);
      return found ? found.quantity : 0;
    },
    [items]
  );

  const totalItems = useMemo(
    () => items.reduce((acc, curr) => acc + curr.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0),
    [items]
  );

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
    lastAddedItem,
  };
}

'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useToast } from './ToastContext';

export interface CartItem {
  id: string;
  name: string;
  image: string;
  seller: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  quantity: number;
  // API fields for order placement
  product_id?: number;
  product_attribute_id?: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { showSuccess } = useToast();
  const isInitialMount = useRef(true);
  const pendingToastRef = useRef<{ itemId: string; message: string } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastShownToastRef = useRef<{ itemId: string; timestamp: number } | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialMount.current) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Show toast for pending operations (debounced to prevent duplicates)
  useEffect(() => {
    if (pendingToastRef.current && !isInitialMount.current) {
      const now = Date.now();
      const lastShown = lastShownToastRef.current;
      const pendingToast = pendingToastRef.current;

      // Prevent showing the same toast within 500ms (handles React Strict Mode)
      const shouldShow = !lastShown ||
        lastShown.itemId !== pendingToast.itemId ||
        (now - lastShown.timestamp) > 500;

      if (shouldShow) {
        // Clear any existing timeout
        if (toastTimeoutRef.current) {
          clearTimeout(toastTimeoutRef.current);
        }

        // Clear the pending ref immediately to prevent duplicate processing
        pendingToastRef.current = null;

        // Set a new timeout to show the toast
        toastTimeoutRef.current = setTimeout(() => {
          showSuccess(pendingToast.message);
          lastShownToastRef.current = {
            itemId: pendingToast.itemId,
            timestamp: Date.now()
          };
        }, 100);
      } else {
        // Skip this toast, clear the pending ref
        pendingToastRef.current = null;
      }
    }

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [cartItems, showSuccess]);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        // If item already exists, increase quantity
        const newQuantity = existingItem.quantity + (item.quantity || 1);

        // Store toast message in ref (will be shown by useEffect)
        pendingToastRef.current = {
          itemId: item.id,
          message: `"${item.name}" quantity updated to ${newQuantity}! 🛒`
        };

        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      } else {
        // Add new item to cart
        // Store toast message in ref (will be shown by useEffect)
        pendingToastRef.current = {
          itemId: item.id,
          message: `"${item.name}" added to cart! 🛒`
        };

        return [...prevItems, { ...item, quantity: item.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


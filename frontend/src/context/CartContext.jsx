'use client';
import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('bapuji_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Sync cart to localStorage
  const syncCart = (items) => {
    setCartItems(items);
    localStorage.setItem('bapuji_cart', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const existingItem = cartItems.find((item) => item.product === product._id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.product === product._id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '/assets/placeholder.png',
          b2cPrice: product.b2cPrice,
          b2bPricing: product.b2bPricing || [],
          qty,
          stock: product.stock
        }
      ];
    }
    syncCart(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter((item) => item.product !== productId);
    syncCart(updatedCart);
  };

  const updateQty = (productId, qty) => {
    const updatedCart = cartItems.map((item) =>
      item.product === productId ? { ...item, qty: Math.max(1, qty) } : item
    );
    syncCart(updatedCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  // Determine item unit price based on user credentials and quantity
  const getItemUnitPrice = (item, user) => {
    const isApprovedB2B = 
      user && 
      user.role === 'b2b' && 
      user.b2bProfile?.verificationStatus === 'approved';

    if (!isApprovedB2B || !item.b2bPricing || item.b2bPricing.length === 0) {
      return item.b2cPrice;
    }

    // Find the highest volume tier reached by item.qty
    let price = item.b2cPrice;
    // Sort tiers by minimum quantity descending
    const sortedTiers = [...item.b2bPricing].sort((a, b) => b.minQty - a.minQty);
    const metTier = sortedTiers.find((tier) => item.qty >= tier.minQty);

    if (metTier) {
      price = metTier.price;
    } else {
      // If B2B but quantity is below the lowest tier, default to first tier or B2C price
      // Let's default to the lowest tier price or B2C price
      const lowestTier = sortedTiers[sortedTiers.length - 1];
      price = lowestTier ? lowestTier.price : item.b2cPrice;
    }

    return price;
  };

  const getCartSubtotal = (user) => {
    return cartItems.reduce((acc, item) => {
      const price = getItemUnitPrice(item, user);
      return acc + price * item.qty;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((acc, item) => acc + item.qty, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        getItemUnitPrice,
        getCartSubtotal,
        getCartCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  return context || {
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQty: () => {},
    clearCart: () => {},
    getItemUnitPrice: () => 0,
    getCartSubtotal: () => 0,
    getCartCount: () => 0
  };
};

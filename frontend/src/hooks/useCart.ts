"use client";

import { useState, useEffect, useCallback } from 'react';

export interface CartItem {
  id: number;
  product_title: string;
  slug: string;
  quantity: number;
  size: string | null;
  price: number;
  discount_price: number | null;
  total_price: number;
  image_url: string | null;
}

export interface CartData {
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setNeedsAuth(true);
        // Load Guest Cart
        const cartStr = localStorage.getItem('guest_cart');
        const guestItems = cartStr ? JSON.parse(cartStr) : [];
        let subtotal = 0;
        guestItems.forEach((item: any) => {
          subtotal += item.total_price * item.quantity;
        });
        const delivery_fee = subtotal > 2000 ? 0 : 100;
        setCart({
          items: guestItems,
          subtotal: subtotal,
          delivery_fee: delivery_fee,
          total: subtotal + delivery_fee
        });
        setLoading(false);
        return;
      }

      const res = await fetch(`https://topnoz-1.onrender.com/api/store/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.status === 401) {
        setNeedsAuth(true);
        // Load Guest Cart
        const cartStr = localStorage.getItem('guest_cart');
        const guestItems = cartStr ? JSON.parse(cartStr) : [];
        let subtotal = 0;
        guestItems.forEach((item: any) => {
          subtotal += item.total_price * item.quantity;
        });
        const delivery_fee = subtotal > 2000 ? 0 : 100;
        setCart({
          items: guestItems,
          subtotal: subtotal,
          delivery_fee: delivery_fee,
          total: subtotal + delivery_fee
        });
        setLoading(false);
        return;
      }

      const data = await res.json();
      setCart(data);
      setNeedsAuth(false);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
    
    // Listen for guest cart updates
    const handleCartUpdate = () => {
      fetchCart();
    };
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [fetchCart]);

  const updateQuantity = async (item: CartItem, action: 'increase' | 'decrease') => {
    if (updating) return;
    try {
      setUpdating(true);
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        // Update Guest Cart
        const cartStr = localStorage.getItem('guest_cart');
        let guestItems = cartStr ? JSON.parse(cartStr) : [];
        const existingItem = guestItems.find((i: any) => i.slug === item.slug);
        
        if (existingItem) {
          if (action === 'increase') {
            existingItem.quantity += 1;
          } else {
            existingItem.quantity -= 1;
            if (existingItem.quantity <= 0) {
              guestItems = guestItems.filter((i: any) => i.slug !== item.slug);
            }
          }
          localStorage.setItem('guest_cart', JSON.stringify(guestItems));
          window.dispatchEvent(new Event('cartUpdated'));
        }
        return;
      }

      const endpoint = action === 'increase' ? '/store/cart/add' : '/store/cart/reduce';
      
      const res = await fetch(`https://topnoz-1.onrender.com/api${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slug: item.slug, size: item.size })
      });

      if (res.ok) {
        await fetchCart();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  return { cart, loading, error, needsAuth, updateQuantity };
}

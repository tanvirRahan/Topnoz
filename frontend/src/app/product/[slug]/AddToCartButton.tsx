"use client";

import { useState } from 'react';

export interface ProductSummary {
  id: number;
  slug: string;
  title: string;
  price: number;
  discount_price?: number | null;
  image_url: string | null;
  sizes?: string[];
}

export default function AddToCartButton({ product }: { product: ProductSummary }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  const handleAddToCart = async () => {
    setMessage('');
    
    // Check if product requires size
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setMessage('Please select a size first.');
      return;
    }

    setLoading(true);
    
    // Check if user is logged in
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    
    if (!token) {
      // Unauthenticated: Store in LocalStorage Guest Cart
      const cartStr = localStorage.getItem('guest_cart');
      let cart = cartStr ? JSON.parse(cartStr) : [];
      
      const existingItem = cart.find((item: any) => item.slug === product.slug && item.size === (selectedSize || null));
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          product_title: product.title,
          slug: product.slug,
          quantity: 1,
          size: selectedSize || null,
          price: product.price,
          discount_price: product.discount_price || null,
          total_price: product.discount_price || product.price,
          image_url: product.image_url
        });
      }
      
      localStorage.setItem('guest_cart', JSON.stringify(cart));
      setMessage('Added to cart successfully!');
      setLoading(false);
      
      // Dispatch custom event to tell useCart hook to update
      window.dispatchEvent(new Event('cartUpdated'));
      return;
    }

    try {
      const res = await fetch(`https://topnoz-1.onrender.com/api/store/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ slug: product.slug, size: selectedSize || null })
      });
      
      if (res.status === 401) {
        // Token expired, use local storage
        localStorage.removeItem('access_token');
        const cartStr = localStorage.getItem('guest_cart');
        let cart = cartStr ? JSON.parse(cartStr) : [];
        const existingItem = cart.find((item: any) => item.slug === product.slug && item.size === (selectedSize || null));
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cart.push({
            id: product.id,
            product_title: product.title,
            slug: product.slug,
            quantity: 1,
            size: selectedSize || null,
            price: product.price,
            discount_price: product.discount_price || null,
            total_price: product.discount_price || product.price,
            image_url: product.image_url
          });
        }
        localStorage.setItem('guest_cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        setMessage('Added to cart successfully!');
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setMessage('Added to cart successfully!');
        window.dispatchEvent(new Event('cartUpdated'));
      } else {
        // Ninja schema validation error check
        if (data.detail && Array.isArray(data.detail)) {
          setMessage(data.detail.map((d: any) => d.msg).join(', '));
        } else {
          setMessage(data.message || 'Error adding to cart');
        }
      }
    } catch (error) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Select Size</span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  padding: '10px 16px',
                  backgroundColor: selectedSize === size ? '#111' : '#fff',
                  color: selectedSize === size ? '#fff' : '#111',
                  border: `1px solid ${selectedSize === size ? '#111' : '#EAEAEA'}`,
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  minWidth: '60px',
                  transition: 'all 0.2s ease'
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={handleAddToCart}
        disabled={loading}
        style={{ 
          width: '100%',
          maxWidth: '280px',
          backgroundColor: '#111', 
          color: '#fff', 
          border: 'none', 
          padding: '12px 20px', 
          fontSize: '13px', 
          fontWeight: '700', 
          textTransform: 'uppercase', 
          letterSpacing: '1px', 
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '12px',
          opacity: loading ? 0.8 : 1,
          transition: 'all 0.2s ease',
          borderRadius: '4px',
        }}
        onMouseOver={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = '#333';
        }}
        onMouseOut={(e) => {
          if (!loading) e.currentTarget.style.backgroundColor = '#111';
        }}
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
      
      {message && (
        <div style={{ 
          padding: '12px 16px', 
          backgroundColor: message.includes('success') ? '#E8F5E9' : '#FFEBEE', 
          color: message.includes('success') ? '#2E7D32' : '#C62828',
          fontSize: '13px',
          fontWeight: '600',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

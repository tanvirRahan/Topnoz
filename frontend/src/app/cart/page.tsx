"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import CartItemCard from '@/components/cart/CartItemCard';
import OrderSummary from '@/components/cart/OrderSummary';

export default function Cart() {
  const router = useRouter();
  const { cart, loading, error, needsAuth, updateQuantity } = useCart();
  const [showModal, setShowModal] = useState(false);

  if (loading) {
    return <div style={{ paddingTop: '150px', textAlign: 'center', minHeight: '60vh' }}>Loading cart...</div>;
  }

  if (error) {
    return <div style={{ paddingTop: '150px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="template-container" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '70vh' }}>
        <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '30px' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '24px' }}>Your Cart</h1>
          <div style={{ backgroundColor: '#F9F9F9', padding: '60px 20px', borderRadius: '8px' }}>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>Your cart is currently empty.</p>
            <Link href="/collection" style={{ display: 'inline-block', padding: '14px 32px', backgroundColor: '#111', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '4px' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="template-container" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '70vh' }}>
      <button onClick={() => router.back()} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '30px' }}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back
      </button>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '40px' }}>Your Cart</h1>
      
      <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
        
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {cart.items.map((item) => (
            <CartItemCard 
              key={item.id} 
              item={item} 
              updateQuantity={updateQuantity} 
            />
          ))}
        </div>

        {/* Order Summary (Desktop) */}
        <div className="desktop-summary" style={{ position: 'sticky', top: '120px' }}>
          <OrderSummary 
            subtotal={cart.subtotal}
            needsAuth={needsAuth}
            onCheckout={() => {
              if (needsAuth) {
                setShowModal(true);
              } else {
                router.push('/checkout');
              }
            }}
          />
        </div>
      </div>
      
      {/* Mobile Fixed Bottom Checkout Bar */}
      <div className="mobile-checkout-bar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>Subtotal:</span>
          <span style={{ fontSize: '18px', fontWeight: '800' }}>৳{cart.subtotal}</span>
        </div>
        <button 
          onClick={() => {
            if (needsAuth) {
              setShowModal(true);
            } else {
              router.push('/checkout');
            }
          }} 
          style={{ width: '100%', padding: '14px', backgroundColor: '#111', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}
        >
          Proceed to Checkout
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '40px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '90%',
            position: 'relative',
            textAlign: 'center'
          }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Checkout Login</h2>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '32px' }}>Please login or register to securely process your order.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link href={`https://topnoz-1.onrender.com/accounts/google/login/?next=/checkout`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', width: '100%', padding: '14px', backgroundColor: '#fff', color: '#111', border: '1px solid #EAEAEA', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
                Continue with Google
              </Link>
              <div style={{ color: '#888', fontSize: '12px', margin: '4px 0' }}>OR</div>
              <Link href="/login?next=/checkout" style={{ display: 'inline-block', width: '100%', padding: '14px', backgroundColor: '#111', color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '4px' }}>
                Login with Email
              </Link>
              <Link href="/register?next=/checkout" style={{ fontSize: '13px', color: '#555', textDecoration: 'underline', marginTop: '8px' }}>
                Don't have an account? Register here
              </Link>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .mobile-checkout-bar {
          display: none;
        }
        @media (max-width: 991px) {
          .cart-grid {
            display: flex !important;
            flex-direction: column !important;
            padding-bottom: 120px; /* Space for the fixed bar */
          }
          .desktop-summary {
            display: none !important;
          }
          .mobile-checkout-bar {
            display: block;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: #fff;
            padding: 20px;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
            z-index: 1000;
          }
        }
      `}} />
    </div>
  );
}

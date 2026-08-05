"use client";

import Link from 'next/link';

interface OrderSummaryProps {
  subtotal: number;
  needsAuth?: boolean;
  onCheckout: () => void;
}

export default function OrderSummary({ subtotal, needsAuth = false, onCheckout }: OrderSummaryProps) {
  return (
    <>
      <div style={{ backgroundColor: '#F9F9F9', padding: '32px', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Summary</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '15px' }}>
          <span style={{ color: '#555' }}>Subtotal</span>
          <span style={{ fontWeight: '600' }}>৳{subtotal}</span>
        </div>
        
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '32px', fontStyle: 'italic' }}>
          Delivery fee will be calculated at checkout.
        </p>

        <button onClick={onCheckout} style={{ 
          display: 'block', 
          textAlign: 'center', 
          width: '100%', 
          padding: '16px', 
          backgroundColor: '#111', 
          color: '#fff', 
          border: 'none', 
          borderRadius: '4px', 
          fontSize: '14px', 
          fontWeight: '700', 
          textTransform: 'uppercase',
          letterSpacing: '1px',
          cursor: 'pointer'
        }}>
          Proceed to Checkout
        </button>
      </div>
    </>
  );
}

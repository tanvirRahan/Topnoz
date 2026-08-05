"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Thanks() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="template-container" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center', backgroundColor: '#fff', padding: '60px 40px', borderRadius: '12px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ width: '80px', height: '80px', backgroundColor: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px' }}>
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>Order Confirmed!</h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '40px', lineHeight: '1.6' }}>
          Thank you for shopping with Topnoz. Your order has been placed successfully. 
          We have sent a confirmation email with your order details.
        </p>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/" style={{ padding: '16px 32px', backgroundColor: '#111', color: '#fff', fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '4px', textDecoration: 'none', transition: 'all 0.2s' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

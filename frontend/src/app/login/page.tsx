"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Login() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already logged in, redirect to nextUrl or home
    if (localStorage.getItem('access_token')) {
      window.location.href = nextUrl;
    }
  }, [nextUrl]);

  const syncGuestCart = async (token: string) => {
    const cartStr = localStorage.getItem('guest_cart');
    if (!cartStr) return;
    try {
      const guestItems = JSON.parse(cartStr);
      if (guestItems.length === 0) return;
      
      // We send all items one by one or create a specific bulk endpoint.
      // Since we don't have a bulk endpoint, we can send them concurrently.
      await Promise.all(guestItems.map((item: any) => {
        // We only have the add endpoint which increases quantity by 1 each time.
        // But to be precise, we need to call it `item.quantity` times or create a better endpoint.
        // For now, we will just add the slug once per quantity to sync it.
        const addRequests = [];
        for (let i = 0; i < item.quantity; i++) {
          addRequests.push(
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/cart/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ slug: item.slug, size: item.size })
            })
          );
        }
        return Promise.all(addRequests);
      }));
      // Clear guest cart after syncing
      localStorage.removeItem('guest_cart');
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err) {
      console.error("Failed to sync guest cart:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token/pair`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password })
      });

      const data = await res.json();
      
      if (res.ok && data.access) {
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        await syncGuestCart(data.access);
        window.location.href = nextUrl;
      } else {
        setError(data.detail || 'Invalid email or password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="template-container" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>Sign in to continue to Topnoz.</p>
        
        {searchParams.get('registered') === 'true' && (
          <div style={{ padding: '12px', backgroundColor: '#E8F5E9', color: '#2E7D32', fontSize: '14px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center', border: '1px solid #C8E6C9' }}>
            <strong>Registration Complete!</strong><br />Please login to continue.
          </div>
        )}

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#FFEBEE', color: '#C62828', fontSize: '14px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#333' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              required 
            />
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#333' }}>Password</label>
              <Link href="#" style={{ fontSize: '12px', color: '#666', textDecoration: 'underline' }}>Forgot?</Link>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
              required 
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            style={{ 
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
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
            <span style={{ padding: '0 10px' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
          </div>
          <button 
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'}/accounts/google/login/?next=${encodeURIComponent(nextUrl)}`}
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: '#fff', 
              color: '#333', 
              border: '1px solid #ddd', 
              borderRadius: '4px', 
              fontSize: '14px', 
              fontWeight: '600', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.2s'
            }}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
          Don't have an account? <Link href={`/register?next=${encodeURIComponent(nextUrl)}`} style={{ color: '#111', fontWeight: '700', textDecoration: 'underline' }}>Create one</Link>
        </div>
      </div>
    </div>
  );
}

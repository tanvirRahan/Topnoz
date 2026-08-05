"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Register() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';
  
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // If user is already logged in, redirect to nextUrl or home
    if (localStorage.getItem('access_token')) {
      window.location.href = nextUrl !== '/' ? nextUrl : '/';
    }
  }, [nextUrl]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://topnoz-1.onrender.com/api'}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          first_name: firstName,
          last_name: lastName
        })
      });

      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
        // Redirect to login with registered flag and next parameter preserved
        setTimeout(() => {
          window.location.href = `/login?registered=true&next=${encodeURIComponent(nextUrl)}`;
        }, 1000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="template-container" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '400px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: '#E8F5E9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#2E7D32" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>Registration Successful!</h1>
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '32px' }}>Welcome to Topnoz. You are being redirected to the login page...</p>
          <Link href={`/login?registered=true&next=${encodeURIComponent(nextUrl)}`} style={{ display: 'inline-block', color: '#111', fontWeight: '700', textDecoration: 'underline', fontSize: '14px' }}>Click here if not redirected</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="template-container" style={{ paddingTop: '120px', paddingBottom: '100px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '450px', width: '100%', backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', textAlign: 'center' }}>Create Account</h1>
        <p style={{ color: '#666', textAlign: 'center', marginBottom: '32px', fontSize: '14px' }}>Join Topnoz for an exclusive shopping experience.</p>
        
        {error && (
          <div style={{ padding: '12px', backgroundColor: '#FFEBEE', color: '#C62828', fontSize: '14px', borderRadius: '4px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#333' }}>First Name</label>
              <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                required 
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#333' }}>Last Name</label>
              <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: '100%', padding: '14px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none' }}
                required 
              />
            </div>
          </div>

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
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: '#333' }}>Password</label>
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
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', color: '#999', fontSize: '12px', textTransform: 'uppercase' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
            <span style={{ padding: '0 10px' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#eee' }}></div>
          </div>
          <button 
            type="button"
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://topnoz-1.onrender.com'}/accounts/google/login/`}
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
          Already have an account? <Link href={`/login?next=${encodeURIComponent(nextUrl)}`} style={{ color: '#111', fontWeight: '700', textDecoration: 'underline' }}>Sign in here</Link>
        </div>
      </div>
    </div>
  );
}

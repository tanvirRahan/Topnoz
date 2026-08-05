"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');

    if (accessToken) {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      
      // Redirect to home or wherever they came from
      window.location.href = '/';
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '20px' }}>
          <svg className="spinner" viewBox="0 0 50 50" style={{ width: '40px', height: '40px', animation: 'rotate 2s linear infinite' }}>
            <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#111" strokeLinecap="round" strokeDasharray="1, 200" strokeDashoffset="0" style={{ animation: 'dash 1.5s ease-in-out infinite' }} />
          </svg>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Authenticating...</h2>
        <p style={{ color: '#666', marginTop: '8px' }}>Please wait while we log you in.</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes rotate { 100% { transform: rotate(360deg); } }
          @keyframes dash {
            0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 89, 200; stroke-dashoffset: -35px; }
            100% { stroke-dasharray: 89, 200; stroke-dashoffset: -124px; }
          }
        `}} />
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}

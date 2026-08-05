"use client";

import { useEffect } from 'react';

export default function AdminPanel() {
  useEffect(() => {
    // Redirect to the backend Django Admin Panel
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    window.location.href = `${backendUrl}/admin`;
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f9f9f9', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #111', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}>Redirecting to Topnoz Admin Panel...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    </div>
  );
}

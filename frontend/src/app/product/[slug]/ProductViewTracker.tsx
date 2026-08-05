"use client";

import { useEffect } from 'react';

export default function ProductViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Prevent double-firing in React StrictMode
    const trackProductView = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers: Record<string, string> = {
          'Content-Type': 'application/json'
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://topnoz-1.onrender.com/api'}/users/track-product-view`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ slug })
        });
      } catch (error) {
        // Silently fail if tracking gets blocked
        console.error("Product tracking failed");
      }
    };

    // Small delay to ensure visitor tracking fires first
    const timer = setTimeout(() => {
      trackProductView();
    }, 1000);

    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}

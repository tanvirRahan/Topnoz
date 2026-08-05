import React from 'react';
import Header from '@/components/Header';
import HomeProductGrid from '@/components/HomeProductGrid';

async function getNewArrivals() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://topnoz-1.onrender.com/api'}/store/products?sort=new`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch new arrivals:", error);
    return [];
  }
}

export default async function NewArrivalsPage() {
  const products = await getNewArrivals();

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ paddingTop: '100px', paddingBottom: '60px' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontWeight: 800, 
              fontSize: '2.5rem', 
              textTransform: 'uppercase', 
              letterSpacing: '2px',
              marginBottom: '16px'
            }}>
              New Arrivals
            </h1>
            <p style={{ color: '#666', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
              Discover the latest styles added to our collection. Premium fashion for the modern trendsetter.
            </p>
          </div>

          {products.length > 0 ? (
            <HomeProductGrid products={products} />
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <svg viewBox="0 0 24 24" width="64" height="64" stroke="#ccc" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
              <h3 style={{ color: '#666', fontWeight: 600 }}>No new arrivals just yet.</h3>
              <p style={{ color: '#999' }}>Please check back soon for our latest styles.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

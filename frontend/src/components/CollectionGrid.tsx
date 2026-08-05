'use client';

import React from 'react';
import Link from 'next/link';
import { collectionCategories } from '@/constants/data';

export default function CollectionGrid() {
  return (
    <section className="template-section" id="topnoz-picks" style={{ padding: '80px 0', backgroundColor: '#111' }}>
      <div className="template-container">
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ color: '#fff', fontSize: '36px', fontWeight: '900', fontFamily: "'Archivo', sans-serif", marginBottom: '10px' }}>
            Topnoz Picks
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
          {collectionCategories.map((cat, index) => (
            <Link href={`/category/${cat.value}`} key={cat.value} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ 
                  borderRadius: '12px', 
                  height: '350px', cursor: 'pointer', position: 'relative',
                  animation: 'fadeInUp 0.5s ease forwards',
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  transform: 'translateY(20px)',
                  overflow: 'hidden'
                }} 
                className="hover-card category-photo-card"
              >
                <img src={cat.image} alt={cat.label} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 }} className="cat-img" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(10,10,10,0.85) 100%)', zIndex: 2 }}></div>
                
                <div style={{ position: 'relative', zIndex: 3, padding: '30px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%', textAlign: 'left' }}>
                  {cat.badge && (
                    <span style={{ alignSelf: 'flex-start', marginBottom: 'auto', backgroundColor: '#00B894', color: '#fff', fontSize: '10px', padding: '4px 10px', borderRadius: '20px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {cat.badge}
                    </span>
                  )}
                  <h3 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px', fontFamily: "'Archivo', sans-serif", color: '#fff' }}>{cat.label}</h3>
                  <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>{cat.desc}</p>
                  <div style={{ color: '#00B894', fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    Explore <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

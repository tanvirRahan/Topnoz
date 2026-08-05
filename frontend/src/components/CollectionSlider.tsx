'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { collectionCategories } from '@/constants/data';

export default function CollectionSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % collectionCategories.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Preload first image for performance */}
      <link rel="preload" as="image" href={collectionCategories[0].image} />

      {/* Custom Slider with Categories */}
      <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 79px)', marginTop: '79px', overflow: 'hidden', backgroundColor: '#000' }}>
        {collectionCategories.map((cat, index) => (
          <div key={index} style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            opacity: index === currentSlide ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: index === currentSlide ? 1 : 0
          }}>
            {/* Blurred Background to fill empty spaces */}
            <img src={cat.image} alt={cat.label} fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'blur(30px)',
              transform: 'scale(1.1)',
              opacity: 0.4
            }} />
            
            {/* Main Image */}
            <img src={cat.image} alt={cat.label} fetchPriority={index === 0 ? "high" : "auto"} loading={index === 0 ? "eager" : "lazy"} style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center'
            }} />

            {/* Dark Overlay for Text Readability */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)', zIndex: 1 }}></div>

            {/* Slider Content */}
            <div style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
              zIndex: 2, textAlign: 'center', padding: '0 20px',
              transform: index === currentSlide ? 'translateY(0)' : 'translateY(20px)',
              transition: 'transform 1s cubic-bezier(0.25, 0.8, 0.25, 1) 0.3s'
            }}>
              <div style={{ fontSize: 'clamp(10px, 3vw, 13px)', fontWeight: '500', letterSpacing: 'clamp(3px, 1.5vw, 8px)', textTransform: 'uppercase', color: '#F9F9F9', marginBottom: 'clamp(10px, 3vw, 20px)', fontFamily: "'Playfair Display', 'Archivo', serif", borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 'clamp(5px, 2vw, 10px)' }}>
                Featured Collection
              </div>
              <h1 style={{ 
                fontSize: 'clamp(40px, 10vw, 150px)', 
                fontWeight: '900', 
                letterSpacing: 'clamp(2px, 1vw, 5px)', 
                fontFamily: "'Playfair Display', 'Archivo', serif",
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textShadow: '0 15px 30px rgba(0,0,0,0.8)',
                margin: '0 0 15px 0',
                lineHeight: '1.1'
              }}>
                {cat.label}
              </h1>
              <p style={{ color: '#EAEAEA', fontSize: 'clamp(12px, 2vw, 20px)', letterSpacing: 'clamp(1px, 1vw, 4px)', textTransform: 'uppercase', fontWeight: '300', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
                {cat.desc}
              </p>
            </div>
          </div>
        ))}

        {/* Scroll Down Indicator (Enhanced & Visual) */}
        <div style={{ position: 'absolute', bottom: 'clamp(20px, 5vh, 40px)', left: '50%', transform: 'translateX(-50%)', zIndex: 10, width: '90%', textAlign: 'center', display: 'flex', justifyContent: 'center' }}>
          <a href="#topnoz-picks" style={{ 
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#fff', color: '#000', padding: 'clamp(10px, 2.5vw, 16px) clamp(16px, 4vw, 32px)', borderRadius: '30px',
            fontWeight: '900', fontSize: 'clamp(10px, 2.5vw, 14px)', textTransform: 'uppercase', letterSpacing: '1px',
            transition: 'all 0.3s', whiteSpace: 'nowrap'
          }} className="mega-scroll-btn">
            ALL CATEGORIES PICK <i className="fas fa-arrow-down bounce-arrow"></i>
          </a>
        </div>
      </div>
    </>
  );
}

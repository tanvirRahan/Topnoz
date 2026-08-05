'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    id: 1,
    image: '/image/topnoz%20cover%202.jpg',
    eyebrow: 'New Collection',
    title: 'TOPNOZ',
    description: 'EXPRESS YOUR TOP THOUGHTS',
    buttonText: 'Explore Collection',
    buttonLink: '/collection'
  },
  {
    id: 2,
    image: '/image/clem-onojeghuo-HpEDSZukJqk-unsplash.jpg',
    eyebrow: 'Style & Comfort',
    title: 'CONFIDENCE',
    description: 'TOP THOUGHTS. TOP LOOKS. TOPNOZ.',
    buttonText: 'View Products',
    buttonLink: '/collection'
  },
  {
    id: 3,
    image: '/image/lonely-814631_1920.jpg',
    eyebrow: 'Autumn / Winter',
    title: 'ALWAYS.',
    description: 'Tailored confidence, season after season.',
    buttonText: 'Shop Now',
    buttonLink: '/collection'
  }
];

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]); // reset timer on manual change

  return (
    <section className="template-hero" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', backgroundColor: '#111111' }}>
      {SLIDES.map((slide, idx) => {
        const isActive = currentIndex === idx;
        
        return (
          <div 
            key={slide.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: isActive ? 1 : 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Background Image */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: -2 }}>
              <img src={slide.image} alt={slide.title} style={{ 
                width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6) contrast(1.05)',
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'transform 8s ease-out'
              }} />
            </div>

            {/* Overlay Gradient */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)', zIndex: -1 }}></div>

            {/* Content */}
            <div style={{ 
              position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff', padding: '0 20px', width: '100%', maxWidth: '1000px',
              opacity: isActive ? 1 : 0,
              transform: isActive ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.25, 0.8, 0.25, 1) 0.3s'
            }}>
              <h1 style={{ 
                fontSize: 'clamp(50px, 8vw, 90px)', 
                fontWeight: '900', 
                letterSpacing: '2px', 
                lineHeight: '1.1',
                marginBottom: '15px', 
                fontFamily: "'Archivo', sans-serif",
                textTransform: 'uppercase',
                color: '#FFFFFF',
                textShadow: '0 4px 20px rgba(0,0,0,0.4)'
              }}>
                TOPNOZ
              </h1>
              <div style={{ 
                fontSize: 'clamp(12px, 1.5vw, 15px)', 
                fontWeight: '500', 
                letterSpacing: '8px', 
                color: '#FFFFFF', 
                marginBottom: '40px', 
                textTransform: 'uppercase',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)'
              }}>
                Express Your Top Thoughts
              </div>
              <Link 
                href={slide.buttonLink}
                style={{ cursor: 'pointer', display: 'inline-block', padding: '16px 40px', background: '#fff', color: '#111', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', transition: 'transform 0.2s ease', textDecoration: 'none' }} 
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} 
                onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
              >
                {slide.buttonText}
              </Link>
            </div>
          </div>
        );
      })}

      {/* Slider Controls: Arrows */}
      <button 
        onClick={prevSlide}
        style={{ position: 'absolute', top: '50%', left: '40px', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', zIndex: 10, padding: '10px' }}
        aria-label="Previous slide"
      >
        ❮
      </button>
      <button 
        onClick={nextSlide}
        style={{ position: 'absolute', top: '50%', right: '40px', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', zIndex: 10, padding: '10px' }}
        aria-label="Next slide"
      >
        ❯
      </button>

      {/* Slider Controls: Dots */}
      <div style={{ position: 'absolute', bottom: '80px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 10 }}>
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            style={{ width: '8px', height: '8px', borderRadius: '50%', border: 'none', background: currentIndex === idx ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 0, transition: 'background 0.3s ease' }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Scroll Down / Swipe Dynamic Cue */}
      <div 
        className="dynamic-scroll-cue" 
        style={{ 
          position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', 
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 10,
          cursor: 'pointer'
        }}
        onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div style={{
          width: '24px', height: '40px', border: '2px solid rgba(255,255,255,0.6)', 
          borderRadius: '20px', position: 'relative', display: 'flex', justifyContent: 'center',
          animation: 'dynamicScrollPill 3s ease-in-out infinite'
        }}>
          <div style={{
            width: '4px', height: '6px', backgroundColor: '#fff', borderRadius: '2px', marginTop: '6px',
            animation: 'dynamicScrollDot 1.5s infinite'
          }}></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-4px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'dynamicSwipeChevron 2s infinite' }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'dynamicSwipeChevron 2s infinite', animationDelay: '0.2s', marginTop: '-8px' }}>
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dynamicScrollPill {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(6px); }
          }
          @keyframes dynamicScrollDot {
            0% { transform: translateY(0); opacity: 1; }
            80% { transform: translateY(14px); opacity: 0; }
            100% { transform: translateY(14px); opacity: 0; }
          }
          @keyframes dynamicSwipeChevron {
            0% { transform: translateY(-5px); opacity: 0; }
            50% { transform: translateY(2px); opacity: 1; }
            100% { transform: translateY(8px); opacity: 0; }
          }
          .dynamic-scroll-cue:hover div {
            border-color: rgba(255,255,255,1) !important;
          }
          .dynamic-scroll-cue:hover svg {
            stroke: rgba(255,255,255,1) !important;
          }
        `}} />
      </div>
    </section>
  );
}

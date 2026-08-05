"use client";

import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, title }: { images: string[], title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  if (!images || images.length === 0) {
    return (
      <div style={{ width: '100%', aspectRatio: '4/5', backgroundColor: '#F9F9F9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
        No Image Available
      </div>
    );
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className="main-image-wrapper"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        style={{ 
          width: '100%',
          position: 'relative', 
          backgroundColor: '#F5F5F5', 
          borderRadius: '12px', 
          overflow: 'hidden', 
          aspectRatio: '4/5',
          cursor: isZoomed ? 'zoom-in' : 'pointer'
        }}
      >
        {images.map((img, idx) => (
          <div 
            key={idx}
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              opacity: activeIndex === idx ? 1 : 0,
              visibility: activeIndex === idx ? 'visible' : 'hidden',
              transition: isZoomed ? 'none' : 'opacity 0.4s ease-in-out, visibility 0.4s ease-in-out',
              zIndex: activeIndex === idx ? 1 : 0,
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: activeIndex === idx && isZoomed ? 'scale(2.5)' : 'scale(1)',
              willChange: 'transform'
            }}
          >
            <Image 
              src={img} 
              alt={`${title} - view ${idx + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Thumbnails (Horizontal Scroll) */}
      {images.length > 1 && (
        <div 
          className="thumbnails-container" 
          style={{ 
            display: 'flex', 
            gap: '12px', 
            width: '100%', 
            overflowX: 'auto', 
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                position: 'relative',
                width: '72px',
                height: '90px',
                flexShrink: 0,
                borderRadius: '8px',
                overflow: 'hidden',
                border: activeIndex === idx ? '2px solid #111' : '2px solid transparent',
                padding: '2px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: activeIndex === idx ? 1 : 0.6
              }}
              className="thumbnail-btn"
            >
              <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                <Image 
                  src={img} 
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  unoptimized
                />
              </div>
            </button>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .thumbnails-container::-webkit-scrollbar {
          display: none;
        }
        .thumbnail-btn:hover {
          opacity: 1 !important;
        }
      `}} />
    </div>
  );
}

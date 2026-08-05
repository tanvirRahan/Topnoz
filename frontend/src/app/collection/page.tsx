'use client';

import React from 'react';
import CollectionSlider from '@/components/CollectionSlider';
import CollectionGrid from '@/components/CollectionGrid';

export default function CollectionPage() {
  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.4);
          border-color: #00B894 !important;
        }
        
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.6); }
          70% { box-shadow: 0 0 0 20px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .mega-scroll-btn {
          animation: pulseGlow 2s infinite;
        }
        .mega-scroll-btn:hover {
          background-color: #00B894 !important;
          color: #fff !important;
          transform: translateY(-3px);
        }
        .bounce-arrow {
          animation: arrowBounce 1.5s infinite;
        }
        .scroll-indicator:hover { opacity: 1; }
        .category-photo-card .cat-img {
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .hover-card:hover .cat-img {
          transform: scale(1.1) !important;
        }

        .dynamic-nav-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FFFFFF;
          padding: 8px 18px;
          border-radius: 2px;
          color: #000;
          font-family: 'Playfair Display', 'Archivo', serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-decoration: none;
          border: 1px solid #FFFFFF;
          transition: all 0.4s ease;
        }
        .dynamic-nav-btn:hover {
          background: transparent;
          color: #FFFFFF;
          border-color: #FFFFFF;
          transform: translateY(-2px);
        }
        .dynamic-nav-btn i {
          font-size: 13px;
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 767px) {
          #nav-collection-link {
            display: none !important;
          }
        }
      `}} />

      <CollectionSlider />
      <CollectionGrid />
    </div>
  );
}

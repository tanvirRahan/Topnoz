'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { collectionCategories } from '@/constants/data';
import AddToCartButton from '@/app/product/[slug]/AddToCartButton';

export default function HomeProductGrid({ products }: { products: any[] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Add 'All' to the beginning of the shared categories
  const categories = [
    { label: 'All', value: 'All' },
    ...collectionCategories.map(c => ({ label: c.label, value: c.value }))
  ];

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => {
        const type = p.product_type?.toLowerCase() || '';
        const catValue = activeCategory.toLowerCase();
        return type === catValue;
      });

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <div className="mobile-filter-toggle-container">
        <button 
          className="mobile-filter-toggle" 
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <line x1="4" y1="21" x2="4" y2="14"></line>
            <line x1="4" y1="10" x2="4" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12" y2="3"></line>
            <line x1="20" y1="21" x2="20" y2="16"></line>
            <line x1="20" y1="12" x2="20" y2="3"></line>
            <line x1="1" y1="14" x2="7" y2="14"></line>
            <line x1="9" y1="8" x2="15" y2="8"></line>
            <line x1="17" y1="16" x2="23" y2="16"></line>
          </svg>
          Filter Categories
        </button>
      </div>

      {/* Mobile Filter Backdrop */}
      <div 
        className={`mobile-filter-backdrop ${isMobileFilterOpen ? 'open' : ''}`}
        onClick={() => setIsMobileFilterOpen(false)}
      ></div>

      {/* Filter Bar (Desktop inline, Mobile Sidebar) */}
      <div className={`filter-bar ${isMobileFilterOpen ? 'open' : ''}`}>
        <div className="filter-bar-header">
          <h3>Categories</h3>
          <button onClick={() => setIsMobileFilterOpen(false)} aria-label="Close Filter">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="filter-options">
          {categories.map(cat => (
            <button 
              key={cat.value} 
              className={activeCategory === cat.value ? 'active' : ''}
              onClick={() => {
                setActiveCategory(cat.value);
                setIsMobileFilterOpen(false);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="template-product-grid">
        {filteredProducts.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: '#6B6B6B', fontSize: '16px' }}>No products available for this category.</p>
          </div>
        ) : (
          filteredProducts.map((product: any) => (
            <article key={product.id} className="template-card" style={{ animation: 'fadeInUp 0.5s ease forwards' }}>
              <div className="card-media">
                <span className="template-tag">New</span>
                <button className="wishlist-btn" aria-label="Add to wishlist"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 21s-7-4.4-9.5-9C1 8 2.5 4.5 6 4c2-.3 3.7.7 4.7 2.2.3.4.9.4 1.2 0C13 4.7 14.7 3.7 16.7 4c3.5.5 5 4 3.5 8-2.5 4.6-9.5 9-9.5 9z"/></svg></button>
                {product.image_url ? (
                  <img src={`http://127.0.0.1:8000${product.image_url}`} alt={product.title} />
                ) : (
                  <div className="d-flex h-100 align-items-center justify-content-center w-100" style={{ backgroundColor: '#F5F5F5', color: '#6B6B6B', fontSize: '14px' }}>No Image</div>
                )}
                <Link href={`/product/${product.slug}`} className="quick-add" style={{ display: 'block', textDecoration: 'none' }}>Quick View</Link>
              </div>
              <div className="card-info">
                <div className="cat">Collection</div>
                <h3><Link href={`/product/${product.slug}`}>{product.title}</Link></h3>
                <div className="price-row">
                  <span className="template-price">৳ {product.discount_price ? product.discount_price : product.price}</span>
                  {product.discount_price && <span className="price-old">৳ {product.price}</span>}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </>
  );
}

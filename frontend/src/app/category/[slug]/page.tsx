import React, { Suspense } from 'react';
import Link from 'next/link';
import CategorySort from '@/components/CategorySort';
import AddToCartButton from '@/app/product/[slug]/AddToCartButton';

async function getCategoryProducts(category: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://topnoz-1.onrender.com/api'}/store/products?category=${category}`, {
      next: { revalidate: 60 } 
    });

    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch category products:", error);
    return [];
  }
}

interface Product {
  id: number;
  image_url: string;
  title: string;
  slug: string;
  discount_price?: number;
  price: number;
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await params;
  const category = resolvedParams?.slug || '';
  let products: Product[] = await getCategoryProducts(category);
  
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const sort = typeof resolvedSearchParams.sort === 'string' ? resolvedSearchParams.sort : 'recommended';

  // Apply sorting
  if (sort === 'price-low') {
    products = products.sort((a: Product, b: Product) => {
      const pA = a.discount_price ? Number(a.discount_price) : Number(a.price);
      const pB = b.discount_price ? Number(b.discount_price) : Number(b.price);
      return pA - pB;
    });
  } else if (sort === 'price-high') {
    products = products.sort((a: Product, b: Product) => {
      const pA = a.discount_price ? Number(a.discount_price) : Number(a.price);
      const pB = b.discount_price ? Number(b.discount_price) : Number(b.price);
      return pB - pA;
    });
  } else if (sort === 'newest') {
    // Assuming newer products have higher IDs or we can sort by id descending
    products = products.sort((a: Product, b: Product) => b.id - a.id);
  }

  // Format category name for display
  const categoryName = category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* Premium Header */}
      <header className="premium-category-header">
        <h1>{categoryName}</h1>
        <p>{products.length} {products.length === 1 ? 'Item' : 'Items'}</p>
      </header>

      {/* Filter and Sort Bar (Sticky) */}
      <div className="premium-filter-bar">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
          <Link href="/collection" style={{ display: 'flex', alignItems: 'center', color: '#111', textDecoration: 'none' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </Link>
          <button className="premium-filter-btn hide-on-mobile">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
            Filter
          </button>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <React.Suspense fallback={<select className="premium-sort-select"><option>Loading...</option></select>}>
            <CategorySort />
          </React.Suspense>
        </div>
      </div>



      {/* Product Grid */}
      <div className="premium-product-grid spaced">
        {products.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '80px 0' }}>
            <p style={{ color: '#999', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>No products found.</p>
            <Link href="/collection" className="premium-filter-btn" style={{ display: 'inline-flex', width: 'fit-content', margin: '0 auto' }}>Back to Collections</Link>
          </div>
        ) : (
          products.map((product: { id: number, image_url: string, title: string, slug: string, discount_price?: number, price: number }, index: number) => (
            <article key={product.id} className="premium-product-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="premium-card-media">
                {product.image_url ? (
                  <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL || 'https://topnoz-1.onrender.com'}${product.image_url}`} alt={product.title} loading="lazy" />
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F9F9', color: '#ccc', fontSize: '12px', textTransform: 'uppercase' }}>No Image</div>
                )}
                <Link href={`/product/${product.slug}`} className="premium-quick-add">Quick View</Link>
              </div>
              <div className="premium-card-info">
                <div className="premium-card-brand">TOPNOZ</div>
                <div className="premium-card-title">{product.title}</div>
                <div className="premium-card-price">
                  ৳ {product.discount_price ? product.discount_price : product.price}
                  {product.discount_price && <span className="premium-card-price-old">৳ {product.price}</span>}
                </div>
                <div style={{ marginTop: '16px' }}>
                  <AddToCartButton product={product} />
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

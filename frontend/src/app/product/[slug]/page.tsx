import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCartButton from './AddToCartButton';
import ProductGallery from './ProductGallery';
import ProductViewTracker from './ProductViewTracker';

async function getProduct(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/products/${slug}`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);
  
  if (!product) {
    notFound();
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  
  // Format all images with full URL
  const galleryImages = product.images && product.images.length > 0 
    ? product.images.map((img: string) => `${backendUrl}${img}`)
    : (product.image_url ? [`${backendUrl}${product.image_url}`] : []);

  return (
    <div className="template-container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
      <ProductViewTracker slug={product.slug} />
      <div style={{ marginBottom: '24px' }}>
        <Link href="/" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#555', 
          textDecoration: 'none',
          transition: 'color 0.2s ease'
        }}>
          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Shop
        </Link>
      </div>
      
      <div className="product-grid">
        
        {/* Product Gallery */}
        <div>
          <ProductGallery images={galleryImages} title={product.title} />
        </div>

        {/* Product Details */}
        <div style={{ padding: '0' }}>
          <span style={{ 
            display: 'inline-block', 
            backgroundColor: '#111', 
            color: '#fff', 
            padding: '4px 12px', 
            fontSize: '11px', 
            fontWeight: 'bold',
            letterSpacing: '1px', 
            textTransform: 'uppercase', 
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            {product.product_type}
          </span>
          
          <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2' }}>
            {product.title}
          </h1>

          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {product.discount_price ? (
              <>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#D32F2F' }}>৳{product.discount_price}</span>
                <del style={{ fontSize: '16px', color: '#888' }}>৳{product.price}</del>
              </>
            ) : (
              <span style={{ fontSize: '24px', fontWeight: '700', color: '#111' }}>৳{product.price}</span>
            )}
          </div>

          <div style={{ marginBottom: '32px' }}>
            {product.stock > 0 ? (
              <span style={{ color: '#2E7D32', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                In Stock ({product.stock})
              </span>
            ) : (
              <span style={{ color: '#D32F2F', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Out of Stock
              </span>
            )}
          </div>
          
          <hr style={{ border: 'none', borderTop: '1px solid #EAEAEA', margin: '32px 0' }} />

          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Product Details</h3>
          <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#555', marginBottom: '40px' }}>
            {product.description}
          </p>

          {/* Add to Cart Client Component */}
          {product.stock > 0 && (
            <AddToCartButton product={product} />
          )}

        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .product-grid {
          display: grid;
          grid-template-columns: minmax(250px, 380px) 1fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 991px) {
          .product-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}} />
    </div>
  );
}

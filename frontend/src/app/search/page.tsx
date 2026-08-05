import Link from 'next/link';

async function getSearchProducts(query: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store/products?q=${encodeURIComponent(query)}`, {
      cache: 'no-store' // Do not cache search results
    });

    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    return [];
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const query = typeof searchParams.q === 'string' ? searchParams.q : '';
  const products = await getSearchProducts(query);

  return (
    <>
      <div style={{ paddingTop: '100px', paddingBottom: '40px', backgroundColor: '#f8f8f8', textAlign: 'center' }}>
        <div className="template-container">
          <h1 style={{ fontSize: '32px', fontWeight: '900', fontFamily: "'Archivo', sans-serif", marginBottom: '10px' }}>
            Search Results
          </h1>
          <p style={{ color: '#6B6B6B', fontSize: '15px' }}>
            {query ? `Showing results for "${query}"` : 'Please enter a search term'}
          </p>
        </div>
      </div>

      <section className="template-section" style={{ minHeight: '50vh' }}>
        <div className="template-container">
          <div className="template-product-grid">
            {products.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 0' }}>
                <p style={{ color: '#6B6B6B', fontSize: '16px' }}>No products found matching your search.</p>
                <Link href="/" className="btn-outline" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Home</Link>
              </div>
            ) : (
              products.map((product: any) => (
                <article key={product.id} className="template-card">
                  <div className="card-media">
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
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
}

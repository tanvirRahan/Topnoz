import Link from 'next/link';
import HeroCarousel from '@/components/HeroCarousel';
import HomeProductGrid from '@/components/HomeProductGrid';

async function getProducts() {
  try {
    const res = await fetch(`https://topnoz-1.onrender.com/api/store/products`, {
      next: { revalidate: 60 } // Revalidate every 60 seconds (ISR)
    });

    if (!res.ok) {
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <HeroCarousel />

      {/* FILTER + PRODUCT GRID */}
      <section className="template-section" id="collection">
        <div className="template-container">
          <div className="section-head">
            <div className="section-eyebrow">Our Collection</div>
            <h2>Discover The Trending Models</h2>
            <p>Handpicked pieces, restocked weekly.</p>
          </div>

          <HomeProductGrid products={products} />
        </div>
      </section>

      {/* EDITORIAL */}
      <section className="editorial" id="editorial">
        <div className="editorial-media">
          <img src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=1200&auto=format&fit=crop" alt="Topnoz editorial" />
        </div>
        <div className="editorial-copy">
          <div className="section-eyebrow">The Journal</div>
          <h2>Express Your Top Thoughts</h2>
          <p>Every piece in the Topnoz wardrobe is built on one idea — what you wear should say something true about how you think. No noise, no trend-chasing. Just tailored confidence, season after season.</p>
          <Link href="/#editorial" className="btn-outline">Read The Story</Link>
        </div>
      </section>

      {/* VALUE STRIP */}
      <div className="template-container">
        <div className="value-strip">
          <div className="value-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7h13l4 4v6h-2M3 7v10h2m10-10v10M3 7l2-4h9l3 4"/><circle cx="7.5" cy="18" r="1.8"/><circle cx="17.5" cy="18" r="1.8"/></svg>
            <h4>Free Shipping</h4>
            <p>On all orders over ৳2,000</p>
          </div>
          <div className="value-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 12l4 4L21 4"/></svg>
            <h4>Easy Returns</h4>
            <p>14-day hassle-free exchange</p>
          </div>
          <div className="value-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="6" width="18" height="13" rx="1"/><path d="M3 10h18M8 3v6"/></svg>
            <h4>Secure Payment</h4>
            <p>bKash, Nagad & cards accepted</p>
          </div>
          <div className="value-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>
            <h4>24/7 Support</h4>
            <p>AI Assistant always online</p>
          </div>
        </div>
      </div>

      {/* NEWSLETTER */}
      <section className="template-newsletter">
        <h2>Join The Topnoz List</h2>
        <p>New drops, restocks, and early access — straight to your inbox.</p>
        <form className="newsletter-form">
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>
    </>
  );
}

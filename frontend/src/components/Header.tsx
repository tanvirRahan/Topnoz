"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ first_name: string, last_name: string } | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          // If token is invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const closeMobileMenu = () => {
    const checkbox = document.getElementById('global-mobile-menu') as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  };

  return (
    <>
      <input type="checkbox" id="global-mobile-menu" style={{ display: 'none' }} />
      <header className="template-header">
        <div className="template-container nav-inner">
          <Link href="/" className="template-logo" onClick={closeMobileMenu}>
            <img src="/image/topnozlogo.jpg" alt="Topnoz Logo" style={{ height: '34px', width: 'auto', borderRadius: '2px' }} />
            Topnoz
          </Link>

          <ul className="nav-links" id="main-nav-links">
            {/* Mobile Greeting - Top of Menu */}
            {isClient && user && (
              <li className="mobile-only" style={{ padding: '20px', fontWeight: '800', backgroundColor: '#1A1A1A', color: '#fff', borderBottom: '1px solid #333', fontSize: '15px', textTransform: 'uppercase', letterSpacing: '1px', textAlign: 'center' }}>
                Hey, {user.first_name} {user.last_name}
              </li>
            )}

            <li className="mobile-only" style={{ padding: '15px 20px', borderBottom: '1px solid #333' }}>
              <form action="/search" method="GET" className="mobile-nav-search-form" onSubmit={closeMobileMenu} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#222', borderRadius: '4px', overflow: 'hidden', border: '1px solid #444' }}>
                <input type="text" name="q" placeholder="Search products..." style={{ flex: 1, padding: '12px 16px', backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '14px', outline: 'none' }} />
                <button type="submit" style={{ padding: '0 16px', backgroundColor: '#fff', color: '#111', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
                </button>
              </form>
            </li>
            {pathname !== '/collection' && <li id="nav-collection-link"><Link href="/collection" onClick={closeMobileMenu}>Collection</Link></li>}
            {pathname !== '/new-arrivals' && <li><Link href="/new-arrivals" onClick={closeMobileMenu}>New Arrivals</Link></li>}
            {pathname !== '/#editorial' && <li><Link href="/#editorial" onClick={closeMobileMenu}>Journal</Link></li>}
            {pathname !== '/chat' && <li><Link href="/chat" onClick={closeMobileMenu}>AI Assistant</Link></li>}

            {/* Mobile Auth Links */}
            {isClient && user ? (
              <>
                {pathname !== '/cart' && <li className="mobile-only"><Link href="/cart" onClick={closeMobileMenu}>Cart</Link></li>}
                <li className="mobile-only"><a href="#" onClick={(e) => { closeMobileMenu(); handleLogout(e); }} style={{ color: '#D32F2F', fontWeight: 'bold' }}>Logout</a></li>
              </>
            ) : (
              <>
                {pathname !== '/login' && <li className="mobile-only"><Link href="/login" onClick={closeMobileMenu}>Login</Link></li>}
                {pathname !== '/cart' && <li className="mobile-only"><Link href="/cart" onClick={closeMobileMenu}>Cart</Link></li>}
              </>
            )}
          </ul>

          <div className="nav-actions">
            <form action="/search" method="GET" className="nav-search-form hide-on-mobile">
              <input type="text" name="q" placeholder="Search..." className="nav-search-input" />
              <button type="submit" className="nav-search-btn">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
              </button>
            </form>

            {/* Desktop Auth Links */}
            {isClient && user ? (
              <div className="hide-on-mobile">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Hey, {user.first_name} {user.last_name}
                  </span>
                  <a href="#" onClick={handleLogout} style={{ fontSize: '13px', fontWeight: '600', color: '#D32F2F', textTransform: 'uppercase', textDecoration: 'none' }}>
                    Logout
                  </a>
                </div>
              </div>
            ) : (
              pathname !== '/login' && (
                <Link href="/login" className="action hide-on-mobile" aria-label="Account">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" /></svg>
                  <span className="hide-on-mobile">Login</span>
                </Link>
              )
            )}

            {pathname !== '/cart' && (
              <Link href="/cart" className="action hide-on-mobile" aria-label="Cart" style={{ marginLeft: (isClient && user) ? '0' : undefined }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 8h12l-1 12H7L6 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
                <span className="hide-on-mobile">Cart</span>
              </Link>
            )}
            
            {pathname !== '/contact' && (
              <Link href="/contact" className="action hide-on-mobile" aria-label="Contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
              </Link>
            )}
            <label htmlFor="global-mobile-menu" className="menu-toggle" aria-label="Menu" id="mobile-menu-btn"><span></span><span></span><span></span></label>
          </div>
        </div>
      </header>
    </>
  );
}

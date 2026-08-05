import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import Script from 'next/script';
import Header from '@/components/Header';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'Topnoz | Home',
  description: 'Style. Comfort. Confidence. Always.',
};

import ScrollHandler from '@/components/ScrollHandler';
import VisitorTracker from '@/components/VisitorTracker';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.2/css/all.css" />
        {/* <link href="/css/bootstrap.min.css" rel="stylesheet" /> */}
        {/* <link href="/css/mdb.min.css" rel="stylesheet" /> */}
        {/* <link href="/css/style.min.css" rel="stylesheet" /> */}
      </head>
      <body>
        <ScrollHandler />
        <VisitorTracker />
        {/* TICKER */}
        <div className="ticker-bar">
          <div className="ticker-track">
            <span>STYLE. COMFORT. CONFIDENCE. ALWAYS.</span>
            <span>FREE SHIPPING OVER ৳2000</span>
            <span>NEW ARRIVALS EVERY WEEK</span>
            <span>STYLE. COMFORT. CONFIDENCE. ALWAYS.</span>
            <span>FREE SHIPPING OVER ৳2000</span>
            <span>NEW ARRIVALS EVERY WEEK</span>
          </div>
        </div>

        <Header />
        <Toaster position="bottom-right" />

        {children}

        {/* FOOTER */}
        <footer className="template-footer">
          <div className="template-container">
            <div className="footer-grid">
              <div className="footer-brand">
                <Link href="/" className="template-logo"><span className="logo-mark">TZ</span>Topnoz</Link>
                <p>Style. Comfort. Confidence. Always. Tailored menswear for people who think in black and white.</p>
              </div>
              <div className="footer-col">
                <h5>Shop</h5>
                <ul>
                  <li><Link href="/new-arrivals">New Arrivals</Link></li>
                  <li><Link href="#">Formalwear</Link></li>
                  <li><Link href="#">Denim</Link></li>
                  <li><Link href="#">Accessories</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Support</h5>
                <ul>
                  <li><Link href="/contact">Contact Us</Link></li>
                  <li><Link href="#">Shipping Info</Link></li>
                  <li><Link href="#">Returns & Exchange</Link></li>
                  <li><Link href="#">Size Guide</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <h5>Company</h5>
                <ul>
                  <li><Link href="#">About Topnoz</Link></li>
                  <li><Link href="#">Careers</Link></li>
                  <li><Link href="#">Journal</Link></li>
                  <li><Link href="#">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <p>© 2026 Topnoz. All rights reserved.</p>
              <div className="socials">
                <Link href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" /></svg></Link>
                <Link href="#" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M15 4h-2a4 4 0 0 0-4 4v3H7v3h2v6h3v-6h2.5l.5-3H12V8a1 1 0 0 1 1-1h2V4z" /></svg></Link>
                <Link href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 4v10.5a3 3 0 1 1-2-2.83" /><path d="M14 4c0 2.5 1.5 4 4 4" /></svg></Link>
              </div>
              <div className="payment-icons">
                <span>bKash</span>
                <span>Nagad</span>
                <span>VISA</span>
                <span>MC</span>
              </div>
            </div>
          </div>
        </footer>

        <Script id="mobile-menu-closer" strategy="afterInteractive">
          {`
            document.addEventListener('click', function(e) {
              const menuToggle = document.getElementById('global-mobile-menu');
              if (menuToggle && menuToggle.checked) {
                // If clicked inside a nav link (but not the search input itself)
                if (e.target.closest('.nav-links a')) {
                  menuToggle.checked = false;
                }
              }
            });
          `}
        </Script>
        
        <ChatWidget />
      </body>
    </html>
  );
}

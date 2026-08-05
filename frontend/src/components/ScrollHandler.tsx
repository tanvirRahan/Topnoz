'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector('.template-header');
    if (!header) return;

    const handleScroll = () => {
      // If we are not on the homepage or collection page, ALWAYS keep the scrolled state so text is visible!
      if ((pathname !== '/' && pathname !== '/collection') || window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  return null;
}

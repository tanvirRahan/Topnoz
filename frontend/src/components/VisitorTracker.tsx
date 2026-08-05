"use client";

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Only run this once per session
    const hasTracked = sessionStorage.getItem('visitor_tracked');
    if (hasTracked) return;

    const trackVisitor = async () => {
      try {
        const userAgent = navigator.userAgent;
        let os = "Unknown OS";
        let browser = "Unknown Browser";

        // Basic OS detection
        if (userAgent.indexOf("Win") !== -1) os = "Windows";
        if (userAgent.indexOf("Mac") !== -1) os = "MacOS";
        if (userAgent.indexOf("X11") !== -1) os = "UNIX";
        if (userAgent.indexOf("Linux") !== -1) os = "Linux";
        if (userAgent.indexOf("Android") !== -1) os = "Android";
        if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

        // Basic Browser detection
        if (userAgent.indexOf("Chrome") !== -1) browser = "Chrome";
        else if (userAgent.indexOf("Safari") !== -1) browser = "Safari";
        else if (userAgent.indexOf("Firefox") !== -1) browser = "Firefox";
        else if (userAgent.indexOf("MSIE") !== -1 || userAgent.indexOf("Trident/") !== -1) browser = "IE";
        else if (userAgent.indexOf("Edge") !== -1) browser = "Edge";

        // Advanced Tracking
        const urlParams = new URLSearchParams(window.location.search);
        
        const payload = {
          os: os,
          browser: browser,
          device_info: userAgent,
          referrer_url: document.referrer || null,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          utm_source: urlParams.get('utm_source') || null,
          utm_medium: urlParams.get('utm_medium') || null,
          utm_campaign: urlParams.get('utm_campaign') || null,
        };

        const res = await fetch(`https://topnoz-1.onrender.com/api/users/track-visitor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          sessionStorage.setItem('visitor_tracked', 'true');
        }
      } catch (error) {
        // Silently fail if tracking doesn't work
        console.error("Tracking failed", error);
      }
    };

    trackVisitor();
  }, []);

  return null;
}

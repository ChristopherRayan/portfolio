'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string>('');

  useEffect(() => {
    const trackPageview = async () => {
      const url = pathname + searchParams.toString();
      
      // Prevent duplicate tracking on the same path
      if (lastPath.current === url) return;
      lastPath.current = url;

      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            type: 'view',
            referrer: document.referrer || '',
            metadata: {
              search: searchParams.toString(),
              title: document.title,
            }
          }),
        });
      } catch (err) {
        // Silent error to prevent UI issues
        console.warn('Analytics tracking failed');
      }
    };

    // Delay slightly to ensure page title is updated and initial load is settled
    const timer = setTimeout(trackPageview, 1000);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return null; // This is a logic-only component
}

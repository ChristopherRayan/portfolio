'use client';

import { Navigation } from '@/components/public/Navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <div className={cn(
      "flex flex-col transition-all duration-300",
      isHome ? "h-screen overflow-hidden" : "min-h-screen"
    )}>
      <Navigation />
      <main className={cn("flex-1", isHome ? "overflow-hidden" : "overflow-y-auto")}>
        {children}
      </main>
    </div>
  );
}

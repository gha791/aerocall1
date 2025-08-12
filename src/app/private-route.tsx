
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

const publicRoutes = ['/login', '/signup', '/accept-invitation'];

const FullPageLoader = () => (
    <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-12 w-12 fill-primary animate-pulse"
            >
              <path d="M16.5 12.5C16.5 13.3284 15.8284 14 15 14H9C8.17157 14 7.5 13.3284 7.5 12.5V12.5C7.5 11.6716 8.17157 11 9 11H15C15.8284 11 16.5 11.6716 16.5 12.5V12.5Z"></path>
              <path d="M6 17.5C6 19.433 7.567 21 9.5 21H14.5C16.433 21 18 19.433 18 17.5V13H6V17.5Z"></path>
              <path d="M18 11V6.5C18 4.567 16.433 3 14.5 3H9.5C7.567 3 6 4.567 6 6.5V11H18Z"></path>
            </svg>
            <Skeleton className="h-4 w-48" />
        </div>
    </div>
);


export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) {
      return; 
    }

    const isPublicPath = publicRoutes.some(route => pathname.startsWith(route));

    if (!user && !isPublicPath) {
      router.push('/login');
    }

    if (user && isPublicPath) {
      router.push('/');
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <FullPageLoader />;
  }
  
  const isPublicPath = publicRoutes.some(route => pathname.startsWith(route));

  // If user is not logged in and it's a public path, show the page
  if (!user && isPublicPath) {
      return <>{children}</>;
  }

  // If user is logged in and it's not a public path, show the protected page
  if (user && !isPublicPath) {
      return <>{children}</>;
  }

  // Otherwise, show loader while redirecting
  return <FullPageLoader />;
}

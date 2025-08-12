
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


const PublicHeader = () => {

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-6 w-6 fill-primary"
            >
              <path d="M16.5 12.5C16.5 13.3284 15.8284 14 15 14H9C8.17157 14 7.5 13.3284 7.5 12.5V12.5C7.5 11.6716 8.17157 11 9 11H15C15.8284 11 16.5 11.6716 16.5 12.5V12.5Z"></path>
              <path d="M6 17.5C6 19.433 7.567 21 9.5 21H14.5C16.433 21 18 19.433 18 17.5V13H6V17.5Z"></path>
              <path d="M18 11V6.5C18 4.567 16.433 3 14.5 3H9.5C7.567 3 6 4.567 6 6.5V11H18Z"></path>
            </svg>
            <span className="font-bold font-headline">AEROCALL</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button asChild>
                <Link href="/dashboard">Go to App</Link>
            </Button>
        </div>
      </div>
    </header>
  );
};

const PublicFooter = () => {
  return (
    <footer className="border-t">
        <div className="container py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} AEROCALL. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link>
                    <Link href="#" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}

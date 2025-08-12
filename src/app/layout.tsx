import type {Metadata} from 'next';
import { Inter as FontSans, Poppins as FontHeadline } from "next/font/google"
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/hooks/use-auth';
import PrivateRoute from './private-route';
import Script from 'next/script';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontHeadline = FontHeadline({
  subsets: ["latin"],
  weight: ['400', '600', '700'],
  variable: "--font-headline",
})

export const metadata: Metadata = {
  title: 'AEROCALL',
  description: 'The All-in-One Cloud Phone System for Your Business.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeadline.variable
        )}>
        <AuthProvider>
          <PrivateRoute>
            {children}
          </PrivateRoute>
        </AuthProvider>
        <Toaster />
        <Script src="https://cdn.paddle.com/paddle/paddle.js" />
      </body>
    </html>
  );
}

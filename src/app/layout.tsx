
'use client';
import './globals.css'
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Loading from '@/components/Loading';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); 
  const [isLoading, setIsLoading] = useState(pathname === '/gnome' ? false : true);
  return (
    <html lang="en">
      <body >{
        isLoading ? (
          <Loading
            // isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) :
          children
      }</body>
    </html>
  )
}

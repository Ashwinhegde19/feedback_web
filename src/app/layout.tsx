import React from 'react';
import { Inter } from 'next/font/google'; // Adjust the import path as necessary
import AuthProvider from '@/context/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
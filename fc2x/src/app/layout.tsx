'use client'
import React, { useState, useEffect } from 'react';
import "@neynar/react/dist/style.css";
import "./globals.css";
import { NeynarContextProvider, Theme } from "@neynar/react";
import { ThemeProvider } from "@/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return newTheme;
    });
  };

  return (
    <ThemeProvider value={{ theme, toggleTheme }}>
      <html lang="en">
        <body>
          <NeynarContextProvider
            key={theme}
            settings={{
              clientId: process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID as string,
              defaultTheme: theme === 'light' ? Theme.Light : Theme.Dark,
            }}
          >
            {children}
          </NeynarContextProvider>
        </body>
      </html>
    </ThemeProvider>
  );
}
"use client";

import { Inter } from "next/font/google";
import "./globals.scss";
import { AppProvider } from "@/Context/AppContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "@neynar/react/dist/style.css";
import NeynarProviderWrapper from "@/Context/NeynarProviderWrapper";
import { base } from "viem/chains";

// import type { Metadata } from 'next';
// import { NEXT_PUBLIC_URL } from '../config';

import './global.css';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ["latin"] });

const OnchainProviders = dynamic(
  () => import('../components/OnchainProviders'),
  {
    ssr: false,
  },
);

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

// export const metadata: Metadata = {
//   title: 'Onchain App Template',
//   description: 'Built with OnchainKit',
//   openGraph: {
//     title: 'Onchain App Template',
//     description: 'Built with OnchainKit',
//     images: [`${NEXT_PUBLIC_URL}/vibes/vibes-19.png`],
//   },
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <NeynarProviderWrapper>
            <OnchainProviders>
              {children}
              <ToastContainer />
            </OnchainProviders>
          </NeynarProviderWrapper>
        </AppProvider>
      </body>
    </html>
  );
}

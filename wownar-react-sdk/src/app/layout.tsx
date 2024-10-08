"use client";

import { Inter } from "next/font/google";
import "./globals.scss";
import { AppProvider } from "@/Context/AppContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "@neynar/react/dist/style.css";
import NeynarProviderWrapper from "@/Context/NeynarProviderWrapper";
import { base } from "viem/chains";

const inter = Inter({ subsets: ["latin"] });

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
              {children}
              <ToastContainer />
            </NeynarProviderWrapper>
        </AppProvider>
      </body>
    </html>
  );
}

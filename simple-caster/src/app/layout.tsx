import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AppProvider } from "@/Context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wownar",
  description: "A demo app (powered by Neynar) that will help user to cast",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}

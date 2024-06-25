import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AppProvider } from "@/Context/AppContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

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
      <head>
        {/* Start of Neynar Frame */}
        <title>Wownar</title>
        <meta property="og:title" content="Wownar"/>
        <meta property="og:description" content="A demo app (powered by Neynar) that will help user to cast" />
        <meta property="og:image" content="https://i.imgur.com/WtMhBtP.png"/>
        <meta property="fc:frame" content="vNext"/>
        <meta property="fc:frame:image" content="https://i.imgur.com/WtMhBtP.png"/>
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1"/> 
        <meta property="fc:frame:button:1" content="Repo"/>
        <meta property="fc:frame:button:1:action" content="post_redirect"/>
        <meta property="fc:frame:button:2" content="View Wownar"/>
        <meta property="fc:frame:button:2:action" content="post_redirect"/>
        <meta property="fc:frame:post_url" content="https://frames.neynar.com/f/e5b5f4b9/e8d1c50b"/>
        {/* End of Neynar Frame */}
      </head>
      <body className={inter.className}>
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import { AppProvider } from "@/Context/AppContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { FrameProvider } from "@/app/providers";

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_URL;

// frame preview metadata
const appName = 'Wownar';
const splashImageUrl = `${appUrl}/logos/powered-by-neynar.png`;
const iconUrl = `${appUrl}/logos/neynar.svg`;

const framePreviewMetadata = {
  version: "next",
  imageUrl: splashImageUrl,
  button: {
    title: 'Launch Wownar',
    action: {
      type: "launch_frame",
      name: appName,
      url: appUrl,
      splashImageUrl,
      iconUrl,
      splashBackgroundColor: "#000000",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: appName,
    openGraph: {
      title: appName,
      description: "A demo app (powered by Neynar) that will help user to cast",
    },
    other: {
      "fc:frame": JSON.stringify(framePreviewMetadata),
    },
  };
}

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
        <meta property="og:title" content="Wownar" />
        <meta
          property="og:description"
          content="A demo app (powered by Neynar) that will help user to cast"
        />
        <meta property="og:image" content="https://i.imgur.com/WtMhBtP.png" />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://i.imgur.com/WtMhBtP.png"
        />
        <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
        <meta property="fc:frame:button:1" content="Repo" />
        <meta property="fc:frame:button:1:action" content="post_redirect" />
        <meta property="fc:frame:button:2" content="View Wownar" />
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta
          property="fc:frame:post_url"
          content="https://frames.neynar.com/f/e5b5f4b9/e8d1c50b"
        />
        <link rel="icon" href="/logos/wownar-logo.svg" sizes="32x32" />

        {/* End of Neynar Frame */}
      </head>
      <body className={inter.className}>
        <FrameProvider>
          <AppProvider>
            {children}
            <ToastContainer />
          </AppProvider>
        </FrameProvider>
      </body>
    </html>
  );
}

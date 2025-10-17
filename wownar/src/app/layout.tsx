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
        <meta property="og:title" content={appName} />
        <meta
          property="og:description"
          content="A demo app (powered by Neynar) that will help user to cast"
        />
        <meta property="og:image" content={splashImageUrl} />
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

import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Haley & George Garcia — June 18, 2027",
  description: "Join us for our wedding celebration in Cape May, NJ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Analytics />
        {/* Umami — cookieless, gives city/region on top of Vercel's country-level data.
            afterInteractive keeps it off the critical path so it can't delay the lander. */}
        <Script
          src="https://cloud.umami.is/script.js"
          data-website-id="1091e1ca-e116-4cae-bcee-cceddca68fc1"
          // Only report from the live domains. Vercel gives every branch a preview URL,
          // and without this our own testing would land in the real visitor numbers.
          data-domains="thegarcias2027.com,www.thegarcias2027.com,garcia-wedding.vercel.app"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

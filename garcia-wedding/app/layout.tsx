import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thegarcias2027.com"),

  // The browser tab and Google's headline read from the same tag, so this one string
  // has to serve both. Short form wins: the tab stays legible, and the full names are
  // carried by the description and the share card below.
  title: "The Garcias 2027",
  description:
    "Haley Driscoll & George Garcia III. June 18, 2027 in Cape May, New Jersey.",

  // What a guest sees when someone texts them the link, which is how most people will
  // arrive here. Full names lead.
  openGraph: {
    title: "Haley Driscoll & George Garcia III",
    description: "Join us in Cape May, New Jersey on June 18, 2027.",
    siteName: "The Garcias 2027",
    url: "https://thegarcias2027.com",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Haley Driscoll & George Garcia III",
    description: "Join us in Cape May, New Jersey on June 18, 2027.",
  },
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

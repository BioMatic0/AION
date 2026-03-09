import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AION",
  description: "Human-centered AI platform for reflection, structure, and development.",
  applicationName: "AION",
  creator: "Patrick Wirth",
  publisher: "Patrick Wirth",
  authors: [{ name: "Patrick Wirth", url: "mailto:patrickwirth_93@icloud.com" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AION"
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "otisscott.me - Terminal Portfolio",
  description: "A terminal-emulated personal website built with Next.js and xterm.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}

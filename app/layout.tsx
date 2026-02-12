import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Otis Scott",
  description: "Otis Scott — Director of Technology, Manhattan Wine Company",
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

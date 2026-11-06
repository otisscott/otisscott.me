import type { Metadata } from "next";
import { NAME, currentRole } from "@/lib/filesystem/profile";
import "./globals.css";

const role = currentRole();
const description = `${NAME} — ${role.title}, ${role.company}`;

export const metadata: Metadata = {
  metadataBase: new URL("https://otisscott.me"),
  title: NAME,
  description,
  openGraph: {
    title: NAME,
    description,
    url: "/",
    siteName: "otisscott.me",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: NAME,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

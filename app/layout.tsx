import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialCooker",
  description: "Social recipe sharing and meal tracking app",
  authors: [{ name: "SocialCooker" }],
  openGraph: {
    title: "SocialCooker",
    description: "Social recipe sharing and meal tracking app",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

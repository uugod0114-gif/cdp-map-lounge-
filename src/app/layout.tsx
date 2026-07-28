import type { Metadata } from "next";
import "./globals.css";
import { RoleProvider } from "@/features/auth/role-context";

export const metadata: Metadata = {
  title: "CDP MAP Lounge | ETC마케팅본부",
  description:
    "ETC마케팅본부 CDP MAP(Marketing Assignment Program) 교육 운영 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-map-ink">
        <RoleProvider>{children}</RoleProvider>
      </body>
    </html>
  );
}

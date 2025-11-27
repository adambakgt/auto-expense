import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "경비 처리 자동화 - AI 지출결의서",
  description:
    "영수증만 업로드하면 AI가 지출결의서를 자동으로 작성해주는 경비 처리 자동화 솔루션",
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" style={{ colorScheme: "light" }}>
      <body>{children}</body>
    </html>
  );
}

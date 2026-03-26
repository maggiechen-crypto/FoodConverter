import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FoodConverter - AI 拍照识菜生成食谱",
  description: "拍照识别食材，AI 生成美味食谱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
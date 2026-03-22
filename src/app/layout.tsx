import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "圣经知识库",
  description: "圣经经文查询与阅读，支持NIV、KJV、希伯来语、希腊语原文",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-gray-800 text-gray-300 py-4 text-center text-sm">
          <p>© 2024 圣经知识库 Bible Knowledge</p>
        </footer>
      </body>
    </html>
  );
}

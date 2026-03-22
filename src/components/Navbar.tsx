"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "首页", labelEn: "Home" },
  { href: "/bible", label: "经文阅读", labelEn: "Bible" },
  { href: "/knowledge", label: "知识库", labelEn: "Knowledge" },
  { href: "/worship", label: "敬拜歌曲", labelEn: "Worship" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold hover:text-blue-200">
              📖 圣经知识库
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  pathname === item.href
                    ? "bg-blue-800 text-white"
                    : "text-blue-100 hover:bg-blue-800"
                }`}
              >
                {item.label} <span className="text-blue-300">({item.labelEn})</span>
              </Link>
            ))}

            {/* Language Toggle Placeholder */}
            <button className="ml-4 px-3 py-1 border border-blue-400 rounded text-sm hover:bg-blue-800 transition">
              中/EN
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-blue-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-blue-700 text-white"
                    : "text-blue-100 hover:bg-blue-700"
                }`}
              >
                {item.label} ({item.labelEn})
              </Link>
            ))}
            <button className="w-full mt-2 px-3 py-2 border border-blue-400 rounded text-sm hover:bg-blue-700">
              中/EN (语言切换)
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

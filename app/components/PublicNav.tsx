"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface PublicNavProps {
  textColor?: string; // Theme color for text (light shade)
  useTheme?: boolean; // Whether to use theme styling
}

export default function PublicNav({
  textColor,
  useTheme = false,
}: PublicNavProps = {}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Pricing", href: "/pricing" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white/10 backdrop-blur-lg border-b border-white/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logos/icon.svg"
              alt="ChurchDonate"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="text-white font-bold text-lg hidden sm:inline">
              ChurchDonate
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  useTheme
                    ? isActive(item.href)
                      ? "text-white"
                      : "hover:text-white"
                    : isActive(item.href)
                    ? "text-white"
                    : "text-primary-200 hover:text-white"
                }`}
                style={
                  useTheme && !isActive(item.href) && textColor
                    ? { color: textColor }
                    : undefined
                }>
                {item.name}
              </Link>
            ))}
            <Link
              href="/get-started"
              className={`bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-100 transition-colors ${
                useTheme ? "text-gray-900" : "text-primary-900"
              }`}>
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              {mobileMenuOpen ? (
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

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium transition-colors ${
                    useTheme
                      ? isActive(item.href)
                        ? "text-white"
                        : "hover:text-white"
                      : isActive(item.href)
                      ? "text-white"
                      : "text-primary-200 hover:text-white"
                  }`}
                  style={
                    useTheme && !isActive(item.href) && textColor
                      ? { color: textColor }
                      : undefined
                  }>
                  {item.name}
                </Link>
              ))}
              <Link
                href="/get-started"
                onClick={() => setMobileMenuOpen(false)}
                className={`bg-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-100 transition-colors text-center ${
                  useTheme ? "text-gray-900" : "text-primary-900"
                }`}>
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

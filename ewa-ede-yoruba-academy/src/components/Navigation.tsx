"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function Navigation() {
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-[#111827] border-b-2 border-[#111827] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Ẹwà Èdè Yorùbá Academy"
                width={192}
                height={192}
                className="h-10 sm:h-12 w-auto"
                quality={100}
                priority
              />
            </div>
            <div className="hidden md:flex items-center justify-center flex-1 space-x-6 lg:space-x-8">
              <Link href="/" className="text-white hover:text-[#e69d2a] transition-colors font-medium text-sm lg:text-base">Home</Link>
              <a href="#about" className="text-white hover:text-[#e69d2a] transition-colors font-medium text-sm lg:text-base">About</a>
              <Link href="/services/yoruba-language-lessons" className="text-white hover:text-[#e69d2a] transition-colors font-medium text-sm lg:text-base">Pricing</Link>

              {/* Services Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                  className="text-white hover:text-[#e69d2a] transition-colors font-medium text-sm lg:text-base flex items-center"
                >
                  Services
                  <svg className={`ml-1 h-4 w-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isServicesDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="py-2">
                      <Link
                        href="/services/yoruba-language-lessons"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#4f46e5] transition-colors"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        Yoruba Language Lessons
                      </Link>
                      <Link
                        href="/services/localization"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#4f46e5] transition-colors"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        Localization Services
                      </Link>
                      <Link
                        href="/services/data-annotation"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#4f46e5] transition-colors"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        Data Annotation
                      </Link>
                      <Link
                        href="/services/cultural-education"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#4f46e5] transition-colors"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        Cultural Education & Curriculum Development
                      </Link>
                      <Link
                        href="/services/event-planning"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#4f46e5] transition-colors"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        Cultural Themed Event Planning
                      </Link>
                      <Link
                        href="/services/consulting"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#4f46e5] transition-colors"
                        onClick={() => setIsServicesDropdownOpen(false)}
                      >
                        Consulting & Training
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <a href="#contact" className="bg-[#e69d2a] text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-[#d48a1f] transition-colors font-medium text-sm lg:text-base">Contact Us</a>
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-6 space-y-4">
            <Link
              href="/"
              className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-2 border-b border-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/services/yoruba-language-lessons"
              className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-2 border-b border-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-2 border-b border-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>

            {/* Services Section */}
            <div className="py-2">
              <button
                onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-900 mb-2 hover:text-[#e69d2a] transition-colors"
              >
                <span>Services</span>
                {isMobileServicesOpen ? (
                  <ChevronUp size={16} className="text-gray-500" />
                ) : (
                  <ChevronDown size={16} className="text-gray-500" />
                )}
              </button>
              {isMobileServicesOpen && (
                <div className="ml-4 space-y-1">
                  <Link
                    href="/services/yoruba-language-lessons"
                    className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-1 pl-4 text-sm border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Yoruba Language Lessons
                  </Link>
                  <Link
                    href="/services/localization"
                    className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-1 pl-4 text-sm border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Localization Services
                  </Link>
                  <Link
                    href="/services/data-annotation"
                    className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-1 pl-4 text-sm border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Data Annotation
                  </Link>
                  <Link
                    href="/services/cultural-education"
                    className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-1 pl-4 text-sm border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cultural Education & Curriculum Development
                  </Link>
                  <Link
                    href="/services/event-planning"
                    className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-1 pl-4 text-sm border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cultural Themed Event Planning
                  </Link>
                  <Link
                    href="/services/consulting"
                    className="block text-gray-900 hover:text-[#e69d2a] transition-colors font-medium py-1 pl-4 text-sm border-b border-gray-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Consulting & Training
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-3">
              <Link
                href="/contact"
                className="block bg-[#e69d2a] text-white px-4 py-2 rounded-lg hover:bg-[#d48a1f] transition-colors font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
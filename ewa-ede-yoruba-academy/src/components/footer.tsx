"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MessageCircle, Phone, BookOpen, X, Github } from "lucide-react";

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const handleBookClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      setShowModal(true);
      setClickCount(0); // Reset counter
    }
  };

  return (
    <footer className="bg-[#111827] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Image
                src="/logo.png"
                alt="Ẹwà Èdè Yorùbá Academy"
                width={160}
                height={160}
                className="h-10 w-auto"
                quality={100}
              />
            </div>
            <p className="text-gray-300 text-sm">
              Empowering learners worldwide to master the beautiful Yoruba language and culture.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Learning</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/courses" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Courses</Link></li>
              <li><Link href="/live-sessions" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Live Sessions</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/help" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Contact Us</Link></li>
              <li><a href="https://wa.me/2348120997786?text=Hello%2C%20I%E2%80%99d%20like%20to%20learn%20more%20about%20your%20Yoruba%20classes" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#e69d2a] transition-colors flex items-center"><MessageCircle size={16} className="mr-2" />Send a DM</a></li>
              <li><a href="tel:+2348138534899" className="text-gray-300 hover:text-[#e69d2a] transition-colors flex items-center"><Phone size={16} className="mr-2" />Call Now</a></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-6 pt-6 text-center text-gray-400 text-sm">
          <p>Copyright &copy; 2025 Ẹwà Èdè Yorùbá Academy. All rights reserved.</p>
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleBookClick}
              className="text-gray-500 hover:text-[#e69d2a] transition-colors cursor-pointer"
              title="Click me 5 times!"
            >
              <BookOpen size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Github size={32} className="text-gray-800" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Found the Easter Egg! 🎉</h3>
              <p className="text-gray-600 mb-4">
                Thanks for exploring! Check out my GitHub profile for more projects.
              </p>
              <a
                href="https://github.com/TravisChandler1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Github size={16} className="mr-2" />
                Visit GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

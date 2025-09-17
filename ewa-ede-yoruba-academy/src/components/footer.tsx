import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Phone } from "lucide-react";

export default function Footer() {
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
              <li><Link href="/e-library" className="text-gray-300 hover:text-[#e69d2a] transition-colors">E-Library</Link></li>
              <li><Link href="/book-club" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Book Club</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-white">Community</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/learning-groups" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Learning Groups</Link></li>
              <li><Link href="/forums" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Forums</Link></li>
              <li><Link href="/events" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Events</Link></li>
              <li><Link href="/teachers" className="text-gray-300 hover:text-[#e69d2a] transition-colors">Teachers</Link></li>
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
          <p>&copy; 2025 Ẹwà Èdè Yorùbá Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

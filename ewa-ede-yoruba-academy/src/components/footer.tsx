import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12">
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
            <p className="text-gray-600 text-sm">
              Empowering learners worldwide to master the beautiful Yoruba language and culture.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Learning</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Courses</a></li>
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Live Sessions</a></li>
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">E-Library</a></li>
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Book Club</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Learning Groups</a></li>
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Forums</a></li>
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Events</a></li>
              <li><a href="#" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Teachers</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/help" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-[#111827] hover:text-[#e69d2a] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
          <p>&copy; 2025 Ẹwà Èdè Yorùbá Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

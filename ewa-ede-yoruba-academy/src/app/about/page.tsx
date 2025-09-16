import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Users, BookOpen, Globe, Award, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/aboutus.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ChevronLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          {/* Glass Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              About Yorùbá Academy
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl">
              Preserving and promoting the beauty and global relevance of the Yorùbá heritage
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Yorùbá Academy is a language and cultural platform founded by Ìfẹ́olúwa Elúfisan, dedicated to promoting the beauty and global relevance of the Yorùbá heritage.
              </p>
              <p className="text-lg text-gray-600">
                We provide a wide range of services, including Yorùbá language lessons, translation and interpretation, localization, transcription, and data annotation. Our work also extends to cultural education and curriculum development, cultural-themed event planning, and consulting and training for individuals, institutions, and organizations.
              </p>
            </div>
            <div className="relative">
              <Image
                src="/about.jpg"
                alt="Yoruba cultural heritage"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cultural Preservation</h3>
              <p className="text-gray-600">
                At the heart of our mission is the belief that language is a bridge to identity and heritage.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Community Building</h3>
              <p className="text-gray-600">
                Through engaging lessons, cultural programs, and professional services, we help learners and partners keep Yorùbá alive.
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Relevance</h3>
              <p className="text-gray-600">
                Making Yorùbá visible and valuable in today's world through modern technology and traditional wisdom.
              </p>
            </div>
          </div>
        </div>

        {/* Services Overview */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#e69d2a] rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Language Lessons</h3>
              <p className="text-gray-600">
                Comprehensive Yorùbá language instruction from beginner to advanced levels with native speakers.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#111827] rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Translation & Localization</h3>
              <p className="text-gray-600">
                Professional translation services and localization for businesses and organizations.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Cultural Education</h3>
              <p className="text-gray-600">
                Curriculum development and educational programs for schools and institutions.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#f59e0b] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Event Planning</h3>
              <p className="text-gray-600">
                Cultural-themed event planning and coordination for celebrations and gatherings.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#ef4444] rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Annotation</h3>
              <p className="text-gray-600">
                Professional data annotation and transcription services for AI and research projects.
              </p>
            </div>
            <div className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#8b5cf6] rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Consulting & Training</h3>
              <p className="text-gray-600">
                Expert consulting and training services for individuals, institutions, and organizations.
              </p>
            </div>
          </div>
        </div>

        {/* Founder Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">
                Meet Our Founder
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-1">
                    <div className="relative">
                      <Image
                        src="/ewaede.jpg"
                        alt="Ìfẹ́olúwa Elúfisan - Founder of Yorùbá Academy"
                        width={300}
                        height={300}
                        className="rounded-xl shadow-lg mx-auto"
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-2 text-left">
                    <h3 className="text-2xl font-semibold mb-4">Ìfẹ́olúwa Elúfisan</h3>
                    <p className="text-lg text-gray-600 mb-6">
                      Ìfẹ́olúwa Elúfisan is the visionary founder of Yorùbá Academy, dedicated to preserving and promoting Yorùbá language and culture in the modern world. With a deep passion for cultural heritage and education, Ìfẹ́olúwa has built a platform that serves as a bridge between traditional Yorùbá wisdom and contemporary global needs.
                    </p>
                    <p className="text-lg text-gray-600">
                      Through innovative approaches combining traditional teaching methods with modern technology, Ìfẹ́olúwa continues to make Yorùbá language and culture accessible, relevant, and valuable to new generations worldwide.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Join Our Mission
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're looking to learn Yorùbá, need professional services, or want to contribute to cultural preservation, we welcome you to join our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services/yoruba-language-lessons"
              className="bg-[#111827] hover:bg-[#3b35c7] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Start Learning Yorùbá
            </Link>
            <Link
              href="/contact"
              className="bg-white border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
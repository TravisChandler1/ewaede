import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileText, Video, Headphones, Search, Download, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";

export default function ELibraryPage() {
  const libraryResources = [
    {
      category: "Reading Materials",
      icon: BookOpen,
      items: [
        "Yoruba Grammar Guides",
        "Vocabulary Building Books",
        "Cultural Literature Collections",
        "Children's Story Books",
        "Poetry and Proverbs Collections"
      ]
    },
    {
      category: "Audio Resources",
      icon: Headphones,
      items: [
        "Pronunciation Guides",
        "Conversation Practice Audio",
        "Traditional Yoruba Music",
        "Storytelling Sessions",
        "Language Learning Podcasts"
      ]
    },
    {
      category: "Video Content",
      icon: Video,
      items: [
        "Grammar Explanation Videos",
        "Cultural Demonstration Videos",
        "Conversation Practice Sessions",
        "Traditional Dance Performances",
        "Historical Documentaries"
      ]
    },
    {
      category: "Interactive Materials",
      icon: FileText,
      items: [
        "Flashcard Sets",
        "Interactive Quizzes",
        "Writing Practice Worksheets",
        "Cultural Activity Guides",
        "Assessment Tools"
      ]
    }
  ];

  const featuredResources = [
    {
      title: "Complete Yoruba Grammar Guide",
      type: "PDF Document",
      description: "Comprehensive guide covering all aspects of Yoruba grammar with examples and exercises.",
      downloads: "2,450"
    },
    {
      title: "Essential Yoruba Vocabulary",
      type: "Audio Series",
      description: "500+ commonly used words with native speaker pronunciation and usage examples.",
      downloads: "1,890"
    },
    {
      title: "Yoruba Cultural Stories",
      type: "Video Collection",
      description: "Traditional folktales and stories told by master storytellers with English subtitles.",
      downloads: "3,210"
    },
    {
      title: "Conversation Practice Kit",
      type: "Interactive Workbook",
      description: "Real-life conversation scenarios with audio guides and practice exercises.",
      downloads: "1,675"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-16 relative" style={{ backgroundImage: "url('/learn.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <BookOpen size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            E-Library
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Access our comprehensive collection of Yoruba language resources, including books, audio materials, videos, and interactive learning tools.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#resources"
              className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Resources
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
            >
              Get Access
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Find Resources</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for books, audio, videos, or topics..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#111827] focus:border-transparent"
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Grammar</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Vocabulary</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Culture</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Audio</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">Video</span>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section id="resources" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Resource Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our organized collection of learning materials across different formats and topics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {libraryResources.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#111827] rounded-lg flex items-center justify-center mr-4">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">{category.category}</h3>
                </div>

                <ul className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-[#e69d2a] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full mt-6 bg-[#111827] hover:bg-[#3b35c7] text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  Browse {category.category}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Featured Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Most popular and highly recommended learning materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{resource.title}</h3>
                    <span className="inline-block px-3 py-1 bg-[#e69d2a] text-white text-sm rounded-full">
                      {resource.type}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Download className="w-4 h-4 mr-1" />
                    <span className="text-sm">{resource.downloads}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{resource.description}</p>

                <div className="flex items-center justify-between">
                  <button className="bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-2 rounded-lg transition-colors flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                  <span className="text-sm text-gray-500">Free for enrolled students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Access Information */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">How to Access the E-Library</h2>
          <p className="text-gray-600 mb-8">
            Get unlimited access to our comprehensive collection of Yoruba learning resources
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enroll in a Course</h3>
              <p className="text-gray-600">Sign up for any of our Yoruba language courses</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Access Your Dashboard</h3>
              <p className="text-gray-600">Log in to your student dashboard</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Browse & Download</h3>
              <p className="text-gray-600">Explore and download unlimited resources</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Need Help Accessing Resources?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our support team for assistance with accessing the E-Library or finding specific resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our support team</p>
              <a
                href="https://wa.me/2348120997786?text=Hello%2C%20I%E2%80%99d%20like%20to%20learn%20more%20about%20your%20Yoruba%20classes"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send a DM
              </a>
            </div>

            {/* Phone Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Phone Call</h3>
              <p className="text-gray-600 mb-4">Speak directly with our team</p>
              <a
                href="tel:+2348138534899"
                className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Email</h3>
              <p className="text-gray-600 mb-4">Send detailed inquiries</p>
              <a
                href="mailto:admin@ewaedeyoruba.com"
                className="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </a>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Visit Full Contact Page
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
import Link from "next/link";
import Image from "next/image";
import { Users, MessageCircle, BookOpen, Globe, Calendar, Star, MessageCircle as ChatIcon, Phone, Mail, ChevronRight } from "lucide-react";

export default function LearningGroupsPage() {
  const groupTypes = [
    {
      level: "Beginner Groups",
      description: "Perfect for those just starting their Yoruba journey",
      features: ["Basic vocabulary and greetings", "Simple conversation practice", "Cultural introductions", "Weekly group sessions"],
      members: 25,
      schedule: "Mondays & Wednesdays, 6:00 PM WAT"
    },
    {
      level: "Intermediate Groups",
      description: "For learners who can hold basic conversations",
      features: ["Complex sentence structures", "Cultural discussions", "Role-playing exercises", "Peer teaching opportunities"],
      members: 20,
      schedule: "Tuesdays & Thursdays, 7:00 PM WAT"
    },
    {
      level: "Advanced Groups",
      description: "For fluent speakers seeking to deepen their knowledge",
      features: ["Literature analysis", "Advanced grammar discussions", "Cultural debates", "Professional networking"],
      members: 15,
      schedule: "Fridays & Saturdays, 6:00 PM WAT"
    },
    {
      level: "Cultural Focus Groups",
      description: "Dedicated to exploring Yoruba culture and traditions",
      features: ["Traditional ceremonies", "Folktales and proverbs", "Music and dance", "Festival celebrations"],
      members: 30,
      schedule: "Sundays, 5:00 PM WAT"
    }
  ];

  const groupBenefits = [
    {
      icon: Users,
      title: "Peer Learning",
      description: "Learn from and teach fellow students at your level."
    },
    {
      icon: MessageCircle,
      title: "Regular Practice",
      description: "Consistent opportunities to practice speaking Yoruba."
    },
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Follow a curriculum designed for group learning dynamics."
    },
    {
      icon: Globe,
      title: "Cultural Exchange",
      description: "Share experiences and learn about different perspectives."
    }
  ];

  const activeGroups = [
    {
      name: "Beginners Circle - Lagos",
      level: "Novice",
      members: 18,
      nextSession: "Monday, 6:00 PM WAT",
      topic: "Basic Greetings & Introductions"
    },
    {
      name: "Intermediate Dialogues",
      level: "Intermediate",
      members: 14,
      nextSession: "Tuesday, 7:00 PM WAT",
      topic: "Complex Sentence Structures"
    },
    {
      name: "Advanced Literature Club",
      level: "Advanced",
      members: 12,
      nextSession: "Friday, 6:00 PM WAT",
      topic: "Modern Yoruba Poetry"
    },
    {
      name: "Cultural Heritage Group",
      level: "All Levels",
      members: 22,
      nextSession: "Sunday, 5:00 PM WAT",
      topic: "Yoruba Festivals & Traditions"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-16 relative" style={{ backgroundImage: "url('/learn.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <Users size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Learning Groups
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our vibrant learning communities where students support each other, practice regularly, and grow together in their Yoruba language journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#groups"
              className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Groups
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
            >
              Join a Group
            </Link>
          </div>
        </div>
      </section>

      {/* Group Types Section */}
      <section id="groups" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your Learning Group
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect group that matches your skill level and learning goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {groupTypes.map((group, index) => (
              <div key={index} className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#111827] rounded-lg flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{group.level}</h3>
                    <p className="text-sm text-gray-600">{group.members} active members</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{group.description}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">What you'll get:</h4>
                  <ul className="space-y-2">
                    {group.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-[#e69d2a] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{group.schedule}</span>
                </div>

                <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white px-4 py-3 rounded-lg transition-colors">
                  Join This Group
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Groups Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Active Learning Groups
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join these thriving communities of Yoruba learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {activeGroups.map((group, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{group.name}</h3>
                    <span className="inline-block px-3 py-1 bg-[#e69d2a] text-white text-sm rounded-full">
                      {group.level}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{group.members}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{group.nextSession}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{group.topic}</span>
                  </div>
                </div>

                <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white px-4 py-2 rounded-lg transition-colors">
                  Join Group
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Join Learning Groups?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the power of collaborative learning and community support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {groupBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">How to Join a Learning Group</h2>
          <p className="text-gray-600 mb-8">
            Getting started with our learning groups is simple and straightforward
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Assess Your Level</h3>
              <p className="text-gray-600">Take our placement test or choose based on your current skills</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Choose Your Group</h3>
              <p className="text-gray-600">Select a group that fits your schedule and learning goals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Learning</h3>
              <p className="text-gray-600">Join your first session and begin your group learning journey</p>
            </div>
          </div>

          <Link
            href="/services/yoruba-language-lessons"
            className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Get Started Today
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Questions About Learning Groups?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our community coordinator for more information about joining our learning groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our community coordinator</p>
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
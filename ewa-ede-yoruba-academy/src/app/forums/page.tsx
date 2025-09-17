import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Users, TrendingUp, Clock, Star, MessageSquare, Phone, Mail, ChevronRight } from "lucide-react";

export default function ForumsPage() {
  const forumCategories = [
    {
      title: "Language Learning",
      description: "Discuss grammar, vocabulary, pronunciation, and learning techniques",
      topics: 245,
      posts: 1234,
      lastActivity: "2 hours ago",
      icon: MessageCircle
    },
    {
      title: "Cultural Discussions",
      description: "Explore Yoruba traditions, festivals, music, and cultural practices",
      topics: 189,
      posts: 956,
      lastActivity: "1 hour ago",
      icon: Users
    },
    {
      title: "Study Groups",
      description: "Find study partners and organize group learning sessions",
      topics: 67,
      posts: 345,
      lastActivity: "30 minutes ago",
      icon: TrendingUp
    },
    {
      title: "Teacher Q&A",
      description: "Ask questions and get answers from our expert instructors",
      topics: 134,
      posts: 678,
      lastActivity: "15 minutes ago",
      icon: Star
    }
  ];

  const recentTopics = [
    {
      title: "How to pronounce 'ẹ̀kọ́' correctly?",
      author: "Adebayo Johnson",
      replies: 12,
      views: 89,
      lastReply: "5 minutes ago",
      category: "Language Learning"
    },
    {
      title: "Traditional Yoruba wedding ceremonies",
      author: "Funmi Adeolu",
      replies: 8,
      views: 156,
      lastReply: "1 hour ago",
      category: "Cultural Discussions"
    },
    {
      title: "Looking for intermediate study partners",
      author: "Kemi Ogunleye",
      replies: 15,
      views: 234,
      lastReply: "2 hours ago",
      category: "Study Groups"
    },
    {
      title: "Question about verb conjugation in Yoruba",
      author: "Tunde Bakare",
      replies: 6,
      views: 67,
      lastReply: "3 hours ago",
      category: "Teacher Q&A"
    }
  ];

  const forumStats = [
    {
      label: "Total Members",
      value: "2,450",
      icon: Users
    },
    {
      label: "Active Topics",
      value: "635",
      icon: MessageSquare
    },
    {
      label: "Daily Posts",
      value: "89",
      icon: TrendingUp
    },
    {
      label: "Online Now",
      value: "127",
      icon: Clock
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-16 relative" style={{ backgroundImage: "url('/learn.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <MessageCircle size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Community Forums
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our vibrant community of Yoruba learners and native speakers. Share experiences, ask questions, and grow together in your language journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#categories"
              className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Forums
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {forumStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section id="categories" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Forum Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore different discussion areas and connect with fellow learners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {forumCategories.map((category, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#111827] rounded-lg flex items-center justify-center mr-4">
                    <category.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span>{category.topics} topics</span>
                      <span>{category.posts} posts</span>
                      <span>Last activity: {category.lastActivity}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{category.description}</p>

                <button className="bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors">
                  Enter Forum
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Topics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Recent Discussions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join the latest conversations and share your thoughts
            </p>
          </div>

          <div className="space-y-4">
            {recentTopics.map((topic, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-[#111827] cursor-pointer">
                      {topic.title}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="bg-[#e69d2a] text-white px-2 py-1 rounded-full text-xs mr-3">
                        {topic.category}
                      </span>
                      <span>by {topic.author}</span>
                      <span className="mx-2">•</span>
                      <span>Last reply: {topic.lastReply}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{topic.replies}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{topic.views}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="bg-[#111827] hover:bg-[#3b35c7] text-white px-8 py-3 rounded-lg transition-colors">
              View All Topics
            </button>
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Community Guidelines
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us maintain a respectful and supportive learning environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Be Respectful</h3>
                  <p className="text-gray-600">Treat all community members with respect and kindness.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Stay On Topic</h3>
                  <p className="text-gray-600">Keep discussions relevant to Yoruba language and culture.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Share Knowledge</h3>
                  <p className="text-gray-600">Help others learn and share your expertise generously.</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">No Spam</h3>
                  <p className="text-gray-600">Avoid posting irrelevant content or promotional material.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Be Constructive</h3>
                  <p className="text-gray-600">Provide helpful feedback and avoid negative criticism.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-red-600 font-bold">✗</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Respect Privacy</h3>
                  <p className="text-gray-600">Do not share personal information of others without permission.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join the Conversation</h2>
          <p className="text-gray-600 mb-8">
            Ready to become part of our thriving community? Here's how to get started
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up for a free account to access the forums</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Introduce Yourself</h3>
              <p className="text-gray-600">Post in the welcome section and meet other learners</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Participating</h3>
              <p className="text-gray-600">Ask questions, share knowledge, and join discussions</p>
            </div>
          </div>

          <Link
            href="/auth/register"
            className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Join Community
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Need Help with the Forums?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our community moderators for assistance with forum features or account issues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our community team</p>
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
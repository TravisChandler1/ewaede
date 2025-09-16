"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, Search, BookOpen, Users, Video, CreditCard, Shield, Mail, MessageCircle } from "lucide-react";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I get started with learning Yoruba?",
      answer: "Getting started is easy! Simply create an account, choose your learning level (Novice, Beginner, Intermediate, Advanced, or Individual), and begin your journey. Our personalized learning plans will guide you through the process.",
      category: "Getting Started"
    },
    {
      question: "What are the different learning levels?",
      answer: "We offer 5 learning levels: Novice (15 weeks, $220 full/$15 per class), Beginner (26 weeks, $390 full/$15 per class), Intermediate (20 weeks, $300 full/$15 per class), Advanced (20 weeks, $300 full/$15 per class), and Individual (24 weeks, $480 full/$20 per class). Each level is designed to build upon the previous one.",
      category: "Courses"
    },
    {
      question: "Can I switch between group and individual learning?",
      answer: "Yes! You can choose between group learning (fostering community and collaborative learning) or individual sessions (providing personalized attention). You can switch between these options based on your preferences and schedule.",
      category: "Courses"
    },
    {
      question: "What materials are included in the courses?",
      answer: "Each course includes comprehensive learning materials: interactive lessons, audio files, video content, grammar exercises, cultural stories, and access to our extensive E-Library with Yoruba literature and resources.",
      category: "Courses"
    },
    {
      question: "How do live sessions work?",
      answer: "Live sessions are conducted once weekly and last 1-2 hours. You'll meet with experienced native Yoruba speakers who provide real-time feedback, answer questions, and guide your learning journey.",
      category: "Sessions"
    },
    {
      question: "What if I miss a live session?",
      answer: "Don't worry! All sessions are recorded and available in your dashboard. You can watch them at your convenience and still receive the same learning benefits.",
      category: "Sessions"
    },
    {
      question: "Are teachers native speakers?",
      answer: "Yes, all our teachers are native Yoruba speakers with extensive teaching experience. They combine traditional Yoruba teaching methods with modern technology for effective learning.",
      category: "Teachers"
    },
    {
      question: "Do I get a certificate upon completion?",
      answer: "Absolutely! Upon completion of any level, you'll receive a certificate of achievement from Ẹwà Èdè Yorùbá Academy. Our certificates are recognized and demonstrate your Yoruba proficiency.",
      category: "Certificates"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, debit cards, and PayPal. All payments are processed securely through our encrypted payment system.",
      category: "Payment"
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 30-day money-back guarantee for all courses. If you're not satisfied with your learning experience, contact our support team for a full refund.",
      category: "Payment"
    },
    {
      question: "How do I access the E-Library?",
      answer: "The E-Library is available to all enrolled students. Access it through your dashboard where you'll find videos, PDFs, audio materials, and cultural resources.",
      category: "Resources"
    },
    {
      question: "Is there a mobile app?",
      answer: "Currently, our platform is web-based and fully responsive. You can access all features on your mobile device through your web browser. A mobile app is in development.",
      category: "Technical"
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the sign-in page, enter your email address, and follow the instructions sent to your email to reset your password.",
      category: "Account"
    },
    {
      question: "Can I pause my subscription?",
      answer: "Yes, you can pause your subscription at any time through your account settings. Your progress and materials will be saved for when you resume.",
      category: "Account"
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our support team through the Contact Us page, email us at support@yorubaacademy.com, or use the chat widget on our website.",
      category: "Support"
    }
  ];

  const quickLinks = [
    { title: "Getting Started Guide", icon: BookOpen, href: "#getting-started" },
    { title: "Course Enrollment", icon: Users, href: "#enrollment" },
    { title: "Live Sessions", icon: Video, href: "#sessions" },
    { title: "Payment & Billing", icon: CreditCard, href: "#payment" },
    { title: "Privacy & Security", icon: Shield, href: "/privacy" },
    { title: "Contact Support", icon: Mail, href: "/contact" }
  ];

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b-2 border-[#4f46e5] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.png"
                  alt="Ẹwà Èdè Yorùbá Academy"
                  width={160}
                  height={160}
                  className="h-10 w-auto"
                  quality={100}
                />
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium">Home</Link>
              <Link href="#faq" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium">FAQ</Link>
              <Link href="/contact" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <MessageCircle size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Help Center
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Find answers to common questions and get the support you need to succeed in your Yoruba learning journey.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group"
              >
                <div className="flex items-center mb-4">
                  <link.icon size={32} className="text-[#4f46e5] group-hover:text-[#e69d2a] transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#4f46e5] transition-colors">
                  {link.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <span className="text-sm text-[#4f46e5] font-medium uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mt-1">
                      {faq.question}
                    </h3>
                  </div>
                  {expandedFAQ === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </button>

                {expandedFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No results found for "{searchQuery}". Try different keywords or browse our categories above.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Link
              href="/contact"
              className="bg-[#4f46e5] hover:bg-[#3b35c7] text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <Mail size={20} className="mr-2" />
              Contact Support
            </Link>

            <button
              onClick={() => window.location.href = '/'}
              className="border-2 border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
            >
              <MessageCircle size={20} className="mr-2" />
              Chat with Bísọ̀lá
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Ẹwà Èdè Yorùbá Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
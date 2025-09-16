"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, MessageCircle, Users, BookOpen } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      setSubmitMessage({
        type: 'success',
        text: 'Thank you for your message! We\'ll get back to you within 24 hours.'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: 'Failed to send message. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      details: "support@yorubaacademy.com",
      description: "Get help with technical issues, account questions, and general inquiries",
      response: "Within 24 hours"
    },
    {
      icon: Phone,
      title: "Phone Support",
      details: "+1 (555) 123-YORUBA",
      description: "Speak directly with our support team for urgent matters",
      response: "Mon-Fri, 9 AM - 6 PM EST"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: "Available on website",
      description: "Chat with Bísọ̀lá, our AI assistant, or connect with human support",
      response: "24/7 availability"
    },
    {
      icon: MapPin,
      title: "Office Address",
      details: "123 Yoruba Cultural Center, Lagos, Nigeria",
      description: "Visit our physical location for in-person support",
      response: "By appointment only"
    }
  ];

  const supportCategories = [
    {
      icon: Users,
      title: "Student Support",
      description: "Course enrollment, progress tracking, certificates, and learning resources"
    },
    {
      icon: BookOpen,
      title: "Academic Support",
      description: "Curriculum questions, learning materials, and educational content"
    },
    {
      icon: MessageCircle,
      title: "Technical Support",
      description: "Website issues, login problems, and platform functionality"
    },
    {
      icon: Mail,
      title: "General Inquiries",
      description: "Partnerships, media inquiries, and general questions"
    }
  ];

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
              <Link href="/help" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium">Help</Link>
              <Link href="#contact" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Mail size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            We're here to help! Get in touch with our support team for any questions about your Yoruba learning journey.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  <info.icon size={32} className="text-[#4f46e5]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                <p className="text-[#4f46e5] font-medium mb-2">{info.details}</p>
                <p className="text-gray-600 text-sm mb-3">{info.description}</p>
                <p className="text-xs text-gray-500">{info.response}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How Can We Help?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((category, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex justify-center mb-4">
                  <category.icon size={32} className="text-[#e69d2a]" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-center">{category.title}</h3>
                <p className="text-gray-600 text-sm text-center">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="technical">Technical Support</option>
                    <option value="academic">Academic Support</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="partnership">Partnerships</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent resize-vertical"
                  placeholder="Please provide details about your inquiry..."
                />
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-lg ${
                  submitMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {submitMessage.text}
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-[#4f46e5] hover:bg-[#3b35c7] text-white hover:transform hover:-translate-y-1 hover:shadow-lg'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Quick Answers</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Response Time</h3>
              <p className="text-gray-600">
                We typically respond to all inquiries within 24 hours during business days.
                Urgent technical issues are prioritized and addressed within 4-6 hours.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Business Hours</h3>
              <p className="text-gray-600">
                Our support team is available Monday through Friday, 9 AM to 6 PM EST.
                Emergency technical support is available 24/7 through our help center.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Multiple Languages</h3>
              <p className="text-gray-600">
                We provide support in English and Yoruba. Our team includes native speakers
                who can assist with language-specific questions and cultural context.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Follow Up</h3>
              <p className="text-gray-600">
                If you don't hear back within 48 hours, please check your spam folder
                or contact us again. We take all inquiries seriously and ensure proper follow-up.
              </p>
            </div>
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
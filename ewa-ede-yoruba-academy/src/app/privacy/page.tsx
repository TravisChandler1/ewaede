"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Eye, Lock, Database, Users, Calendar } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone number)",
        "Account information and learning progress data",
        "Payment information (processed securely by third-party providers)",
        "Communication records and support interactions",
        "Device and browser information for platform optimization",
        "Usage analytics to improve our services"
      ]
    },
    {
      icon: Database,
      title: "How We Use Your Information",
      content: [
        "Provide and personalize your learning experience",
        "Process payments and manage subscriptions",
        "Send important updates about your courses and account",
        "Improve our platform and develop new features",
        "Provide customer support and respond to inquiries",
        "Ensure platform security and prevent fraud",
        "Comply with legal obligations and enforce our terms"
      ]
    },
    {
      icon: Users,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information to third parties",
        "Limited sharing with service providers who help operate our platform",
        "Legal compliance when required by law or to protect rights",
        "Aggregate, anonymized data for research and improvement purposes",
        "Your learning progress may be shared with instructors for personalized support"
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "Industry-standard encryption for all data transmission",
        "Secure servers with regular security audits",
        "Access controls and employee training on data protection",
        "Regular backups and disaster recovery procedures",
        "Payment information never stored on our servers",
        "Continuous monitoring for security threats"
      ]
    }
  ];

  const lastUpdated = "September 15, 2024";

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
              <Link href="/contact" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4f46e5] to-[#7c3aed] text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <Shield size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <div className="flex items-center justify-center text-white/80">
            <Calendar size={16} className="mr-2" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold mb-4">Privacy Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Ẹwà Èdè Yorùbá Academy, we are committed to protecting your privacy and ensuring the security of your personal information.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using our platform, you agree to the collection and use of information in accordance with this policy.
              We will not use or share your information with anyone except as described in this Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Key Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Privacy Information</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <section.icon size={32} className="text-[#4f46e5] mr-3" />
                  <h3 className="text-xl font-semibold">{section.title}</h3>
                </div>

                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-[#4f46e5] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Policy */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">Detailed Privacy Policy</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">1. Information Collection</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, enroll in courses,
                make payments, or contact our support team. This includes your name, email address, payment information,
                and any messages you send us.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We also automatically collect certain information about your device and usage of our platform,
                including IP addresses, browser type, operating system, and usage patterns to improve our services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">2. Cookies and Tracking</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience on our platform. These help us
                remember your preferences, analyze usage patterns, and provide personalized content.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You can control cookie settings through your browser, though disabling cookies may limit some
                platform functionality.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">3. Third-Party Services</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We partner with trusted third-party service providers for payment processing, email delivery,
                analytics, and customer support. These providers are contractually obligated to protect your
                information and only use it for the purposes specified by us.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not sell your personal information to third parties for marketing purposes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">4. Data Retention</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide our services, comply with
                legal obligations, resolve disputes, and enforce our agreements. Account data is typically retained
                while your account is active and for a reasonable period thereafter.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You can request deletion of your account and associated data at any time.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">5. International Data Transfers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure
                that such transfers comply with applicable data protection laws and implement appropriate safeguards.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our servers are located in secure data centers with industry-standard security measures.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">6. Your Rights</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-3">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Access and review your personal information</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict certain processing activities</li>
                  <li>Data portability (receive your data in a structured format)</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">7. Children's Privacy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13. If we become aware that we have collected personal
                information from a child under 13, we will take steps to delete such information.
              </p>
              <p className="text-gray-700 leading-relaxed">
                For users aged 13-17, we recommend parental guidance and involvement in their learning journey.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">8. Changes to This Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
                We will notify you of any material changes by posting the updated policy on our website and updating the
                "Last updated" date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">9. Contact Us</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> privacy@yorubaacademy.com</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Yoruba Cultural Center, Lagos, Nigeria</p>
                <p className="text-gray-700"><strong>Phone:</strong> +1 (555) 123-YORUBA</p>
              </div>
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
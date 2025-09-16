"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, Users, CreditCard, Shield, AlertTriangle, Calendar } from "lucide-react";

export default function TermsOfServicePage() {
  const sections = [
    {
      icon: Users,
      title: "User Accounts",
      content: [
        "You must be at least 13 years old to create an account",
        "Provide accurate and complete information during registration",
        "Maintain the confidentiality of your account credentials",
        "You are responsible for all activities under your account",
        "Notify us immediately of any unauthorized account access",
        "One account per individual (multiple accounts not permitted)"
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: [
        "All fees are displayed in USD and payable in advance",
        "Subscription fees are billed according to your selected plan",
        "Refunds available within 30 days of purchase with valid reason",
        "Failed payments may result in account suspension",
        "Price changes will be communicated 30 days in advance",
        "Taxes may apply based on your location"
      ]
    },
    {
      icon: Shield,
      title: "Content Usage",
      content: [
        "Course materials are for personal learning only",
        "No unauthorized sharing, copying, or redistribution",
        "Copyright and intellectual property rights are reserved",
        "Content may not be used for commercial purposes",
        "Respect fellow learners and instructors in discussions",
        "Academic integrity is required for assignments and quizzes"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Prohibited Activities",
      content: [
        "Harassment, abuse, or disrespectful behavior toward others",
        "Sharing account credentials or course access",
        "Attempting to hack, disrupt, or damage the platform",
        "Posting inappropriate, offensive, or illegal content",
        "Impersonating other users or academy staff",
        "Using the platform for any illegal activities"
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
            <FileText size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-4">
            Please read these terms carefully before using our platform. By using Ẹwà Èdè Yorùbá Academy, you agree to be bound by these terms.
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
            <h2 className="text-2xl font-bold mb-4">Agreement Overview</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              These Terms of Service ("Terms") govern your use of Ẹwà Èdè Yorùbá Academy's website, mobile application,
              and related services (collectively, the "Platform"). By accessing or using our Platform, you agree to be
              bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree to these Terms, please do not use our Platform. We reserve the right to modify these
              Terms at any time, with changes taking effect immediately upon posting.
            </p>
          </div>
        </div>
      </section>

      {/* Key Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Terms & Conditions</h2>

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

      {/* Detailed Terms */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-8">Complete Terms of Service</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing and using Ẹwà Èdè Yorùbá Academy, you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 leading-relaxed">
                These Terms apply to all visitors, users, and others who access or use the Platform.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">2. Description of Service</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ẹwà Èdè Yorùbá Academy provides online Yoruba language learning services, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Interactive language courses and lessons</li>
                <li>Live virtual classroom sessions with instructors</li>
                <li>Digital learning materials and resources</li>
                <li>Progress tracking and assessment tools</li>
                <li>Community forums and discussion groups</li>
                <li>Certificate programs upon course completion</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">3. User Eligibility</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To use our Platform, you must be at least 13 years old. By using our services, you represent and warrant
                that you meet this age requirement and have the legal capacity to enter into these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Users under 18 should review these Terms with a parent or guardian and obtain their consent before using our services.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">4. Account Registration and Security</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must provide accurate, current, and complete information during the registration process and keep
                your account information updated. You are responsible for maintaining the confidentiality of your account
                credentials and for all activities that occur under your account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree to immediately notify us of any unauthorized use of your account or any other breach of security.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">5. Payment and Billing</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-3">Payment Terms:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>All fees are non-refundable except as expressly stated in our refund policy</li>
                  <li>Subscription fees are billed in advance on a recurring basis</li>
                  <li>You authorize us to charge your payment method for all fees incurred</li>
                  <li>Failed payments may result in account suspension or termination</li>
                  <li>Price changes will be communicated with 30 days advance notice</li>
                  <li>You are responsible for all applicable taxes</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">6. Refund Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a 30-day money-back guarantee for all course purchases. If you are not satisfied with your
                learning experience within the first 30 days, you may request a full refund. Refund requests must be
                submitted through our support team with a valid reason.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Refunds for subscription services will be prorated based on unused time. Some restrictions may apply
                to certain promotional or discounted purchases.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">7. Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content, features, and functionality on our Platform, including but not limited to text, graphics,
                logos, icons, images, audio clips, digital downloads, and software, are owned by Ẹwà Èdè Yorùbá Academy
                or its licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You may not reproduce, distribute, modify, or create derivative works of our content without explicit permission.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">8. User-Generated Content</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                By posting content on our Platform (including forums, comments, or assignments), you grant us a
                non-exclusive, royalty-free, perpetual, and worldwide license to use, display, and distribute your content.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You are solely responsible for the content you post and must ensure it does not violate any laws or
                infringe on third-party rights.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">9. Termination</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to terminate or suspend your account and access to our services immediately,
                without prior notice or liability, for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Upon termination, your right to use our Platform will cease immediately. All provisions of these Terms
                that by their nature should survive termination shall survive.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">10. Disclaimers and Limitations</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700 mb-3"><strong>Service Disclaimers:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                  <li>Our services are provided "as is" without warranties of any kind</li>
                  <li>We do not guarantee specific learning outcomes or language proficiency levels</li>
                  <li>Platform availability and technical performance are not guaranteed</li>
                  <li>We are not liable for indirect, incidental, or consequential damages</li>
                  <li>Our liability is limited to the amount paid for our services in the 12 months preceding the claim</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">11. Governing Law</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard
                to its conflict of law provisions. Any disputes arising from these Terms shall be resolved through
                binding arbitration in Lagos, Nigeria.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You agree to submit to the personal jurisdiction of the courts located in Lagos, Nigeria, for any legal action.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">12. Changes to Terms</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of material changes via
                email or platform notification. Your continued use of our services after such modifications constitutes
                acceptance of the updated Terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                It is your responsibility to review these Terms periodically for changes.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">13. Contact Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700"><strong>Email:</strong> legal@yorubaacademy.com</p>
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
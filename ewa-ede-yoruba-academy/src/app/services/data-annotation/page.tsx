import Link from "next/link";
import Image from "next/image";
import { Database, Brain, Users, CheckCircle, ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";

export default function DataAnnotationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/data.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Glass Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Data Annotation Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Professional data annotation and transcription services for AI training, research, and machine learning projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#services"
                className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Our Services
              </Link>
              <Link
                href="#contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Our Data Annotation Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              High-quality data annotation solutions for various industries and applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Database className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Text Annotation</h3>
              <p className="text-gray-600">Named entity recognition, sentiment analysis, and text classification for NLP models.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Brain className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Image Annotation</h3>
              <p className="text-gray-600">Object detection, image classification, and segmentation for computer vision projects.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Audio Transcription</h3>
              <p className="text-gray-600">Accurate transcription of audio files with timestamps and speaker identification.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
              <p className="text-gray-600">Multi-layer quality control with expert reviewers ensuring 99%+ accuracy.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Database className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Custom Datasets</h3>
              <p className="text-gray-600">Tailored dataset creation for specific industry needs and use cases.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Brain className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">AI Model Training</h3>
              <p className="text-gray-600">End-to-end solutions from data collection to model training and validation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Why Choose Our Data Annotation Services?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Expert Annotators</h3>
                    <p className="text-gray-600">Trained professionals with domain expertise in various industries.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Quality Guarantee</h3>
                    <p className="text-gray-600">Rigorous quality control processes with 99%+ accuracy rates.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Scalable Solutions</h3>
                    <p className="text-gray-600">Flexible capacity to handle projects of any size and complexity.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Fast Turnaround</h3>
                    <p className="text-gray-600">Efficient workflows without compromising on quality or accuracy.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Confidentiality</h3>
                    <p className="text-gray-600">Strict data protection and confidentiality agreements for all projects.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/data-annotation.png"
                alt="Data Annotation Services"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact us today for a free consultation and quote for your data annotation project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our data experts</p>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message on WhatsApp
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
                href="tel:+1234567890"
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
              <p className="text-gray-600 mb-4">Send detailed project inquiries</p>
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
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
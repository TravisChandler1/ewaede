import Link from "next/link";
import Image from "next/image";
import { Globe, Languages, Users, CheckCircle, ArrowRight, MessageCircle, Phone, Mail } from "lucide-react";

export default function LocalizationPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/translate.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Glass Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Localization Services
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Professional translation and localization services to help your business reach Yoruba-speaking audiences effectively.
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
                Get Quote
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
              Our Localization Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive localization solutions tailored for the Yoruba market
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Languages className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Document Translation</h3>
              <p className="text-gray-600">Professional translation of legal documents, contracts, and official paperwork with cultural adaptation.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Website Localization</h3>
              <p className="text-gray-600">Complete website translation and cultural adaptation for Yoruba-speaking audiences.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Marketing Content</h3>
              <p className="text-gray-600">Translation and localization of marketing materials, advertisements, and promotional content.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <CheckCircle className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
              <p className="text-gray-600">Rigorous quality control and proofreading by native speakers and localization experts.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <MessageCircle className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Interpretation Services</h3>
              <p className="text-gray-600">Professional interpretation for meetings, conferences, and business negotiations.</p>
            </div>

            <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Globe className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Cultural Consulting</h3>
              <p className="text-gray-600">Expert guidance on cultural nuances and business practices in Yoruba-speaking markets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 p-8 rounded-xl">
              <div className="backdrop-blur-md bg-white/70 border border-white/30 rounded-xl p-6 shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                  Why Choose Our Localization Services?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Native Expertise</h3>
                      <p className="text-gray-600">Our team consists of native Yoruba speakers with deep cultural understanding.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Industry Experience</h3>
                      <p className="text-gray-600">Years of experience working with major brands and international companies.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Quality Guarantee</h3>
                      <p className="text-gray-600">Rigorous quality control processes ensure accuracy and cultural appropriateness.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Fast Turnaround</h3>
                      <p className="text-gray-600">Efficient processes without compromising on quality or accuracy.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-xl relative">
              <Image
                src="/heroside.png"
                alt="Localization Services"
                width={500}
                height={400}
                className="rounded-lg shadow-lg w-full"
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
              Ready to Localize Your Content?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact us today for a free consultation and quote for your localization project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our localization experts</p>
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
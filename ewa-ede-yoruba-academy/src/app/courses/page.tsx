import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Video, Award, Star, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";

export default function CoursesPage() {
  const courseLevels = [
    {
      name: "Novice",
      duration: "15 weeks | once weekly",
      fullPrice: "$220",
      flexiblePrice: "$15",
      period: "(full course package) / (flexible per-class option)",
      description: "Learning the basics of the Yorùbá Language, how to do simple greetings, introduction of yourself, talk about things in Yorùbá.",
      features: ["Basic alphabet and pronunciation", "Simple greetings and expressions", "Cultural introduction", "Community access"]
    },
    {
      name: "Beginner",
      duration: "26 weeks | once weekly",
      fullPrice: "$390",
      flexiblePrice: "$15",
      period: "(full course package) / (flexible per-class option)",
      description: "You know a bit of Yorùbá Language, but want to get better, building vocabulary and simple sentences.",
      features: ["Grammar fundamentals", "Vocabulary building", "Basic conversations", "Group learning sessions", "E-library access"]
    },
    {
      name: "Intermediate",
      duration: "20 weeks | once weekly",
      fullPrice: "$300",
      flexiblePrice: "$15",
      period: "(full course package) / (flexible per-class option)",
      description: "You need to boost your speaking, you feel stuck, but you know some words, can form a bit of simple sentences and statements.",
      features: ["Intermediate grammar structures", "Vocabulary expansion", "Conversation practice", "Pronunciation improvement", "Cultural immersion"]
    },
    {
      name: "Advanced",
      duration: "20 weeks | once weekly",
      fullPrice: "$300",
      flexiblePrice: "$15",
      period: "(full course package) / (flexible per-class option)",
      description: "You need to boost your speaking, you feel stuck, but you know some words, can form a bit of simple sentences and statements.",
      features: ["Complex grammar structures", "Advanced vocabulary", "Cultural context lessons", "Live teacher sessions", "Book club access"],
      popular: true
    },
    {
      name: "Individual",
      duration: "24 weeks | once weekly",
      fullPrice: "$480",
      flexiblePrice: "$20",
      period: "(full course package) / (flexible per-class option)",
      description: "One on one lesson with the teacher, personalized instruction.",
      features: ["Personalized one-on-one sessions", "Customized learning pace", "Dedicated teacher attention", "Flexible scheduling", "All features included"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/aboutus.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Glass Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <BookOpen size={64} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white">
              Our Courses
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Discover our comprehensive Yoruba language courses designed to take you from beginner to fluent speaker through structured, engaging learning experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#levels"
                className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Course Levels
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Course Levels Section */}
      <section id="levels" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the level that matches your current knowledge and goals. All levels include both individual and group learning options.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Left Column: Novice, Beginner, Intermediate */}
            <div className="space-y-6">
              {courseLevels.filter(level => ["Novice", "Beginner", "Intermediate"].includes(level.name)).map((level, index) => (
                <div key={index} className={`relative bg-white border rounded-xl p-6 max-w-md mx-auto min-h-[400px] flex flex-col group hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl ${level.popular ? 'border-[#e69d2a] ring-1 ring-[#e69d2a]/20' : 'border-gray-200'}`}>
                  {level.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#e69d2a] text-black px-3 py-1 text-sm rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {level.name === "Novice" && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <span className="bg-[#e69d2a] text-white text-xs px-3 py-1 rounded-full shadow-md">
                        Perfect for starters
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-3">
                      {level.name}
                    </h3>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 leading-relaxed">{level.duration}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1 mb-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-2xl font-bold">{level.fullPrice}</span>
                        <span className="text-gray-600 ml-1 text-xs">full course</span>
                      </div>
                      <div className="flex items-baseline justify-center">
                        <span className="text-xl font-semibold text-[#a78bfa]">{level.flexiblePrice}</span>
                        <span className="text-gray-600 ml-1 text-xs">per class</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 px-2 leading-relaxed bg-[#e69d2a]/10 rounded-md py-2">{level.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-grow">
                    {level.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <Star size={14} className="text-[#10b981] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-xs leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Link href="/services/yoruba-language-lessons" className="block w-full">
                      <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Advanced, Individual */}
            <div className="space-y-6">
              {courseLevels.filter(level => ["Advanced", "Individual"].includes(level.name)).map((level, index) => (
                <div key={index} className={`relative bg-white border rounded-xl p-6 max-w-md mx-auto min-h-[400px] flex flex-col group hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl ${level.popular ? 'border-[#e69d2a] ring-1 ring-[#e69d2a]/20' : 'border-gray-200'}`}>
                  {level.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#e69d2a] text-black px-3 py-1 text-sm rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-3">
                      {level.name}
                    </h3>
                    <div className="mb-3">
                      <p className="text-sm text-gray-600 leading-relaxed">{level.duration}</p>
                    </div>
                    <div className="flex flex-col items-center space-y-1 mb-4">
                      <div className="flex items-baseline justify-center">
                        <span className="text-2xl font-bold">{level.fullPrice}</span>
                        <span className="text-gray-600 ml-1 text-xs">full course</span>
                      </div>
                      <div className="flex items-baseline justify-center">
                        <span className="text-xl font-semibold text-[#a78bfa]">{level.flexiblePrice}</span>
                        <span className="text-gray-600 ml-1 text-xs">per class</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 px-2 leading-relaxed">{level.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-grow">
                    {level.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start">
                        <Star size={14} className="text-[#10b981] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-xs leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Link href="/services/yoruba-language-lessons" className="block w-full">
                      <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Learn More
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Ready to Start Your Yoruba Journey?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact us today to enroll in any of our courses and begin your journey to mastering the beautiful Yoruba language.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our enrollment team</p>
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

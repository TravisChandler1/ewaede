import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Video, Award, Star, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";

export default function YorubaLanguageLessonsPage() {
  const pricingLevels = [
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
            backgroundImage: "url('/learn.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Glass Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Yoruba Language Lessons
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-white/90">
              Master the beautiful Yoruba language through our comprehensive, culturally immersive learning programs designed for all levels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#pricing"
                className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Pricing
              </Link>
              <Link
                href="#contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                Why Learn Yoruba with Us?
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="text-lg">
                  At Ẹwà Èdè Yorùbá Academy, we believe that learning Yoruba goes beyond memorizing vocabulary and grammar rules. It's about connecting with a rich cultural heritage, understanding traditional values, and participating in a vibrant linguistic community.
                </p>
                <p className="text-lg">
                  Our expert native speakers and experienced educators create an immersive learning environment that combines traditional teaching methods with modern technology, ensuring you not only learn the language but also appreciate its cultural context.
                </p>
                <p className="text-lg">
                  Whether you're learning for personal enrichment, academic purposes, business communication, or cultural preservation, our comprehensive curriculum adapts to your goals and learning pace.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/culture.png"
                alt="Yoruba Cultural Learning"
                width={500}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              What You'll Learn
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive curriculum covers all aspects of Yoruba language proficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <BookOpen className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Reading & Writing</h3>
              <p className="text-gray-600">Master the Yoruba alphabet, pronunciation, and writing system with our structured approach.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <MessageCircle className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Speaking & Listening</h3>
              <p className="text-gray-600">Develop conversational skills through interactive sessions and cultural immersion activities.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Users className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Cultural Context</h3>
              <p className="text-gray-600">Learn proverbs, folktales, and cultural nuances that enrich your understanding of Yoruba heritage.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Video className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Live Sessions</h3>
              <p className="text-gray-600">Participate in real-time interactive classes with experienced native speakers.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Award className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Certification</h3>
              <p className="text-gray-600">Earn recognized certificates upon completion of your learning journey.</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <Star className="w-12 h-12 text-[#111827] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community Access</h3>
              <p className="text-gray-600">Join our vibrant community of Yoruba learners and practice with fellow students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
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
              {pricingLevels.filter(level => ["Novice", "Beginner", "Intermediate"].includes(level.name)).map((level, index) => (
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
                    <Link href="#contact" className="block w-full">
                      <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Enroll Now
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Advanced, Individual */}
            <div className="space-y-6">
              {pricingLevels.filter(level => ["Advanced", "Individual"].includes(level.name)).map((level, index) => (
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
                    <Link href="#contact" className="block w-full">
                      <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Enroll Now
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
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Ready to Start Your Yoruba Journey?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              If you want to enroll for any of our services, reach out to Ìfẹ́olúwa Elúfisan, our dedicated enrollment coordinator who will guide you through the process and answer all your questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with Ìfẹ́olúwa directly for instant responses</p>
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
              <p className="text-gray-600 mb-4">Speak directly with our enrollment coordinator</p>
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
              <p className="text-gray-600 mb-4">Send detailed inquiries and get comprehensive responses</p>
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
            <p className="text-gray-600 mb-4">
              Contact Ìfẹ́olúwa Elúfisan today to begin your Yoruba language learning journey!
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Visit Contact Page
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
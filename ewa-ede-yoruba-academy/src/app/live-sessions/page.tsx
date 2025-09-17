import Link from "next/link";
import Image from "next/image";
import { Video, Users, Calendar, Clock, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";

export default function LiveSessionsPage() {
  const sessionTypes = [
    {
      title: "Group Learning Sessions",
      description: "Interactive group sessions with fellow learners at your level",
      features: ["8-12 students per session", "Interactive discussions", "Peer learning opportunities", "Structured curriculum"],
      duration: "1.5 hours",
      frequency: "Weekly"
    },
    {
      title: "Individual Private Sessions",
      description: "One-on-one personalized instruction tailored to your needs",
      features: ["Personalized curriculum", "Flexible scheduling", "Focused attention", "Custom pace"],
      duration: "1 hour",
      frequency: "Flexible"
    },
    {
      title: "Conversation Practice",
      description: "Focused sessions on speaking and listening skills",
      features: ["Real conversation scenarios", "Pronunciation practice", "Cultural context", "Immediate feedback"],
      duration: "45 minutes",
      frequency: "Bi-weekly"
    },
    {
      title: "Cultural Immersion Sessions",
      description: "Learn about Yoruba culture while practicing the language",
      features: ["Traditional stories", "Cultural traditions", "Music and arts", "Historical context"],
      duration: "1 hour",
      frequency: "Weekly"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-16 relative" style={{ backgroundImage: "url('/learn.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <Video size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Live Sessions
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our interactive live sessions with experienced native Yoruba speakers. Learn through real-time conversations, cultural immersion, and personalized instruction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#sessions"
              className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Session Types
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </section>

      {/* Session Types Section */}
      <section id="sessions" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Choose Your Session Type
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer various session formats to match your learning style and schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sessionTypes.map((session, index) => (
              <div key={index} className="bg-white rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#111827] rounded-lg flex items-center justify-center mr-4">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{session.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{session.duration}</span>
                      <span className="mx-2">•</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{session.frequency}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{session.description}</p>

                <ul className="space-y-3 mb-8">
                  {session.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-[#e69d2a] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors">
                  Book This Session
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose Live Sessions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the benefits of real-time learning with our expert instructors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Interactive Learning</h3>
              <p className="text-gray-600">Engage in real-time conversations and receive immediate feedback from native speakers.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Visual Learning</h3>
              <p className="text-gray-600">See proper pronunciation and gestures while learning cultural context and expressions.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Community Support</h3>
              <p className="text-gray-600">Connect with fellow learners and build lasting relationships in our supportive community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Ready to Join Live Sessions?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Book your first live session today and experience interactive Yoruba learning with our expert instructors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our session coordinators</p>
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
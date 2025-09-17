import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Calendar, MessageCircle, Star, Award, MessageCircle as ChatIcon, Phone, Mail, ChevronRight } from "lucide-react";

export default function BookClubPage() {
  const currentBooks = [
    {
      title: "Òwe Yorùbá: Yoruba Proverbs",
      author: "Various Traditional Sources",
      description: "Explore the wisdom and cultural significance of Yoruba proverbs, which serve as moral guides and reflections of traditional values.",
      discussionDate: "Every Wednesday",
      time: "7:00 PM WAT",
      participants: 45
    },
    {
      title: "Ìtàn Àtọ̀wọ́dọ́wọ́: Folktales of Wisdom",
      author: "Traditional Yoruba Storytellers",
      description: "Dive into traditional Yoruba folktales that teach valuable life lessons and preserve cultural heritage.",
      discussionDate: "Every Friday",
      time: "6:00 PM WAT",
      participants: 38
    },
    {
      title: "Modern Yoruba Literature",
      author: "Contemporary Yoruba Authors",
      description: "Discuss contemporary Yoruba literature and how it reflects modern Nigerian society and culture.",
      discussionDate: "Every Sunday",
      time: "5:00 PM WAT",
      participants: 52
    }
  ];

  const clubBenefits = [
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with fellow Yoruba learners and native speakers in meaningful discussions."
    },
    {
      icon: BookOpen,
      title: "Cultural Immersion",
      description: "Deepen your understanding of Yoruba culture through literature and storytelling."
    },
    {
      icon: MessageCircle,
      title: "Language Practice",
      description: "Improve your Yoruba speaking and comprehension skills through regular discussions."
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Earn certificates and badges for active participation in book club activities."
    }
  ];

  const upcomingEvents = [
    {
      title: "Proverbs Deep Dive Session",
      date: "October 15, 2024",
      time: "7:00 PM WAT",
      type: "Discussion"
    },
    {
      title: "Author Q&A: Modern Yoruba Writers",
      date: "October 20, 2024",
      time: "6:00 PM WAT",
      type: "Live Event"
    },
    {
      title: "Cultural Storytelling Workshop",
      date: "October 25, 2024",
      time: "5:00 PM WAT",
      type: "Workshop"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-16 relative" style={{ backgroundImage: "url('/learn.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <BookOpen size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Book Club
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our vibrant community of Yoruba literature enthusiasts. Read, discuss, and deepen your understanding of Yoruba culture through books and stories.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#current"
              className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Current Readings
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
            >
              Join the Club
            </Link>
          </div>
        </div>
      </section>

      {/* Current Books Section */}
      <section id="current" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Current Book Discussions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our weekly discussions on fascinating Yoruba literature and cultural texts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBooks.map((book, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <BookOpen className="w-8 h-8 text-[#111827] mr-3" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{book.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{book.discussionDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>{book.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{book.participants} participants</span>
                  </div>
                </div>

                <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white px-4 py-2 rounded-lg transition-colors">
                  Join Discussion
                </button>
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
              Why Join Our Book Club?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the benefits of community learning and cultural immersion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {clubBenefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss these exciting book club events and special sessions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <Calendar className="w-6 h-6 text-[#111827] mr-3" />
                  <span className="text-sm font-medium text-[#111827] uppercase tracking-wide">
                    {event.type}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3">{event.title}</h3>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                </div>

                <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white px-4 py-2 rounded-lg transition-colors">
                  RSVP
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Become a Book Club Member</h2>
          <p className="text-gray-600 mb-8">
            Join our community of literature lovers and cultural enthusiasts. Membership is free for all enrolled students.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Enroll in a Course</h3>
              <p className="text-gray-600">Sign up for any Yoruba language course</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Join the Community</h3>
              <p className="text-gray-600">Access the book club section in your dashboard</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Reading</h3>
              <p className="text-gray-600">Choose your first book and join discussions</p>
            </div>
          </div>

          <Link
            href="/services/yoruba-language-lessons"
            className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Enroll Now
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Questions About the Book Club?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our book club coordinator for more information about joining our literary community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our book club coordinator</p>
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
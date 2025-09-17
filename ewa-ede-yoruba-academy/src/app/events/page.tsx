import Link from "next/link";
import Image from "next/image";
import { Calendar, MapPin, Clock, Users, Star, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";

export default function EventsPage() {
  const upcomingEvents = [
    {
      title: "Yoruba Cultural Festival",
      date: "October 15, 2024",
      time: "2:00 PM - 8:00 PM WAT",
      location: "Lagos Cultural Center",
      description: "Celebrate Yoruba culture with traditional music, dance, food, and storytelling sessions.",
      attendees: 150,
      type: "Cultural Event",
      featured: true
    },
    {
      title: "Beginners Welcome Workshop",
      date: "October 20, 2024",
      time: "10:00 AM - 12:00 PM WAT",
      location: "Online (Zoom)",
      description: "A special orientation session for new students to get acquainted with our learning methods.",
      attendees: 50,
      type: "Educational"
    },
    {
      title: "Yoruba Proverbs & Wisdom Session",
      date: "October 25, 2024",
      time: "6:00 PM - 8:00 PM WAT",
      location: "Online (Zoom)",
      description: "Explore the depth of Yoruba proverbs and their application in modern life.",
      attendees: 75,
      type: "Educational"
    },
    {
      title: "Language Exchange Meetup",
      date: "November 2, 2024",
      time: "4:00 PM - 6:00 PM WAT",
      location: "Ikeja Community Center",
      description: "Practice conversational Yoruba with native speakers in a relaxed setting.",
      attendees: 30,
      type: "Social"
    }
  ];

  const pastEvents = [
    {
      title: "Introduction to Yoruba Tones",
      date: "September 10, 2024",
      attendees: 45,
      rating: 4.8
    },
    {
      title: "Traditional Yoruba Cooking Class",
      date: "September 5, 2024",
      attendees: 28,
      rating: 4.9
    },
    {
      title: "Yoruba Music Appreciation",
      date: "August 28, 2024",
      attendees: 62,
      rating: 4.7
    }
  ];

  const eventCategories = [
    {
      title: "Cultural Events",
      description: "Celebrate Yoruba traditions, festivals, and heritage",
      icon: Star,
      count: 12
    },
    {
      title: "Educational Workshops",
      description: "Learn specific aspects of Yoruba language and culture",
      icon: Users,
      count: 8
    },
    {
      title: "Social Meetups",
      description: "Connect with fellow learners in casual settings",
      icon: MessageCircle,
      count: 15
    },
    {
      title: "Online Sessions",
      description: "Virtual events accessible from anywhere",
      icon: Calendar,
      count: 20
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-16 relative" style={{ backgroundImage: "url('/learn.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <Calendar size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Events & Activities
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Join our exciting events, workshops, and cultural celebrations. Connect with the community and deepen your understanding of Yoruba culture.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#upcoming"
              className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View Upcoming Events
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
            >
              Host an Event
            </Link>
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Event Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the variety of events we organize for our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="text-2xl font-bold text-[#e69d2a]">{category.count}</div>
                <div className="text-sm text-gray-500">Events this month</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="upcoming" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Don't miss these exciting events and activities
            </p>
          </div>

          <div className="space-y-8">
            {upcomingEvents.map((event, index) => (
              <div key={index} className={`bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 ${event.featured ? 'border-2 border-[#e69d2a] bg-gradient-to-r from-yellow-50 to-orange-50' : ''}`}>
                {event.featured && (
                  <div className="flex items-center mb-4">
                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-yellow-700">Featured Event</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                        <span className="inline-block px-3 py-1 bg-[#111827] text-white text-sm rounded-full">
                          {event.type}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Users className="w-4 h-4 mr-1" />
                          <span className="text-sm">{event.attendees} attending</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-6">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-5 h-5 mr-3 text-[#111827]" />
                        <div>
                          <div className="font-medium">Date</div>
                          <div className="text-sm">{event.date}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="w-5 h-5 mr-3 text-[#111827]" />
                        <div>
                          <div className="font-medium">Time</div>
                          <div className="text-sm">{event.time}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-5 h-5 mr-3 text-[#111827]" />
                        <div>
                          <div className="font-medium">Location</div>
                          <div className="text-sm">{event.location}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1 flex flex-col justify-center">
                    <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors mb-3">
                      Register Now
                    </button>
                    <button className="w-full border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white px-6 py-3 rounded-lg transition-colors">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Past Events
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our community has enjoyed recently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pastEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-3">{event.title}</h3>
                <div className="flex items-center text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">{event.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    <span className="text-sm">{event.attendees} attended</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{event.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Host an Event */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Host Your Own Event</h2>
          <p className="text-gray-600 mb-8">
            Have an idea for a Yoruba cultural event or educational workshop? We'd love to help you bring it to life!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Share Your Idea</h3>
              <p className="text-gray-600">Tell us about your event concept and goals</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Get Support</h3>
              <p className="text-gray-600">Receive guidance and resources from our team</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Launch Your Event</h3>
              <p className="text-gray-600">Bring your vision to life with community support</p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Propose an Event
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Questions About Events?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our events coordinator for more information about upcoming events or hosting your own.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our events team</p>
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
"use client";
import { useState } from "react";
import { BookOpen, Users, Video, Library, Award, Star, Mail } from "lucide-react";

interface NewsletterResponse {
  message?: string;
  error?: string;
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data: NewsletterResponse = await response.json();

      if (response.ok) {
        setMessage({
          text: data.message || 'Thank you for subscribing!',
          type: 'success'
        });
        setEmail("");
      } else {
        setMessage({
          text: data.error || 'Failed to subscribe. Please try again.',
          type: 'error'
        });
      }
    } catch {
      setMessage({
        text: 'Failed to connect to the server. Please check your connection.',
        type: 'error'
      });
    } finally {
      setLoading(false);

      // Clear message after 5 seconds
      if (message) {
        const timer = setTimeout(() => {
          setMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-t border-[#2a2a2a]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#4f46e5]/10 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#4f46e5]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Ṣe ẹ fẹ́ kí a ránṣẹ́ létà sí ẹ? <span className="block text-[#4f46e5] mt-2">Stay Updated</span>
          </h2>
          <p className="text-[#a1a1aa] text-lg mb-8 max-w-2xl">
            Gba àwọn ìmọ̀ tuntun nípa èdè àti àṣà Yorùbá, àwọn ìpèsè ẹ̀kọ́, àti àwọn ìròyìn tó ṣe pàtàkì.
            <span className="block mt-2">
              Get the latest Yoruba learning tips, cultural insights, and academy updates delivered to your inbox.
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-5 py-3.5 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:ring-2 focus:ring-[#4f46e5]/20 focus:outline-none transition-all duration-200"
                required
                disabled={loading}
                aria-label="Email address for newsletter subscription"
              />
              {message && (
                <div
                  className={`absolute -bottom-7 left-0 right-0 text-sm text-center transition-opacity duration-300 ${
                    message ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <span className={`inline-block px-3 py-1 rounded-full ${
                    message.type === 'success'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }`}>
                    {message.text}
                  </span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className={`px-6 py-3.5 rounded-lg font-medium transition-all duration-200 flex-shrink-0 ${
                loading || !email.trim()
                  ? 'bg-[#4f46e5]/50 cursor-not-allowed'
                  : 'bg-[#4f46e5] hover:bg-[#4338ca] transform hover:-translate-y-0.5 shadow-lg hover:shadow-[#4f46e5]/20'
              } text-white`}
              aria-busy={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span>Subscribe</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </div>
          <p className="mt-10 text-sm text-[#6b7280]">
            A kì yóò ta àdíẹ ẹ̀rí rẹ. We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  );
}

export default function HomePage() {
  const features = [
    {
      icon: BookOpen,
      title: "Personalized Learning",
      description: "Track your progress through novice to pro levels with customized lesson plans."
    },
    {
      icon: Users,
      title: "Learning Groups",
      description: "Join or create study groups with fellow learners at your level."
    },
    {
      icon: Video,
      title: "Live Sessions",
      description: "Attend interactive classes with experienced Yoruba teachers."
    },
    {
      icon: Library,
      title: "E-Library Access",
      description: "Access comprehensive resources including videos, PDFs, and audio materials."
    },
    {
      icon: Award,
      title: "Book Club",
      description: "Explore Yoruba literature and culture with our community book discussions."
    }
  ];

  const levels = [
    {
      name: "Novice",
      price: "$29",
      period: "/month",
      features: ["Basic alphabet and pronunciation", "Simple greetings and expressions", "Cultural introduction", "Community access"]
    },
    {
      name: "Beginner",
      price: "$39",
      period: "/month",
      features: ["Grammar fundamentals", "Vocabulary building", "Basic conversations", "Group learning sessions", "E-library access"]
    },
    {
      name: "Advanced",
      price: "$49",
      period: "/month",
      features: ["Complex grammar structures", "Advanced vocabulary", "Cultural context lessons", "Live teacher sessions", "Book club access"],
      popular: true
    },
    {
      name: "Pro",
      price: "$59",
      period: "/month",
      features: ["Fluency training", "Literature analysis", "One-on-one sessions", "Teaching preparation", "All features included"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Navigation */}
      <nav className="bg-[#1a1a1a] border-b border-[#2a2a2a] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BookOpen size={32} className="text-[#4f46e5] mr-3" />
              <h1 className="font-bold text-xl text-white">Ewa Ede Yoruba Academy</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-[#a1a1aa] hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-[#a1a1aa] hover:text-white transition-colors">Pricing</a>
              <a href="#about" className="text-[#a1a1aa] hover:text-white transition-colors">About</a>
            </div>
            <div className="flex items-center space-x-4">
              {/* Navigation buttons moved to bottom tabs */}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=2000&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#0f0f0f]/80 to-[#0f0f0f]" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#4f46e5]/10 border border-[#4f46e5]/30 text-[#a78bfa] text-sm font-medium mb-6">
            <span className="relative flex h-3 w-3 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4f46e5] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#4f46e5]"></span>
            </span>
            Ẹ kú àbọ̀! Welcome to Ewa Ede Yoruba Academy
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-[#4f46e5]">Learn the Beautiful Yoruba Language</span>
          </h1>
          <p className="text-xl lg:text-2xl text-[#a1a1aa] mb-8 max-w-3xl mx-auto">
            Immerse yourself in the rich culture and traditions of the Yoruba people through our interactive language programs. From greetings to proverbs, we make learning Yoruba engaging and meaningful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Hero buttons moved to bottom tabs */}
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { text: 'Personalized Learning', yoruba: 'Ẹkọ Oníṣòwò' },
              { text: 'Native Teachers', yoruba: 'Ọ̀jọ̀gbọ́n Ọmọ Ilẹ̀ Yorùbá' },
              { text: 'Cultural Immersion', yoruba: 'Ìtẹ̀síwájú Ọ̀nà Àṣà' },
              { text: 'Flexible Schedule', yoruba: 'Àkókò Tí Ó Wọ́nù Fún Ẹ' }
            ].map((item, i) => (
              <div key={i} className="bg-[#1a1a1a]/50 backdrop-blur-sm border border-[#2a2a2a] p-4 rounded-lg">
                <p className="text-[#a1a1aa] text-sm">{item.text}</p>
                <p className="text-[#a78bfa] font-medium mt-1">{item.yoruba}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Learn Yoruba
            </h2>
            <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and community support for your Yoruba learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#4f46e5]/30 transition-colors">
                <feature.icon size={48} className="text-[#4f46e5] mb-4" />
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-[#a1a1aa]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Levels & Pricing */}
      {/* Cultural Showcase */}
      <section className="py-16 bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ọ̀nà Tí A ń Kọ́ Ẹ̀kọ́
              <span className="block text-[#4f46e5] mt-2">Our Teaching Approach</span>
            </h2>
            <p className="text-xl text-[#a1a1aa] max-w-3xl mx-auto">
              We combine traditional Yoruba teaching methods with modern technology for effective learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Ìtàn-Àròsọ',
                eng: 'Storytelling',
                desc: 'Learn through traditional Yoruba folktales and proverbs',
                color: 'from-purple-600 to-blue-500'
              },
              {
                title: 'Ìdánimọ̀ra',
                eng: 'Interactive',
                desc: 'Engage in conversations and role-playing exercises',
                color: 'from-amber-600 to-yellow-500'
              },
              {
                title: 'Ìṣẹ̀lú',
                eng: 'Cultural',
                desc: 'Immerse in Yoruba culture, music, and traditions',
                color: 'from-red-600 to-pink-500'
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 hover:border-[#4f46e5]/30 transition-all group">
                <div className={`w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br ${item.color} text-white text-2xl font-bold`}>
                  {item.title.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title} <span className="text-[#a1a1aa]">({item.eng})</span></h3>
                <p className="text-[#a1a1aa]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-xl text-[#a1a1aa] max-w-2xl mx-auto">
              Select the level that matches your current knowledge and goals. All levels include both individual and group learning options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level, index) => (
              <div key={index} className={`relative bg-[#1a1a1a] border rounded-xl p-6 ${level.popular ? 'border-[#4f46e5] ring-1 ring-[#4f46e5]/20' : 'border-[#2a2a2a]'}`}>
                {level.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-[#4f46e5] text-white px-3 py-1 text-sm rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">
                  {level.name}
                  {level.name === 'Novice' && ' (Aṣáájú)'}
                  {level.name === 'Beginner' && ' Ìbẹ̀rẹ̀'}
                  {level.name === 'Advanced' && ' Ìlọsíwájú'}
                  {level.name === 'Pro' && ' Ọ̀jọ̀gbọ́n'}
                </h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{level.price}</span>
                    <span className="text-[#a1a1aa] ml-1">{level.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {level.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start">
                      <Star size={16} className="text-[#10b981] mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-[#a1a1aa] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Pricing buttons moved to bottom tabs */}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold mb-3">Teaching Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <h4 className="font-medium text-[#4f46e5] mb-2">Individual Learning</h4>
                  <p className="text-[#a1a1aa] text-sm">One-on-one sessions with dedicated teachers for personalized attention and faster progress.</p>
                </div>
                <div>
                  <h4 className="font-medium text-[#4f46e5] mb-2">Group Learning</h4>
                  <p className="text-[#a1a1aa] text-sm">Learn alongside peers in small groups, fostering community and collaborative learning.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-8">
            About Ewa Ede Yoruba Academy
          </h2>
          <p className="text-lg text-[#a1a1aa] mb-8">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Founded with a passion for preserving and promoting the Yoruba language and culture, our academy brings together expert teachers and enthusiastic learners from around the world. Whether you're connecting with your heritage or discovering Yoruba for the first time, we provide the structure, community, and resources you need to succeed.
          </p>
          <p className="text-lg text-[#a1a1aa]">
            Our platform combines traditional teaching methods with modern technology, creating an engaging and effective learning environment. Join our community of learners and discover the beauty of Yoruba language and culture.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen size={24} className="text-[#4f46e5] mr-2" />
                <span className="font-bold">Ewa Ede Yoruba Academy</span>
              </div>
              <p className="text-[#a1a1aa] text-sm">
                Empowering learners worldwide to master the beautiful Yoruba language and culture.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Learning</h3>
              <ul className="space-y-2 text-sm text-[#a1a1aa]">
                <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Live Sessions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">E-Library</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Book Club</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-[#a1a1aa]">
                <li><a href="#" className="hover:text-white transition-colors">Learning Groups</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forums</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Events</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Teachers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-[#a1a1aa]">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#2a2a2a] mt-8 pt-8 text-center text-[#a1a1aa] text-sm">
            <p>&copy; 2024 Ewa Ede Yoruba Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";
import { useState } from "react";
import { BookOpen, Users, Video, Library, Award, Star, Mail, GraduationCap, PenTool, Brain, Lightbulb, MessageCircle, X, Send } from "lucide-react";

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
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#4f46e5]/10 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#e69d2a]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="block text-[#e69d2a] mt-2">Stay Updated</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Gba àwọn ìmọ̀ tuntun nípa èdè àti àṣà Yorùbá, àwọn ìpèsè ẹ̀kọ́, àti àwọn ìròyìn tó ṣe pàtàkì.
            <span className="block mt-2">
              Get the latest Yoruba learning tips, cultural insights, and academy updates delivered to your inbox.
            </span>
          </p>
        </div>

        <div className="bg-gray-50 border-2 border-[#4f46e5] rounded-xl p-8 shadow-lg max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-5 py-3.5 bg-white border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:border-[#e69d2a] focus:ring-2 focus:ring-[#e69d2a]/20 focus:outline-none transition-all duration-200"
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
                    ? 'bg-[#e69d2a]/50 cursor-not-allowed'
                    : 'bg-[#e69d2a] hover:bg-[#d48a1f] transform hover:-translate-y-0.5 shadow-lg hover:shadow-[#e69d2a]/20'
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
            <p className="mt-6 text-sm text-gray-500 text-center">
              A kì yóò ta àdíẹ ẹ̀rí rẹ. We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Bisola, your Yoruba learning assistant. How can I help you today?", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 1000);
  };

  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    if (input.includes('hello') || input.includes('hi') || input.includes('ẹ kaabo')) {
      return "Ẹ kaabo! (Welcome!) I'm excited to help you learn Yoruba. What would you like to know about our courses?";
    }

    if (input.includes('course') || input.includes('learn') || input.includes('beginner')) {
      return "We offer four learning levels: Novice (beginners), Beginner, Advanced, and Individual (personalized). Each level includes live sessions, E-library access, and community features. Which level interests you?";
    }

    if (input.includes('price') || input.includes('cost') || input.includes('fee')) {
      return "Our courses range from $15 per class to $480 for full individual packages. We also offer flexible payment options. Would you like me to explain the pricing for a specific level?";
    }

    if (input.includes('teacher') || input.includes('instructor')) {
      return "Our teachers are native Yoruba speakers with extensive teaching experience. They combine traditional methods with modern technology for effective learning. Many have been teaching for over 10 years!";
    }

    if (input.includes('schedule') || input.includes('time') || input.includes('when')) {
      return "Classes are typically held once weekly and last about 1-2 hours. We offer flexible scheduling to accommodate different time zones. Individual sessions can be arranged at your convenience.";
    }

    return "That's interesting! I'm here to help with any questions about Yoruba learning, our courses, teachers, or the academy. What specific information are you looking for?";
  };

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

  const testimonials = [
    { name: "Adebayo Johnson", text: "This academy transformed my understanding of Yoruba culture. The teachers are exceptional!", rating: 5 },
    { name: "Funmi Adeolu", text: "Learning Yoruba here has been an amazing journey. Highly recommend to anyone interested in the language.", rating: 5 },
    { name: "Kemi Ogunleye", text: "The personalized approach made all the difference. I went from zero knowledge to conversational in months.", rating: 5 },
    { name: "Tunde Bakare", text: "Outstanding platform! The cultural immersion is unparalleled.", rating: 5 },
    { name: "Adunni Lawal", text: "Best investment I've made for my cultural heritage. Thank you!", rating: 5 },
    { name: "Gbenga Adeyemi", text: "The live sessions are interactive and engaging. Love it!", rating: 5 },
    { name: "Ifeoluwa Adebayo", text: "From Nigeria but wanted to deepen my roots. This academy delivered.", rating: 5 },
    { name: "Simi Okafor", text: "The community aspect is wonderful. Made great friends while learning.", rating: 5 },
    { name: "Yemi Adewale", text: "Professional teachers with deep knowledge. Five stars!", rating: 5 },
    { name: "Bola Nwosu", text: "Flexible scheduling fits my busy life perfectly.", rating: 5 },
    { name: "Chike Eze", text: "The proverbs and stories taught here are priceless.", rating: 5 },
    { name: "Ngozi Okoro", text: "Amazing progress in just a few weeks. So motivated!", rating: 5 },
    { name: "Jide Adeolu", text: "Cultural context makes learning meaningful and fun.", rating: 5 },
    { name: "Tola Adebayo", text: "The academy's approach is both traditional and modern.", rating: 5 },
    { name: "Kemi Adeyemi", text: "Best online Yoruba learning experience ever!", rating: 5 },
    { name: "Femi Ogunleye", text: "Teachers are patient and knowledgeable. Perfect!", rating: 5 },
    { name: "Adaeze Nwosu", text: "Learning Yoruba has opened new doors for me.", rating: 5 },
    { name: "Obinna Eze", text: "The interactive sessions keep me engaged.", rating: 5 },
    { name: "Nneka Okoro", text: "Highly recommend for cultural preservation.", rating: 5 },
    { name: "Emeka Adewale", text: "Transformative experience. Grateful for this platform.", rating: 5 }
  ];

  // Debug log for homepage learning levels
  console.log('Homepage learning levels:', levels.map(level => level.name));

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Separate Navigation Bar */}
      <nav className="bg-white border-b-2 border-[#4f46e5] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Ẹwà Èdè Yorùbá Academy"
                className="h-10 sm:h-12 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center justify-center flex-1 space-x-6 lg:space-x-8">
              <a href="/" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium text-sm lg:text-base">Home</a>
              <a href="#features" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium text-sm lg:text-base">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium text-sm lg:text-base">Pricing</a>
              <a href="#about" className="text-gray-700 hover:text-[#4f46e5] transition-colors font-medium text-sm lg:text-base">About</a>
              <a href="/auth/register" className="bg-[#4f46e5] text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-[#3b35c7] transition-colors font-medium text-sm lg:text-base">Get Started</a>
            </div>
            {/* Mobile menu button - could be added later if needed */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 overflow-hidden bg-white">

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Left Column - Content (2/3 width) */}
            <div className="md:col-span-2 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                E̩ kaabo̩! Welcome to Ẹwà Èdè Yorùbá Academy
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-black">
                Learn the Beautiful <span className="text-[#e69d2a]">Yoruba</span> Language
              </h1>
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-3xl">
                Immerse yourself in the rich culture and traditions of the Yoruba people through our interactive language programs. From greetings to proverbs, we make learning Yoruba engaging and meaningful.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
                {[
                  { text: 'Personalized Learning', yoruba: 'Ẹkọ Oníṣòwò' },
                  { text: 'Native Teachers', yoruba: 'Ọ̀jọ̀gbọ́n Ọmọ Ilẹ̀ Yorùbá' },
                  { text: 'Cultural Immersion', yoruba: 'Ìtẹ̀síwájú Ọ̀nà Àṣà' },
                  { text: 'Flexible Schedule', yoruba: 'Àkókò Tí Ó Wọ́nù Fún Ẹ' }
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm border border-[#e69d2a] p-4 rounded-lg hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-lg hover:shadow-white/20">
                    <p className="text-white text-sm">{item.text}</p>
                    <p className="text-[#e69d2a] font-medium mt-1">{item.yoruba}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Image (1/3 width) */}
            <div className="md:col-span-1 flex justify-center md:justify-end">
              <div className="relative">
                <img
                  src="/heroside.jpg"
                  alt="Yoruba Learning Experience"
                  className="w-full max-w-sm h-auto rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Learn Yoruba
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools and community support for your Yoruba learning journey.
            </p>
          </div>

          <div className="space-y-8">
            {/* Top row with 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.slice(0, 3).map((feature, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#e69d2a]/30 transition-all duration-500 hover:transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <feature.icon size={48} className="text-[#e69d2a] mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Bottom row with 2 centered cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {features.slice(3, 5).map((feature, index) => (
                <div key={index + 3} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#e69d2a]/30 transition-all duration-500 hover:transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                  <feature.icon size={48} className="text-[#e69d2a] mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Levels & Pricing */}
      {/* Cultural Showcase */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ọ̀nà Tí A ń Kọ́ Ẹ̀kọ́
              <span className="block text-[#4f46e5] mt-2">Our <span className="text-[#e69d2a]">Teaching</span> Approach</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#e69d2a]/30 transition-all duration-500 group hover:transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className={`w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br ${item.color} text-white text-2xl font-bold`}>
                  {item.title.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title} <span className="text-gray-600">({item.eng})</span></h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Divider */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="mx-8">
              <img
                src="/logo.png"
                alt="Ẹwà Èdè Yorùbá Academy Logo"
                className="h-16 w-auto animate-pulse"
              />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-[#e69d2a]">Choose Your</span> <span className="text-[#4f46e5]">Learning</span> <span className="text-[#e69d2a]">Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the level that matches your current knowledge and goals. All levels include both individual and group learning options.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Left Column: Novice, Beginner, Intermediate */}
            <div className="space-y-6">
              {levels.filter(level => ["Novice", "Beginner", "Intermediate"].includes(level.name)).map((level, index) => (
                <div key={index} className={`relative bg-white border rounded-xl p-6 max-w-md mx-auto min-h-[400px] flex flex-col ${level.popular ? 'border-[#e69d2a] ring-1 ring-[#e69d2a]/20' : 'border-gray-200'}`}>
                  {level.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#e69d2a] text-black px-3 py-1 text-sm rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Perfect for starters tag outside the card */}
                  {level.name === "Novice" && (
                    <div className="absolute -top-2 -left-2 z-10">
                      <span className="bg-[#e69d2a] text-white text-xs px-3 py-1 rounded-full shadow-md">
                        Perfect for starters
                      </span>
                    </div>
                  )}

                  {/* Animated Study Icon */}
                  <div className="flex justify-center mb-4">
                    {level.name === "Novice" && <BookOpen size={36} className="text-[#4f46e5] animate-bounce" />}
                    {level.name === "Beginner" && <GraduationCap size={36} className="text-[#e69d2a] animate-pulse" />}
                    {level.name === "Intermediate" && <Brain size={36} className="text-[#4f46e5] animate-bounce" />}
                  </div>

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
                    <a href="/auth/register" className="block w-full">
                      <button className="w-full bg-[#4f46e5] hover:bg-[#3b35c7] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Enroll Now
                      </button>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Advanced, Individual, Teaching Options */}
            <div className="space-y-6">
              {/* Advanced Card */}
              {levels.filter(level => level.name === "Advanced").map((level, index) => (
                <div key={index} className={`relative bg-white border rounded-xl p-6 max-w-md mx-auto min-h-[400px] flex flex-col ${level.popular ? 'border-[#e69d2a] ring-1 ring-[#e69d2a]/20' : 'border-gray-200'}`}>
                  {level.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#e69d2a] text-black px-3 py-1 text-sm rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Animated Study Icon */}
                  <div className="flex justify-center mb-4">
                    <Lightbulb size={36} className="text-[#e69d2a] animate-pulse" />
                  </div>

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
                    <a href="/auth/register" className="block w-full">
                      <button className="w-full bg-[#4f46e5] hover:bg-[#3b35c7] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Enroll Now
                      </button>
                    </a>
                  </div>
                </div>
              ))}

              {/* Individual Card */}
              {levels.filter(level => level.name === "Individual").map((level, index) => (
                <div key={index} className={`relative bg-white border rounded-xl p-6 max-w-md mx-auto min-h-[400px] flex flex-col ${level.popular ? 'border-[#e69d2a] ring-1 ring-[#e69d2a]/20' : 'border-gray-200'}`}>
                  {level.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-[#e69d2a] text-black px-3 py-1 text-sm rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Animated Study Icon */}
                  <div className="flex justify-center mb-4">
                    <Users size={36} className="text-[#4f46e5] animate-pulse" />
                  </div>

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
                    <a href="/auth/register" className="block w-full">
                      <button className="w-full bg-[#4f46e5] hover:bg-[#3b35c7] text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                        Enroll Now
                      </button>
                    </a>
                  </div>
                </div>
              ))}

              {/* Teaching Options */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto w-full">
                <h3 className="text-xl font-semibold mb-6 text-center">Teaching Options</h3>
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h4 className="font-medium text-[#e69d2a] mb-2">Individual Learning</h4>
                    <p className="text-gray-600 text-sm">One-on-one sessions with dedicated teachers for personalized attention and faster progress.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#e69d2a] mb-2">Group Learning</h4>
                    <p className="text-gray-600 text-sm">Learn alongside peers in small groups, fostering community and collaborative learning.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#000080]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our <span className="text-[#e69d2a]">Students</span> Say
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto">
              Hear from learners who have transformed their understanding of Yoruba language and culture.
            </p>
          </div>

          <div className="relative overflow-hidden h-96">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 h-full">
              {[0, 1, 2, 3].map((colIndex) => (
                <div key={colIndex} className="flex flex-col animate-scroll-up">
                  {[...testimonials.slice(colIndex * 5, (colIndex + 1) * 5), ...testimonials.slice(colIndex * 5, (colIndex + 1) * 5)].map((testimonial, index) => (
                    <div key={`${colIndex}-${index}-${testimonial.name}`} className="flex-shrink-0 mb-6">
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={14} className="text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 mb-3 italic text-sm">&ldquo;{testimonial.text}&rdquo;</p>
                        <p className="font-semibold text-gray-800 text-sm">- {testimonial.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <img
                src="/about.jpg"
                alt="About Ẹwà Èdè Yorùbá Academy"
                className="w-full h-auto rounded-xl shadow-lg transform transition-all duration-1000 hover:scale-105"
              />
            </div>
            <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8 transform transition-all duration-1000 translate-y-0 opacity-100">
                About Ẹwà Èdè Yorùbá Academy
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-4 lg:mb-6 transform transition-all duration-1000 translate-y-0 opacity-100" style={{ animationDelay: '0.5s' }}>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                Founded with a passion for preserving and promoting the Yoruba language and culture, our academy brings together expert teachers and enthusiastic learners from around the world. Whether you're connecting with your heritage or discovering Yoruba for the first time, we provide the structure, community, and resources you need to succeed.
              </p>
              <p className="text-base sm:text-lg text-gray-600 transform transition-all duration-1000 translate-y-0 opacity-100" style={{ animationDelay: '0.7s' }}>
                Our platform combines traditional teaching methods with modern technology, creating an engaging and effective learning environment. Join our community of learners and discover the beauty of Yoruba language and culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider with Animated Book Icon */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="mx-8">
              <BookOpen size={48} className="text-[#4f46e5] animate-bounce" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/logo.png"
                  alt="Ẹwà Èdè Yorùbá Academy"
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-600 text-sm">
                Empowering learners worldwide to master the beautiful Yoruba language and culture.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Learning</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Courses</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Live Sessions</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">E-Library</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Book Club</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Learning Groups</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Forums</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Events</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Teachers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Help Center</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-[#4f46e5] hover:text-[#e69d2a] transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2025 Ẹwà Èdè Yorùbá Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-20 right-6 z-50">
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-[#000080] hover:bg-[#000066] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-bounce"
            aria-label="Open chat with Bisola"
          >
            <MessageCircle size={24} />
          </button>
        )}

        {isChatOpen && (
          <div className="bg-white rounded-lg shadow-2xl w-80 h-96 flex flex-col border border-gray-200">
            {/* Chat Header */}
            <div className="bg-[#000080] text-white p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3">
                  <span className="text-[#4f46e5] font-bold text-sm">B</span>
                </div>
                <div>
                  <h3 className="font-semibold">Bisola</h3>
                  <p className="text-xs opacity-90">Yoruba Learning Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-[#4f46e5] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about Yoruba learning..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#4f46e5]"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="bg-[#000080] hover:bg-[#000066] text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Video, Library, Award, Star, Mail, GraduationCap, Brain, Lightbulb, MessageCircle, X, Send, ChevronRight } from "lucide-react";

interface NewsletterResponse {
  message?: string;
  error?: string;
}

function StudentCounter() {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentElement = counterRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          animateCounter();
        }
      },
      { threshold: 0.3 }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [isVisible]);

  const animateCounter = () => {
    const target = 100;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
  };

  return (
    <div ref={counterRef} className="text-center py-12">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md mx-auto shadow-lg">
        <div className="text-4xl font-bold text-[#e69d2a] mb-2">
          {count}+
        </div>
        <div className="text-lg font-semibold text-gray-800 mb-1">
          Satisfied Students
        </div>
        <div className="text-sm text-gray-600">
          Join our growing community of Yoruba learners
        </div>
      </div>
    </div>
  );
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
          <div className="w-16 h-16 rounded-full bg-[#111827]/10 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#e69d2a]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="block text-[#e69d2a] mt-2">Stay Updated</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl">
            Get the latest Yoruba learning tips, cultural insights, and academy updates delivered to your inbox.
          </p>
        </div>

        <div className="bg-gray-50 border-2 border-[#111827] rounded-xl p-8 shadow-lg max-w-lg mx-auto">
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
              We respect your privacy. Unsubscribe at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Ẹ kaabo! I'm admin@ewaedeyoruba.com, your Yoruba learning assistant. What's your name?", sender: 'bot', timestamp: new Date() }
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
    setIsTyping(true);

    // Simulate bot response with typing effect
    setTimeout(() => {
      const botResponse = getBotResponse(inputMessage);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }]);
    }, 2000); // Increased delay for typing effect
  };

  const getBotResponse = (userInput: string) => {
    const input = userInput.toLowerCase();

    // If we don't have the user's name yet, treat this as their name
    if (!userName) {
      setUserName(userInput.trim());
      return `Ẹ kaabo ${userInput.trim()}! 🎉 I'm admin@ewaedeyoruba.com, your Ẹwà Èdè Virtual Assistant. How can I help you today?`;
    }

    // Greeting responses
    if (input.includes('hello') || input.includes('hi') || input.includes('hey') || input.includes('ẹ kaabo')) {
      return `Ẹ kaabo ${userName}! 👋 How are you doing today? I'm here to help you with anything related to Ẹwà Èdè Yorùbá Academy!`;
    }

    // Course and pricing responses
    if (input.includes('course') || input.includes('pricing') || input.includes('price') || input.includes('level')) {
      return `Great question, ${userName}! We offer 5 learning levels: Novice ($220 full/$15 per class), Beginner ($390 full/$15 per class), Intermediate ($300 full/$15 per class), Advanced ($300 full/$15 per class), and Individual ($480 full/$20 per class). Each level includes personalized learning plans and native teacher sessions!`;
    }

    if (input.includes('cost') || input.includes('fee') || input.includes('payment') || input.includes('pay')) {
      return "Our courses range from $15 per class to $480 for full individual packages. We also offer flexible payment options and a 30-day money-back guarantee. Would you like me to explain the pricing for a specific level?";
    }

    // Teacher and instruction responses
    if (input.includes('teacher') || input.includes('instructor') || input.includes('tutor')) {
      return `Our expert teachers are native Yoruba speakers with years of teaching experience, ${userName}! They provide personalized instruction, cultural insights, and real-time feedback to help you master Yoruba effectively.`;
    }

    // Schedule and timing responses
    if (input.includes('schedule') || input.includes('time') || input.includes('when') || input.includes('session')) {
      return "Classes are typically held once weekly and last about 1-2 hours. We offer flexible scheduling to accommodate different time zones. Individual sessions can be arranged at your convenience.";
    }

    // Registration and enrollment responses
    if (input.includes('register') || input.includes('enroll') || input.includes('join') || input.includes('start')) {
      return `Ready to start your Yoruba journey, ${userName}? You can register by visiting our courses page or contacting us directly. We offer both group and individual learning options!`;
    }

    // Cultural and language responses
    if (input.includes('culture') || input.includes('tradition') || input.includes('yoruba') || input.includes('language')) {
      return `Yoruba is a beautiful language with rich cultural traditions, ${userName}! At Ẹwà Èdè, we teach not just the language, but also the cultural context, proverbs, and traditions that make Yoruba so special.`;
    }

    // Contact and support responses
    if (input.includes('contact') || input.includes('help') || input.includes('support') || input.includes('question')) {
      return `I'm here to help, ${userName}! You can reach our support team through the contact page, email us at admin@ewaedeyoruba.com, or use the contact form on our website.`;
    }

    // Location and accessibility responses
    if (input.includes('location') || input.includes('online') || input.includes('remote') || input.includes('access')) {
      return `Great news, ${userName}! All our courses are fully online, so you can learn from anywhere in the world. We use interactive platforms that work on computers, tablets, and mobile devices.`;
    }

    // Certificate and completion responses
    if (input.includes('certificate') || input.includes('certification') || input.includes('complete') || input.includes('finish')) {
      return `Yes, ${userName}! Upon completion of any level, you'll receive a certificate of achievement from Ẹwà Èdè Yorùbá Academy. Our certificates are recognized and demonstrate your Yoruba proficiency.`;
    }

    // Refund and guarantee responses
    if (input.includes('refund') || input.includes('guarantee') || input.includes('money back')) {
      return `We offer a 30-day money-back guarantee, ${userName}! If you're not satisfied with your learning experience within the first 30 days, you may request a full refund.`;
    }

    // Default response
    return `That's interesting, ${userName}! I'm here to help with any questions about Yoruba learning, our courses, teachers, cultural insights, or the academy. What specific information are you looking for?`;
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

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 overflow-hidden" style={{
        backgroundImage: "url('/hero-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
            {/* Left Column - Content (2/3 width) */}
            <div className="md:col-span-2 text-center md:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-8 backdrop-blur-sm">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                Welcome to Ẹwà Èdè Yorùbá Academy
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                Learn the Beautiful <span className="text-[#e69d2a]">Yorùbá</span> Language
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl">
                Immerse yourself in the rich culture and traditions of the Yoruba people through our interactive language programs. From greetings to proverbs, we make learning Yoruba engaging and meaningful.
              </p>
            </div>

            {/* Right Column - Image (1/3 width) */}
            <div className="md:col-span-1 flex justify-center md:justify-end relative">
              <div className="absolute inset-0 backdrop-blur-sm bg-black/20 rounded-xl"></div>
              <div className="relative z-10">
                <Image
                  src="/heroside.png"
                  alt="Yoruba Learning Experience"
                  width={400}
                  height={300}
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
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#e69d2a]/30 transition-all duration-500 hover:transform hover:-translate-y-2 animate-fade-in-up animate-float" style={{ animationDelay: `${index * 0.1}s` }}>
                  <feature.icon size={48} className="text-[#e69d2a] mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Bottom row with 2 centered cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              {features.slice(3, 5).map((feature, index) => (
                <div key={index + 3} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#e69d2a]/30 transition-all duration-500 hover:transform hover:-translate-y-2 animate-fade-in-up animate-float" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                  <feature.icon size={48} className="text-[#e69d2a] mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Student Counter */}
          <StudentCounter />
        </div>
      </section>

      {/* Learning Levels & Pricing */}
      {/* Cultural Showcase */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our <span className="text-[#e69d2a]">Teaching</span> Approach
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional Yoruba teaching methods with modern technology for effective learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Storytelling',
                desc: 'Learn through traditional Yoruba folktales and proverbs',
                image: '/storytelling.png'
              },
              {
                title: 'Interactive Learning',
                desc: 'Engage in conversations and role-playing exercises',
                image: '/interactive.png'
              },
              {
                title: 'Cultural Immersion',
                desc: 'Immerse in Yoruba culture, music, and traditions',
                image: '/culture.png'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-[#e69d2a]/30 transition-all duration-500 group hover:transform hover:-translate-y-2 animate-fade-in-up" style={{ animationDelay: `${i * 0.2}s` }}>
                <div className="mb-6">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={240}
                    className="w-full h-32 object-cover rounded-lg"
                    quality={100}
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
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
              <Image
                src="/logo.png"
                alt="Ẹwà Èdè Yorùbá Academy Logo"
                width={256}
                height={256}
                className="h-16 w-auto animate-pulse"
                quality={100}
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
              <span className="text-[#e69d2a]">Choose Your</span> <span className="text-[#111827]">Learning</span> <span className="text-[#e69d2a]">Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select the level that matches your current knowledge and goals. All levels include both individual and group learning options.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {/* Left Column: Novice */}
            <div className="space-y-6">
              {levels.filter(level => ["Novice"].includes(level.name)).map((level, index) => (
                <div key={index} className={`relative bg-white border rounded-xl p-6 max-w-md mx-auto min-h-[400px] flex flex-col group hover:transform hover:-translate-y-2 transition-all duration-300 hover:shadow-xl ${level.popular ? 'border-[#e69d2a] ring-1 ring-[#e69d2a]/20' : 'border-gray-200'}`}>
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
                  <div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {level.name === "Novice" && <BookOpen size={48} className="text-[#111827] group-hover:text-[#e69d2a] animate-bounce transition-colors duration-300" />}
                    {level.name === "Beginner" && <GraduationCap size={48} className="text-[#e69d2a] group-hover:text-[#111827] animate-pulse transition-colors duration-300" />}
                    {level.name === "Intermediate" && <Brain size={48} className="text-[#111827] group-hover:text-[#e69d2a] animate-bounce transition-colors duration-300" />}
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
                    {/* Contact button removed for Novice level */}
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: See More Options */}
            <div className="space-y-6">
              {/* See More Button */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto w-full flex flex-col justify-center items-center min-h-[400px]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Explore More Learning Options</h3>
                  <p className="text-gray-600 mb-6">Discover all our comprehensive learning levels including Intermediate, Advanced, and Individual programs.</p>
                  <Link href="/services/yoruba-language-lessons" className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                    See More Options
                    <ChevronRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 border-4 border-[#e69d2a] rounded-3xl mx-4 md:mx-8 lg:mx-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              What Our <span className="text-[#e69d2a]">Students</span> Say
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
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

      {/* Animated Divider */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="mx-8">
              <Lightbulb size={48} className="text-[#e69d2a] animate-pulse" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              About Yorùbá Academy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Preserving and promoting the beauty of Yoruba heritage through education and cultural immersion
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-up">
              <Image
                src="/about.jpg"
                alt="About Ẹwà Èdè Yorùbá Academy"
                width={600}
                height={400}
                className="w-full h-auto rounded-xl shadow-lg transform transition-all duration-1000 hover:scale-105"
              />
            </div>
            <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-base sm:text-lg text-gray-600 mb-4 lg:mb-6 transform transition-all duration-1000 translate-y-0 opacity-100" style={{ animationDelay: '0.5s' }}>
                Founded with a passion for preserving and promoting the Yoruba language and culture, our academy brings together expert teachers and enthusiastic learners from around the world. Whether you're connecting with your heritage or discovering Yoruba for the first time, we provide the structure, community, and resources you need to succeed.
              </p>
              <div className="mt-6">
                <Link href="/about" className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                  Know More
                  <ChevronRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our <span className="text-[#111827]">Blog</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover insights, tips, and stories about Yoruba language and culture from our community of learners and teachers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
            {/* Blog Post 1 */}
            <article className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-[#111827] to-[#7c3aed] flex items-center justify-center">
                <Image
                  src="/blog-1.png"
                  alt="Yoruba Proverbs"
                  width={400}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="text-sm text-[#e69d2a] font-medium mb-2">Yoruba Language</div>
                <h3 className="text-xl font-bold mb-3">The Power of Yoruba Proverbs in Modern Life</h3>
                <p className="text-gray-600 mb-4">
                  Yoruba proverbs, known as "Òwe Yorùbá," are timeless wisdom capsules that have guided generations. These concise sayings encapsulate deep cultural insights and moral teachings that remain relevant in today's world.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">March 15, 2024</span>
                  <Link href="/blog/yoruba-proverbs-modern-life" className="text-[#111827] font-medium text-sm hover:text-[#3b35c7] transition-colors">
                    Read More →
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Divider with Animated Book Icon */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <div className="mx-8">
              <BookOpen size={48} className="text-[#111827] animate-bounce" />
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <Newsletter />

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
                  <span className="text-[#111827] font-bold text-xs">@</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">admin@ewaedeyoruba.com</h3>
                  <p className="text-xs opacity-90">Ẹwà Èdè Virtual Assistant</p>
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
                        ? 'bg-[#111827] text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 ml-2">admin@ewaedeyoruba.com is typing...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder=""
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#111827]"
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
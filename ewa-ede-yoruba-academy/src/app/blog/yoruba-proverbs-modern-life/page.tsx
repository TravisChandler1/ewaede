import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, BookOpen, Heart, MessageCircle, Clock } from "lucide-react";

export default function YorubaProverbsBlogPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#111827] to-[#7c3aed] text-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
              Yoruba Language
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              The Power of Yoruba Proverbs in Modern Life
            </h1>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>March 15, 2024</span>
              </div>
              <div className="flex items-center">
                <BookOpen size={16} className="mr-2" />
                <span>5 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Featured Image */}
        <div className="mb-12">
          <div className="h-96 bg-gradient-to-br from-[#111827] to-[#7c3aed] rounded-xl flex items-center justify-center">
            <BookOpen size={80} className="text-white" />
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Yoruba proverbs, known as "Òwe Yorùbá," are timeless wisdom capsules that have guided generations through life's complexities. These concise sayings encapsulate deep cultural insights and moral teachings that remain strikingly relevant in today's fast-paced world.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">The Essence of Òwe Yorùbá</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            At their core, Yoruba proverbs are more than just linguistic expressions—they are repositories of ancestral wisdom, cultural values, and practical life lessons. Each proverb serves as a bridge between the past and present, offering guidance that transcends generations.
          </p>

          <blockquote className="border-l-4 border-[#e69d2a] pl-6 py-4 my-8 bg-gray-50 italic text-lg">
            "Òwe lẹ̀sìn òwe, òwe ló ń pe òwe" - One proverb calls another proverb, proverbs beget proverbs.
          </blockquote>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Timeless Wisdom for Modern Challenges</h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Patience and Perseverance</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            In an era of instant gratification, the Yoruba proverb "Sùúrù l'ẹ̀rọ̀, sùúrù l'ẹ̀fọ̀" (Patience is the companion of palm oil, patience is the companion of soap) reminds us that meaningful achievements require time and consistent effort.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Unity and Community</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            "Ọ̀pọ̀lọpọ̀ kì í pa ẹyẹlé" (Many hands do not kill a bird) emphasizes the power of collective action and community support, a principle that resonates strongly in our interconnected digital age.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Wisdom in Decision Making</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            "Gbọ́dọ̀ ni ojú méjì, kí a lè ríran" (One must have two eyes to see clearly) teaches the importance of seeking multiple perspectives before making important decisions.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Cultural Preservation Through Proverbs</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            As globalization continues to reshape cultural landscapes, Yoruba proverbs serve as vital anchors, preserving linguistic heritage while offering universal insights. They remind us that wisdom is not bound by time or geography.
          </p>

          <div className="bg-gradient-to-r from-[#e69d2a]/10 to-[#111827]/10 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Learning Yoruba Proverbs</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              At Ẹwà Èdè Yorùbá Academy, we integrate proverbs into our curriculum because they:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Enhance cultural understanding</li>
              <li>Improve language proficiency</li>
              <li>Develop critical thinking skills</li>
              <li>Connect learners with their heritage</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">The Future of Yoruba Wisdom</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            As we navigate the complexities of modern life, Yoruba proverbs continue to offer guidance that is both timeless and timely. They remind us that the fundamental principles of human behavior and social interaction remain constant, regardless of technological advancement.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            By learning and applying these proverbs, we not only preserve a rich cultural heritage but also gain practical tools for navigating contemporary challenges. The wisdom of our ancestors, encapsulated in these concise expressions, continues to illuminate our path forward.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-xl p-8 text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Explore Yoruba Wisdom?</h3>
          <p className="text-gray-600 mb-6">
            Join our community of learners and discover the profound wisdom of Yoruba proverbs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services/yoruba-language-lessons"
              className="bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Start Learning Yoruba
            </Link>
            <Link
              href="/contact"
              className="border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/durbar-festival-yoruba-tradition" className="group">
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 group-hover:text-[#111827] mb-2">
                  Durbar Festival: Celebrating Yoruba Equestrian Tradition
                </h4>
                <p className="text-gray-600 text-sm">Explore the rich equestrian heritage of Yoruba culture...</p>
              </div>
            </Link>
            <Link href="/about" className="group">
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 group-hover:text-[#111827] mb-2">
                  About Yoruba Academy
                </h4>
                <p className="text-gray-600 text-sm">Learn about our mission to preserve Yoruba culture...</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Social Share */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-[#111827] transition-colors">
                <Heart size={20} />
                <span>Like</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-[#111827] transition-colors">
                <Share2 size={20} />
                <span>Share</span>
              </button>
            </div>
            <Link
              href="/"
              className="text-[#111827] hover:text-[#3b35c7] transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, Users, Heart, MessageCircle, Clock, MapPin, Calendar } from "lucide-react";

export default function DurbarFestivalBlogPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#e69d2a] to-[#d48a1f] text-white py-16">
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
              Cultural Heritage
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Durbar Festival: Celebrating Yoruba Equestrian Tradition
            </h1>
            <div className="flex items-center justify-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>March 10, 2024</span>
              </div>
              <div className="flex items-center">
                <Users size={16} className="mr-2" />
                <span>7 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Featured Image */}
        <div className="mb-12">
          <div className="h-96 bg-gradient-to-br from-[#e69d2a] to-[#d48a1f] rounded-xl flex items-center justify-center">
            <Users size={80} className="text-white" />
          </div>
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            The Durbar Festival represents the pinnacle of Yoruba cultural celebration, showcasing the region's rich equestrian heritage and the enduring legacy of traditional horsemanship in Nigerian culture. This spectacular event brings together tradition, pageantry, and community in a display of cultural pride.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Historical Roots of the Durbar</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            The Durbar Festival traces its origins to the 19th century when Northern Nigeria was under British colonial rule. The term "Durbar" itself is derived from the Persian word "darbar," meaning "royal court." What began as a military parade evolved into a grand cultural celebration that showcases the finest aspects of Yoruba heritage.
          </p>

          <blockquote className="border-l-4 border-[#e69d2a] pl-6 py-4 my-8 bg-gray-50 italic text-lg">
            "The Durbar is not just a festival; it's a living testament to the resilience and grandeur of Yoruba culture."
          </blockquote>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">The Spectacle of the Durbar</h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Regal Processions</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            The festival features elaborate processions where traditional rulers, adorned in magnificent robes and crowns, ride majestically on decorated horses. The rhythmic beat of drums and the sound of trumpets create an atmosphere of regal splendor that captivates all who witness it.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Equestrian Excellence</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Expert horsemen demonstrate their skill in intricate riding patterns, showcasing the deep connection between the Yoruba people and their equine partners. The horses themselves are adorned with elaborate decorations, reflecting the artistry and craftsmanship of Yoruba culture.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cultural Performances</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Accompanying the equestrian displays are traditional dancers, musicians, and performers who bring the festival to life with vibrant cultural expressions. The Durbar serves as a platform for preserving and showcasing Yoruba performing arts.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Modern Significance</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            Today, the Durbar Festival continues to play a vital role in Yoruba cultural preservation. It serves as:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#e69d2a]/10 to-[#111827]/10 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Cultural Preservation</h4>
              <p className="text-gray-700 text-sm">Keeping traditional practices alive for future generations</p>
            </div>
            <div className="bg-gradient-to-br from-[#111827]/10 to-[#e69d2a]/10 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Community Unity</h4>
              <p className="text-gray-700 text-sm">Bringing people together in celebration of shared heritage</p>
            </div>
            <div className="bg-gradient-to-br from-[#e69d2a]/10 to-[#111827]/10 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Tourism Boost</h4>
              <p className="text-gray-700 text-sm">Attracting visitors and promoting cultural tourism</p>
            </div>
            <div className="bg-gradient-to-br from-[#111827]/10 to-[#e69d2a]/10 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Economic Impact</h4>
              <p className="text-gray-700 text-sm">Supporting local artisans and cultural practitioners</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">The Spirit of the Durbar</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Beyond the visual spectacle, the Durbar Festival embodies the core values of Yoruba culture: dignity, community, tradition, and excellence. It reminds us that cultural heritage is not just about preserving the past, but about celebrating it in ways that enrich the present and inspire the future.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            The festival also highlights the importance of equestrian culture in Yoruba society, a tradition that has been passed down through generations and continues to thrive in modern times. The relationship between rider and horse symbolizes harmony, respect, and mutual understanding.
          </p>

          <div className="bg-gradient-to-r from-[#111827]/10 to-[#e69d2a]/10 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Experience the Durbar</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Durbar Festival typically takes place during important cultural or religious occasions, particularly during:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Eid-el-Kabir celebrations</li>
              <li>Independence Day commemorations</li>
              <li>Traditional festivals and ceremonies</li>
              <li>State visits and official events</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Cultural Education Through Celebration</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            At Ẹwà Èdè Yorùbá Academy, we recognize the educational value of events like the Durbar Festival. By studying and participating in such cultural celebrations, learners gain deeper insights into Yoruba traditions, values, and social structures.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            The Durbar Festival serves as a living classroom, where the abstract concepts of culture become tangible experiences. It teaches us that cultural preservation is not just about memorizing facts, but about actively participating in and celebrating our heritage.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-xl p-8 text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Experience Yoruba Culture</h3>
          <p className="text-gray-600 mb-6">
            Join us in celebrating and learning about the rich traditions of Yoruba culture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services/cultural-education"
              className="bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Explore Cultural Education
            </Link>
            <Link
              href="/contact"
              className="border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-200 pt-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/yoruba-proverbs-modern-life" className="group">
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 group-hover:text-[#111827] mb-2">
                  The Power of Yoruba Proverbs in Modern Life
                </h4>
                <p className="text-gray-600 text-sm">Discover the timeless wisdom of Yoruba proverbs...</p>
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
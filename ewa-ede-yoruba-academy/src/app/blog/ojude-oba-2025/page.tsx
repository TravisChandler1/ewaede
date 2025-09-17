import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Share2, BookOpen, Heart, MessageCircle, Clock } from "lucide-react";

export default function OjudeOba2025BlogPost() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/aboutus.jpg')",
          }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Home
          </Link>

          {/* Glass Card */}
          <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-6">
               Cultural Festival
             </div>
             <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
               Ojude Oba 2025: Celebrating Yoruba Royal Heritage
             </h1>
             <div className="flex items-center justify-center space-x-6 text-white/80">
               <div className="flex items-center">
                 <Clock size={16} className="mr-2" />
                 <span>September 15, 2025</span>
               </div>
               <div className="flex items-center">
                 <BookOpen size={16} className="mr-2" />
                 <span>6 min read</span>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        {/* Featured Image */}
        <div className="mb-12">
          <Image
            src="/blog-1.png"
            alt="Ojude Oba Festival"
            width={800}
            height={400}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            Ojude Oba Festival stands as one of Nigeria's most significant cultural celebrations, showcasing the rich heritage and traditions of the Yoruba people. This annual event brings together royalty, culture, and community in a spectacular display of traditional splendor that continues to captivate and educate both locals and visitors.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">The Majesty of Ojude Oba</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            Ojude Oba, which translates to "The Ooni's Day Out," is the annual festival celebrating the reunion of the Ooni of Ife with his subjects. This grand cultural event showcases the enduring legacy of Yoruba monarchy, traditional ceremonies, and the deep connection between the people and their royal heritage.
          </p>

          <blockquote className="border-l-4 border-[#e69d2a] pl-6 py-4 my-8 bg-gray-50 italic text-lg">
            "Ojude Oba l'ọmọdé ńlá ń ṣe ayẹyẹ" - The Ooni's outing is when the child becomes an adult in celebration.
          </blockquote>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">The Grand Procession of Ojude Oba</h2>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Royal Procession</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            The highlight of the festival is the majestic procession of the Ooni of Ife through the ancient city. Adorned in traditional regalia and accompanied by chiefs, the Ooni's journey symbolizes the sacred bond between the monarch and his people, a tradition that dates back centuries.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Cultural Performances</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Traditional drummers, dancers, and performers bring the festival to life with vibrant displays of Yoruba cultural heritage. The rhythmic beats of bata drums and the graceful movements of dancers create an atmosphere of celebration and reverence.
          </p>

          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Community Celebration</h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Ojude Oba brings together people from all walks of life in a grand reunion. Families gather, friends reunite, and the entire community participates in this annual celebration of Yoruba identity and heritage.
          </p>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Preserving Yoruba Royal Heritage</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            In an era of rapid modernization, festivals like Ojude Oba serve as vital connections to our ancestral roots. They preserve the traditions, ceremonies, and cultural practices that define Yoruba identity and heritage for future generations.
          </p>

          <div className="bg-gradient-to-r from-[#e69d2a]/10 to-[#111827]/10 p-8 rounded-xl mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Ojude Oba 2025 Highlights</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              This year's festival promises to showcase:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Traditional royal procession through ancient Ile-Ife</li>
              <li>Authentic cultural performances and music</li>
              <li>Community gatherings and family reunions</li>
              <li>Educational displays of Yoruba history</li>
              <li>Economic opportunities for local artisans</li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">The Legacy of Ojude Oba</h2>
          <p className="text-gray-700 leading-relaxed mb-8">
            As we celebrate Ojude Oba 2025, we honor the enduring legacy of Yoruba monarchy and the sacred traditions that have sustained our culture through centuries. The festival reminds us that our heritage is not just about preserving the past, but actively celebrating it in ways that enrich our present.
          </p>

          <p className="text-gray-700 leading-relaxed mb-8">
            By participating in and learning about Ojude Oba, we strengthen our connection to our cultural roots and ensure that the rich traditions of the Yoruba people continue to thrive in the modern world. This festival serves as a living bridge between tradition and contemporary life.
          </p>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-50 rounded-xl p-8 text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Experience Ojude Oba 2025</h3>
          <p className="text-gray-600 mb-6">
            Join us in celebrating this magnificent display of Yoruba cultural heritage and royal tradition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/services/cultural-education"
              className="bg-[#111827] hover:bg-[#3b35c7] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Learn About Yoruba Culture
            </Link>
            <Link
              href="/contact"
              className="border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white px-6 py-3 rounded-lg transition-colors"
            >
              Plan Your Visit
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
            <Link href="/services/cultural-education" className="group">
              <div className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 group-hover:text-[#111827] mb-2">
                  Yoruba Cultural Education
                </h4>
                <p className="text-gray-600 text-sm">Deepen your understanding of Yoruba traditions and heritage...</p>
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
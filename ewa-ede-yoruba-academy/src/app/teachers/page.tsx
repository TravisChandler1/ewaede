import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Award, Users, Star, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";

export default function TeachersPage() {
  const teachers = [
    {
      name: "Adunni Ogunleye",
      title: "Senior Yoruba Instructor",
      experience: "15 years",
      specialization: "Grammar & Literature",
      students: 450,
      rating: 4.9,
      bio: "Adunni is a native Yoruba speaker with extensive experience teaching Yoruba grammar and literature. She holds a Master's degree in Yoruba Language and has published several academic papers on Yoruba linguistics.",
      achievements: ["Published Author", "Master's Degree", "15+ Years Experience"]
    },
    {
      name: "Kemi Adebayo",
      title: "Cultural Education Specialist",
      experience: "12 years",
      specialization: "Culture & Traditions",
      students: 380,
      rating: 4.8,
      bio: "Kemi specializes in teaching Yoruba cultural traditions, festivals, and social customs. Her classes combine language learning with cultural immersion, making learning both educational and enjoyable.",
      achievements: ["Cultural Expert", "Festival Organizer", "Community Leader"]
    },
    {
      name: "Tunde Bakare",
      title: "Conversation Coach",
      experience: "10 years",
      specialization: "Speaking & Pronunciation",
      students: 320,
      rating: 4.9,
      bio: "Tunde focuses on developing conversational skills and proper pronunciation. His interactive teaching methods help students gain confidence in speaking Yoruba fluently and naturally.",
      achievements: ["Pronunciation Specialist", "Conversation Expert", "Student Favorite"]
    },
    {
      name: "Funmi Adeolu",
      title: "Beginners Specialist",
      experience: "8 years",
      specialization: "Foundation Courses",
      students: 290,
      rating: 4.8,
      bio: "Funmi has a passion for teaching beginners and making Yoruba language accessible to everyone. Her patient and encouraging approach helps new learners build strong foundations.",
      achievements: ["Beginners Expert", "Patient Teacher", "Motivational Coach"]
    },
    {
      name: "Gbenga Adeyemi",
      title: "Advanced Studies Instructor",
      experience: "14 years",
      specialization: "Advanced Grammar & Literature",
      students: 275,
      rating: 4.9,
      bio: "Gbenga teaches advanced Yoruba grammar, literature analysis, and academic writing. His students often go on to pursue higher education in Yoruba studies and related fields.",
      achievements: ["Academic Specialist", "Research Mentor", "Advanced Expert"]
    },
    {
      name: "Ifeoluwa Johnson",
      title: "Online Learning Coordinator",
      experience: "9 years",
      specialization: "Digital Education",
      students: 410,
      rating: 4.7,
      bio: "Ifeoluwa specializes in online teaching methodologies and digital learning tools. She ensures that all students receive high-quality education regardless of their location.",
      achievements: ["Digital Education Expert", "Online Coordinator", "Tech-Savvy Teacher"]
    }
  ];

  const teacherStats = [
    {
      label: "Expert Teachers",
      value: "12",
      icon: GraduationCap
    },
    {
      label: "Years Combined Experience",
      value: "68+",
      icon: Award
    },
    {
      label: "Happy Students",
      value: "2,125",
      icon: Users
    },
    {
      label: "Average Rating",
      value: "4.8",
      icon: Star
    }
  ];

  const qualifications = [
    {
      title: "Native Speakers",
      description: "All our teachers are native Yoruba speakers with authentic pronunciation and cultural knowledge.",
      icon: Users
    },
    {
      title: "Certified Educators",
      description: "Our instructors hold relevant certifications and degrees in education and Yoruba studies.",
      icon: Award
    },
    {
      title: "Experienced Professionals",
      description: "Each teacher brings years of teaching experience and subject matter expertise.",
      icon: GraduationCap
    },
    {
      title: "Student-Centered Approach",
      description: "Our teaching methods are tailored to individual learning styles and goals.",
      icon: Star
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-cover bg-center text-white py-16 relative" style={{ backgroundImage: "url('/learn.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="flex justify-center mb-6">
            <GraduationCap size={64} className="text-white" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Meet Our Teachers
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
            Learn from experienced native Yoruba speakers who are passionate about sharing their language and culture with students worldwide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#teachers"
              className="bg-white text-[#111827] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Meet the Team
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#111827] transition-colors"
            >
              Become a Teacher
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {teacherStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section id="teachers" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Our Expert Instructors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get to know the dedicated professionals who make learning Yoruba an enriching experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((teacher, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:transform hover:-translate-y-1">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{teacher.name}</h3>
                  <p className="text-[#e69d2a] font-medium mb-2">{teacher.title}</p>
                  <div className="flex items-center justify-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(teacher.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">({teacher.rating})</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-medium">{teacher.experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Specialization:</span>
                    <span className="font-medium">{teacher.specialization}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Students:</span>
                    <span className="font-medium">{teacher.students}+</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-6">{teacher.bio}</p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Achievements:</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.achievements.map((achievement, aIndex) => (
                      <span key={aIndex} className="px-3 py-1 bg-[#e69d2a] text-white text-xs rounded-full">
                        {achievement}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-[#111827] hover:bg-[#3b35c7] text-white px-4 py-2 rounded-lg transition-colors text-sm">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qualifications Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Why Choose Our Teachers?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our instructors bring expertise, passion, and dedication to every lesson
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualifications.map((qual, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-6">
                  <qual.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-4">{qual.title}</h3>
                <p className="text-gray-600">{qual.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become a Teacher */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Teaching Team</h2>
          <p className="text-gray-600 mb-8">
            Are you a passionate Yoruba speaker with teaching experience? We'd love to hear from you!
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Apply</h3>
              <p className="text-gray-600">Submit your application with your background and experience</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Interview</h3>
              <p className="text-gray-600">Meet with our team to discuss your teaching approach</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#111827] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Teaching</h3>
              <p className="text-gray-600">Begin your journey as part of our teaching community</p>
            </div>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center bg-[#111827] hover:bg-[#3b35c7] text-white px-8 py-3 rounded-lg transition-colors"
          >
            Apply to Teach
            <ChevronRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Questions About Our Teachers?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Contact our academic coordinator for more information about our teaching team or to apply as a teacher.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* WhatsApp Card */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Chat with our academic team</p>
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
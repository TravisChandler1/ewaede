import { BookOpen, Users, MonitorPlay, Award, Languages, BookMarked } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Structured Courses",
      description: "Learn at your own pace with our comprehensive curriculum designed for all levels.",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Expert Tutors",
      description: "Learn from native Yoruba speakers and experienced language instructors.",
    },
    {
      icon: <MonitorPlay className="h-8 w-8 text-primary" />,
      title: "Interactive Lessons",
      description: "Engage with interactive content, videos, and exercises for better retention.",
    },
    {
      icon: <Award className="h-8 w-8 text-primary" />,
      title: "Certification",
      description: "Earn certificates upon course completion to showcase your language proficiency.",
    },
    {
      icon: <Languages className="h-8 w-8 text-primary" />,
      title: "Cultural Immersion",
      description: "Learn not just the language but also the rich Yoruba culture and traditions.",
    },
    {
      icon: <BookMarked className="h-8 w-8 text-primary" />,
      title: "E-Library",
      description: "Access a growing collection of Yoruba learning resources and materials.",
    },
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Ewa Ede Yoruba Academy?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience the best way to learn Yoruba with our proven methodology and dedicated support.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-lg bg-background border border-border shadow-sm hover:shadow-lg hover-lift hover-glow transition-all duration-300 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 icon-bounce">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

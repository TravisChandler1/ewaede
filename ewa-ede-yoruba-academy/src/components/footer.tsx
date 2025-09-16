import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  const navigation = {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Courses', href: '/courses' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
      { name: 'FAQ', href: '/faq' },
    ],
    social: [
      {
        name: 'Facebook',
        href: '#',
        icon: Facebook,
      },
      {
        name: 'Instagram',
        href: '#',
        icon: Instagram,
      },
      {
        name: 'Twitter',
        href: '#',
        icon: Twitter,
      },
      {
        name: 'YouTube',
        href: '#',
        icon: Youtube,
      },
    ],
  }

  return (
    <footer className="bg-background border-t border-border">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/logo.png"
                alt="Ewa Ede Yoruba Academy"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Empowering the world to learn Yoruba through immersive and engaging online education.
            </p>
            <div className="flex mt-6 space-x-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              {navigation.main.slice(0, 3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Resources</h3>
            <ul className="mt-4 space-y-2">
              {navigation.main.slice(3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: hello@ewaede.com
              </li>
              <li className="text-sm text-muted-foreground">
                Phone: +234 800 123 4567
              </li>
              <li className="text-sm text-muted-foreground">
                Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border/40">
          <p className="text-xs text-center text-muted-foreground">
            &copy; {currentYear} Ẹwà Èdè Yorùbá Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

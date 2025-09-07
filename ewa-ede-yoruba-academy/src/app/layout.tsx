import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/MobileNav";
import BottomTabs from "@/components/BottomTabs";
import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: {
    default: "Ewa Ede Yoruba Academy | Learn Yoruba Online",
    template: "%s | Ewa Ede Yoruba Academy"
  },
  description: "Join Ewa Ede Yoruba Academy to learn Yoruba language with expert tutors and interactive lessons. Master Yoruba through immersive courses, live sessions, and cultural content.",
  keywords: [
    "Yoruba",
    "Learn Yoruba",
    "Yoruba Language",
    "Online Yoruba Classes",
    "Yoruba Academy",
    "Yoruba Culture",
    "Nigerian Language",
    "Language Learning",
    "Online Education",
    "Cultural Education"
  ],
  authors: [{ name: "Ewa Ede Yoruba Academy" }],
  creator: "Ewa Ede Yoruba Academy",
  publisher: "Ewa Ede Yoruba Academy",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yorubaacademy.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Ewa Ede Yoruba Academy | Learn Yoruba Online",
    description: "Master Yoruba language with expert tutors and interactive lessons. Join our immersive online learning platform.",
    url: "https://yorubaacademy.com",
    siteName: "Ewa Ede Yoruba Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ewa Ede Yoruba Academy | Learn Yoruba Online",
    description: "Master Yoruba language with expert tutors and interactive lessons.",
    creator: "@yorubaacademy",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster />
        <MobileNav />
        <BottomTabs />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground pb-16">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

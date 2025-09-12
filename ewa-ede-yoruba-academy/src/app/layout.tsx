import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/MobileNav";
import BottomTabs from "@/components/BottomTabs";
import { SessionProvider } from "next-auth/react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: {
    default: "Ẹwà Èdè Yorùbá Academy | Learn Yoruba Online",
    template: "%s | Ẹwà Èdè Yorùbá Academy"
  },
  description: "Join Ẹwà Èdè Yorùbá Academy to learn Yoruba language with expert tutors and interactive lessons. Master Yoruba through immersive courses, live sessions, and cultural content.",
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
  authors: [{ name: "Ẹwà Èdè Yorùbá Academy" }],
  creator: "Ẹwà Èdè Yorùbá Academy",
  publisher: "Ẹwà Èdè Yorùbá Academy",
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
    title: "Ẹwà Èdè Yorùbá Academy | Learn Yoruba Online",
    description: "Master Yoruba language with expert tutors and interactive lessons. Join our immersive online learning platform.",
    url: "https://yorubaacademy.com",
    siteName: "Ẹwà Èdè Yorùbá Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ẹwà Èdè Yorùbá Academy | Learn Yoruba Online",
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
        <Suspense fallback={null}>
          <BottomTabs />
        </Suspense>
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
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground pb-16">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

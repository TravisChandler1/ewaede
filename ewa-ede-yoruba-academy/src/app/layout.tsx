import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { MobileNav } from "@/components/MobileNav";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Ewa Ede Yoruba Academy | Learn Yoruba Online",
  description: "Join Ewa Ede Yoruba Academy to learn Yoruba language with expert tutors and interactive lessons.",
  keywords: ["Yoruba", "Learn Yoruba", "Yoruba Language", "Online Yoruba Classes", "Yoruba Academy"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <MobileNav />
        </ThemeProvider>
      </body>
    </html>
  );
}

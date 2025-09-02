"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogIn } from "lucide-react";

export function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border/40 md:hidden">
      <div className="container flex items-center justify-center py-3">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href="/auth/signin" className="flex items-center justify-center">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          </Button>
          <Button size="sm" asChild className="flex-1">
            <Link href="/auth/register" className="flex items-center justify-center">
              <User className="mr-2 h-4 w-4" />
              Get Started
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
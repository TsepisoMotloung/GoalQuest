'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SoccerBall, Clapperboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Live Matches', icon: SoccerBall },
  { href: '/highlights', label: 'Highlights', icon: Clapperboard },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <SoccerBall className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold tracking-tight">
            GoalQuest
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          {navLinks.map(link => (
            <Button
              key={link.href}
              variant={pathname === link.href ? 'secondary' : 'ghost'}
              asChild
            >
              <Link href={link.href}>
                <link.icon className="mr-2 h-4 w-4" />
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}

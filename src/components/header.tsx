'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clapperboard, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Live Matches', icon: FutbolIcon },
  { href: '/highlights', label: 'Highlights', icon: Clapperboard },
  { href: '/standings', label: 'Standings', icon: Medal },
];

function FutbolIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5 4.5 4.5 0 0 0 4.5 4.5 4.5 4.5 0 0 0 4.5-4.5A4.5 4.5 0 0 0 12 2Z" />
      <path d="M12 2v1" />
      <path d="M12 11v1.5" />
      <path d="M12 22v-1" />
      <path d="M12 13.5V12" />
      <path d="M2.44 15.22 4.5 14" />
      <path d="M19.5 14l2.06 1.22" />
      <path d="M3.5 9.5 2 12l1.5 2.5" />
      <path d="M20.5 9.5 22 12l-1.5 2.5" />
      <path d="m9.75 4.04-.13.51" />
      <path d="m14.25 4.04.13.51" />
      <path d="M5.27 6.22 6.5 8" />
      <path d="m17.5 8 1.23-1.78" />
    </svg>
  );
}


export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-8 flex items-center gap-2">
          <FutbolIcon className="h-6 w-6 text-primary" />
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

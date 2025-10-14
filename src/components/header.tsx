'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clapperboard, Medal, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Live Matches', icon: FutbolIcon },
  { href: '/highlights', label: 'Highlights', icon: Clapperboard },
  { href: '/standings', label: 'Standings', icon: Medal },
  { href: '/news', label: 'News', icon: Newspaper },
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
      <path d="M12 12a10 10 0 1 0-8.5-4.95A10 10 0 0 0 12 12Z" />
      <path d="M12 12a5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5 5 5 0 0 1-5 5Z" />
      <path d="m3.5 9.5 5-4.5" />
      <path d="m15.5 5-5 4.5" />
      <path d="M12 2v10" />
      <path d="m15.5 19-5-4.5" />
      <path d="m3.5 14.5 5 4.5" />
      <path d="M12 12v10" />
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

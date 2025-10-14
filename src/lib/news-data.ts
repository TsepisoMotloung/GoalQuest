import { getPlaceholderImage } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';

export const mockNews: NewsArticle[] = [
    {
        id: '1',
        title: 'Transfer Window Analysis: Who Won the Summer?',
        source: 'The Athletic',
        date: '2024-09-03T14:00:00Z',
        imageUrl: getPlaceholderImage('highlight-thumb-1').imageUrl,
        imageHint: 'soccer player signing contract',
        url: '#',
        summary: 'A deep dive into the biggest moves of the summer transfer window, grading each club\'s business.'
    },
    {
        id: '2',
        title: 'Champions League Predictions: Group Stage Preview',
        source: 'ESPN FC',
        date: '2024-09-02T11:30:00Z',
        imageUrl: getPlaceholderImage('highlight-thumb-2').imageUrl,
        imageHint: 'champions league trophy',
        url: '#',
        summary: 'Experts make their picks for who will advance from each group in this year\'s Champions League.'
    },
    {
        id: '3',
        title: 'The Rise of the Underdog: How Smaller Clubs Are Competing with Giants',
        source: 'The Guardian',
        date: '2024-09-01T09:00:00Z',
        imageUrl: getPlaceholderImage('highlight-thumb-3').imageUrl,
        imageHint: 'team celebration',
        url: '#',
        summary: 'An investigative piece on the tactics and strategies that are leveling the playing field in top leagues.'
    },
     {
        id: '4',
        title: 'VAR Controversy Strikes Again in Premier League Showdown',
        source: 'Sky Sports',
        date: '2024-08-31T20:00:00Z',
        imageUrl: getPlaceholderImage('highlight-thumb-4').imageUrl,
        imageHint: 'referee VAR screen',
        url: '#',
        summary: 'Another weekend, another debate about the video assistant referee after a controversial call.'
    },
    {
        id: '5',
        title: 'Youth Spotlight: The Next Generation of Superstars',
        source: 'Goal.com',
        date: '2024-08-30T15:00:00Z',
        imageUrl: getPlaceholder.photos/seed/young-talent/800/450',
        imageHint: 'young soccer player',
        url: '#',
        summary: 'We profile five young talents who are poised to take the football world by storm in the coming years.'
    },
     {
        id: '6',
        title: 'Tactical Breakdown: The Evolution of the Full-Back',
        source: 'Tifo Football',
        date: '2024-08-29T18:00:00Z',
        imageUrl: getPlaceholderImage('highlight-thumb-5').imageUrl,
        imageHint: 'soccer tactics board',
        url: '#',
        summary: 'A detailed look at how the full-back position has transformed from a purely defensive role to a key attacking component.'
    }
];
